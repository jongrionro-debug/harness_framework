import { asc, desc, eq, sql } from "drizzle-orm";

import { getDb } from "@/lib/db/client";
import {
  attachments,
  attendanceRecords,
  classes,
  lessonJournals,
  programs,
  sessions,
  teacherAssignments,
  users,
  villages,
} from "@/lib/db/schema";

type DashboardCounts = {
  villageCount: number;
  programCount: number;
  classCount: number;
  teacherAssignmentCount: number;
  attendanceCount: number;
  journalCount: number;
  attachmentCount: number;
};

type DashboardSessionActivity = {
  id: string;
  sessionDate: string;
  className: string;
  villageName: string;
  programName: string;
  teacherName: string | null;
  teacherEmail: string | null;
  submittedAt: Date | null;
  updatedAt: Date;
};

type DashboardRepository = {
  getCounts(organizationId: string): Promise<DashboardCounts>;
  listSessionActivity(organizationId: string): Promise<DashboardSessionActivity[]>;
};

function createDashboardRepository(): DashboardRepository {
  const db = getDb();

  return {
    async getCounts(organizationId) {
      const [
        villageCount,
        programCount,
        classCount,
        teacherAssignmentCount,
        attendanceCount,
        journalCount,
        attachmentCount,
      ] = await Promise.all([
        db
          .select({ count: sql<number>`count(*)`.mapWith(Number) })
          .from(villages)
          .where(eq(villages.organizationId, organizationId)),
        db
          .select({ count: sql<number>`count(*)`.mapWith(Number) })
          .from(programs)
          .where(eq(programs.organizationId, organizationId)),
        db
          .select({ count: sql<number>`count(*)`.mapWith(Number) })
          .from(classes)
          .where(eq(classes.organizationId, organizationId)),
        db
          .select({ count: sql<number>`count(*)`.mapWith(Number) })
          .from(teacherAssignments)
          .where(eq(teacherAssignments.organizationId, organizationId)),
        db
          .select({ count: sql<number>`count(*)`.mapWith(Number) })
          .from(attendanceRecords)
          .where(eq(attendanceRecords.organizationId, organizationId)),
        db
          .select({ count: sql<number>`count(*)`.mapWith(Number) })
          .from(lessonJournals)
          .where(eq(lessonJournals.organizationId, organizationId)),
        db
          .select({ count: sql<number>`count(*)`.mapWith(Number) })
          .from(attachments)
          .where(eq(attachments.organizationId, organizationId)),
      ]);

      return {
        villageCount: villageCount[0]?.count ?? 0,
        programCount: programCount[0]?.count ?? 0,
        classCount: classCount[0]?.count ?? 0,
        teacherAssignmentCount: teacherAssignmentCount[0]?.count ?? 0,
        attendanceCount: attendanceCount[0]?.count ?? 0,
        journalCount: journalCount[0]?.count ?? 0,
        attachmentCount: attachmentCount[0]?.count ?? 0,
      };
    },
    async listSessionActivity(organizationId) {
      return db
        .select({
          id: sessions.id,
          sessionDate: sessions.sessionDate,
          className: classes.name,
          villageName: villages.name,
          programName: programs.name,
          teacherName: users.displayName,
          teacherEmail: users.email,
          submittedAt: sessions.submittedAt,
          updatedAt: sessions.updatedAt,
        })
        .from(sessions)
        .innerJoin(classes, eq(sessions.classId, classes.id))
        .innerJoin(villages, eq(sessions.villageId, villages.id))
        .innerJoin(programs, eq(sessions.programId, programs.id))
        .leftJoin(users, eq(sessions.teacherId, users.id))
        .where(eq(sessions.organizationId, organizationId))
        .orderBy(desc(sessions.updatedAt), asc(classes.name));
    },
  };
}

export function getRecentSubmissions(rows: DashboardSessionActivity[]) {
  return rows
    .filter((row) => row.submittedAt)
    .sort((left, right) => {
      return (
        new Date(right.submittedAt as Date).getTime() -
        new Date(left.submittedAt as Date).getTime()
      );
    })
    .slice(0, 6);
}

export function getRecentUpdates(rows: DashboardSessionActivity[]) {
  return rows
    .filter(
      (row) =>
        row.submittedAt &&
        new Date(row.updatedAt).getTime() > new Date(row.submittedAt).getTime(),
    )
    .sort((left, right) => {
      return new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime();
    })
    .slice(0, 6);
}

export function getSetupGaps(
  counts: Pick<
    DashboardCounts,
    "programCount" | "classCount" | "teacherAssignmentCount"
  >,
  sessionRows: DashboardSessionActivity[],
) {
  const gaps = [];

  if (!counts.programCount) {
    gaps.push({
      label: "첫 사업 만들기",
      description: "세션을 만들기 전에 사업 이름부터 준비합니다.",
      href: "/settings",
    });
  }

  if (!counts.classCount) {
    gaps.push({
      label: "첫 수업 연결하기",
      description: "마을과 사업을 수업에 연결해야 세션을 만들 수 있습니다.",
      href: "/settings",
    });
  }

  if (!counts.teacherAssignmentCount) {
    gaps.push({
      label: "강사 배정하기",
      description: "강사가 수업에 연결되어야 세션 생성과 제출이 이어집니다.",
      href: "/users",
    });
  }

  if (!sessionRows.length) {
    gaps.push({
      label: "첫 세션 만들기",
      description: "운영자가 세션을 만들면 강사 작업공간이 바로 열립니다.",
      href: "/dashboard",
    });
  }

  return gaps;
}

export function buildDashboardQueryModel(
  counts: DashboardCounts,
  sessionRows: DashboardSessionActivity[],
) {
  const submittedSessions = sessionRows.filter((row) => row.submittedAt).length;
  const pendingSessions = sessionRows.length - submittedSessions;

  return {
    setupGaps: getSetupGaps(counts, sessionRows),
    recentSubmissions: getRecentSubmissions(sessionRows),
    recentUpdates: getRecentUpdates(sessionRows),
    submissionOverview: {
      totalSessions: sessionRows.length,
      submittedSessions,
      pendingSessions,
      completionRate:
        sessionRows.length === 0
          ? 0
          : Math.round((submittedSessions / sessionRows.length) * 100),
      attendanceCount: counts.attendanceCount,
      journalCount: counts.journalCount,
      attachmentCount: counts.attachmentCount,
    },
    pendingSessions: sessionRows
      .filter((row) => !row.submittedAt)
      .sort((left, right) => {
        return (
          new Date(right.sessionDate).getTime() - new Date(left.sessionDate).getTime()
        );
      })
      .slice(0, 6),
  };
}

export async function listOperatorDashboardData(
  organizationId: string,
  repository: DashboardRepository = createDashboardRepository(),
) {
  const [counts, sessionRows] = await Promise.all([
    repository.getCounts(organizationId),
    repository.listSessionActivity(organizationId),
  ]);

  return buildDashboardQueryModel(counts, sessionRows);
}
