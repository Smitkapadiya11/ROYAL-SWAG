import { getSupabaseAdmin } from "@/lib/supabase/admin";

export async function writeAuditLog(entry: {
  event_type: string;
  payload: Record<string, unknown>;
  ip_hash?: string;
  idempotency_key?: string;
}): Promise<void> {
  try {
    const admin = getSupabaseAdmin();
    await admin.from("audit_log").insert(entry);
  } catch (err) {
    console.error("[audit_log]", err);
  }
}

export async function getIdempotentResponse<T>(
  key: string
): Promise<T | null> {
  try {
    const admin = getSupabaseAdmin();
    const { data } = await admin
      .from("audit_log")
      .select("payload")
      .eq("idempotency_key", key)
      .maybeSingle();

    if (data?.payload && typeof data.payload === "object") {
      const p = data.payload as { response?: T };
      if (p.response) return p.response;
    }
  } catch {
    /* table may not exist yet */
  }
  return null;
}

export async function storeIdempotentResponse(
  key: string,
  event_type: string,
  response: Record<string, unknown>,
  ip_hash?: string
): Promise<void> {
  await writeAuditLog({
    event_type,
    idempotency_key: key,
    ip_hash,
    payload: { response },
  });
}
