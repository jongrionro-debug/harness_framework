import Link from "next/link";

type RecordSummary = {
  id: string;
  sessionDate: string;
  className: string;
  villageName: string;
  programName: string;
  teacherName: string | null;
  teacherEmail: string;
  submittedAt: Date | null;
  updatedAt: Date;
};

function formatDateLabel(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "short",
    day: "numeric",
    weekday: "short",
  }).format(new Date(`${value}T00:00:00`));
}

export function RecordsBrowser({
  rows,
  filterOptions,
  filters,
}: {
  rows: RecordSummary[];
  filterOptions: {
    programs: string[];
    teachers: string[];
  };
  filters: {
    search?: string;
    status?: string;
    program?: string;
    teacher?: string;
  };
}) {
  return (
    <main className="flex min-h-screen flex-1 flex-col bg-[var(--color-background)]">
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-5 py-6 sm:px-8 lg:px-10 lg:py-10">
        <header className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-panel sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-text-secondary)]">
            Records browser
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-[-0.05em] text-[var(--color-text-primary)] sm:text-5xl">
            제출된 세션과 미제출 세션을 같은 브라우저에서 찾습니다.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--color-text-secondary)]">
            검색과 상태 필터를 함께 써서 특정 수업 기록을 빠르게 열고,
            상세에서 출석, 교육일지, 첨부를 한 흐름으로 검토할 수 있습니다.
          </p>
        </header>

        <section className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-panel">
          <form className="grid gap-3 lg:grid-cols-[minmax(0,1.2fr)_repeat(3,minmax(0,0.8fr))]">
            <input
              name="search"
              defaultValue={filters.search}
              placeholder="수업, 프로그램, 마을, 강사 검색"
              className="rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none"
            />
            <select
              name="status"
              defaultValue={filters.status ?? "all"}
              className="rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none"
            >
              <option value="all">전체 상태</option>
              <option value="submitted">제출 완료</option>
              <option value="updated">제출 후 수정</option>
              <option value="pending">미제출</option>
            </select>
            <select
              name="program"
              defaultValue={filters.program ?? ""}
              className="rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none"
            >
              <option value="">전체 프로그램</option>
              {filterOptions.programs.map((program) => (
                <option key={program} value={program}>
                  {program}
                </option>
              ))}
            </select>
            <select
              name="teacher"
              defaultValue={filters.teacher ?? ""}
              className="rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none"
            >
              <option value="">전체 강사</option>
              {filterOptions.teachers.map((teacher) => (
                <option key={teacher} value={teacher}>
                  {teacher}
                </option>
              ))}
            </select>
            <button className="rounded-full bg-[var(--color-accent)] px-4 py-3 text-sm font-semibold text-[var(--color-accent-ink)] lg:col-span-4 lg:w-fit">
              필터 적용
            </button>
          </form>
        </section>

        <section className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-panel">
          <div className="space-y-3">
            {rows.length ? (
              rows.map((row) => (
                <Link
                  key={row.id}
                  href={`/records/${row.id}`}
                  className="block rounded-[22px] bg-[var(--color-surface-alt)] px-4 py-4 transition-transform hover:-translate-y-0.5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                        {row.className}
                      </p>
                      <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                        {row.programName} · {row.villageName}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                        {formatDateLabel(row.sessionDate)}
                      </p>
                      <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                        {row.submittedAt ? "제출됨" : "미제출"}
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-[var(--color-text-secondary)]">
                    {row.teacherName ?? row.teacherEmail}
                  </p>
                </Link>
              ))
            ) : (
              <p className="rounded-[22px] bg-[var(--color-surface-alt)] px-4 py-5 text-sm leading-6 text-[var(--color-text-secondary)]">
                조건에 맞는 기록이 없습니다. 검색어를 줄이거나 상태 필터를 바꿔
                보세요.
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
