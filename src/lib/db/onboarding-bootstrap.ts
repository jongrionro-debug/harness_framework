import { randomUUID } from "node:crypto";

import type { OrganizationRole } from "@/lib/db/schema";

type BootstrapInput = {
  userId: string;
  organizationName: string;
  firstVillageName: string;
};

export function createSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function buildOrganizationBootstrapRecords({
  userId,
  organizationName,
  firstVillageName,
}: BootstrapInput) {
  const organizationId = randomUUID();
  const organizationAdminRole: OrganizationRole = "organization_admin";

  return {
    organization: {
      id: organizationId,
      name: organizationName.trim(),
      slug: createSlug(organizationName),
    },
    firstVillage: {
      name: firstVillageName.trim(),
      organizationId,
      isPrimary: true,
    },
    membership: {
      organizationId,
      userId,
      role: organizationAdminRole,
      approvedAt: new Date(),
    },
  };
}
