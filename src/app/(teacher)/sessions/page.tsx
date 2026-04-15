import { TeacherSessionsScreen } from "@/components/teacher/sessions-screen";
import { getServerAuthState } from "@/lib/auth/supabase-server";
import { listTeacherSessionCards } from "@/server/services/sessions";

export default async function TeacherSessionsPage() {
  const authState = await getServerAuthState();

  if (!authState.organizationId || !authState.user) {
    return null;
  }

  const sessions = await listTeacherSessionCards(
    authState.organizationId,
    authState.user.id,
  );

  return <TeacherSessionsScreen sessions={sessions} />;
}
