import { redirect } from "next/navigation";

import { getGuestRouteRedirect } from "@/lib/auth/routing";
import { getServerAuthState } from "@/lib/auth/supabase-server";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const authState = await getServerAuthState();
  const redirectHref = getGuestRouteRedirect(authState);

  if (redirectHref) {
    redirect(redirectHref);
  }

  return children;
}
