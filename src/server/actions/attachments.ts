"use server";

import { revalidatePath } from "next/cache";

import { getServerAuthState } from "@/lib/auth/supabase-server";
import { attachmentMetadataSchema } from "@/lib/validations/sessions";
import { uploadTeacherSessionAttachment } from "@/server/services/attachments";

type AttachmentActionState = {
  message?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

async function requireTeacherAccess() {
  const authState = await getServerAuthState();

  if (!authState.isAuthenticated || !authState.organizationId || !authState.user) {
    return {
      error: "강사 제출 영역에 접근하려면 로그인과 기관 소속이 필요합니다.",
    };
  }

  if (!authState.membershipApproved) {
    return {
      error: "운영자 승인 이후에만 첨부 업로드를 진행할 수 있습니다.",
    };
  }

  if (authState.role !== "teacher") {
    return {
      error: "첨부 업로드는 teacher만 수행할 수 있습니다.",
    };
  }

  return {
    organizationId: authState.organizationId,
    teacherId: authState.user.id,
  };
}

export async function uploadTeacherAttachmentAction(
  sessionId: string,
  _: AttachmentActionState,
  formData: FormData,
) {
  const access = await requireTeacherAccess();
  if ("error" in access) {
    return { message: access.error };
  }

  const file = formData.get("attachment");
  if (!(file instanceof File)) {
    return { message: "첨부 파일을 다시 선택해 주세요." };
  }

  const parsed = attachmentMetadataSchema.safeParse({
    fileName: file.name,
    mimeType: file.type,
    size: file.size,
  });

  if (!parsed.success) {
    return {
      message: "첨부 파일 정보를 다시 확인해 주세요.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await uploadTeacherSessionAttachment({
      organizationId: access.organizationId,
      teacherId: access.teacherId,
      sessionId,
      fileName: parsed.data.fileName,
      mimeType: parsed.data.mimeType,
      size: parsed.data.size,
      bytes: await file.arrayBuffer(),
    });

    if (result.status === "blocked") {
      return {
        message: result.message,
      };
    }

    revalidatePath(`/sessions/${sessionId}`);
    revalidatePath("/dashboard");

    return {
      message: "첨부 문서를 업로드했습니다.",
    };
  } catch (error) {
    return {
      message:
        error instanceof Error ? error.message : "첨부 업로드 중 오류가 발생했습니다.",
    };
  }
}
