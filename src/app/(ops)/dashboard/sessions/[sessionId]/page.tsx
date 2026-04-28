import { notFound } from "next/navigation";

import { SessionManagementScreen } from "@/components/ops/session-management-screen";
import { getServerAuthState } from "@/lib/auth/supabase-server";
import { getOperatorSessionManagement } from "@/server/services/session-management";

export default async function SessionManagementPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  const authState = await getServerAuthState();

  if (!authState.organizationId || authState.role !== "organization_admin") {
    notFound();
  }

  const session = await getOperatorSessionManagement(
    authState.organizationId,
    sessionId,
  );

  if (!session) {
    notFound();
  }

  return <SessionManagementScreen session={session} />;
}
