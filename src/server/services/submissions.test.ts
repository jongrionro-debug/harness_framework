import {
  getTeacherSubmissionWorkspace,
  saveTeacherSessionSubmission,
} from "@/server/services/submissions";

describe("submission services", () => {
  it("hydrates teacher workspace with saved attendance and journal", async () => {
    const workspace = await getTeacherSubmissionWorkspace(
      "org-1",
      "teacher-1",
      "session-1",
      {
        findTeacherSessionWorkspace: async () => ({
          id: "session-1",
          teacherId: "teacher-1",
          sessionDate: "2026-04-15",
          className: "A반",
          villageName: "동네 배움터",
          programName: "문해",
          submittedAt: null,
          snapshots: [
            {
              id: "snapshot-1",
              fullName: "홍길동",
              note: null,
              rosterOrder: 0,
            },
          ],
        }),
        listAttendanceRecords: async () => [
          {
            sessionParticipantSnapshotId: "snapshot-1",
            status: "late",
          },
        ],
        findLessonJournal: async () => ({
          body: "오늘은 낱말 읽기와 따라 쓰기를 진행했습니다.",
        }),
        listAttachments: async () => [],
        upsertAttendanceRecords: async () => undefined,
        upsertLessonJournal: async () => undefined,
        updateSessionSubmission: async () => undefined,
      },
    );

    expect(workspace).toMatchObject({
      lessonJournal: "오늘은 낱말 읽기와 따라 쓰기를 진행했습니다.",
      snapshots: [
        {
          id: "snapshot-1",
          attendanceStatus: "late",
        },
      ],
    });
  });

  it("preserves submitted_at on later edits", async () => {
    const updates: Array<{
      sessionId: string;
      organizationId: string;
      submittedAt: Date;
      updatedAt: Date;
    }> = [];

    const firstSubmittedAt = new Date("2026-04-10T09:00:00.000Z");

    const result = await saveTeacherSessionSubmission(
      {
        organizationId: "org-1",
        teacherId: "teacher-1",
        sessionId: "session-1",
        lessonJournal: "오늘은 읽기 활동과 문장 쓰기를 함께 진행했습니다.",
        attendance: [
          {
            sessionParticipantSnapshotId: "snapshot-1",
            status: "present",
          },
        ],
      },
      {
        findTeacherSessionWorkspace: async () => ({
          id: "session-1",
          teacherId: "teacher-1",
          sessionDate: "2026-04-15",
          className: "A반",
          villageName: "동네 배움터",
          programName: "문해",
          submittedAt: firstSubmittedAt,
          snapshots: [
            {
              id: "snapshot-1",
              fullName: "홍길동",
              note: null,
              rosterOrder: 0,
            },
          ],
        }),
        listAttendanceRecords: async () => [],
        findLessonJournal: async () => null,
        listAttachments: async () => [],
        upsertAttendanceRecords: async () => undefined,
        upsertLessonJournal: async () => undefined,
        updateSessionSubmission: async (
          sessionId,
          organizationId,
          submittedAt,
          updatedAt,
        ) => {
          updates.push({ sessionId, organizationId, submittedAt, updatedAt });
        },
      },
    );

    expect(result.isFirstSubmission).toBe(false);
    expect(result.submittedAt).toEqual(firstSubmittedAt);
    expect(updates[0]?.submittedAt).toEqual(firstSubmittedAt);
  });

  it("rejects teacher submission for unassigned sessions", async () => {
    await expect(
      saveTeacherSessionSubmission(
        {
          organizationId: "org-1",
          teacherId: "teacher-1",
          sessionId: "session-1",
          lessonJournal: "오늘 수업 내용을 남깁니다.",
          attendance: [
            {
              sessionParticipantSnapshotId: "snapshot-1",
              status: "present",
            },
          ],
        },
        {
          findTeacherSessionWorkspace: async () => null,
          listAttendanceRecords: async () => [],
          findLessonJournal: async () => null,
          listAttachments: async () => [],
          upsertAttendanceRecords: async () => undefined,
          upsertLessonJournal: async () => undefined,
          updateSessionSubmission: async () => undefined,
        },
      ),
    ).rejects.toThrow("배정된 세션만 제출하거나 수정할 수 있습니다.");
  });

  it("rejects teacher submission until the session has at least one snapshot", async () => {
    await expect(
      saveTeacherSessionSubmission(
        {
          organizationId: "org-1",
          teacherId: "teacher-1",
          sessionId: "session-1",
          lessonJournal: "오늘 수업 내용을 충분히 적어 둡니다.",
          attendance: [],
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
          listAttendanceRecords: async () => [],
          findLessonJournal: async () => null,
          listAttachments: async () => [],
          upsertAttendanceRecords: async () => undefined,
          upsertLessonJournal: async () => undefined,
          updateSessionSubmission: async () => undefined,
        },
      ),
    ).rejects.toThrow("운영자가 참여자를 추가해야 제출할 수 있습니다.");
  });

  it("fails final submission when stored attachment metadata is invalid", async () => {
    await expect(
      saveTeacherSessionSubmission(
        {
          organizationId: "org-1",
          teacherId: "teacher-1",
          sessionId: "session-1",
          lessonJournal: "오늘 수업 내용을 충분히 적어 둡니다.",
          attendance: [
            {
              sessionParticipantSnapshotId: "snapshot-1",
              status: "present",
            },
          ],
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
            snapshots: [
              {
                id: "snapshot-1",
                fullName: "홍길동",
                note: null,
                rosterOrder: 0,
              },
            ],
          }),
          listAttendanceRecords: async () => [],
          findLessonJournal: async () => null,
          listAttachments: async () => [
            {
              id: "attachment-1",
              fileName: "",
              mimeType: "",
              size: 0,
              filePath: "broken",
            },
          ],
          upsertAttendanceRecords: async () => undefined,
          upsertLessonJournal: async () => undefined,
          updateSessionSubmission: async () => undefined,
        },
      ),
    ).rejects.toThrow("첨부 문서 메타데이터를 다시 확인해 주세요.");
  });
});
