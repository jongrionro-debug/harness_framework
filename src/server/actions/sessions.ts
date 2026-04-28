"use server";

import { revalidatePath } from "next/cache";

import { getServerAuthState } from "@/lib/auth/supabase-server";
import { sessionCreateSchema } from "@/lib/validations/sessions";
import { createSessionRecord } from "@/server/services/sessions";

type SessionActionState = {
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
      error: "운영자 승인 이후에만 세션을 생성할 수 있습니다.",
    };
  }

  if (authState.role !== "organization_admin") {
    return {
      error: "세션 생성은 organization_admin만 수행할 수 있습니다.",
    };
  }

  return {
    organizationId: authState.organizationId,
  };
}

export async function createSessionAction(
  _: SessionActionState,
  formData: FormData,
) {
  const access = await requireOrganizationAdmin();
  if ("error" in access) {
    return { message: access.error };
  }

  const parsed = sessionCreateSchema.safeParse({
    sessionDate: formData.get("sessionDate"),
    villageId: formData.get("villageId"),
    programId: formData.get("programId"),
    classId: formData.get("classId"),
    teacherId: formData.get("teacherId"),
  });

  if (!parsed.success) {
    return {
      message: "세션 생성 정보를 다시 확인해 주세요.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const session = await createSessionRecord({
      organizationId: access.organizationId,
      sessionDate: parsed.data.sessionDate,
      villageId: parsed.data.villageId,
      programId: parsed.data.programId,
      classId: parsed.data.classId,
      teacherId: parsed.data.teacherId || null,
    });

    revalidatePath("/dashboard");
    revalidatePath("/sessions");

    return {
      message: `세션을 만들었습니다. 스냅샷 ${session.snapshotCount}명을 고정했습니다.`,
    };
  } catch (error) {
    return {
      message:
        error instanceof Error
          ? error.message
          : "세션 생성 중 오류가 발생했습니다.",
    };
  }
}
