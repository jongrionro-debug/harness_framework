import { DashboardScreen } from "@/components/ops/dashboard-screen";
import { getServerAuthState } from "@/lib/auth/supabase-server";
import { listOperatorDashboardData } from "@/server/services/dashboard";
import { getOperatorSessionManagement } from "@/server/services/session-management";
import { listSessionDashboardData } from "@/server/services/sessions";

export default async function DashboardStatusPage() {
  const authState = await getServerAuthState();

  if (!authState.organizationId) {
    return null;
  }

  const [data, dashboard] = await Promise.all([
    listSessionDashboardData(authState.organizationId),
    listOperatorDashboardData(authState.organizationId),
  ]);
  const sessionManagementRecords = (
    await Promise.all(
      data.recentSessions.map((session) =>
        getOperatorSessionManagement(authState.organizationId!, session.id),
      ),
    )
  ).filter((session) => session !== null);

  return (
    <DashboardScreen
      data={data}
      dashboard={dashboard}
      sessionManagementRecords={sessionManagementRecords}
      activeView="status"
    />
  );
}
