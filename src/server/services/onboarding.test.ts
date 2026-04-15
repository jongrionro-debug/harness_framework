import { createOrganizationOnboarding } from "@/server/services/onboarding";

describe("createOrganizationOnboarding", () => {
  it("creates organization, first village, and membership inside one transaction", async () => {
    const steps: string[] = [];

    const repository = {
      ensureUserExists: async () => true,
      transaction: async (
        callback: (writer: {
          createOrganization(values: { name: string; slug: string }): Promise<void>;
          createVillage(values: { name: string; organizationId: string }): Promise<void>;
          createMembership(values: {
            organizationId: string;
            userId: string;
            role: string;
          }): Promise<void>;
        }) => Promise<void>,
      ) =>
        callback({
          createOrganization: async (values) => {
            steps.push(`organization:${values.slug}`);
          },
          createVillage: async (values) => {
            steps.push(`village:${values.organizationId}:${values.name}`);
          },
          createMembership: async (values) => {
            steps.push(`membership:${values.organizationId}:${values.role}`);
          },
        }),
    };

    const organization = await createOrganizationOnboarding(
      {
        userId: "46a87e1a-9918-4ea1-872f-999999999999",
        organizationName: "다도리인 교육 센터",
        firstVillageName: "동네 배움터",
      },
      repository,
    );

    expect(organization.slug).toBe("다도리인-교육-센터");
    expect(steps[0]).toBe("organization:다도리인-교육-센터");
    expect(steps[1]).toContain(`village:${organization.id}`);
    expect(steps[2]).toContain(`membership:${organization.id}:organization_admin`);
  });

  it("fails clearly when the signed-in user row does not exist yet", async () => {
    const repository = {
      ensureUserExists: async () => false,
      transaction: async () => undefined,
    };

    await expect(
      createOrganizationOnboarding(
        {
          userId: "46a87e1a-9918-4ea1-872f-999999999999",
          organizationName: "다도리인 교육 센터",
          firstVillageName: "동네 배움터",
        },
        repository,
      ),
    ).rejects.toThrow("회원 정보가 아직 준비되지 않았습니다");
  });
});
