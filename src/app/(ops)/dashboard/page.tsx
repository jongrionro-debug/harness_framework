import { DashboardScreen } from "@/components/ops/dashboard-screen";
import { getServerAuthState } from "@/lib/auth/supabase-server";
import { listOperatorDashboardData } from "@/server/services/dashboard";
import { listSessionDashboardData } from "@/server/services/sessions";

export default async function DashboardPage() {
  const authState = await getServerAuthState();

  if (!authState.organizationId) {
    return null;
  }

  const [data, dashboard] = await Promise.all([
    listSessionDashboardData(authState.organizationId),
    listOperatorDashboardData(authState.organizationId),
  ]);

  return <DashboardScreen data={data} dashboard={dashboard} />;
}
