import {
  acceptOrganizationInvite,
  approveOrganizationMembership,
  assignTeacherToClass,
  createInviteRecord,
  updateOrganizationMemberRole,
} from "@/server/services/memberships";

describe("membership services", () => {
  it("creates a local-first invite token and expiry", async () => {
    const inserted: unknown[] = [];

    const invite = await createInviteRecord(
      {
        organizationId: "org-1",
        email: "Teacher@Example.com",
        role: "teacher",
      },
      {
        insertInvite: async (values) => {
          inserted.push(values);
        },
        updateMembershipRole: async () => undefined,
        findOrganizationMembership: async () => null,
        insertTeacherAssignment: async () => undefined,
      },
    );

    expect(invite.inviteToken).toBeTruthy();
    expect(inserted).toMatchObject([
      {
        organizationId: "org-1",
        email: "teacher@example.com",
        role: "teacher",
      },
    ]);
  });

  it("accepts a valid invite token for the matching email", async () => {
    const accepted: unknown[] = [];

    const result = await acceptOrganizationInvite(
      {
        userId: "user-1",
        email: "teacher@example.com",
        inviteToken: "5d1b6c1d-61d8-42eb-bc0d-82f6811a2b7c",
      },
      {
        insertInvite: async () => undefined,
        ensureUserExists: async () => true,
        findInviteByToken: async () => ({
          id: "invite-1",
          organizationId: "org-1",
          email: "teacher@example.com",
          role: "teacher",
          expiresAt: new Date(Date.now() + 1000 * 60 * 60),
          acceptedAt: null,
        }),
        acceptInvite: async (values) => {
          accepted.push(values);
        },
        approveMembership: async () => undefined,
        updateMembershipRole: async () => undefined,
        findOrganizationMembership: async () => null,
        insertTeacherAssignment: async () => undefined,
      },
    );

    expect(result.organizationId).toBe("org-1");
    expect(result.role).toBe("teacher");
    expect(accepted).toMatchObject([
      {
        inviteId: "invite-1",
        organizationId: "org-1",
        userId: "user-1",
        role: "teacher",
      },
    ]);
  });

  it("rejects an invite token when the logged-in email does not match", async () => {
    await expect(
      acceptOrganizationInvite(
        {
          userId: "user-1",
          email: "other@example.com",
          inviteToken: "5d1b6c1d-61d8-42eb-bc0d-82f6811a2b7c",
        },
        {
          insertInvite: async () => undefined,
          ensureUserExists: async () => true,
          findInviteByToken: async () => ({
            id: "invite-1",
            organizationId: "org-1",
            email: "teacher@example.com",
            role: "teacher",
            expiresAt: new Date(Date.now() + 1000 * 60 * 60),
            acceptedAt: null,
          }),
          acceptInvite: async () => undefined,
          approveMembership: async () => undefined,
          updateMembershipRole: async () => undefined,
          findOrganizationMembership: async () => null,
          insertTeacherAssignment: async () => undefined,
        },
      ),
    ).rejects.toThrow("초대받은 이메일로 로그인한 뒤 다시 시도해 주세요.");
  });

  it("updates member role inside the organization scope", async () => {
    const updates: unknown[] = [];

    await updateOrganizationMemberRole(
      {
        organizationId: "org-1",
        membershipId: "46a87e1a-9918-4ea1-872f-999999999999",
        role: "teacher",
      },
      {
        insertInvite: async () => undefined,
        ensureUserExists: async () => true,
        findInviteByToken: async () => null,
        acceptInvite: async () => undefined,
        approveMembership: async () => undefined,
        updateMembershipRole: async (membershipId, organizationId, role) => {
          updates.push({ membershipId, organizationId, role });
        },
        findOrganizationMembership: async () => null,
        insertTeacherAssignment: async () => undefined,
      },
    );

    expect(updates).toEqual([
      {
        membershipId: "46a87e1a-9918-4ea1-872f-999999999999",
        organizationId: "org-1",
        role: "teacher",
      },
    ]);
  });

  it("approves a pending membership inside the organization scope", async () => {
    const approvals: unknown[] = [];

    await approveOrganizationMembership(
      {
        organizationId: "org-1",
        membershipId: "46a87e1a-9918-4ea1-872f-999999999999",
      },
      {
        insertInvite: async () => undefined,
        ensureUserExists: async () => true,
        findInviteByToken: async () => null,
        acceptInvite: async () => undefined,
        approveMembership: async (membershipId, organizationId) => {
          approvals.push({ membershipId, organizationId });
        },
        updateMembershipRole: async () => undefined,
        findOrganizationMembership: async () => null,
        insertTeacherAssignment: async () => undefined,
      },
    );

    expect(approvals).toEqual([
      {
        membershipId: "46a87e1a-9918-4ea1-872f-999999999999",
        organizationId: "org-1",
      },
    ]);
  });

  it("rejects teacher assignment for non-teacher memberships", async () => {
    await expect(
      assignTeacherToClass(
        {
          organizationId: "org-1",
          userId: "user-1",
          classId: "class-1",
        },
        {
          insertInvite: async () => undefined,
          ensureUserExists: async () => true,
          findInviteByToken: async () => null,
          acceptInvite: async () => undefined,
          approveMembership: async () => undefined,
          updateMembershipRole: async () => undefined,
          findOrganizationMembership: async () => ({
            role: "organization_admin",
            approvedAt: new Date(),
          }),
          insertTeacherAssignment: async () => undefined,
        },
      ),
    ).rejects.toThrow("teacher 역할 사용자만 수업에 배정할 수 있습니다.");
  });

  it("rejects teacher assignment before approval", async () => {
    await expect(
      assignTeacherToClass(
        {
          organizationId: "org-1",
          userId: "user-1",
          classId: "class-1",
        },
        {
          insertInvite: async () => undefined,
          ensureUserExists: async () => true,
          findInviteByToken: async () => null,
          acceptInvite: async () => undefined,
          approveMembership: async () => undefined,
          updateMembershipRole: async () => undefined,
          findOrganizationMembership: async () => ({
            role: "teacher",
            approvedAt: null,
          }),
          insertTeacherAssignment: async () => undefined,
        },
      ),
    ).rejects.toThrow("운영자 승인이 끝난 teacher만 수업에 배정할 수 있습니다.");
  });
});
