import { LogoutButton } from "@/components/auth/logout-button";

export function AuthSessionBar({
  email,
  roleLabel,
  tone = "surface",
}: {
  email?: string | null;
  roleLabel: string;
  tone?: "surface" | "accent";
}) {
  const panelClassName =
    tone === "accent"
      ? "bg-[var(--color-accent-surface)]"
      : "bg-[var(--color-surface)]";

  return (
    <div className="border-b border-[var(--color-border)] bg-[var(--color-background)]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-5 py-4 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
        <div className={`rounded-[22px] px-4 py-4 ${panelClassName}`}>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-secondary)]">
            Signed in
          </p>
          <p className="mt-2 text-lg font-semibold tracking-[-0.03em] text-[var(--color-text-primary)]">
            {roleLabel}
          </p>
          <p className="mt-1 text-sm leading-6 text-[var(--color-text-secondary)]">
            현재 세션을 유지하거나, 필요하면 바로 로그아웃할 수 있습니다.
          </p>
        </div>
        <LogoutButton email={email} tone={tone} />
      </div>
    </div>
  );
}
