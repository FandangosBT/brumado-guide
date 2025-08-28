import { rateLimit, getClientIp } from "./_rateLimit";

// Dados mock (sem PII) – pilotos recomendados
const PILOTS = [
  { id: "pil-01", title: "Piloto de Reativação", focus: "Lembretes SMS", durationWeeks: 6, recommended: true, demo: true },
  { id: "pil-02", title: "Piloto de Operações", focus: "Fila Dinâmica", durationWeeks: 8, recommended: false, demo: true },
  { id: "pil-03", title: "Piloto de Qualidade", focus: "Protocolos Guiados", durationWeeks: 10, recommended: false, demo: true },
] as const;

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    res.status(405).json({ ok: false, error: "Method Not Allowed" });
    return;
  }

  const ip = getClientIp(req);
  const key = `${ip}:pilots`;
  const { allowed, remaining, resetMs } = rateLimit(key, { windowMs: 10_000, max: 20 });
  if (!allowed) {
    res.status(429).json({ ok: false, error: "Too Many Requests", remaining, resetMs });
    return;
  }

  // Cache público: 1 min no navegador, 5 min em CDN; SWR 10 min
  res.setHeader("Cache-Control", "public, max-age=60, s-maxage=300, stale-while-revalidate=600");
  res.status(200).json({ ok: true, ts: Date.now(), data: PILOTS });
}