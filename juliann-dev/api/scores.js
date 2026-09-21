import { Redis } from '@upstash/redis'

// Reads connection info from env vars. The Vercel + Upstash integration injects
// KV_REST_API_URL / KV_REST_API_TOKEN; the standalone Upstash integration uses
// UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN. We accept either pair.
const redis = new Redis({
  url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN,
})

const KEY = 'tetris:sprint'   // sorted set: member = "NAME", score = best ms
const TOP_N = 20              // rows we return
// Stored depth is kept well above TOP_N. Rows written before one-row-per-player was
// enforced can still hold several slots under one name, and trimming at 20 would drop
// real scores sitting underneath them. Reading deeper lets the de-dupe below find them.
const KEEP_N = 200
const MIN_MS = 5000           // reject faster than 5s (impossible for a real sprint)
const MAX_MS = 3_600_000      // reject slower than 1 hour (junk / afk)

// Names are sanitized to A-Z0-9 only. The sanitized name IS the sorted-set member,
// which is what keeps one player to one row.
const cleanName = (raw) =>
  String(raw ?? '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 3) || 'AAA'

// Sorted set is ascending by score, and lower ms is better, so index 0 = rank 1.
async function readTop() {
  const flat = await redis.zrange(KEY, 0, KEEP_N - 1, { withScores: true })
  const out = []
  const seen = new Set()
  for (let i = 0; i < flat.length; i += 2) {
    // split(' ') strips the id suffix from rows written by the older "NAME id" format;
    // members written now are the bare name.
    const name = String(flat[i]).split(' ')[0]
    // The set is ascending and lower ms is faster, so the first row for a name is that
    // player's best. Later rows are either legacy duplicates or a slower legacy run,
    // and are dropped. This is what keeps one player from occupying the whole board.
    if (seen.has(name)) continue
    seen.add(name)
    out.push({ name, ms: Number(flat[i + 1]) })
    if (out.length === TOP_N) break
  }
  return out
}

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      return res.status(200).json(await readTop())
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {})
      const name = cleanName(body.name)
      const ms = Math.round(Number(body.ms))

      if (!Number.isFinite(ms) || ms < MIN_MS || ms > MAX_MS) {
        return res.status(400).json({ error: 'invalid score' })
      }

      // One row per player. The member is the name itself, so a repeat submission
      // updates that player's existing row instead of appending another, which is what
      // let one player fill the board with the same time over and over.
      //
      // `lt` writes the score only when it beats what is stored (lower ms is faster).
      // A new name is still inserted; a slower run by an existing name is ignored and
      // that player keeps their best time.
      await redis.zadd(KEY, { lt: true }, { score: ms, member: name })

      // Rank at time of submission (0-indexed -> 1-indexed). Captured before we
      // trim, so a player who missed the board still learns their true placing.
      const idx = await redis.zrank(KEY, name)
      const rank = (idx ?? 0) + 1

      // Keep the set bounded so it never grows without limit. Trimming at KEEP_N rather
      // than TOP_N leaves room for legacy duplicate rows, so a real score is not evicted
      // by someone else's repeats before the de-dupe on read can surface it.
      await redis.zremrangebyrank(KEY, KEEP_N, -1)

      return res.status(200).json({ rank })
    }

    res.setHeader('Allow', 'GET, POST')
    return res.status(405).json({ error: 'method not allowed' })
  } catch {
    return res.status(500).json({ error: 'server error' })
  }
}
