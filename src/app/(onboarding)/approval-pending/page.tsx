import Link from "next/link";
import { redirect } from "next/navigation";

import { getServerAuthState } from "@/lib/auth/supabase-server";

export default async function ApprovalPendingPage() {
  const authState = await getServerAuthState();

  if (!authState.isAuthenticated) {
    redirect("/login");
  }

  if (!authState.hasMembership) {
    redirect("/organization");
  }

  if (authState.membershipApproved) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen flex-1 flex-col bg-[var(--color-background)]">
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col justify-center gap-6 px-5 py-6 sm:px-8 lg:px-10 lg:py-10">
        <section className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-panel sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-text-secondary)]">
            Approval pending
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-[-0.05em] text-[var(--color-text-primary)] sm:text-5xl">
            운영자 승인을 기다리고 있습니다.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--color-text-secondary)]">
            초대 토큰 수락은 완료되었지만, 처음 마을을 만든 운영자가 접근을
            허용하기 전까지는 대시보드와 세션, 설정 화면에 들어갈 수 없습니다.
          </p>

          <div className="mt-6 rounded-[24px] bg-[var(--color-surface-alt)] p-5">
            <p className="text-sm font-semibold text-[var(--color-text-primary)]">
              지금 가능한 것
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
              운영자가 `/users` 화면에서 접근 승인을 누르면 바로 기존 역할에
              맞는 화면으로 들어갈 수 있습니다.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/approval-pending"
              className="rounded-full bg-[var(--color-accent)] px-4 py-2.5 text-sm font-semibold text-[var(--color-accent-ink)]"
            >
              상태 새로 보기
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
