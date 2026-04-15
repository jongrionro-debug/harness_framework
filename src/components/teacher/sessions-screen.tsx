import Link from "next/link";

type TeacherSessionCard = {
  id: string;
  sessionDate: string;
  className: string;
  villageName: string;
  programName: string;
  submittedAt: Date | null;
};

function formatDateLabel(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "short",
  }).format(new Date(`${value}T00:00:00`));
}

export function TeacherSessionsScreen({
  sessions,
}: {
  sessions: TeacherSessionCard[];
}) {
  return (
    <main className="flex min-h-screen flex-1 flex-col bg-[var(--color-background)]">
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-5 py-6 sm:px-8 lg:px-10 lg:py-10">
        <header className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-panel sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-text-secondary)]">
            Teacher sessions
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-[-0.05em] text-[var(--color-text-primary)] sm:text-5xl">
            내게 배정된 세션만 짧고 빠르게 처리합니다.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--color-text-secondary)]">
            운영자가 세션을 만들면 여기에서 바로 열 수 있습니다. 아직 세션이
            없다면 다음 작업은 운영자가 먼저 세션을 생성하는 것입니다.
          </p>
        </header>

        <section className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-panel sm:p-5">
          <div className="space-y-3">
            {sessions.length ? (
              sessions.map((session) => (
                <Link
                  key={session.id}
                  href={`/sessions/${session.id}`}
                  className="block rounded-[22px] bg-[var(--color-surface-alt)] px-4 py-4 transition-transform hover:-translate-y-0.5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                        {session.className}
                      </p>
                      <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                        {session.programName} · {session.villageName}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                        {formatDateLabel(session.sessionDate)}
                      </p>
                      <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                        {session.submittedAt ? "제출 완료" : "입력 대기"}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="rounded-[22px] bg-[var(--color-surface-alt)] px-4 py-5 text-sm leading-6 text-[var(--color-text-secondary)]">
                아직 배정된 세션이 없습니다. 운영자가 `/dashboard`에서 세션을
                만들면 이 목록에 바로 나타납니다.
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
