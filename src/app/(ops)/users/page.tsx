import { redirect } from "next/navigation";

import { UsersScreen } from "@/components/ops/users-screen";
import { getServerAuthState } from "@/lib/auth/supabase-server";
import { listMembershipOverview } from "@/server/services/memberships";

export default async function UsersPage() {
  const authState = await getServerAuthState();

  if (!authState.organizationId) {
    redirect("/organization");
  }

  const data = await listMembershipOverview(authState.organizationId);

  return <UsersScreen data={data} />;
}
