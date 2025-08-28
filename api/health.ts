export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    res.status(405).json({ ok: false, error: "Method Not Allowed" });
    return;
  }

  res.status(200).json({ ok: true, ts: Date.now(), status: "healthy" });
}