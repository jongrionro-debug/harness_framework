import { redirect } from "next/navigation";

import { AuthSessionBar } from "@/components/auth/auth-session-bar";
import { getProtectedRouteRedirect } from "@/lib/auth/routing";
import { getServerAuthState } from "@/lib/auth/supabase-server";

export default async function OpsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const authState = await getServerAuthState();
  const redirectHref = getProtectedRouteRedirect(authState);

  if (redirectHref) {
    redirect(redirectHref);
  }

  if (authState.role === "teacher") {
    redirect("/sessions");
  }

  return (
    <>
      <AuthSessionBar
        email={authState.user?.email}
        roleLabel="운영자"
      />
      {children}
    </>
  );
}
