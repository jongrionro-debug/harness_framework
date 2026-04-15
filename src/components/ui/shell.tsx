import Link from "next/link";
import type { ReactNode } from "react";

type NavItem = {
  href?: string;
  label: string;
  description?: string;
  active?: boolean;
};

type StatItem = {
  label: string;
  value: string;
  tone?: "success" | "warning" | "neutral";
};

type FilterItem = {
  label: string;
  active?: boolean;
};

function toneClassName(tone: StatItem["tone"] = "neutral") {
  switch (tone) {
    case "success":
      return "bg-[rgba(47,158,91,0.12)] text-[var(--color-success)]";
    case "warning":
      return "bg-[rgba(201,131,26,0.14)] text-[var(--color-warning)]";
    default:
      return "bg-[var(--color-surface-alt)] text-[var(--color-text-secondary)]";
  }
}

export function SurfacePanel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-panel ${className}`.trim()}
    >
      {children}
    </section>
  );
}

export function PillFilters({ items }: { items: FilterItem[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item.label}
          className={`rounded-full border px-4 py-2 text-sm font-semibold ${
            item.active
              ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-accent-ink)]"
              : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)]"
          }`}
        >
          {item.label}
        </span>
      ))}
    </div>
  );
}

export function ChannelList({ items }: { items: NavItem[] }) {
  return (
    <div className="space-y-2">
      {items.map((item) => {
        const content = (
          <div
            className={`rounded-[18px] px-3 py-3 transition-colors ${
              item.active
                ? "bg-[var(--color-accent)] text-[var(--color-accent-ink)]"
                : "bg-[var(--color-surface-alt)] text-[var(--color-text-primary)]"
            }`}
          >
            <p className="text-sm font-semibold">{item.label}</p>
            {item.description ? (
              <p
                className={`mt-1 text-xs leading-5 ${
                  item.active
                    ? "text-[color:rgba(31,26,23,0.76)]"
                    : "text-[var(--color-text-secondary)]"
                }`}
              >
                {item.description}
              </p>
            ) : null}
          </div>
        );

        if (!item.href) {
          return <div key={item.label}>{content}</div>;
        }

        return (
          <Link key={item.label} href={item.href} className="block">
            {content}
          </Link>
        );
      })}
    </div>
  );
}

export function StatsRow({ items }: { items: StatItem[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item.label}
          className={`rounded-full px-3 py-2 text-xs font-semibold ${toneClassName(item.tone)}`}
        >
          {item.label}: {item.value}
        </span>
      ))}
    </div>
  );
}

export function PlaceholderScreen({
  eyebrow,
  title,
  description,
  activeRoute,
  nextAction,
}: {
  eyebrow: string;
  title: string;
  description: string;
  activeRoute: string;
  nextAction: string;
}) {
  return (
    <main className="flex min-h-screen flex-1 flex-col bg-[var(--color-background)]">
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-5 py-6 sm:px-8 lg:grid lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-8 lg:px-10 lg:py-10">
        <SurfacePanel className="p-4">
          <div className="rounded-[22px] bg-[var(--color-accent-surface)] px-4 py-4 text-[var(--color-accent-ink)]">
            <p className="text-xs font-semibold uppercase tracking-[0.14em]">
              Shared shell
            </p>
            <p className="mt-2 text-xl font-bold tracking-[-0.04em]">
              {activeRoute}
            </p>
            <p className="mt-3 text-sm leading-6 text-[color:rgba(31,26,23,0.78)]">
              Later phases will replace this placeholder with real data and role
              logic.
            </p>
          </div>

          <div className="mt-4">
            <ChannelList
              items={[
                {
                  href: "/login",
                  label: "Auth",
                  description: "로그인과 회원가입 흐름",
                  active: activeRoute === "Auth",
                },
                {
                  href: "/organization",
                  label: "Onboarding",
                  description: "기관과 첫 마을 생성",
                  active: activeRoute === "Onboarding",
                },
                {
                  href: "/dashboard",
                  label: "Ops",
                  description: "운영자 대시보드와 설정",
                  active: activeRoute === "Ops",
                },
                {
                  href: "/sessions",
                  label: "Teacher",
                  description: "강사 세션 제출 영역",
                  active: activeRoute === "Teacher",
                },
              ]}
            />
          </div>
        </SurfacePanel>

        <div className="flex flex-col gap-6">
          <SurfacePanel className="overflow-hidden p-6 sm:p-8">
            <PillFilters
              items={[
                { label: "Warm UI", active: true },
                { label: "Route placeholder" },
                { label: "Ready for next phase" },
              ]}
            />
            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-text-secondary)]">
              {eyebrow}
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-[-0.05em] text-[var(--color-text-primary)] sm:text-5xl">
              {title}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--color-text-secondary)] sm:text-lg">
              {description}
            </p>
            <div className="mt-6 rounded-[22px] bg-[var(--color-surface-alt)] p-4">
              <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                Next action
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
                {nextAction}
              </p>
            </div>
          </SurfacePanel>
        </div>
      </div>
    </main>
  );
}
