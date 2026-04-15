export type AuthRouteState = {
  isAuthenticated: boolean;
  hasMembership: boolean;
  membershipApproved: boolean;
  role?: "platform_admin" | "organization_admin" | "teacher" | null;
};

export function getPostAuthDestination(state: AuthRouteState) {
  if (!state.hasMembership) {
    return "/organization";
  }

  if (!state.membershipApproved) {
    return "/approval-pending";
  }

  return state.role === "teacher" ? "/sessions" : "/dashboard";
}

export function getGuestRouteRedirect(state: AuthRouteState) {
  return state.isAuthenticated ? getPostAuthDestination(state) : null;
}

export function getProtectedRouteRedirect(state: AuthRouteState) {
  if (!state.isAuthenticated) {
    return "/login";
  }

  if (!state.hasMembership) {
    return "/organization";
  }

  return state.membershipApproved ? null : "/approval-pending";
}
