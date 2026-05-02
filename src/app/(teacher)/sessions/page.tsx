import { TeacherSessionsScreen } from "@/components/teacher/sessions-screen";
import { getServerAuthState } from "@/lib/auth/supabase-server";
import { listTeacherSessionCards } from "@/server/services/sessions";
import { getTeacherSubmissionWorkspace } from "@/server/services/submissions";

export default async function TeacherSessionsPage({
  searchParams,
}: {
  searchParams: Promise<{ sessionId?: string }>;
}) {
  const { sessionId } = await searchParams;
  const authState = await getServerAuthState();

  if (!authState.organizationId || !authState.user) {
    return null;
  }

  const sessions = await listTeacherSessionCards(
    authState.organizationId,
    authState.user.id,
  );

  const selectedSessionId =
    sessions.find((session) => session.id === sessionId)?.id ?? sessions[0]?.id;
  const selectedSession = selectedSessionId
    ? await getTeacherSubmissionWorkspace(
        authState.organizationId,
        authState.user.id,
        selectedSessionId,
      )
    : null;

  return (
    <TeacherSessionsScreen
      sessions={sessions}
      selectedSession={selectedSession}
    />
  );
}
