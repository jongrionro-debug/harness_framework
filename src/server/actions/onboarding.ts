"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { setUserOrganizationMetadata } from "@/lib/auth/supabase-admin";
import { getServerAuthState } from "@/lib/auth/supabase-server";
import { acceptOrganizationInvite } from "@/server/services/memberships";
import { createOrganizationOnboarding } from "@/server/services/onboarding";

const onboardingSchema = z.object({
  organizationName: z
    .string()
    .trim()
    .min(2, "기관 이름을 2자 이상 입력해 주세요."),
  firstVillageName: z
    .string()
    .trim()
    .min(2, "첫 번째 마을 이름을 2자 이상 입력해 주세요."),
});

const inviteJoinSchema = z.object({
  inviteToken: z.string().trim().uuid("유효한 초대 토큰을 입력해 주세요."),
});

export type OnboardingActionState = {
  message?: string;
  fieldErrors?: {
    organizationName?: string[];
    firstVillageName?: string[];
    inviteToken?: string[];
  };
};

export async function createOrganizationOnboardingAction(
  _: OnboardingActionState,
  formData: FormData,
) {
  const authState = await getServerAuthState();

  if (!authState.user) {
    return {
      message: "로그인이 필요합니다.",
    };
  }

  if (authState.hasMembership) {
    redirect("/dashboard");
  }

  const parsed = onboardingSchema.safeParse({
    organizationName: formData.get("organizationName"),
    firstVillageName: formData.get("firstVillageName"),
  });

  if (!parsed.success) {
    return {
      message: "입력값을 다시 확인해 주세요.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const organization = await createOrganizationOnboarding({
      userId: authState.user.id,
      organizationName: parsed.data.organizationName,
      firstVillageName: parsed.data.firstVillageName,
    });

    await setUserOrganizationMetadata(authState.user.id, organization.id);
  } catch (error) {
    return {
      message:
        error instanceof Error
          ? error.message
          : "기관 생성 중 알 수 없는 오류가 발생했습니다.",
    };
  }

  redirect("/organization/complete");
}

export async function acceptInviteOnboardingAction(
  _: OnboardingActionState,
  formData: FormData,
) {
  const authState = await getServerAuthState();

  if (!authState.user?.email) {
    return {
      message: "초대를 수락하려면 이메일이 있는 계정으로 로그인해 주세요.",
    };
  }

  if (authState.hasMembership) {
    redirect("/dashboard");
  }

  const parsed = inviteJoinSchema.safeParse({
    inviteToken: formData.get("inviteToken"),
  });

  if (!parsed.success) {
    return {
      message: "초대 토큰을 다시 확인해 주세요.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const membership = await acceptOrganizationInvite({
      userId: authState.user.id,
      email: authState.user.email,
      inviteToken: parsed.data.inviteToken,
    });

    await setUserOrganizationMetadata(authState.user.id, membership.organizationId);
  } catch (error) {
    return {
      message:
        error instanceof Error
          ? error.message
          : "초대 수락 중 알 수 없는 오류가 발생했습니다.",
    };
  }

  redirect("/approval-pending");
}
