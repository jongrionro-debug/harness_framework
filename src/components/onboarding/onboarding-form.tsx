"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import {
  type OnboardingActionState,
  acceptInviteOnboardingAction,
  createOrganizationOnboardingAction,
} from "@/server/actions/onboarding";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-[var(--color-accent)] px-4 py-3 text-sm font-semibold text-[var(--color-accent-ink)] transition disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? "기관 생성 중..." : "기관 만들기"}
    </button>
  );
}

function InviteSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm font-semibold text-[var(--color-text-primary)] transition disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? "초대 확인 중..." : "기존 기관 참여"}
    </button>
  );
}

const initialState: OnboardingActionState = {};

export function OnboardingForm() {
  const [state, formAction] = useActionState<OnboardingActionState, FormData>(
    createOrganizationOnboardingAction,
    initialState,
  );
  const [inviteState, inviteAction] = useActionState<
    OnboardingActionState,
    FormData
  >(
    acceptInviteOnboardingAction,
    initialState,
  );

  return (
    <main className="flex min-h-screen flex-1 flex-col bg-[var(--color-background)]">
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-5 py-6 sm:px-8 lg:grid lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-8 lg:px-10 lg:py-10">
        <aside className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-panel">
          <div className="rounded-[22px] bg-[var(--color-accent-surface)] px-4 py-4 text-[var(--color-accent-ink)]">
            <p className="text-xs font-semibold uppercase tracking-[0.14em]">
              Organization onboarding
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-[-0.04em]">
              새 기관을 만들거나 기존 기관에 참여합니다.
            </h1>
            <p className="mt-3 text-sm leading-6 text-[color:rgba(31,26,23,0.78)]">
              가입 직후 바로 새 기관을 만들 수도 있고, 운영자가 전달한 초대
              토큰으로 기존 기관에 합류할 수도 있습니다.
            </p>
          </div>

          <div className="mt-4 rounded-[22px] bg-[var(--color-surface-alt)] p-4">
            <p className="text-sm font-semibold text-[var(--color-text-primary)]">
              가능한 시작 방식
            </p>
            <ul className="mt-2 space-y-2 text-sm leading-6 text-[var(--color-text-secondary)]">
              <li>새 기관과 첫 마을을 직접 생성하기</li>
              <li>초대 토큰으로 기존 기관 membership 받기</li>
              <li>가입 이후 설정 화면에서 프로그램, 수업, 강사 관리 이어가기</li>
            </ul>
          </div>
        </aside>

        <section className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-panel sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-text-secondary)]">
            Step 2 onboarding
          </p>
          <h2 className="mt-3 text-4xl font-bold tracking-[-0.05em] text-[var(--color-text-primary)] sm:text-5xl">
            시작 방식을 고릅니다.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--color-text-secondary)]">
            기존 기관에 들어가고 싶은 사용자는 초대 토큰으로 바로 참여하고,
            새 운영 단위를 만드는 사용자는 기관과 첫 마을을 직접 생성합니다.
          </p>

          <div className="mt-8 grid gap-6 xl:grid-cols-2">
            <div className="rounded-[24px] bg-[var(--color-surface-alt)] p-5">
              <p className="text-lg font-semibold tracking-[-0.03em] text-[var(--color-text-primary)]">
                새 기관 만들기
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
                현재 사용자를 첫 운영자로 등록하고, 기관과 첫 마을을 함께
                만듭니다.
              </p>

              <form action={formAction} className="mt-6 grid gap-4">
                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                    기관 이름
                  </span>
                  <input
                    type="text"
                    name="organizationName"
                    className="rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none transition focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent-surface)]"
                    placeholder="다도리인 교육 센터"
                    required
                  />
                  {state.fieldErrors?.organizationName ? (
                    <p className="text-sm text-[var(--color-danger)]">
                      {state.fieldErrors.organizationName.join(" ")}
                    </p>
                  ) : null}
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                    첫 번째 마을 이름
                  </span>
                  <input
                    type="text"
                    name="firstVillageName"
                    className="rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none transition focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent-surface)]"
                    placeholder="동네 배움터"
                    required
                  />
                  {state.fieldErrors?.firstVillageName ? (
                    <p className="text-sm text-[var(--color-danger)]">
                      {state.fieldErrors.firstVillageName.join(" ")}
                    </p>
                  ) : null}
                </label>

                {state.message ? (
                  <p className="rounded-[18px] bg-[var(--color-surface)] px-4 py-3 text-sm leading-6 text-[var(--color-text-secondary)]">
                    {state.message}
                  </p>
                ) : null}

                <div className="mt-2">
                  <SubmitButton />
                </div>
              </form>
            </div>

            <div className="rounded-[24px] bg-[var(--color-surface-alt)] p-5">
              <p className="text-lg font-semibold tracking-[-0.03em] text-[var(--color-text-primary)]">
                기존 기관 참여
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
                운영자가 공유한 초대 토큰을 입력하면, 기존 기관 소속으로 바로
                들어갑니다.
              </p>

              <form action={inviteAction} className="mt-6 grid gap-4">
                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                    초대 토큰
                  </span>
                  <input
                    type="text"
                    name="inviteToken"
                    className="rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none transition focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent-surface)]"
                    placeholder="c27da9ba-dc9a-494b-8742-8ad3e42671d3"
                    required
                  />
                  {inviteState.fieldErrors?.inviteToken ? (
                    <p className="text-sm text-[var(--color-danger)]">
                      {inviteState.fieldErrors.inviteToken.join(" ")}
                    </p>
                  ) : null}
                </label>

                {inviteState.message ? (
                  <p className="rounded-[18px] bg-[var(--color-surface)] px-4 py-3 text-sm leading-6 text-[var(--color-text-secondary)]">
                    {inviteState.message}
                  </p>
                ) : null}

                <div className="mt-2">
                  <InviteSubmitButton />
                </div>
              </form>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
