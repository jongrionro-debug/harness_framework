import { randomUUID } from "node:crypto";

import { and, asc, eq } from "drizzle-orm";

import { getSupabaseAdminClient } from "@/lib/auth/supabase-admin";
import { getDb } from "@/lib/db/client";
import { attachments } from "@/lib/db/schema";
import { getOptionalStorageEnv } from "@/lib/env";
import { getTeacherSessionWorkspace } from "@/server/services/sessions";

type AttachmentRepository = {
  findTeacherSessionWorkspace(
    organizationId: string,
    teacherId: string,
    sessionId: string,
  ): ReturnType<typeof getTeacherSessionWorkspace>;
  uploadBinary(
    bucket: string,
    path: string,
    bytes: ArrayBuffer,
    contentType: string,
  ): Promise<void>;
  insertAttachment(values: typeof attachments.$inferInsert): Promise<void>;
};

function sanitizeFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "-");
}

function createAttachmentRepository(): AttachmentRepository {
  const db = getDb();

  return {
    async findTeacherSessionWorkspace(organizationId, teacherId, sessionId) {
      return getTeacherSessionWorkspace(organizationId, teacherId, sessionId);
    },
    async uploadBinary(bucket, path, bytes, contentType) {
      const supabase = getSupabaseAdminClient();
      const { error } = await supabase.storage
        .from(bucket)
        .upload(path, bytes, { contentType, upsert: false });

      if (error) {
        throw new Error(error.message);
      }
    },
    async insertAttachment(values) {
      await db.insert(attachments).values(values);
    },
  };
}

export function getAttachmentStorageStatus() {
  const storageEnv = getOptionalStorageEnv();

  return {
    enabled: Boolean(storageEnv.SUPABASE_ATTACHMENTS_BUCKET),
    bucket: storageEnv.SUPABASE_ATTACHMENTS_BUCKET ?? null,
  };
}

export async function uploadTeacherSessionAttachment(
  input: {
    organizationId: string;
    teacherId: string;
    sessionId: string;
    fileName: string;
    mimeType: string;
    size: number;
    bytes: ArrayBuffer;
  },
  repository: AttachmentRepository = createAttachmentRepository(),
) {
  const workspace = await repository.findTeacherSessionWorkspace(
    input.organizationId,
    input.teacherId,
    input.sessionId,
  );

  if (!workspace) {
    throw new Error("배정된 세션에만 첨부 문서를 올릴 수 있습니다.");
  }

  const storage = getAttachmentStorageStatus();
  if (!storage.enabled || !storage.bucket) {
    return {
      status: "blocked" as const,
      message:
        "SUPABASE_ATTACHMENTS_BUCKET 설정이 없어 첨부 업로드를 시작할 수 없습니다.",
    };
  }

  const filePath = [
    "organizations",
    input.organizationId,
    "sessions",
    input.sessionId,
    `${randomUUID()}-${sanitizeFileName(input.fileName)}`,
  ].join("/");

  await repository.uploadBinary(
    storage.bucket,
    filePath,
    input.bytes,
    input.mimeType,
  );

  await repository.insertAttachment({
    organizationId: input.organizationId,
    sessionId: input.sessionId,
    uploadedByUserId: input.teacherId,
    filePath,
    fileName: input.fileName,
    mimeType: input.mimeType,
    size: input.size,
  });

  return {
    status: "uploaded" as const,
    filePath,
  };
}

export async function listSessionAttachments(organizationId: string, sessionId: string) {
  const db = getDb();

  return db
    .select({
      id: attachments.id,
      fileName: attachments.fileName,
      mimeType: attachments.mimeType,
      size: attachments.size,
      filePath: attachments.filePath,
    })
    .from(attachments)
    .where(
      and(
        eq(attachments.organizationId, organizationId),
        eq(attachments.sessionId, sessionId),
      ),
    )
    .orderBy(asc(attachments.createdAt));
}
