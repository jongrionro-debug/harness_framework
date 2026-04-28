import { and, eq } from "drizzle-orm";

import { attachmentMetadataSchema } from "@/lib/validations/sessions";
import { getDb } from "@/lib/db/client";
import { getTeacherSessionWorkspace } from "@/server/services/sessions";
import {
  attendanceRecords,
  attachments,
  lessonJournals,
  sessions,
} from "@/lib/db/schema";

type SubmissionAttendanceStatus = "present" | "absent" | "late" | "excused";

type TeacherSubmissionWorkspace = Awaited<
  ReturnType<typeof getTeacherSessionWorkspace>
>;

type SubmissionRepository = {
  findTeacherSessionWorkspace(
    organizationId: string,
    teacherId: string,
    sessionId: string,
  ): Promise<TeacherSubmissionWorkspace>;
  listAttendanceRecords(
    organizationId: string,
    sessionId: string,
  ): Promise<
    Array<{
      sessionParticipantSnapshotId: string;
      status: SubmissionAttendanceStatus;
    }>
  >;
  findLessonJournal(
    organizationId: string,
    sessionId: string,
  ): Promise<{ body: string } | null>;
  listAttachments(
    organizationId: string,
    sessionId: string,
  ): Promise<
    Array<{
      id: string;
      fileName: string;
      mimeType: string;
      size: number;
      filePath: string;
    }>
  >;
  upsertAttendanceRecords(
    values: Array<typeof attendanceRecords.$inferInsert>,
  ): Promise<void>;
  upsertLessonJournal(values: typeof lessonJournals.$inferInsert): Promise<void>;
  updateSessionSubmission(
    sessionId: string,
    organizationId: string,
    submittedAt: Date,
    updatedAt: Date,
  ): Promise<void>;
};

function createSubmissionRepository(): SubmissionRepository {
  const db = getDb();

  return {
    async findTeacherSessionWorkspace(organizationId, teacherId, sessionId) {
      return getTeacherSessionWorkspace(organizationId, teacherId, sessionId);
    },
    async listAttendanceRecords(organizationId, sessionId) {
      return db
        .select({
          sessionParticipantSnapshotId: attendanceRecords.sessionParticipantSnapshotId,
          status: attendanceRecords.status,
        })
        .from(attendanceRecords)
        .where(
          and(
            eq(attendanceRecords.organizationId, organizationId),
            eq(attendanceRecords.sessionId, sessionId),
          ),
        );
    },
    async findLessonJournal(organizationId, sessionId) {
      const [journal] = await db
        .select({
          body: lessonJournals.body,
        })
        .from(lessonJournals)
        .where(
          and(
            eq(lessonJournals.organizationId, organizationId),
            eq(lessonJournals.sessionId, sessionId),
          ),
        )
        .limit(1);

      return journal ?? null;
    },
    async listAttachments(organizationId, sessionId) {
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
        );
    },
    async upsertAttendanceRecords(values) {
      for (const value of values) {
        await db
          .insert(attendanceRecords)
          .values(value)
          .onConflictDoUpdate({
            target: attendanceRecords.sessionParticipantSnapshotId,
            set: {
              status: value.status,
              updatedAt: new Date(),
            },
          });
      }
    },
    async upsertLessonJournal(values) {
      await db
        .insert(lessonJournals)
        .values(values)
        .onConflictDoUpdate({
          target: lessonJournals.sessionId,
          set: {
            body: values.body,
            updatedAt: new Date(),
          },
        });
    },
    async updateSessionSubmission(sessionId, organizationId, submittedAt, updatedAt) {
      await db
        .update(sessions)
        .set({
          submittedAt,
          updatedAt,
        })
        .where(
          and(
            eq(sessions.id, sessionId),
            eq(sessions.organizationId, organizationId),
          ),
        );
    },
  };
}

function buildAttendanceStatusMap(
  attendanceRows: Array<{
    sessionParticipantSnapshotId: string;
    status: SubmissionAttendanceStatus;
  }>,
) {
  return new Map(
    attendanceRows.map((row) => [row.sessionParticipantSnapshotId, row.status]),
  );
}

export async function getTeacherSubmissionWorkspace(
  organizationId: string,
  teacherId: string,
  sessionId: string,
  repository: SubmissionRepository = createSubmissionRepository(),
) {
  const [session, attendanceRows, journal, attachmentRows] = await Promise.all([
    repository.findTeacherSessionWorkspace(organizationId, teacherId, sessionId),
    repository.listAttendanceRecords(organizationId, sessionId),
    repository.findLessonJournal(organizationId, sessionId),
    repository.listAttachments(organizationId, sessionId),
  ]);

  if (!session) {
    return null;
  }

  const attendanceMap = buildAttendanceStatusMap(attendanceRows);

  return {
    ...session,
    lessonJournal: journal?.body ?? "",
    attachments: attachmentRows,
    snapshots: session.snapshots.map((snapshot) => ({
      ...snapshot,
      attendanceStatus: attendanceMap.get(snapshot.id) ?? "present",
    })),
  };
}

export async function saveTeacherSessionSubmission(
  input: {
    organizationId: string;
    teacherId: string;
    sessionId: string;
    lessonJournal: string;
    attendance: Array<{
      sessionParticipantSnapshotId: string;
      status: SubmissionAttendanceStatus;
    }>;
  },
  repository: SubmissionRepository = createSubmissionRepository(),
) {
  const workspace = await repository.findTeacherSessionWorkspace(
    input.organizationId,
    input.teacherId,
    input.sessionId,
  );

  if (!workspace) {
    throw new Error("배정된 세션만 제출하거나 수정할 수 있습니다.");
  }

  if (!workspace.snapshots.length) {
    throw new Error("운영자가 참여자를 추가해야 제출할 수 있습니다.");
  }

  for (const attachment of await repository.listAttachments(
    input.organizationId,
    input.sessionId,
  )) {
    const parsed = attachmentMetadataSchema.safeParse({
      fileName: attachment.fileName,
      mimeType: attachment.mimeType,
      size: attachment.size,
    });

    if (!parsed.success) {
      throw new Error("첨부 문서 메타데이터를 다시 확인해 주세요.");
    }
  }

  const snapshotIds = new Set(workspace.snapshots.map((snapshot) => snapshot.id));
  const attendanceIds = input.attendance.map(
    (row) => row.sessionParticipantSnapshotId,
  );

  if (new Set(attendanceIds).size !== attendanceIds.length) {
    throw new Error("출석 정보가 중복되어 있습니다.");
  }

  if (
    attendanceIds.length !== snapshotIds.size ||
    attendanceIds.some((snapshotId) => !snapshotIds.has(snapshotId))
  ) {
    throw new Error("세션 스냅샷 기준으로 모든 출석 정보를 제출해 주세요.");
  }

  const now = new Date();
  const submittedAt = workspace.submittedAt ?? now;

  await repository.upsertAttendanceRecords(
    input.attendance.map((row) => ({
      organizationId: input.organizationId,
      sessionId: input.sessionId,
      sessionParticipantSnapshotId: row.sessionParticipantSnapshotId,
      status: row.status,
    })),
  );

  await repository.upsertLessonJournal({
    organizationId: input.organizationId,
    sessionId: input.sessionId,
    body: input.lessonJournal.trim(),
  });

  await repository.updateSessionSubmission(
    input.sessionId,
    input.organizationId,
    submittedAt,
    now,
  );

  return {
    submittedAt,
    updatedAt: now,
    isFirstSubmission: workspace.submittedAt === null,
  };
}
