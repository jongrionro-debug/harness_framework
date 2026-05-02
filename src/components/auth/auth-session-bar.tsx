import Image from "next/image";

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
  return (
    <div className="bg-[var(--color-background)]">
      <div className="mx-auto flex w-full max-w-[1347px] items-center justify-between gap-5 px-5 py-5 sm:px-8 lg:px-0">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <Image
            src="/figma/dure-logo.png"
            alt=""
            width={70}
            height={70}
            className="size-12 shrink-0 object-contain sm:size-[70px]"
          />
          <div className="flex min-w-0 items-baseline gap-2">
            <p className="text-[34px] font-extrabold leading-none text-[#111111] sm:text-[48px]">
              DURE
            </p>
            <p className="truncate text-xl font-extrabold text-black sm:text-[30px]">
              : 두레
            </p>
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2 text-right">
          <p className="max-w-[42vw] truncate text-sm text-black sm:max-w-none sm:text-[20px]">
            {email ?? "로그인된 사용자"}{" "}
            <span className="font-semibold text-[#386665]">({roleLabel})</span>
          </p>
          <div className="flex items-center gap-4">
            <div className="hidden h-px w-[75px] bg-[#555555] sm:block" />
            <LogoutButton email={email} tone={tone} variant="compact" />
          </div>
        </div>
      </div>
    </div>
  );
}
