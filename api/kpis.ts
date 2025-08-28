import { rateLimit, getClientIp } from "./_rateLimit";

// Dados mock (sem PII) – KPIs de cockpit
const KPIS = {
  demo: true,
  widgets: [
    { id: "kpi-ocupacao", name: "Ocupação", value: 82, unit: "%", trend: +3, period: "últimos 7d" },
    { id: "kpi-reativacao", name: "Reativação", value: 124, unit: "pacientes", trend: +12, period: "últimos 30d" },
    { id: "kpi-estoque", name: "Estoque", value: 14, unit: "dias", trend: -2, period: "últimos 14d" },
  ],
};

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    res.status(405).json({ ok: false, error: "Method Not Allowed" });
    return;
  }

  const ip = getClientIp(req);
  const key = `${ip}:kpis`;
  const { allowed, remaining, resetMs } = rateLimit(key, { windowMs: 10_000, max: 30 });
  if (!allowed) {
    res.status(429).json({ ok: false, error: "Too Many Requests", remaining, resetMs });
    return;
  }

  // Cache público: 30s no navegador, 2 min na CDN; SWR 5 min
  res.setHeader("Cache-Control", "public, max-age=30, s-maxage=120, stale-while-revalidate=300");
  res.status(200).json({ ok: true, ts: Date.now(), data: KPIS });
}