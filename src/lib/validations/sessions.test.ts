import {
  attachmentMetadataSchema,
  sessionCreateSchema,
  sessionSubmissionSchema,
} from "@/lib/validations/sessions";

describe("session validations", () => {
  it("accepts a complete session creation payload", () => {
    expect(
      sessionCreateSchema.safeParse({
        sessionDate: "2026-04-15",
        villageId: "46a87e1a-9918-4ea1-872f-999999999999",
        programId: "56a87e1a-9918-4ea1-872f-999999999999",
        classId: "66a87e1a-9918-4ea1-872f-999999999999",
        teacherId: "76a87e1a-9918-4ea1-872f-999999999999",
      }).success,
    ).toBe(true);
  });

  it("rejects malformed dates and missing ids", () => {
    const parsed = sessionCreateSchema.safeParse({
      sessionDate: "2026/04/15",
      villageId: "",
      programId: "",
      classId: "",
      teacherId: "",
    });

    expect(parsed.success).toBe(false);
  });

  it("accepts required attendance rows and lesson journal content", () => {
    expect(
      sessionSubmissionSchema.safeParse({
        lessonJournal: "오늘은 읽기 활동과 짝 토론을 진행했습니다.",
        attendance: [
          {
            sessionParticipantSnapshotId:
              "46a87e1a-9918-4ea1-872f-999999999999",
            status: "present",
          },
        ],
      }).success,
    ).toBe(true);
  });

  it("validates attachment metadata limits", () => {
    expect(
      attachmentMetadataSchema.safeParse({
        fileName: "attendance-photo.jpg",
        mimeType: "image/jpeg",
        size: 1024,
      }).success,
    ).toBe(true);
    expect(
      attachmentMetadataSchema.safeParse({
        fileName: "",
        mimeType: "",
        size: 0,
      }).success,
    ).toBe(false);
  });
});
