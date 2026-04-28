"use client";

import Link from "next/link";
import { useActionState } from "react";

import {
  createClassAction,
  createParticipantAction,
  createProgramAction,
  createVillageAction,
  deleteParticipantAction,
} from "@/server/actions/settings";

type SettingsOverview = {
  villages: Array<{ id: string; name: string; isPrimary: boolean }>;
  programs: Array<{ id: string; name: string; description: string | null }>;
  classes: Array<{
    id: string;
    name: string;
    description: string | null;
    programName: string | null;
    villageName: string | null;
  }>;
  participants: Array<{
    id: string;
    fullName: string;
    note: string | null;
    className: string | null;
  }>;
};

type ActionState = {
  message?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

const initialState: ActionState = {};

function Section({
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

export function SettingsScreen({ data }: { data: SettingsOverview }) {
  const [villageState, villageAction] = useActionState(
    createVillageAction,
    initialState,
  );
  const [programState, programAction] = useActionState(
    createProgramAction,
    initialState,
  );
  const [classState, classAction] = useActionState(
    createClassAction,
    initialState,
  );
  const [participantState, participantAction] = useActionState(
    createParticipantAction,
    initialState,
  );
  const [participantDeleteState, participantDeleteAction] = useActionState(
    deleteParticipantAction,
    initialState,
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
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-text-secondary)]">
            Ops settings
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-[-0.05em] text-[var(--color-text-primary)] sm:text-5xl">
            운영 기본정보를 비어 있는 상태에서부터 차근차근 채웁니다.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--color-text-secondary)]">
            기관 생성 직후 사업, 수업, 참여자 명단이 비어 있어도 괜찮게
            설계하고, 운영자가 필요한 것부터 하나씩 추가하는 흐름을 우선
            구현합니다.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          <Section
            title="마을"
            description="기관의 지역 단위를 먼저 만들고 이후 수업과 연결합니다."
          >
            <div className="space-y-2">
              {data.villages.length ? (
                data.villages.map((village) => (
                  <div
                    key={village.id}
                    className="rounded-[18px] bg-[var(--color-surface-alt)] px-4 py-3 text-sm text-[var(--color-text-primary)]"
                  >
                    {village.name}
                    {village.isPrimary ? " · 첫 마을" : ""}
                  </div>
                ))
              ) : (
                <p className="rounded-[18px] bg-[var(--color-surface-alt)] px-4 py-3 text-sm text-[var(--color-text-secondary)]">
                  아직 마을이 없습니다. 첫 마을부터 추가해 주세요.
                </p>
              )}
            </div>
            <form action={villageAction} className="mt-4 grid gap-3">
              <input
                name="name"
                placeholder="예: 동네 배움터"
                className="rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none"
              />
              <button className="rounded-full bg-[var(--color-accent)] px-4 py-3 text-sm font-semibold text-[var(--color-accent-ink)]">
                마을 추가
              </button>
            </form>
            <Feedback state={villageState} />
          </Section>

          <Section
            title="사업"
            description="기관이 운영하는 사업 또는 사업 단위를 관리합니다."
          >
            <div className="space-y-2">
              {data.programs.length ? (
                data.programs.map((program) => (
                  <div
                    key={program.id}
                    className="rounded-[18px] bg-[var(--color-surface-alt)] px-4 py-3"
                  >
                    <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                      {program.name}
                    </p>
                    {program.description ? (
                      <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                        {program.description}
                      </p>
                    ) : null}
                  </div>
                ))
              ) : (
                <p className="rounded-[18px] bg-[var(--color-surface-alt)] px-4 py-3 text-sm text-[var(--color-text-secondary)]">
                  아직 사업이 없습니다. 첫 사업을 추가해 주세요.
                </p>
              )}
            </div>
            <form action={programAction} className="mt-4 grid gap-3">
              <input
                name="name"
                placeholder="예: 문해 사업"
                className="rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none"
              />
              <textarea
                name="description"
                placeholder="사업 설명"
                className="min-h-24 rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none"
              />
              <button className="rounded-full bg-[var(--color-accent)] px-4 py-3 text-sm font-semibold text-[var(--color-accent-ink)]">
                사업 추가
              </button>
            </form>
            <Feedback state={programState} />
          </Section>

          <Section
            title="수업"
            description="사업과 마을을 선택적으로 연결해 실제 운영 수업을 만듭니다."
          >
            <div className="space-y-2">
              {data.classes.length ? (
                data.classes.map((klass) => (
                  <div
                    key={klass.id}
                    className="rounded-[18px] bg-[var(--color-surface-alt)] px-4 py-3"
                  >
                    <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                      {klass.name}
                    </p>
                    <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                      {klass.programName ?? "사업 미연결"} ·{" "}
                      {klass.villageName ?? "마을 미연결"}
                    </p>
                  </div>
                ))
              ) : (
                <p className="rounded-[18px] bg-[var(--color-surface-alt)] px-4 py-3 text-sm text-[var(--color-text-secondary)]">
                  아직 수업이 없습니다. 운영할 수업을 추가해 주세요.
                </p>
              )}
            </div>
            <form action={classAction} className="mt-4 grid gap-3">
              <input
                name="name"
                placeholder="예: 기초 문해 수업"
                className="rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none"
              />
              <textarea
                name="description"
                placeholder="수업 설명"
                className="min-h-24 rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none"
              />
              <select
                name="programId"
                className="rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none"
              >
                <option value="">사업 선택 안 함</option>
                {data.programs.map((program) => (
                  <option key={program.id} value={program.id}>
                    {program.name}
                  </option>
                ))}
              </select>
              <select
                name="villageId"
                className="rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none"
              >
                <option value="">마을 선택 안 함</option>
                {data.villages.map((village) => (
                  <option key={village.id} value={village.id}>
                    {village.name}
                  </option>
                ))}
              </select>
              <button className="rounded-full bg-[var(--color-accent)] px-4 py-3 text-sm font-semibold text-[var(--color-accent-ink)]">
                수업 추가
              </button>
            </form>
            <Feedback state={classState} />
          </Section>

          <Section
            title="참여자 명단"
            description="수업에 연결하거나 비연결 상태로 먼저 명단을 쌓을 수 있습니다."
          >
            <div className="space-y-2">
              {data.participants.length ? (
                data.participants.map((participant) => (
                  <div
                    key={participant.id}
                    className="rounded-[18px] bg-[var(--color-surface-alt)] px-4 py-3"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                          {participant.fullName}
                        </p>
                        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                          {participant.className ?? "수업 미연결"}
                          {participant.note ? ` · ${participant.note}` : ""}
                        </p>
                      </div>
                      <form action={participantDeleteAction}>
                        <input
                          type="hidden"
                          name="participantId"
                          value={participant.id}
                        />
                        <button className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-xs font-semibold text-[var(--color-text-secondary)] transition hover:text-[var(--color-text-primary)]">
                          삭제
                        </button>
                      </form>
                    </div>
                  </div>
                ))
              ) : (
                <p className="rounded-[18px] bg-[var(--color-surface-alt)] px-4 py-3 text-sm text-[var(--color-text-secondary)]">
                  아직 참여자 명단이 없습니다. 첫 참여자를 추가해 주세요.
                </p>
              )}
            </div>
            <form action={participantAction} className="mt-4 grid gap-3">
              <input
                name="fullName"
                placeholder="예: 홍길동"
                className="rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none"
              />
              <textarea
                name="note"
                placeholder="참여자 메모"
                className="min-h-24 rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none"
              />
              <select
                name="classId"
                className="rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none"
              >
                <option value="">수업 선택 안 함</option>
                {data.classes.map((klass) => (
                  <option key={klass.id} value={klass.id}>
                    {klass.name}
                  </option>
                ))}
              </select>
              <button className="rounded-full bg-[var(--color-accent)] px-4 py-3 text-sm font-semibold text-[var(--color-accent-ink)]">
                참여자 추가
              </button>
            </form>
            <Feedback state={participantState} />
            <Feedback state={participantDeleteState} />
          </Section>
        </div>
      </div>
    </main>
  );
}
