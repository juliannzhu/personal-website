// Live Jstris stats for the About page's profile card.
//
// Jstris has a public JSON API (https://jezevec10.github.io/jstris-api-docs/), but it
// only covers part of what the profile page shows:
//   - Sprint personal bests are fully available, so those are always live.
//   - The live-games feed only goes back ~460 games, and has no lines-received or B2B
//     counts. The profile page itself (which has the real all-time totals) sits behind
//     a Cloudflare challenge and can't be scraped from a server.
// So the all-time totals are a snapshot copied from the profile (BASELINE) plus every
// live game played after BASELINE.lastGameId, which the feed does have.
//
// To re-sync after copying fresh numbers off the profile: update BASELINE and set
// lastGameId to the id of the newest game in /api/u/<user>/live/games at that moment.

const USER = 'jambo722'
const BASE = 'https://jstris.jezevec10.com'

const BASELINE = {
  lastGameId: 448225588, // newest live game when the profile was copied, 2026-10-04
  games: 1612,
  seconds: 48.34 * 3600,
  sent: 71530,
  blocks: 219826,
  maxApm: 121.49,
  maxCombo: 11,
  longestSec: 3.07 * 60,
  mostSent: 132,
}

const SPRINTS = [
  { label: '20L',  mode: 2 },
  { label: '40L',  mode: 1 },
  { label: '100L', mode: 3 },
]

const PAGE = 50
const MAX_PAGES = 10 // the feed stops returning rows past ~460 games anyway

async function get(path) {
  const r = await fetch(BASE + path, { headers: { 'User-Agent': 'juliann.dev stats card' } })
  if (!r.ok) throw new Error(`${path}: ${r.status}`)
  return r.json()
}

async function sprint({ label, mode }) {
  const rec = await get(`/api/u/${USER}/records/1?mode=${mode}&best`)
  const best = rec.best?.[0]
  if (!best) return { label, runs: rec.games ?? 0 }
  // Block count isn't in the records response; it lives on the individual replay.
  const game = await get(`/api/record/${best.id}`).catch(() => null)
  return { label, time: best.gametime, blocks: game?.blocks ?? null, date: best.ts, runs: rec.games ?? 0 }
}

// Newest-first, so stop as soon as the baseline's last game shows up.
async function gamesSinceBaseline() {
  const recent = []
  let latest = []
  for (let p = 0; p < MAX_PAGES; p++) {
    const page = await get(`/api/u/${USER}/live/games?offset=${p * PAGE}`)
    if (p === 0) latest = page.slice(0, 10)
    const cut = page.findIndex((g) => g.id <= BASELINE.lastGameId)
    if (cut !== -1) { recent.push(...page.slice(0, cut)); break }
    recent.push(...page)
    if (page.length < PAGE) break
  }
  return { recent, latest }
}

const apm = (g) => (g.gametime > 0 ? (g.attack / g.gametime) * 60 : 0)

export default async function handler(req, res) {
  try {
    const [pbs, { recent, latest }] = await Promise.all([
      Promise.all(SPRINTS.map(sprint)),
      gamesSinceBaseline(),
    ])

    const sum = (k) => recent.reduce((n, g) => n + (g[k] || 0), 0)
    // Jstris's 10-games APM/PPS is the mean of each game's rate, not totals over total time.
    const tenAvg = (f) => (latest.length ? latest.reduce((n, g) => n + f(g), 0) / latest.length : null)

    const stats = {
      games: BASELINE.games + recent.length,
      seconds: BASELINE.seconds + sum('gametime'),
      sent: BASELINE.sent + sum('sent'),
      blocks: BASELINE.blocks + sum('pcs'),
      maxApm: Math.max(BASELINE.maxApm, ...recent.map(apm)),
      maxCombo: Math.max(BASELINE.maxCombo, ...recent.map((g) => g.ren || 0)),
      longestSec: Math.max(BASELINE.longestSec, ...recent.map((g) => g.gametime)),
      mostSent: Math.max(BASELINE.mostSent, ...recent.map((g) => g.sent || 0)),
      sprintRuns: pbs.reduce((n, p) => n + p.runs, 0),
      lastPlayed: latest[0]?.gtime ?? null,
      tenApm: tenAvg(apm),
      tenPps: tenAvg((g) => (g.gametime > 0 ? g.pcs / g.gametime : 0)),
    }

    // Edge-cached: Jstris gets hit at most once every few minutes no matter the traffic,
    // and a new game shows up on the site within ~5 minutes of finishing it.
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=86400')
    return res.status(200).json({ pbs, stats })
  } catch {
    return res.status(502).json({ error: 'jstris unavailable' })
  }
}
