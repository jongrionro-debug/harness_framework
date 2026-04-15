import {
  getAttachmentStorageStatus,
  uploadTeacherSessionAttachment,
} from "@/server/services/attachments";

describe("attachment services", () => {
  const originalBucket = process.env.SUPABASE_ATTACHMENTS_BUCKET;

  afterEach(() => {
    if (originalBucket) {
      process.env.SUPABASE_ATTACHMENTS_BUCKET = originalBucket;
      return;
    }

    delete process.env.SUPABASE_ATTACHMENTS_BUCKET;
  });

  it("reports blocked storage when the attachment bucket is not configured", () => {
    delete process.env.SUPABASE_ATTACHMENTS_BUCKET;

    expect(getAttachmentStorageStatus()).toEqual({
      enabled: false,
      bucket: null,
    });
  });

  it("returns an explicit blocked result when storage config is missing", async () => {
    delete process.env.SUPABASE_ATTACHMENTS_BUCKET;

    const result = await uploadTeacherSessionAttachment(
      {
        organizationId: "org-1",
        teacherId: "teacher-1",
        sessionId: "session-1",
        fileName: "photo.jpg",
        mimeType: "image/jpeg",
        size: 1024,
        bytes: new ArrayBuffer(8),
      },
      {
        findTeacherSessionWorkspace: async () => ({
          id: "session-1",
          teacherId: "teacher-1",
          sessionDate: "2026-04-15",
          className: "A반",
          villageName: "동네 배움터",
          programName: "문해",
          submittedAt: null,
          snapshots: [],
        }),
        uploadBinary: async () => undefined,
        insertAttachment: async () => undefined,
      },
    );

    expect(result).toEqual({
      status: "blocked",
      message:
        "SUPABASE_ATTACHMENTS_BUCKET 설정이 없어 첨부 업로드를 시작할 수 없습니다.",
    });
  });
});
