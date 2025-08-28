import { LeadPayloadSchema } from "../src/lib/schemas";
import { rateLimit, getClientIp } from "./_rateLimit";
import { persistLead } from "./_db";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).json({ ok: false, error: "Method Not Allowed" });
    return;
  }

  const ip = getClientIp(req);
  const key = `${ip}:leads`;
  const { allowed, remaining, resetMs } = rateLimit(key, { windowMs: 60_000, max: 10 });
  if (!allowed) {
    res.status(429).json({ ok: false, error: "Too Many Requests", remaining, resetMs });
    return;
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const parsed = LeadPayloadSchema.safeParse(body);
    if (!parsed.success) {
      res.status(400).json({ ok: false, error: "Invalid payload", details: parsed.error.flatten() });
      return;
    }

    try {
      await persistLead(parsed.data as any);
    } catch (dbErr) {
      console.error("[api/leads] persist error", dbErr);
      res.status(500).json({ ok: false, error: "DB persistence error" });
      return;
    }

    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: "Server error" });
  }
}