import { RecordsBrowser } from "@/components/records/records-browser";
import { getServerAuthState } from "@/lib/auth/supabase-server";
import { listOperatorRecords } from "@/server/services/records";

export default async function RecordsPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    status?: "all" | "submitted" | "pending" | "updated";
    program?: string;
    teacher?: string;
  }>;
}) {
  const params = await searchParams;
  const authState = await getServerAuthState();

  if (!authState.organizationId) {
    return null;
  }

  const data = await listOperatorRecords(authState.organizationId, {
    search: params.search,
    status: params.status,
    program: params.program,
    teacher: params.teacher,
  });

  return (
    <RecordsBrowser
      rows={data.rows}
      filterOptions={data.filterOptions}
      filters={params}
    />
  );
}
