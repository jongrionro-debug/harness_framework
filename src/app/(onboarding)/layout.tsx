import { redirect } from "next/navigation";

import { AuthSessionBar } from "@/components/auth/auth-session-bar";
import { getServerAuthState } from "@/lib/auth/supabase-server";

export default async function OnboardingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const authState = await getServerAuthState();

  if (!authState.isAuthenticated) {
    redirect("/login");
  }

  return (
    <>
      <AuthSessionBar
        email={authState.user?.email}
        roleLabel="기관 온보딩"
        tone="accent"
      />
      {children}
    </>
  );
}
