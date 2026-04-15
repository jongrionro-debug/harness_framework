import {
  getGuestRouteRedirect,
  getPostAuthDestination,
  getProtectedRouteRedirect,
} from "@/lib/auth/routing";

describe("auth routing", () => {
  it("sends approved operators to the dashboard", () => {
    expect(
      getPostAuthDestination({
        isAuthenticated: true,
        hasMembership: true,
        membershipApproved: true,
        role: "organization_admin",
      }),
    ).toBe("/dashboard");
  });

  it("sends approved teachers to their sessions workspace", () => {
    expect(
      getPostAuthDestination({
        isAuthenticated: true,
        hasMembership: true,
        membershipApproved: true,
        role: "teacher",
      }),
    ).toBe("/sessions");
  });

  it("sends authenticated users without membership to onboarding", () => {
    expect(
      getGuestRouteRedirect({
        isAuthenticated: true,
        hasMembership: false,
        membershipApproved: false,
        role: null,
      }),
    ).toBe("/organization");
  });

  it("sends invited members waiting for approval to the pending page", () => {
    expect(
      getGuestRouteRedirect({
        isAuthenticated: true,
        hasMembership: true,
        membershipApproved: false,
        role: null,
      }),
    ).toBe("/approval-pending");
  });

  it("protects private areas from signed-out users", () => {
    expect(
      getProtectedRouteRedirect({
        isAuthenticated: false,
        hasMembership: false,
        membershipApproved: false,
        role: null,
      }),
    ).toBe("/login");
  });
});
