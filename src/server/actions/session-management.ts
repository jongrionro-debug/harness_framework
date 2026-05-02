"use server";

import { revalidatePath } from "next/cache";

import { getServerAuthState } from "@/lib/auth/supabase-server";
import {
  existingSessionParticipantSchema,
  newSessionParticipantSchema,
  removeSessionParticipantSchema,
  sessionTeacherAssignmentSchema,
} from "@/lib/validations/sessions";
import {
  addExistingParticipantToSession,
  assignTeacherToSession,
  createAndAddParticipantToSession,
  removeParticipantFromSession,
} from "@/server/services/session-management";

type SessionManagementActionState = {
  message?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

async function requireOrganizationAdmin() {
  const authState = await getServerAuthState();

  if (!authState.isAuthenticated || !authState.organizationId) {
    return {
      error: "기관 운영 영역에 접근하려면 로그인과 기관 소속이 필요합니다.",
    };
  }

  if (!authState.membershipApproved) {
    return {
      error: "운영자 승인 이후에만 세션을 관리할 수 있습니다.",
    };
  }

  if (authState.role !== "organization_admin") {
    return {
      error: "세션 관리는 organization_admin만 수행할 수 있습니다.",
    };
  }

  return {
    organizationId: authState.organizationId,
  };
}

function revalidateSessionManagement(sessionId: string) {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/status");
  revalidatePath(`/dashboard/sessions/${sessionId}`);
  revalidatePath("/records");
  revalidatePath(`/records/${sessionId}`);
  revalidatePath("/sessions");
  revalidatePath(`/sessions/${sessionId}`);
}

export async function assignSessionTeacherAction(
  _: SessionManagementActionState,
  formData: FormData,
) {
  const access = await requireOrganizationAdmin();
  if ("error" in access) {
    return { message: access.error };
  }

  const parsed = sessionTeacherAssignmentSchema.safeParse({
    sessionId: formData.get("sessionId"),
    teacherId: formData.get("teacherId"),
  });

  if (!parsed.success) {
    return {
      message: "강사 배정 정보를 다시 확인해 주세요.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await assignTeacherToSession({
      organizationId: access.organizationId,
      sessionId: parsed.data.sessionId,
      teacherId: parsed.data.teacherId || null,
    });
  } catch (error) {
    return {
      message:
        error instanceof Error
          ? error.message
          : "세션 강사 배정 중 오류가 발생했습니다.",
    };
  }

  revalidateSessionManagement(parsed.data.sessionId);
  return { message: "세션 강사를 저장했습니다." };
}

export async function addExistingSessionParticipantAction(
  _: SessionManagementActionState,
  formData: FormData,
) {
  const access = await requireOrganizationAdmin();
  if ("error" in access) {
    return { message: access.error };
  }

  const parsed = existingSessionParticipantSchema.safeParse({
    sessionId: formData.get("sessionId"),
    participantId: formData.get("participantId"),
  });

  if (!parsed.success) {
    return {
      message: "추가할 참여자 정보를 다시 확인해 주세요.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await addExistingParticipantToSession({
      organizationId: access.organizationId,
      sessionId: parsed.data.sessionId,
      participantId: parsed.data.participantId,
    });

    revalidateSessionManagement(parsed.data.sessionId);
    return {
      message: result.added
        ? "기존 참여자를 세션에 추가했습니다."
        : "이미 이 세션에 포함된 참여자입니다.",
    };
  } catch (error) {
    return {
      message:
        error instanceof Error
          ? error.message
          : "참여자 추가 중 오류가 발생했습니다.",
    };
  }
}

export async function createSessionParticipantAction(
  _: SessionManagementActionState,
  formData: FormData,
) {
  const access = await requireOrganizationAdmin();
  if ("error" in access) {
    return { message: access.error };
  }

  const parsed = newSessionParticipantSchema.safeParse({
    sessionId: formData.get("sessionId"),
    fullName: formData.get("fullName"),
    note: formData.get("note"),
  });

  if (!parsed.success) {
    return {
      message: "새 참여자 정보를 다시 확인해 주세요.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await createAndAddParticipantToSession({
      organizationId: access.organizationId,
      sessionId: parsed.data.sessionId,
      fullName: parsed.data.fullName,
      note: parsed.data.note,
    });
  } catch (error) {
    return {
      message:
        error instanceof Error
          ? error.message
          : "새 참여자 추가 중 오류가 발생했습니다.",
    };
  }

  revalidateSessionManagement(parsed.data.sessionId);
  return { message: "새 참여자를 전체 명단과 이 세션에 추가했습니다." };
}

export async function removeSessionParticipantAction(
  _: SessionManagementActionState,
  formData: FormData,
) {
  const access = await requireOrganizationAdmin();
  if ("error" in access) {
    return { message: access.error };
  }

  const parsed = removeSessionParticipantSchema.safeParse({
    sessionId: formData.get("sessionId"),
    snapshotId: formData.get("snapshotId"),
  });

  if (!parsed.success) {
    return {
      message: "제거할 참여자 정보를 다시 확인해 주세요.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await removeParticipantFromSession({
      organizationId: access.organizationId,
      sessionId: parsed.data.sessionId,
      snapshotId: parsed.data.snapshotId,
    });
  } catch (error) {
    return {
      message:
        error instanceof Error
          ? error.message
          : "참여자 제거 중 오류가 발생했습니다.",
    };
  }

  revalidateSessionManagement(parsed.data.sessionId);
  return { message: "세션 참여자를 제거했습니다." };
}
