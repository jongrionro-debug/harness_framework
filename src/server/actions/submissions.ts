"use server";

import { revalidatePath } from "next/cache";

import { getServerAuthState } from "@/lib/auth/supabase-server";
import { sessionSubmissionSchema } from "@/lib/validations/sessions";
import { saveTeacherSessionSubmission } from "@/server/services/submissions";

type SubmissionActionState = {
  message?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

function extractAttendanceRows(formData: FormData) {
  return Array.from(formData.entries())
    .filter(([key]) => key.startsWith("attendance:"))
    .map(([key, value]) => ({
      sessionParticipantSnapshotId: key.replace("attendance:", ""),
      status: String(value),
    }));
}

async function requireTeacherAccess() {
  const authState = await getServerAuthState();

  if (!authState.isAuthenticated || !authState.organizationId || !authState.user) {
    return {
      error: "강사 제출 영역에 접근하려면 로그인과 기관 소속이 필요합니다.",
    };
  }

  if (!authState.membershipApproved) {
    return {
      error: "운영자 승인 이후에만 세션 기록을 제출할 수 있습니다.",
    };
  }

  if (authState.role !== "teacher") {
    return {
      error: "강사 세션 제출은 teacher만 수행할 수 있습니다.",
    };
  }

  return {
    organizationId: authState.organizationId,
    teacherId: authState.user.id,
  };
}

export async function submitTeacherSessionAction(
  sessionId: string,
  _: SubmissionActionState,
  formData: FormData,
) {
  const access = await requireTeacherAccess();
  if ("error" in access) {
    return { message: access.error };
  }

  const parsed = sessionSubmissionSchema.safeParse({
    lessonJournal: formData.get("lessonJournal"),
    attendance: extractAttendanceRows(formData),
  });

  if (!parsed.success) {
    return {
      message: "출석과 교육일지 내용을 다시 확인해 주세요.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await saveTeacherSessionSubmission({
      organizationId: access.organizationId,
      teacherId: access.teacherId,
      sessionId,
      lessonJournal: parsed.data.lessonJournal,
      attendance: parsed.data.attendance,
    });

    revalidatePath("/sessions");
    revalidatePath(`/sessions/${sessionId}`);
    revalidatePath("/dashboard");

    return {
      message: result.isFirstSubmission
        ? "세션 기록을 처음 제출했습니다."
        : "세션 기록을 수정 저장했습니다.",
    };
  } catch (error) {
    return {
      message:
        error instanceof Error ? error.message : "세션 제출 중 오류가 발생했습니다.",
    };
  }
}
