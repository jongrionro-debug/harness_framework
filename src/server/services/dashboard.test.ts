import {
  buildDashboardQueryModel,
  getRecentSubmissions,
  getRecentUpdates,
  listOperatorDashboardData,
} from "@/server/services/dashboard";

describe("dashboard services", () => {
  const sessionRows = [
    {
      id: "session-1",
      sessionDate: "2026-04-10",
      className: "A반",
      villageName: "동네 배움터",
      programName: "문해",
      teacherName: "김선생",
      teacherEmail: "teacher-1@example.com",
      submittedAt: new Date("2026-04-10T09:00:00.000Z"),
      updatedAt: new Date("2026-04-10T09:00:00.000Z"),
    },
    {
      id: "session-2",
      sessionDate: "2026-04-11",
      className: "B반",
      villageName: "바다 마을",
      programName: "생활",
      teacherName: "박선생",
      teacherEmail: "teacher-2@example.com",
      submittedAt: new Date("2026-04-11T09:00:00.000Z"),
      updatedAt: new Date("2026-04-12T10:00:00.000Z"),
    },
    {
      id: "session-3",
      sessionDate: "2026-04-12",
      className: "C반",
      villageName: "숲 마을",
      programName: "기초",
      teacherName: "최선생",
      teacherEmail: "teacher-3@example.com",
      submittedAt: null,
      updatedAt: new Date("2026-04-12T10:00:00.000Z"),
    },
  ];

  it("separates recent submissions from later updates", () => {
    expect(getRecentSubmissions(sessionRows).map((row) => row.id)).toEqual([
      "session-2",
      "session-1",
    ]);
    expect(getRecentUpdates(sessionRows).map((row) => row.id)).toEqual([
      "session-2",
    ]);
  });

  it("builds dashboard overview counts and setup gaps", () => {
    expect(
      buildDashboardQueryModel(
        {
          villageCount: 1,
          programCount: 0,
          classCount: 0,
          teacherAssignmentCount: 0,
          attendanceCount: 3,
          journalCount: 1,
          attachmentCount: 0,
        },
        [],
      ),
    ).toMatchObject({
      setupGaps: [
        { label: "첫 사업 만들기" },
        { label: "첫 수업 연결하기" },
        { label: "강사 배정하기" },
        { label: "첫 세션 만들기" },
      ],
      submissionOverview: {
        totalSessions: 0,
        submittedSessions: 0,
        pendingSessions: 0,
        completionRate: 0,
      },
    });
  });

  it("keeps dashboard queries organization-scoped", async () => {
    const calledWith: string[] = [];

    const dashboard = await listOperatorDashboardData("org-1", {
      getCounts: async (organizationId) => {
        calledWith.push(organizationId);
        return {
          villageCount: 1,
          programCount: 1,
          classCount: 1,
          teacherAssignmentCount: 1,
          attendanceCount: 1,
          journalCount: 1,
          attachmentCount: 0,
        };
      },
      listSessionActivity: async (organizationId) => {
        calledWith.push(organizationId);
        return sessionRows;
      },
    });

    expect(calledWith).toEqual(["org-1", "org-1"]);
    expect(dashboard.submissionOverview).toMatchObject({
      totalSessions: 3,
      submittedSessions: 2,
      pendingSessions: 1,
      completionRate: 67,
    });
  });

  it("keeps unassigned sessions visible in dashboard query results", async () => {
    const dashboard = await listOperatorDashboardData("org-1", {
      getCounts: async () => ({
        villageCount: 1,
        programCount: 1,
        classCount: 1,
        teacherAssignmentCount: 0,
        attendanceCount: 0,
        journalCount: 0,
        attachmentCount: 0,
      }),
      listSessionActivity: async () => [
        {
          id: "session-unassigned",
          sessionDate: "2026-04-20",
          className: "현장 수업",
          villageName: "성내마을",
          programName: "문해 사업",
          teacherName: null,
          teacherEmail: null,
          submittedAt: null,
          updatedAt: new Date("2026-04-20T10:00:00.000Z"),
        },
      ],
    });

    expect(dashboard.pendingSessions).toEqual([
      expect.objectContaining({
        id: "session-unassigned",
        teacherName: null,
        teacherEmail: null,
      }),
    ]);
  });
});
