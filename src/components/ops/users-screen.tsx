"use client";

import Link from "next/link";
import { useActionState } from "react";

import {
  approveMemberAction,
  assignTeacherAction,
  createInviteAction,
  updateMemberRoleAction,
} from "@/server/actions/memberships";

type UserManagementData = {
  members: Array<{
    membershipId: string;
    userId: string;
    email: string;
    displayName: string | null;
    role: "platform_admin" | "organization_admin" | "teacher";
    approvedAt: Date | null;
  }>;
  invites: Array<{
    id: string;
    email: string;
    role: "platform_admin" | "organization_admin" | "teacher";
    inviteToken: string;
    expiresAt: Date;
    acceptedAt: Date | null;
  }>;
  assignments: Array<{
    id: string;
    className: string;
    userEmail: string;
  }>;
  classes: Array<{
    id: string;
    name: string;
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

function CopyInviteTokenButton({ token }: { token: string }) {
  return (
    <button
      type="button"
      onClick={() => navigator.clipboard.writeText(token)}
      className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-xs font-semibold text-[var(--color-text-primary)]"
    >
      토큰 복사
    </button>
  );
}

export function UsersScreen({ data }: { data: UserManagementData }) {
  const [inviteState, inviteAction] = useActionState(
    createInviteAction,
    initialState,
  );
  const [roleState, roleAction] = useActionState(
    updateMemberRoleAction,
    initialState,
  );
  const [approveState, approveAction] = useActionState(
    approveMemberAction,
    initialState,
  );
  const [assignmentState, assignmentAction] = useActionState(
    assignTeacherAction,
    initialState,
  );

  const teachers = data.members.filter(
    (member) => member.role === "teacher" && member.approvedAt,
  );

  return (
    <main className="flex min-h-screen flex-1 flex-col bg-[var(--color-background)]">
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-5 py-6 sm:px-8 lg:px-10 lg:py-10">
        <header className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-panel sm:p-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 py-2 text-sm font-semibold text-[var(--color-text-primary)] transition hover:-translate-y-0.5"
          >
            <span aria-hidden="true">&lt;</span>
            뒤로 가기
          </Link>
          <p className="mt-5 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-text-secondary)]">
            Organization users
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-[-0.05em] text-[var(--color-text-primary)] sm:text-5xl">
            강사 초대, 승인, 역할 관리, 수업 배정을 한 흐름에서 다룹니다.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--color-text-secondary)]">
            지금은 로컬 MVP답게 실제 메일 발송 대신 초대 토큰을 생성하고, 조직
            내부 사용자가 토큰을 수락한 뒤에도 운영자 승인 전에는 접근하지
            못하도록 먼저 안정적으로 관리합니다.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          <Panel
            title="멤버 역할 관리"
            description="organization_admin과 teacher 역할을 조직 범위 안에서만 조정하고, 초대 수락 뒤에는 운영자가 승인해야 실제 접근이 열립니다."
          >
            <div className="space-y-3">
              {data.members.length ? (
                data.members.map((member) => (
                  <div
                    key={member.membershipId}
                    className="rounded-[18px] bg-[var(--color-surface-alt)] p-4"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                          {member.displayName ?? member.email}
                        </p>
                        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                          {member.email}
                        </p>
                        <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-text-secondary)]">
                          {member.approvedAt ? "승인 완료" : "승인 대기"}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <form action={roleAction} className="flex flex-wrap gap-2">
                          <input
                            type="hidden"
                            name="membershipId"
                            value={member.membershipId}
                          />
                          <select
                            name="role"
                            defaultValue={member.role}
                            className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm text-[var(--color-text-primary)] outline-none"
                          >
                            <option value="organization_admin">
                              organization_admin
                            </option>
                            <option value="teacher">teacher</option>
                          </select>
                          <button className="rounded-full bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold text-[var(--color-accent-ink)]">
                            역할 변경
                          </button>
                        </form>
                        {!member.approvedAt ? (
                          <form action={approveAction}>
                            <input
                              type="hidden"
                              name="membershipId"
                              value={member.membershipId}
                            />
                            <button className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm font-semibold text-[var(--color-text-primary)]">
                              접근 승인
                            </button>
                          </form>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="rounded-[18px] bg-[var(--color-surface-alt)] px-4 py-3 text-sm text-[var(--color-text-secondary)]">
                  아직 조직 멤버가 없습니다.
                </p>
              )}
            </div>
            <Feedback state={roleState} />
            <Feedback state={approveState} />
          </Panel>

          <Panel
            title="강사 초대"
            description="메일 발송 없이도 공유 가능한 local-first 초대 토큰을 만듭니다."
          >
            <form action={inviteAction} className="grid gap-3">
              <input
                name="email"
                placeholder="teacher@example.com"
                className="rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none"
              />
              <select
                name="role"
                defaultValue="teacher"
                className="rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none"
              >
                <option value="teacher">teacher</option>
                <option value="organization_admin">organization_admin</option>
              </select>
              <button className="rounded-full bg-[var(--color-accent)] px-4 py-3 text-sm font-semibold text-[var(--color-accent-ink)]">
                초대 링크 만들기
              </button>
            </form>
            <Feedback state={inviteState} />
            <div className="mt-4 space-y-2">
              {data.invites.length ? (
                data.invites.map((invite) => (
                  <div
                    key={invite.id}
                    className="rounded-[18px] bg-[var(--color-surface-alt)] px-4 py-3"
                  >
                    <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                      {invite.email}
                    </p>
                    <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                      {invite.role} ·{" "}
                      {invite.acceptedAt ? "수락 완료" : "수락 대기"}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <code className="max-w-full break-all rounded-[14px] bg-[var(--color-surface)] px-3 py-2 text-xs text-[var(--color-text-secondary)]">
                        {invite.inviteToken}
                      </code>
                      <CopyInviteTokenButton token={invite.inviteToken} />
                    </div>
                  </div>
                ))
              ) : (
                <p className="rounded-[18px] bg-[var(--color-surface-alt)] px-4 py-3 text-sm text-[var(--color-text-secondary)]">
                  아직 생성된 초대 링크가 없습니다.
                </p>
              )}
            </div>
          </Panel>

          <Panel
            title="강사 수업 배정"
            description="teacher 역할을 가진 사용자만 수업에 배정할 수 있습니다."
          >
            <form action={assignmentAction} className="grid gap-3">
              <select
                name="userId"
                className="rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none"
              >
                <option value="">강사 선택</option>
                {teachers.map((teacher) => (
                  <option key={teacher.userId} value={teacher.userId}>
                    {teacher.displayName ?? teacher.email}
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
                    {klass.name}
                  </option>
                ))}
              </select>
              <button className="rounded-full bg-[var(--color-accent)] px-4 py-3 text-sm font-semibold text-[var(--color-accent-ink)]">
                강사 배정
              </button>
            </form>
            <Feedback state={assignmentState} />
            <div className="mt-4 space-y-2">
              {data.assignments.length ? (
                data.assignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="rounded-[18px] bg-[var(--color-surface-alt)] px-4 py-3 text-sm text-[var(--color-text-primary)]"
                  >
                    {assignment.className} · {assignment.userEmail}
                  </div>
                ))
              ) : (
                <p className="rounded-[18px] bg-[var(--color-surface-alt)] px-4 py-3 text-sm text-[var(--color-text-secondary)]">
                  아직 강사 배정이 없습니다.
                </p>
              )}
            </div>
          </Panel>
        </div>
      </div>
    </main>
  );
}
