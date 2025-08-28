import { rateLimit, getClientIp } from "./_rateLimit";

// Dados mock (sem PII) – identificar soluções
const SOLUTIONS = [
  { id: "sol-ops-01", title: "Agendamento Inteligente", category: "Operações", tags: ["alto_impacto", "fluxo"], demo: true },
  { id: "sol-eng-02", title: "Integração com EMR", category: "Engenharia", tags: ["integração"], demo: true },
  { id: "sol-mkt-03", title: "Lembretes Automáticos", category: "Marketing", tags: ["reativação"], demo: true },
  { id: "sol-ops-04", title: "Fila Dinâmica", category: "Operações", tags: ["eficiência"], demo: true },
  { id: "sol-clin-05", title: "Protocolos Guiados", category: "Clínico", tags: ["qualidade"], demo: true },
  { id: "sol-data-06", title: "Painel de Insights", category: "Dados", tags: ["visibilidade"], demo: true },
] as const;

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    res.status(405).json({ ok: false, error: "Method Not Allowed" });
    return;
  }

  const ip = getClientIp(req);
  const key = `${ip}:solutions`;
  const { allowed, remaining, resetMs } = rateLimit(key, { windowMs: 10_000, max: 20 });
  if (!allowed) {
    res.status(429).json({ ok: false, error: "Too Many Requests", remaining, resetMs });
    return;
  }

  // Cache público: 1 min no navegador, 5 min em CDN; SWR 10 min
  res.setHeader("Cache-Control", "public, max-age=60, s-maxage=300, stale-while-revalidate=600");
  res.status(200).json({ ok: true, ts: Date.now(), data: SOLUTIONS });
}