"use client";

import { useActionState } from "react";

import { uploadTeacherAttachmentAction } from "@/server/actions/attachments";
import { submitTeacherSessionAction } from "@/server/actions/submissions";

type AttendanceStatus = "present" | "absent" | "late" | "excused";

type TeacherSessionWorkspace = {
  id: string;
  sessionDate: string;
  className: string;
  villageName: string;
  programName: string;
  submittedAt: Date | null;
  lessonJournal: string;
  attachments: Array<{
    id: string;
    fileName: string;
    mimeType: string;
    size: number;
    filePath: string;
  }>;
  snapshots: Array<{
    id: string;
    fullName: string;
    note: string | null;
    rosterOrder: number;
    attendanceStatus: AttendanceStatus;
  }>;
};

type ActionState = {
  message?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

const initialState: ActionState = {};

const attendanceOptions: Array<{ value: AttendanceStatus; label: string }> = [
  { value: "present", label: "출석" },
  { value: "late", label: "지각" },
  { value: "absent", label: "결석" },
  { value: "excused", label: "사유 있음" },
];

function formatDateLabel(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  }).format(new Date(`${value}T00:00:00`));
}

export function TeacherSessionWorkspaceScreen({
  session,
}: {
  session: TeacherSessionWorkspace;
}) {
  const submitAction = submitTeacherSessionAction.bind(null, session.id);
  const uploadAction = uploadTeacherAttachmentAction.bind(null, session.id);
  const [submitState, formAction] = useActionState(submitAction, initialState);
  const [uploadState, uploadFormAction] = useActionState(
    uploadAction,
    initialState,
  );
  const canSubmit = session.snapshots.length > 0;

  return (
    <main className="flex min-h-screen flex-1 flex-col bg-[var(--color-background)]">
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-5 py-6 sm:px-8 lg:px-10 lg:py-10">
        <header className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-panel sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-text-secondary)]">
            Session workspace
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-[-0.05em] text-[var(--color-text-primary)] sm:text-5xl">
            {session.className}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--color-text-secondary)]">
            {formatDateLabel(session.sessionDate)} · {session.programName} ·{" "}
            {session.villageName}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full bg-[var(--color-surface-alt)] px-3 py-2 text-xs font-semibold text-[var(--color-text-secondary)]">
              {session.snapshots.length}명 스냅샷 고정
            </span>
            <span className="rounded-full bg-[var(--color-surface-alt)] px-3 py-2 text-xs font-semibold text-[var(--color-text-secondary)]">
              {session.submittedAt ? "제출 후 수정 중" : "첫 제출 준비"}
            </span>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(260px,0.85fr)]">
          <form action={formAction} className="contents">
            <div className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-panel">
              <p className="text-lg font-semibold tracking-[-0.03em] text-[var(--color-text-primary)]">
                출석 입력
              </p>
              <p className="mt-1 text-sm leading-6 text-[var(--color-text-secondary)]">
                세션 생성 시점의 출석 대상 명단을 기준으로 상태를 남깁니다.
              </p>
              <div className="mt-5 space-y-3">
                {session.snapshots.length ? (
                  session.snapshots.map((participant) => (
                    <div
                      key={participant.id}
                      className="rounded-[20px] bg-[var(--color-surface-alt)] px-4 py-4"
                    >
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                            {participant.fullName}
                          </p>
                          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                            {participant.note ?? "메모 없음"}
                          </p>
                        </div>
                        <select
                          name={`attendance:${participant.id}`}
                          defaultValue={participant.attendanceStatus}
                          className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm text-[var(--color-text-primary)] outline-none"
                        >
                          {attendanceOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="rounded-[20px] bg-[var(--color-surface-alt)] px-4 py-4 text-sm leading-6 text-[var(--color-text-secondary)]">
                    아직 참여자가 없습니다. 운영자가 세션에 참여자를 추가하면
                    제출할 수 있습니다.
                  </p>
                )}
              </div>
            </div>

            <section className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-panel">
              <p className="text-lg font-semibold tracking-[-0.03em] text-[var(--color-text-primary)]">
                교육일지
              </p>
              <p className="mt-1 text-sm leading-6 text-[var(--color-text-secondary)]">
                첫 제출 후에도 같은 화면에서 계속 수정할 수 있고, 최초
                `submitted_at`은 그대로 유지됩니다.
              </p>
              <textarea
                name="lessonJournal"
                defaultValue={session.lessonJournal}
                className="mt-4 min-h-56 w-full rounded-[20px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 py-4 text-sm leading-6 text-[var(--color-text-primary)] outline-none"
                placeholder="오늘 수업에서 진행한 활동, 반응, 다음 시간 메모를 남겨 주세요."
              />
              <button
                disabled={!canSubmit}
                className="mt-4 w-full rounded-full bg-[var(--color-accent)] px-4 py-3 text-sm font-semibold text-[var(--color-accent-ink)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {session.submittedAt ? "수정 저장" : "최종 제출"}
              </button>
              {!canSubmit ? (
                <p className="mt-4 rounded-[18px] bg-[var(--color-surface-alt)] px-4 py-3 text-sm leading-6 text-[var(--color-text-secondary)]">
                  운영자가 참여자를 추가해야 제출할 수 있습니다.
                </p>
              ) : null}
              {submitState.message ? (
                <p className="mt-4 rounded-[18px] bg-[var(--color-surface-alt)] px-4 py-3 text-sm leading-6 text-[var(--color-text-secondary)]">
                  {submitState.message}
                </p>
              ) : null}
            </section>
          </form>

          <aside className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-panel lg:col-start-2">
            <div className="border-t border-[var(--color-border)] pt-0">
              <p className="text-lg font-semibold tracking-[-0.03em] text-[var(--color-text-primary)]">
                첨부 문서
              </p>
              <p className="mt-1 text-sm leading-6 text-[var(--color-text-secondary)]">
                버킷 설정이 있으면 실제 업로드를 시도하고, 없으면 명시적으로
                차단 이유를 알려줍니다.
              </p>
              <form action={uploadFormAction} className="mt-4 grid gap-3">
                <input
                  type="file"
                  name="attachment"
                  className="rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none"
                />
                <button className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm font-semibold text-[var(--color-text-primary)]">
                  첨부 업로드
                </button>
              </form>
              {uploadState.message ? (
                <p className="mt-4 rounded-[18px] bg-[var(--color-surface-alt)] px-4 py-3 text-sm leading-6 text-[var(--color-text-secondary)]">
                  {uploadState.message}
                </p>
              ) : null}
              <div className="mt-4 space-y-2">
                {session.attachments.length ? (
                  session.attachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="rounded-[18px] bg-[var(--color-surface-alt)] px-4 py-3 text-sm text-[var(--color-text-secondary)]"
                    >
                      {attachment.fileName} · {Math.ceil(attachment.size / 1024)}KB
                    </div>
                  ))
                ) : (
                  <p className="rounded-[18px] bg-[var(--color-surface-alt)] px-4 py-3 text-sm text-[var(--color-text-secondary)]">
                    아직 첨부 문서가 없습니다.
                  </p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
