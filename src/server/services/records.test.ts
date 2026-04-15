import { applyRecordFilters } from "@/server/services/records";

describe("records services", () => {
  const rows = [
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
      teacherName: null,
      teacherEmail: "teacher-3@example.com",
      submittedAt: null,
      updatedAt: new Date("2026-04-12T10:00:00.000Z"),
    },
  ];

  it("filters records by status semantics", () => {
    expect(
      applyRecordFilters(rows, {
        status: "submitted",
      }).map((row) => row.id),
    ).toEqual(["session-1", "session-2"]);

    expect(
      applyRecordFilters(rows, {
        status: "updated",
      }).map((row) => row.id),
    ).toEqual(["session-2"]);

    expect(
      applyRecordFilters(rows, {
        status: "pending",
      }).map((row) => row.id),
    ).toEqual(["session-3"]);
  });

  it("filters records by search, program, and teacher dimensions", () => {
    expect(
      applyRecordFilters(rows, {
        search: "바다",
      }).map((row) => row.id),
    ).toEqual(["session-2"]);

    expect(
      applyRecordFilters(rows, {
        program: "문해",
        teacher: "김선생",
      }).map((row) => row.id),
    ).toEqual(["session-1"]);
  });
});
