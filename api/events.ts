import { EventPayloadSchema, EventPayloadArraySchema } from "../src/lib/schemas";
import { rateLimit, getClientIp } from "./_rateLimit";
import { persistEvents, persistSessionStart, persistSessionEnd } from "./_db";

// Limites e sanitização
const MAX_REQUEST_SIZE = 100_000; // ~100KB
const MAX_METADATA_JSON_SIZE = 4_096; // ~4KB por evento
const MAX_STRING_LEN = 300;
const MAX_DEPTH = 2;

function safeJsonSize(value: unknown): number {
  try {
    return JSON.stringify(value).length;
  } catch {
    return Infinity;
  }
}

function sanitizeValue(value: any, depth = 0): any {
  if (depth > MAX_DEPTH) return null;
  const t = typeof value;
  if (value == null) return null;
  if (t === "string") return value.length > MAX_STRING_LEN ? value.slice(0, MAX_STRING_LEN) + "…" : value;
  if (t === "number" || t === "boolean") return value;
  if (t === "function" || t === "symbol") return null;
  if (Array.isArray(value)) return value.slice(0, 50).map((v) => sanitizeValue(v, depth + 1));
  if (t === "object") {
    const out: Record<string, unknown> = {};
    const entries = Object.entries(value as Record<string, unknown>).slice(0, 50);
    for (const [k, v] of entries) {
      const key = typeof k === "string" && k.length > 64 ? k.slice(0, 64) : k;
      out[key] = sanitizeValue(v, depth + 1);
    }
    return out;
  }
  return null;
}

function clampMetadataSize(meta: any): any {
  const size = safeJsonSize(meta);
  if (size <= MAX_METADATA_JSON_SIZE) return meta;
  // Se exceder, substitui por marcador mínimo para não estourar armazenamento
  return { _truncated: true };
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).json({ ok: false, error: "Method Not Allowed" });
    return;
  }

  const ip = getClientIp(req);
  const key = `${ip}:events`;
  const { allowed, remaining, resetMs } = rateLimit(key, { windowMs: 10_000, max: 30 });
  if (!allowed) {
    res.status(429).json({ ok: false, error: "Too Many Requests", remaining, resetMs });
    return;
  }

  try {
    const bodyRaw = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    // Limite de payload do request
    const reqSize = safeJsonSize(bodyRaw);
    if (reqSize > MAX_REQUEST_SIZE) {
      res.status(413).json({ ok: false, error: "Payload Too Large" });
      return;
    }

    const isArray = Array.isArray(bodyRaw);
    const parsed = isArray
      ? EventPayloadArraySchema.safeParse(bodyRaw)
      : EventPayloadSchema.safeParse(bodyRaw);

    if (!parsed.success) {
      res.status(400).json({ ok: false, error: "Invalid payload", details: parsed.error.flatten() });
      return;
    }

    const events = (isArray ? parsed.data : [parsed.data]) as Array<ReturnType<typeof EventPayloadSchema.parse>>;

    // Sanitizar metadados e aplicar clamp
    const sanitized = events.map((e) => ({
      ...e,
      metadata: clampMetadataSize(sanitizeValue(e.metadata ?? {})),
    }));

    // Persistência: sessions (start/end) e events
    const starts = sanitized
      .filter((e) => e.action === "session_start")
      .map((e) => ({
        sessionId: e.sessionId,
        device: (e.metadata as any)?.device ?? "unknown",
        userAgent: (e.metadata as any)?.userAgent ?? "",
        startAt: e.ts,
        consent: Boolean((e.metadata as any)?.consent),
      }));
    const ends = sanitized
      .filter((e) => e.action === "session_end")
      .map((e) => ({ sessionId: e.sessionId, endAt: e.ts }));

    try {
      await Promise.all([
        ...starts.map((s) => persistSessionStart(s as any)),
        ...ends.map((s) => persistSessionEnd(s as any)),
        persistEvents(sanitized as any),
      ]);
    } catch (dbErr) {
      // Não vazar detalhes
      console.error("[api/events] persist error", dbErr);
      res.status(500).json({ ok: false, error: "DB persistence error" });
      return;
    }

    res.status(200).json({ ok: true, count: sanitized.length });
  } catch (e) {
    res.status(500).json({ ok: false, error: "Server error" });
  }
}