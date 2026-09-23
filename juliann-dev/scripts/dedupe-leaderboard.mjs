// One-time cleanup for the sprint leaderboard.
//
// Rows written before the API enforced one-row-per-player can hold the same initials
// many times over. This collapses each name down to its single best (lowest ms) run and
// removes the rest.
//
// Dry run (prints what it would remove, changes nothing):
//   node scripts/dedupe-leaderboard.mjs
// Apply:
//   node scripts/dedupe-leaderboard.mjs --apply
//
// Needs the same credentials the deployed function uses. Either pair works:
//   KV_REST_API_URL / KV_REST_API_TOKEN
//   UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN
// Grab them from the Upstash console or `vercel env pull`, then run e.g.
//   KV_REST_API_URL=... KV_REST_API_TOKEN=... node scripts/dedupe-leaderboard.mjs

import { Redis } from '@upstash/redis'

const KEY = 'tetris:sprint'
const apply = process.argv.includes('--apply')

const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL
const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN
if (!url || !token) {
  console.error('Missing credentials. Set KV_REST_API_URL + KV_REST_API_TOKEN (or the UPSTASH_* pair).')
  process.exit(1)
}

const redis = new Redis({ url, token })

// Whole set, ascending by score. Lower ms is faster, so the first row for a name is its best.
const flat = await redis.zrange(KEY, 0, -1, { withScores: true })
if (flat.length === 0) {
  console.log('Leaderboard is empty, nothing to do.')
  process.exit(0)
}

const best = new Map()        // name -> { member, ms }
const remove = []             // members to drop
for (let i = 0; i < flat.length; i += 2) {
  const member = String(flat[i])
  const ms = Number(flat[i + 1])
  const name = member.split(' ')[0]
  if (!best.has(name)) best.set(name, { member, ms })
  else remove.push({ member, ms, name, keptMs: best.get(name).ms })
}

console.log(`rows stored:   ${flat.length / 2}`)
console.log(`unique names:  ${best.size}`)
console.log(`to remove:     ${remove.length}`)

if (remove.length) {
  const byName = {}
  remove.forEach(r => { byName[r.name] = (byName[r.name] || 0) + 1 })
  console.log('\nduplicates per name:')
  Object.entries(byName).sort((a, b) => b[1] - a[1])
    .forEach(([n, c]) => console.log(`  ${n.padEnd(4)} ${c} extra row${c > 1 ? 's' : ''} (keeping ${best.get(n).ms}ms)`))
}

// Members written by the current API are the bare name. Rewriting those to themselves is
// a no-op, so only the legacy "NAME id" rows actually need removing.
const legacy = remove.map(r => r.member)

if (!apply) {
  console.log('\nDry run. Re-run with --apply to remove them.')
  process.exit(0)
}

if (legacy.length) {
  // zrem takes the members to drop; chunked so a huge board does not build one giant call.
  for (let i = 0; i < legacy.length; i += 100) {
    await redis.zrem(KEY, ...legacy.slice(i, i + 100))
  }
}

// Collapse survivors onto the bare-name member format the API now writes, so a future
// submission updates the same row instead of sitting alongside the legacy one.
for (const [name, { member, ms }] of best) {
  if (member === name) continue
  await redis.zrem(KEY, member)
  await redis.zadd(KEY, { score: ms, member: name })
}

const after = await redis.zrange(KEY, 0, -1, { withScores: true })
console.log(`\nDone. rows now: ${after.length / 2}`)
