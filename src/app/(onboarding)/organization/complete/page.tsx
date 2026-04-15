import Link from "next/link";

export default function OrganizationCompletePage() {
  return (
    <main className="flex min-h-screen flex-1 flex-col bg-[var(--color-background)]">
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-5 py-6 sm:px-8 lg:grid lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-8 lg:px-10 lg:py-10">
        <aside className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-panel">
          <div className="rounded-[22px] bg-[rgba(47,158,91,0.12)] px-4 py-4 text-[var(--color-success)]">
            <p className="text-xs font-semibold uppercase tracking-[0.14em]">
              Created
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-[-0.04em]">
              기관 생성이 완료되었습니다.
            </h1>
            <p className="mt-3 text-sm leading-6 text-[color:rgba(47,158,91,0.86)]">
              이제 운영 기본정보를 채우고 첫 프로그램과 수업, 강사 연결을
              시작할 수 있습니다.
            </p>
          </div>
        </aside>

        <section className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-panel sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-text-secondary)]">
            Next actions
          </p>
          <h2 className="mt-3 text-4xl font-bold tracking-[-0.05em] text-[var(--color-text-primary)] sm:text-5xl">
            다음으로 운영 기본정보를 채워 넣습니다.
          </h2>
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {[
              "첫 프로그램 만들기",
              "수업과 마을 연결하기",
              "강사 계정과 담당 범위 지정하기",
            ].map((item) => (
              <div
                key={item}
                className="rounded-[22px] bg-[var(--color-surface-alt)] p-4 text-sm font-semibold text-[var(--color-text-primary)]"
              >
                {item}
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/dashboard"
              className="rounded-full bg-[var(--color-accent)] px-4 py-2.5 text-sm font-semibold text-[var(--color-accent-ink)]"
            >
              대시보드로 이동
            </Link>
            <Link
              href="/organization"
              className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm font-semibold text-[var(--color-text-primary)]"
            >
              온보딩 다시 보기
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
