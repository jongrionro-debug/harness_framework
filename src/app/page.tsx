import Link from "next/link";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-1 items-center justify-center overflow-hidden bg-[var(--color-background)] px-6">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[26rem] w-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[rgba(255,243,164,0.72)] blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.45),transparent_62%)]" />
      </div>

      <section className="relative z-10 flex w-full max-w-2xl flex-col items-center text-center">
        <h1 className="text-4xl font-bold tracking-[-0.06em] text-[var(--color-text-primary)] sm:text-6xl">
          두레에 오신것을 환영합니다.
        </h1>

        <Link
          href="/login"
          className="mt-10 inline-flex min-w-40 items-center justify-center rounded-full bg-[var(--color-accent)] px-8 py-4 text-base font-semibold text-[var(--color-accent-ink)] transition-transform duration-200 hover:-translate-y-0.5"
        >
          로그인
        </Link>
      </section>
    </main>
  );
}
