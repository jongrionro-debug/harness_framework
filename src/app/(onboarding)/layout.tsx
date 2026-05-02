import { redirect } from "next/navigation";

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

  return children;
}
