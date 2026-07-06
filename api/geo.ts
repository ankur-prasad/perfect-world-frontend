// Vercel serverless function: expose the visitor's country (from Vercel's
// geo-IP headers) to the SPA so language + currency can localize on entry.
export default function handler(
  req: { headers: Record<string, string | string[] | undefined> },
  res: {
    setHeader: (k: string, v: string) => void
    status: (code: number) => { json: (body: unknown) => void }
  }
) {
  const raw = req.headers['x-vercel-ip-country']
  const country = typeof raw === 'string' && /^[A-Z]{2}$/.test(raw) ? raw : null
  // Geo is per-visitor: never cache at the edge/browser
  res.setHeader('Cache-Control', 'no-store')
  res.status(200).json({ country })
}
