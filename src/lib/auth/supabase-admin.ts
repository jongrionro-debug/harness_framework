import { createClient } from "@supabase/supabase-js";

import { getServerEnv } from "@/lib/env";

let adminClient: ReturnType<typeof createClient> | null = null;

export function getSupabaseAdminClient() {
  if (adminClient) {
    return adminClient;
  }

  const env = getServerEnv();
  adminClient = createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );

  return adminClient;
}

export async function setUserOrganizationMetadata(
  userId: string,
  organizationId: string,
) {
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.auth.admin.updateUserById(userId, {
    user_metadata: {
      organization_id: organizationId,
    },
  });

  if (error) {
    throw new Error(error.message);
  }
}
