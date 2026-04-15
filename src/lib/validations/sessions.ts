import { z } from "zod";

export const sessionCreateSchema = z.object({
  sessionDate: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "세션 날짜를 선택해 주세요."),
  villageId: z.string().uuid("유효한 마을 id가 필요합니다."),
  programId: z.string().uuid("유효한 프로그램 id가 필요합니다."),
  classId: z.string().uuid("유효한 수업 id가 필요합니다."),
  teacherId: z.string().uuid("유효한 강사 id가 필요합니다."),
});

export const attendanceStatusSchema = z.enum([
  "present",
  "absent",
  "late",
  "excused",
]);

export const sessionSubmissionSchema = z.object({
  lessonJournal: z
    .string()
    .trim()
    .min(10, "교육일지는 10자 이상 입력해 주세요."),
  attendance: z
    .array(
      z.object({
        sessionParticipantSnapshotId: z.string().uuid(
          "유효한 출석 대상 id가 필요합니다.",
        ),
        status: attendanceStatusSchema,
      }),
    )
    .min(1, "최소 한 명 이상의 출석 정보가 필요합니다."),
});

export const attachmentMetadataSchema = z.object({
  fileName: z.string().trim().min(1, "파일 이름이 필요합니다."),
  mimeType: z.string().trim().min(1, "파일 타입 정보가 필요합니다."),
  size: z
    .number()
    .int()
    .positive("파일 크기 정보가 필요합니다.")
    .max(10 * 1024 * 1024, "첨부 파일은 10MB 이하로 제한합니다."),
});
