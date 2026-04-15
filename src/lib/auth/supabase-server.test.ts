import {
  buildAppUserRecord,
  deriveAuthState,
  isMissingApprovedAtColumnError,
} from "@/lib/auth/supabase-server";

describe("supabase server auth helpers", () => {
  it("maps a Supabase user into the app user row shape", () => {
    expect(
      buildAppUserRecord({
        id: "46a87e1a-9918-4ea1-872f-999999999999",
        email: "ops@example.com",
        user_metadata: {
          full_name: "운영 담당자",
        },
      } as never),
    ).toEqual({
      id: "46a87e1a-9918-4ea1-872f-999999999999",
      email: "ops@example.com",
      displayName: "운영 담당자",
    });
  });

  it("derives authenticated membership state from the membership row", () => {
    expect(
      deriveAuthState(
        {
          id: "46a87e1a-9918-4ea1-872f-999999999999",
        } as never,
        {
          organizationId: "org-1",
          role: "organization_admin",
          approvedAt: new Date("2026-04-15T00:00:00.000Z"),
        },
      ),
    ).toEqual({
      user: {
        id: "46a87e1a-9918-4ea1-872f-999999999999",
      },
      isAuthenticated: true,
      hasMembership: true,
      membershipApproved: true,
      organizationId: "org-1",
      role: "organization_admin",
    });
  });

  it("detects legacy schema errors for the approved_at column", () => {
    expect(
      isMissingApprovedAtColumnError({
        message: 'column "approved_at" does not exist',
      }),
    ).toBe(true);

    expect(
      isMissingApprovedAtColumnError({
        cause: {
          code: "42703",
        },
      }),
    ).toBe(true);

    expect(
      isMissingApprovedAtColumnError({
        message: "different failure",
      }),
    ).toBe(false);
  });
});
