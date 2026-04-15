import { notFound } from "next/navigation";

import { RecordDetailScreen } from "@/components/records/record-detail";
import { getServerAuthState } from "@/lib/auth/supabase-server";
import { getOperatorRecordDetail } from "@/server/services/records";

export default async function RecordDetailPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  const authState = await getServerAuthState();

  if (!authState.organizationId) {
    notFound();
  }

  const record = await getOperatorRecordDetail(
    authState.organizationId,
    sessionId,
  );

  if (!record) {
    notFound();
  }

  return <RecordDetailScreen record={record} />;
}
