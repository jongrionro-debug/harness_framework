"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useActionState } from "react";

import { uploadTeacherAttachmentAction } from "@/server/actions/attachments";
import { submitTeacherSessionAction } from "@/server/actions/submissions";

type AttendanceStatus = "present" | "absent" | "late" | "excused";

type TeacherSessionCard = {
  id: string;
  sessionDate: string;
  className: string;
  villageName: string;
  programName: string;
  submittedAt: Date | null;
};

type TeacherSessionWorkspace = TeacherSessionCard & {
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
  { value: "present", label: "출 석" },
  { value: "late", label: "지 각" },
  { value: "absent", label: "결 석" },
  { value: "excused", label: "사유 있음" },
];

function formatCompactDateLabel(value: string) {
  const date = new Date(`${value}T00:00:00`);
  const weekday = new Intl.DateTimeFormat("ko-KR", { weekday: "short" }).format(
    date,
  );

  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(
    2,
    "0",
  )}.${String(date.getDate()).padStart(2, "0")}(${weekday})`;
}

export function TeacherSessionsScreen({
  sessions,
  selectedSession,
}: {
  sessions: TeacherSessionCard[];
  selectedSession: TeacherSessionWorkspace | null;
}) {
  if (!selectedSession) {
    return (
      <main className="min-h-screen bg-[var(--color-background)] px-5 pb-10 sm:px-8 lg:px-10">
        <section className="mx-auto mt-6 flex min-h-[520px] w-full max-w-[1347px] flex-col items-center justify-center rounded-[50px] bg-[#fffdf8] px-5 text-center">
          <h1 className="text-[30px] font-extrabold text-black sm:text-[35px]">
            강사 대시보드
          </h1>
          <p className="mt-5 max-w-xl text-[18px] leading-8 text-[#555555]">
            아직 나에게 할당된 세션이 없습니다. 운영자가 세션을 만들고 강사를
            배정하면 이 화면에서 바로 출석과 일지를 입력할 수 있습니다.
          </p>
        </section>
      </main>
    );
  }

  return (
    <TeacherDashboardWorkspace
      sessions={sessions}
      selectedSession={selectedSession}
    />
  );
}

function TeacherDashboardWorkspace({
  sessions,
  selectedSession,
}: {
  sessions: TeacherSessionCard[];
  selectedSession: TeacherSessionWorkspace;
}) {
  const router = useRouter();
  const submitAction = submitTeacherSessionAction.bind(null, selectedSession.id);
  const uploadAction = uploadTeacherAttachmentAction.bind(null, selectedSession.id);
  const [submitState, formAction] = useActionState(submitAction, initialState);
  const [uploadState, uploadFormAction] = useActionState(
    uploadAction,
    initialState,
  );
  const canSubmit = selectedSession.snapshots.length > 0;

  function handleSessionChange(sessionId: string) {
    router.push(`/sessions?sessionId=${sessionId}`);
  }

  return (
    <main className="min-h-screen bg-[var(--color-background)] px-5 pb-10 sm:px-8 lg:px-10">
      <section className="mx-auto mt-6 w-full max-w-[1347px] rounded-[50px] bg-[#fffdf8] px-4 pb-16 pt-10 shadow-[0_0_10px_rgba(255,253,248,0.75)] sm:px-8 lg:px-[76px]">
        <header className="flex items-center justify-center gap-3">
          <h1 className="text-[30px] font-extrabold leading-tight text-black sm:text-[35px]">
            강사 대시보드
          </h1>
          <Image
            src="/figma-assets/teacher-dashboard-search.png"
            alt=""
            width={44}
            height={44}
            className="size-[38px] object-contain sm:size-[44px]"
            priority
          />
        </header>

        <div className="mx-auto mt-10 w-full max-w-[1022px] bg-white px-0 py-8 sm:px-10">
          <div className="flex justify-end">
            <p className="text-[15px] font-medium text-[#555555] sm:text-[20px]">
              나에게 할당된 세션 총 {sessions.length}개
            </p>
          </div>

          <div className="relative mt-3">
            <select
              aria-label="수업 선택"
              value={selectedSession.id}
              onChange={(event) => handleSessionChange(event.target.value)}
              className="h-[54px] w-full appearance-none border-2 border-[#555555] bg-white px-5 pr-14 text-[20px] font-bold text-black shadow-[0_4px_4px_rgba(0,0,0,0.25)] outline-none sm:h-[63px] sm:text-[25px]"
            >
              {sessions.map((session) => (
                <option key={session.id} value={session.id}>
                  {session.className}
                </option>
              ))}
            </select>
            <Image
              src="/figma-assets/teacher-dashboard-chevron.png"
              alt=""
              width={35}
              height={35}
              className="pointer-events-none absolute right-5 top-1/2 size-[28px] -translate-y-1/2 object-contain sm:size-[35px]"
            />
          </div>

          <p className="mt-4 text-[16px] font-medium leading-7 text-[#c5a100] sm:text-[20px]">
            {formatCompactDateLabel(selectedSession.sessionDate)} ·{" "}
            {selectedSession.programName} · {selectedSession.villageName}
          </p>

          <form id="teacher-submission-form" action={formAction}>
            <section className="mt-5 rounded-[14px] border-2 border-[#fcce00] bg-white px-4 py-5 sm:rounded-[20px] sm:px-6">
              <h2 className="text-[20px] font-extrabold text-black sm:text-[25px]">
                출석 입력
              </h2>

              <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {selectedSession.snapshots.length ? (
                  selectedSession.snapshots.map((participant) => (
                    <article
                      key={participant.id}
                      className="min-h-[190px] rounded-[20px] bg-[#f6f1e8] px-4 py-4 sm:min-h-[247px] sm:rounded-[25px]"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className="min-w-0 truncate text-[18px] font-extrabold leading-8 text-black sm:text-[23px]">
                          {participant.fullName}
                        </p>
                        <div className="relative shrink-0">
                          <select
                            aria-label={`${participant.fullName} 출석 상태`}
                            name={`attendance:${participant.id}`}
                            defaultValue={participant.attendanceStatus}
                            className="h-[37px] w-[118px] appearance-none rounded-[7px] border border-[#555555] bg-white px-3 pr-8 text-center text-[14px] font-medium text-black outline-none sm:w-[151px] sm:text-[18px]"
                          >
                            {attendanceOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                          <Image
                            src="/figma-assets/teacher-dashboard-chevron.png"
                            alt=""
                            width={23}
                            height={23}
                            className="pointer-events-none absolute right-2 top-1/2 size-[18px] -translate-y-1/2 object-contain sm:size-[23px]"
                          />
                        </div>
                      </div>
                      <textarea
                        aria-label={`${participant.fullName} 메모`}
                        readOnly
                        value={participant.note ?? ""}
                        className="mt-3 h-[112px] w-full resize-none border border-[#d8d8d8] bg-white px-4 py-3 text-[16px] leading-7 text-black shadow-[inset_0_4px_4px_rgba(0,0,0,0.18)] outline-none sm:h-[152px] sm:text-[18px]"
                      />
                    </article>
                  ))
                ) : (
                  <p className="rounded-[20px] bg-[#f6f1e8] px-5 py-5 text-[18px] leading-8 text-[#555555] md:col-span-2 xl:col-span-3">
                    아직 참여자가 없습니다. 운영자가 세션에 참여자를 추가하면
                    제출할 수 있습니다.
                  </p>
                )}
              </div>
            </section>
          </form>

          <div className="mt-9 grid gap-9 lg:grid-cols-2">
            <section className="rounded-[14px] border-2 border-[#fcce00] bg-white px-4 py-5 sm:rounded-[20px] sm:px-6">
              <h2 className="text-[20px] font-extrabold text-black sm:text-[25px]">
                교육일지 작성
              </h2>
              <textarea
                form="teacher-submission-form"
                name="lessonJournal"
                defaultValue={selectedSession.lessonJournal}
                className="mt-5 min-h-[218px] w-full resize-none rounded-[8px] border border-[#555555] bg-white px-4 py-4 text-[18px] leading-8 text-black outline-none sm:text-[23px]"
                placeholder="오늘 수업에서 진행한 활동을 적어 주세요."
              />
              <button
                form="teacher-submission-form"
                disabled={!canSubmit}
                className="mt-5 min-h-[56px] w-full rounded-[25px] border border-[#fcce00] bg-[#ffec1d] px-5 text-[20px] font-extrabold text-black shadow-[0_4px_4px_rgba(0,0,0,0.25)] transition hover:bg-[#fee500] disabled:cursor-not-allowed disabled:opacity-50 sm:min-h-[63px] sm:text-[23px]"
              >
                일지 저장
              </button>
              {!canSubmit ? (
                <p className="mt-4 rounded-[18px] bg-[#f6f1e8] px-4 py-3 text-[16px] leading-7 text-[#555555]">
                  운영자가 참여자를 추가해야 제출할 수 있습니다.
                </p>
              ) : null}
              {submitState.message ? (
                <p className="mt-4 rounded-[18px] bg-[#f6f1e8] px-4 py-3 text-[16px] leading-7 text-[#555555]">
                  {submitState.message}
                </p>
              ) : null}
            </section>

            <section className="rounded-[14px] border-2 border-[#fcce00] bg-white px-4 py-5 sm:rounded-[20px] sm:px-6">
              <h2 className="text-[20px] font-extrabold text-black sm:text-[25px]">
                문서 첨부
              </h2>
              <form action={uploadFormAction} className="mt-5 grid gap-6">
                <input
                  type="file"
                  name="attachment"
                  className="min-h-[56px] w-full rounded-[25px] bg-[#f6f1e8] px-4 py-4 text-[16px] font-medium text-black file:mr-2 file:border-0 file:bg-transparent file:text-[16px] file:font-extrabold file:text-black sm:min-h-[63px] sm:text-[20px] sm:file:text-[20px]"
                />
                <button className="min-h-[56px] w-full rounded-[25px] border border-[#555555] bg-white px-5 text-[20px] font-extrabold text-black sm:min-h-[63px] sm:text-[23px]">
                  문서 업로드
                </button>
              </form>
              {uploadState.message ? (
                <p className="mt-4 rounded-[18px] bg-[#f6f1e8] px-4 py-3 text-[16px] leading-7 text-[#555555]">
                  {uploadState.message}
                </p>
              ) : null}
              <div className="mt-6 space-y-2">
                {selectedSession.attachments.length ? (
                  selectedSession.attachments.map((attachment) => (
                    <p
                      key={attachment.id}
                      className="rounded-[18px] bg-[#f6f1e8] px-4 py-3 text-[18px] leading-7 text-black"
                    >
                      {attachment.fileName} · {Math.ceil(attachment.size / 1024)}
                      KB
                    </p>
                  ))
                ) : (
                  <p className="rounded-[18px] bg-[#f6f1e8] px-4 py-4 text-[18px] font-medium leading-7 text-black sm:text-[23px]">
                    아직 첨부 문서가 없습니다.
                  </p>
                )}
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
