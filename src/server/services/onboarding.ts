import { eq } from "drizzle-orm";

import { buildOrganizationBootstrapRecords } from "@/lib/db/onboarding-bootstrap";
import { getDb } from "@/lib/db/client";
import {
  organizationMemberships,
  organizations,
  users,
  villages,
} from "@/lib/db/schema";

export type CreateOrganizationInput = {
  userId: string;
  organizationName: string;
  firstVillageName: string;
};

type OnboardingRepository = {
  ensureUserExists(userId: string): Promise<boolean>;
  transaction<T>(
    callback: (writer: {
      createOrganization(values: typeof organizations.$inferInsert): Promise<void>;
      createVillage(values: typeof villages.$inferInsert): Promise<void>;
      createMembership(
        values: typeof organizationMemberships.$inferInsert,
      ): Promise<void>;
    }) => Promise<T>,
  ): Promise<T>;
};

function createOnboardingRepository(): OnboardingRepository {
  const db = getDb();

  return {
    async ensureUserExists(userId) {
      const existingUser = await db.query.users.findFirst({
        where: eq(users.id, userId),
      });

      return Boolean(existingUser);
    },
    async transaction(callback) {
      return db.transaction(async (tx) =>
        callback({
          createOrganization: async (values) => {
            await tx.insert(organizations).values(values);
          },
          createVillage: async (values) => {
            await tx.insert(villages).values(values);
          },
          createMembership: async (values) => {
            await tx.insert(organizationMemberships).values(values);
          },
        }),
      );
    },
  };
}

export async function createOrganizationOnboarding(
  input: CreateOrganizationInput,
  repository: OnboardingRepository = createOnboardingRepository(),
) {
  const userExists = await repository.ensureUserExists(input.userId);

  if (!userExists) {
    throw new Error("회원 정보가 아직 준비되지 않았습니다. 다시 로그인해 주세요.");
  }

  const records = buildOrganizationBootstrapRecords(input);

  await repository.transaction(async (writer) => {
    await writer.createOrganization(records.organization);
    await writer.createVillage(records.firstVillage);
    await writer.createMembership(records.membership);
  });

  return records.organization;
}
