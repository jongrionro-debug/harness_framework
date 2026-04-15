import { notFound } from "next/navigation";

import { TeacherSessionWorkspaceScreen } from "@/components/teacher/session-workspace";
import { getServerAuthState } from "@/lib/auth/supabase-server";
import { getTeacherSubmissionWorkspace } from "@/server/services/submissions";

export default async function TeacherSessionDetailPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  const authState = await getServerAuthState();

  if (!authState.organizationId || !authState.user) {
    notFound();
  }

  const session = await getTeacherSubmissionWorkspace(
    authState.organizationId,
    authState.user.id,
    sessionId,
  );

  if (!session) {
    notFound();
  }

  return <TeacherSessionWorkspaceScreen session={session} />;
}
