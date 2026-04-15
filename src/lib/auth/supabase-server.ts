import type { User } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

import { getDb } from "@/lib/db/client";
import { organizationMemberships, users } from "@/lib/db/schema";
import { getPublicEnv } from "@/lib/env";

let hasWarnedAboutMissingApprovedAtSchema = false;

export async function getSupabaseServerClient() {
  const env = getPublicEnv();
  const cookieStore = await cookies();

  return createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Server components cannot write cookies during render.
          }
        },
      },
    },
  );
}

type MembershipRecord = {
  organizationId: string;
  role: "platform_admin" | "organization_admin" | "teacher";
  approvedAt: Date | null;
};

type MembershipLookupError = {
  code?: string;
  message?: string;
  cause?: unknown;
};

export function buildAppUserRecord(user: User) {
  return {
    id: user.id,
    email: user.email ?? "",
    displayName:
      typeof user.user_metadata?.display_name === "string"
        ? user.user_metadata.display_name
        : typeof user.user_metadata?.full_name === "string"
          ? user.user_metadata.full_name
          : null,
  };
}

export function deriveAuthState(
  user: User | null,
  membership: MembershipRecord | null,
) {
  const membershipApproved = Boolean(membership?.approvedAt);

  return {
    user,
    isAuthenticated: Boolean(user),
    hasMembership: Boolean(membership),
    membershipApproved,
    organizationId: membership?.organizationId ?? null,
    role: membershipApproved ? membership?.role ?? null : null,
  };
}

export function isMissingApprovedAtColumnError(error: unknown): boolean {
  if (!error || typeof error !== "object") {
    return false;
  }

  const typedError = error as MembershipLookupError;

  if (typedError.code === "42703") {
    return true;
  }

  if (
    typeof typedError.message === "string" &&
    typedError.message.includes("approved_at")
  ) {
    return true;
  }

  return isMissingApprovedAtColumnError(typedError.cause);
}

async function syncAuthenticatedUser(user: User) {
  const db = getDb();
  const appUser = buildAppUserRecord(user);

  await db
    .insert(users)
    .values(appUser)
    .onConflictDoUpdate({
      target: users.id,
      set: {
        email: appUser.email,
        displayName: appUser.displayName,
        updatedAt: new Date(),
      },
    });
}

async function getLegacyMembershipRecord(
  userId: string,
): Promise<MembershipRecord | null> {
  const db = getDb();
  const [membership] = await db
    .select({
      organizationId: organizationMemberships.organizationId,
      role: organizationMemberships.role,
      approvedAt: organizationMemberships.createdAt,
    })
    .from(organizationMemberships)
    .where(eq(organizationMemberships.userId, userId))
    .limit(1);

  return membership ?? null;
}

async function getMembershipRecord(userId: string): Promise<MembershipRecord | null> {
  const db = getDb();

  try {
    const [membership] = await db
      .select({
        organizationId: organizationMemberships.organizationId,
        role: organizationMemberships.role,
        approvedAt: organizationMemberships.approvedAt,
      })
      .from(organizationMemberships)
      .where(eq(organizationMemberships.userId, userId))
      .limit(1);

    return membership ?? null;
  } catch (error) {
    if (!isMissingApprovedAtColumnError(error)) {
      throw error;
    }

    if (!hasWarnedAboutMissingApprovedAtSchema) {
      hasWarnedAboutMissingApprovedAtSchema = true;
      console.warn(
        "[auth] organization_memberships.approved_at column is missing. Falling back to legacy membership lookup. Run `npm run db:migrate` to sync the database schema.",
      );
    }

    return getLegacyMembershipRecord(userId);
  }
}

export async function getServerAuthState() {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return deriveAuthState(null, null);
  }

  await syncAuthenticatedUser(user);
  const membership = await getMembershipRecord(user.id);

  return deriveAuthState(user, membership);
}
