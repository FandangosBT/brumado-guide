import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { EventPayload, LeadPayload, SessionStart, SessionEnd } from "../src/lib/schemas";

let supabase: SupabaseClient | null = null;

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
  supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { "x-application-name": "digital-clinic-guide" } },
  });
}

export function isDbConfigured() {
  return !!supabase;
}

export async function persistEvents(events: EventPayload[]) {
  if (!supabase) {
    // DB não configurado; registrar e retornar ok para não travar o fluxo
    console.warn("[db] Supabase não configurado. Eventos não serão persistidos.", { count: events.length });
    return { ok: true, skipped: true } as const;
  }
  const rows = events.map((e) => ({
    session_id: e.sessionId,
    step: e.step,
    action: e.action,
    metadata: e.metadata ?? {},
    ts: new Date(e.ts).toISOString(),
  }));
  const { error } = await supabase.from("events").insert(rows);
  if (error) throw error;
  return { ok: true } as const;
}

export async function persistLead(lead: LeadPayload) {
  if (!supabase) {
    console.warn("[db] Supabase não configurado. Lead não será persistido.", { email: lead.email });
    return { ok: true, skipped: true } as const;
  }
  const row = {
    name: lead.name,
    email: lead.email,
    phone: lead.phone ?? null,
    context: lead.context ?? {},
    ts: new Date(lead.ts).toISOString(),
    session_id: lead.sessionId ?? null,
  };
  const { error } = await supabase.from("leads").insert(row);
  if (error) throw error;
  return { ok: true } as const;
}

export async function persistSessionStart(s: SessionStart) {
  if (!supabase) {
    console.warn("[db] Supabase não configurado. SessionStart não será persistido.", { sessionId: s.sessionId });
    return { ok: true, skipped: true } as const;
  }
  const row = {
    id: s.sessionId,
    device: s.device,
    user_agent: s.userAgent,
    start_at: new Date(s.startAt).toISOString(),
    consent: s.consent ?? false,
  };
  const { error } = await supabase.from("sessions").upsert(row, { onConflict: "id" });
  if (error) throw error;
  return { ok: true } as const;
}

export async function persistSessionEnd(s: SessionEnd) {
  if (!supabase) {
    console.warn("[db] Supabase não configurado. SessionEnd não será persistido.", { sessionId: s.sessionId });
    return { ok: true, skipped: true } as const;
  }
  const { error } = await supabase
    .from("sessions")
    .update({ end_at: new Date(s.endAt).toISOString() })
    .eq("id", s.sessionId);
  if (error) throw error;
  return { ok: true } as const;
}