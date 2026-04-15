"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";

import { getSupabaseBrowserClient } from "@/lib/auth/supabase-browser";

type AuthFormProps = {
  mode: "login" | "signup";
};

const modeCopy = {
  login: {
    eyebrow: "Login",
    title: "이메일과 비밀번호로 다시 들어옵니다.",
    description:
      "기관 운영자와 강사는 같은 인증 흐름을 사용하고, 이후 권한에 따라 알맞은 영역으로 이동합니다.",
    submitLabel: "로그인",
    alternateLabel: "처음이신가요?",
    alternateHref: "/signup",
    alternateAction: "회원가입",
  },
  signup: {
    eyebrow: "Signup",
    title: "가볍게 가입하고 기관 생성을 시작합니다.",
    description:
      "로컬 MVP에서는 이메일과 비밀번호 기반의 단순한 가입 흐름을 우선 연결합니다.",
    submitLabel: "회원가입",
    alternateLabel: "이미 계정이 있나요?",
    alternateHref: "/login",
    alternateAction: "로그인",
  },
} as const;

export function AuthForm({ mode }: AuthFormProps) {
  const copy = modeCopy[mode];
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    setFeedback(null);

    const supabase = getSupabaseBrowserClient();

    const result =
      mode === "login"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

    if (result.error) {
      setFeedback(result.error.message);
      setIsPending(false);
      return;
    }

    setFeedback(
      mode === "signup"
        ? "가입이 완료되었습니다. 바로 기관 생성 온보딩으로 이동합니다."
        : "로그인에 성공했습니다. 온보딩 또는 대시보드로 이동합니다.",
    );

    startTransition(() => {
      router.replace("/organization");
      router.refresh();
    });

    setIsPending(false);
  }

  return (
    <main className="flex min-h-screen flex-1 flex-col bg-[var(--color-background)]">
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-5 py-6 sm:px-8 lg:grid lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-8 lg:px-10 lg:py-10">
        <aside className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-panel">
          <div className="rounded-[22px] bg-[var(--color-accent-surface)] px-4 py-4 text-[var(--color-accent-ink)]">
            <p className="text-xs font-semibold uppercase tracking-[0.14em]">
              {copy.eyebrow}
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-[-0.04em]">
              {copy.title}
            </h1>
            <p className="mt-3 text-sm leading-6 text-[color:rgba(31,26,23,0.78)]">
              {copy.description}
            </p>
          </div>

          <div className="mt-4 rounded-[22px] bg-[var(--color-surface-alt)] p-4">
            <p className="text-sm font-semibold text-[var(--color-text-primary)]">
              인증 이후 이동
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
              membership 정보가 없으면 `/organization`, 있으면 `/dashboard`
              로 보내도록 foundation을 준비했습니다.
            </p>
          </div>
        </aside>

        <section className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-panel sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-text-secondary)]">
            Supabase auth
          </p>
          <h2 className="mt-3 text-4xl font-bold tracking-[-0.05em] text-[var(--color-text-primary)] sm:text-5xl">
            {copy.submitLabel}
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--color-text-secondary)]">
            현재는 email/password 흐름만 연결합니다. OAuth, 초대 메일 발송,
            상세 권한 체크는 이후 phase에서 확장합니다.
          </p>

          <form className="mt-8 grid gap-4" onSubmit={handleSubmit}>
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                Email
              </span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none transition focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent-surface)]"
                placeholder="teacher@example.com"
                required
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                Password
              </span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none transition focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent-surface)]"
                placeholder="••••••••"
                required
              />
            </label>

            {feedback ? (
              <p className="rounded-[18px] bg-[var(--color-surface-alt)] px-4 py-3 text-sm leading-6 text-[var(--color-text-secondary)]">
                {feedback}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isPending}
              className="mt-2 rounded-full bg-[var(--color-accent)] px-4 py-3 text-sm font-semibold text-[var(--color-accent-ink)] transition disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isPending ? "진행 중..." : copy.submitLabel}
            </button>
          </form>

          <div className="mt-6 flex flex-wrap items-center gap-2 text-sm text-[var(--color-text-secondary)]">
            <span>{copy.alternateLabel}</span>
            <a
              href={copy.alternateHref}
              className="font-semibold text-[var(--color-text-primary)]"
            >
              {copy.alternateAction}
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
