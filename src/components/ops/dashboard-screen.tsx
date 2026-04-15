"use client";

import Link from "next/link";
import { useActionState } from "react";

import { createSessionAction } from "@/server/actions/sessions";

type SessionDashboardData = {
  villages: Array<{ id: string; name: string }>;
  programs: Array<{ id: string; name: string }>;
  classes: Array<{
    id: string;
    name: string;
    programId: string | null;
    villageId: string | null;
    programName: string | null;
    villageName: string | null;
  }>;
  teacherAssignments: Array<{
    classId: string;
    className: string;
    teacherId: string;
    teacherName: string | null;
    teacherEmail: string;
  }>;
  recentSessions: Array<{
    id: string;
    sessionDate: string;
    className: string;
    villageName: string;
    programName: string;
    teacherName: string | null;
    teacherEmail: string;
    snapshotCount: number;
    submittedAt: Date | null;
  }>;
};

type DashboardQueryData = {
  setupGaps: Array<{
    label: string;
    description: string;
    href: string;
  }>;
  recentSubmissions: Array<{
    id: string;
    sessionDate: string;
    className: string;
    villageName: string;
    programName: string;
    teacherName: string | null;
    teacherEmail: string;
    submittedAt: Date | null;
    updatedAt: Date;
  }>;
  recentUpdates: Array<{
    id: string;
    sessionDate: string;
    className: string;
    villageName: string;
    programName: string;
    teacherName: string | null;
    teacherEmail: string;
    submittedAt: Date | null;
    updatedAt: Date;
  }>;
  submissionOverview: {
    totalSessions: number;
    submittedSessions: number;
    pendingSessions: number;
    completionRate: number;
    attendanceCount: number;
    journalCount: number;
    attachmentCount: number;
  };
  pendingSessions: Array<{
    id: string;
    sessionDate: string;
    className: string;
    villageName: string;
    programName: string;
    teacherName: string | null;
    teacherEmail: string;
    submittedAt: Date | null;
    updatedAt: Date;
  }>;
};

type ActionState = {
  message?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

const initialState: ActionState = {};

function Panel({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-panel">
      <div>
        <p className="text-lg font-semibold tracking-[-0.03em] text-[var(--color-text-primary)]">
          {title}
        </p>
        <p className="mt-1 text-sm leading-6 text-[var(--color-text-secondary)]">
          {description}
        </p>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Feedback({ state }: { state: ActionState }) {
  return state.message ? (
    <p className="rounded-[18px] bg-[var(--color-surface-alt)] px-4 py-3 text-sm leading-6 text-[var(--color-text-secondary)]">
      {state.message}
    </p>
  ) : null;
}

function formatDateLabel(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "short",
    day: "numeric",
    weekday: "short",
  }).format(new Date(`${value}T00:00:00`));
}

function formatDateTimeLabel(value: Date) {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(value);
}

function ActivityList({
  items,
  emptyMessage,
  timestampLabel,
}: {
  items: Array<{
    id: string;
    sessionDate: string;
    className: string;
    villageName: string;
    programName: string;
    teacherName: string | null;
    teacherEmail: string;
    submittedAt: Date | null;
    updatedAt: Date;
  }>;
  emptyMessage: string;
  timestampLabel: "submitted" | "updated";
}) {
  if (!items.length) {
    return (
      <p className="rounded-[18px] bg-[var(--color-surface-alt)] px-4 py-4 text-sm leading-6 text-[var(--color-text-secondary)]">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="rounded-[20px] bg-[var(--color-surface-alt)] px-4 py-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                {item.className}
              </p>
              <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                {item.programName} · {item.villageName}
              </p>
            </div>
            <span className="rounded-full bg-[var(--color-surface)] px-3 py-2 text-xs font-semibold text-[var(--color-text-secondary)]">
              {formatDateLabel(item.sessionDate)}
            </span>
          </div>
          <p className="mt-3 text-sm text-[var(--color-text-secondary)]">
            {item.teacherName ?? item.teacherEmail} ·{" "}
            {timestampLabel === "submitted"
              ? `제출 ${formatDateTimeLabel(item.submittedAt as Date)}`
              : `수정 ${formatDateTimeLabel(item.updatedAt)}`}
          </p>
        </div>
      ))}
    </div>
  );
}

