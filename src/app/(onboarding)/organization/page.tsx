import { redirect } from "next/navigation";

import { OnboardingForm } from "@/components/onboarding/onboarding-form";
import { getServerAuthState } from "@/lib/auth/supabase-server";

export default async function OrganizationOnboardingPage() {
  const authState = await getServerAuthState();

  if (authState.hasMembership && authState.membershipApproved) {
    redirect("/dashboard");
  }

  if (authState.hasMembership) {
    redirect("/approval-pending");
  }

  return <OnboardingForm email={authState.user?.email} />;
}
