import { redirect } from "next/navigation";

import { SettingsScreen } from "@/components/ops/settings-screen";
import { getServerAuthState } from "@/lib/auth/supabase-server";
import { listSettingsOverview } from "@/server/services/settings";

export default async function SettingsPage() {
  const authState = await getServerAuthState();

  if (!authState.organizationId) {
    redirect("/organization");
  }

  const data = await listSettingsOverview(authState.organizationId);

  return <SettingsScreen data={data} />;
}