export function DashboardScreen({
  data,
  dashboard,
}: {
  data: SessionDashboardData;
  dashboard: DashboardQueryData;
}) {
  const [createState, createAction] = useActionState(
    createSessionAction,
    initialState,
  );

  const missingRequirements = [
    !data.villages.length ? "마을" : null,
    !data.programs.length ? "프로그램" : null,
    !data.classes.length ? "수업" : null,
    !data.teacherAssignments.length ? "강사 배정" : null,
  ].filter(Boolean);

  return (
    <main className="flex min-h-screen flex-1 flex-col bg-[var(--color-background)]">
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-5 py-6 sm:px-8 lg:px-10 lg:py-10">
        <header className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-panel sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-text-secondary)]">
            Ops dashboard
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-[-0.05em] text-[var(--color-text-primary)] sm:text-5xl">
            다음 할 일과 최근 기록 변화를 한 화면에서 바로 스캔합니다.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--color-text-secondary)]">
            세션 생성, 미제출 확인, 최근 제출과 수정 흐름을 한 톤 안에서
            관리하면 운영자가 가장 먼저 움직여야 할 액션이 분명해집니다.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <Panel
            title="다음 액션"
            description="설정 공백과 현재 운영 흐름을 함께 보고, 가장 먼저 처리할 일을 위로 올립니다."
          >
            <div className="space-y-3">
              {dashboard.setupGaps.length ? (
                dashboard.setupGaps.map((gap) => (
                  <Link
                    key={gap.label}
                    href={gap.href}
                    className="block rounded-[20px] bg-[var(--color-surface-alt)] px-4 py-4 transition-transform hover:-translate-y-0.5"
                  >
                    <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                      {gap.label}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-[var(--color-text-secondary)]">
                      {gap.description}
                    </p>
                  </Link>
                ))
              ) : (
                <p className="rounded-[18px] bg-[var(--color-surface-alt)] px-4 py-4 text-sm leading-6 text-[var(--color-text-secondary)]">
                  기본 설정과 세션 흐름이 모두 준비되었습니다. 이제 최근 제출과
                  미제출 세션을 중심으로 운영 상태를 확인하면 됩니다.
                </p>
              )}
            </div>
          </Panel>

          <Panel
            title="제출 상태 요약"
            description="세션 기준 진행률과 기록 단위 볼륨을 같은 맥락에서 봅니다."
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[20px] bg-[var(--color-surface-alt)] px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-text-secondary)]">
                  Sessions
                </p>
                <p className="mt-2 text-3xl font-bold tracking-[-0.04em] text-[var(--color-text-primary)]">
                  {dashboard.submissionOverview.totalSessions}
                </p>
              </div>
              <div className="rounded-[20px] bg-[var(--color-surface-alt)] px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-text-secondary)]">
                  Completion
                </p>
                <p className="mt-2 text-3xl font-bold tracking-[-0.04em] text-[var(--color-text-primary)]">
                  {dashboard.submissionOverview.completionRate}%
                </p>
              </div>
              <div className="rounded-[20px] bg-[var(--color-surface-alt)] px-4 py-4 text-sm leading-6 text-[var(--color-text-secondary)]">
                제출 {dashboard.submissionOverview.submittedSessions}건 · 미제출{" "}
                {dashboard.submissionOverview.pendingSessions}건
              </div>
              <div className="rounded-[20px] bg-[var(--color-surface-alt)] px-4 py-4 text-sm leading-6 text-[var(--color-text-secondary)]">
                출석 {dashboard.submissionOverview.attendanceCount}건 · 일지{" "}
                {dashboard.submissionOverview.journalCount}건 · 첨부{" "}
                {dashboard.submissionOverview.attachmentCount}건
              </div>
            </div>
          </Panel>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <Panel
            title="세션 만들기"
            description="날짜, 마을, 프로그램, 수업, 배정된 강사를 선택해 세션과 출석 대상 스냅샷을 함께 생성합니다."
          >
            {missingRequirements.length ? (
              <div className="rounded-[18px] bg-[var(--color-surface-alt)] px-4 py-4 text-sm leading-6 text-[var(--color-text-secondary)]">
                아직 {missingRequirements.join(", ")} 정보가 부족합니다.{" "}
                `/settings`와 `/users`에서 기본 데이터를 채운 뒤 세션을 만들 수
                있습니다.
              </div>
            ) : null}

            <form action={createAction} className="mt-4 grid gap-3">
              <input
                type="date"
                name="sessionDate"
                className="rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none"
              />
              <select
                name="villageId"
                className="rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none"
              >
                <option value="">마을 선택</option>
                {data.villages.map((village) => (
                  <option key={village.id} value={village.id}>
                    {village.name}
                  </option>
                ))}
              </select>
              <select
                name="programId"
                className="rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none"
              >
                <option value="">프로그램 선택</option>
                {data.programs.map((program) => (
                  <option key={program.id} value={program.id}>
                    {program.name}
                  </option>
                ))}
              </select>
              <select
                name="classId"
                className="rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none"
              >
                <option value="">수업 선택</option>
                {data.classes.map((klass) => (
                  <option key={klass.id} value={klass.id}>
                    {klass.name} · {klass.programName ?? "프로그램 미연결"} ·{" "}
                    {klass.villageName ?? "마을 미연결"}
                  </option>
                ))}
              </select>
              <select
                name="teacherId"
                className="rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none"
              >
                <option value="">배정 강사 선택</option>
                {data.teacherAssignments.map((assignment) => (
                  <option
                    key={`${assignment.classId}-${assignment.teacherId}`}
                    value={assignment.teacherId}
                  >
                    {assignment.className} ·{" "}
                    {assignment.teacherName ?? assignment.teacherEmail}
                  </option>
                ))}
              </select>
              <button className="rounded-full bg-[var(--color-accent)] px-4 py-3 text-sm font-semibold text-[var(--color-accent-ink)]">
                세션 생성
              </button>
            </form>
            <Feedback state={createState} />
          </Panel>

          <Panel
            title="최근 생성 세션"
            description="세션은 생성 즉시 명단 스냅샷 수와 함께 확인할 수 있어야 합니다."
          >
            <div className="space-y-3">
              {data.recentSessions.length ? (
                data.recentSessions.map((session) => (
                  <div
                    key={session.id}
                    className="rounded-[20px] bg-[var(--color-surface-alt)] px-4 py-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                          {session.className}
                        </p>
                        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                          {session.programName} · {session.villageName}
                        </p>
                      </div>
                      <span className="rounded-full bg-[var(--color-surface)] px-3 py-2 text-xs font-semibold text-[var(--color-text-secondary)]">
                        {formatDateLabel(session.sessionDate)}
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-[var(--color-text-secondary)]">
                      강사 {session.teacherName ?? session.teacherEmail} · 스냅샷{" "}
                      {session.snapshotCount}명 ·{" "}
                      {session.submittedAt ? "제출 완료" : "제출 전"}
                    </p>
                  </div>
                ))
              ) : (
                <p className="rounded-[18px] bg-[var(--color-surface-alt)] px-4 py-4 text-sm leading-6 text-[var(--color-text-secondary)]">
                  아직 세션이 없습니다. 운영자가 첫 세션을 만들면 강사 작업공간에
                  바로 나타납니다.
                </p>
              )}
            </div>
          </Panel>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Panel
            title="최근 제출"
            description="최초 제출 시각 기준으로 새로 들어온 기록만 봅니다."
          >
            <ActivityList
              items={dashboard.recentSubmissions}
              emptyMessage="아직 제출된 세션이 없습니다."
              timestampLabel="submitted"
            />
          </Panel>

          <Panel
            title="최근 수정"
            description="이미 제출된 기록 중 나중에 수정된 세션만 따로 봅니다."
          >
            <ActivityList
              items={dashboard.recentUpdates}
              emptyMessage="아직 제출 후 수정된 세션이 없습니다."
              timestampLabel="updated"
            />
          </Panel>

          <Panel
            title="미제출 세션"
            description="운영자가 먼저 챙겨야 할 pending 세션을 빠르게 확인합니다."
          >
            <ActivityList
              items={dashboard.pendingSessions}
              emptyMessage="현재 미제출 세션이 없습니다."
              timestampLabel="updated"
            />
          </Panel>
        </div>
      </div>
    </main>
  );
}
