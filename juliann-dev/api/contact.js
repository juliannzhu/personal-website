import { Resend } from 'resend'
import { Redis } from '@upstash/redis'

// Where contact messages are delivered. Without a verified custom domain, Resend
// only permits sending to the account owner's address, so this must match the
// email the Resend account was created with. Overridable via env var.
const TO = process.env.CONTACT_TO || 'juliann.zhu07@gmail.com'
// Resend's shared onboarding sender, usable without verifying a domain.
const FROM = 'Portfolio Contact <onboarding@resend.dev>'

const isEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)

// ---- rate limiting ---------------------------------------------------------------------
// The honeypot below stops naive bots, but nothing stopped a script from POSTing valid-looking
// messages in a loop and flooding the inbox. Same Redis the leaderboard uses; see README for
// which env var pair to set.
//
// Two windows: the short one absorbs a burst, the long one caps a slow drip that would sit
// under the hourly limit all day.
const LIMITS = [
  { name: 'hour', max: 3, seconds: 60 * 60 },
  { name: 'day', max: 10, seconds: 60 * 60 * 24 },
]

function makeRedis() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN
  return url && token ? new Redis({ url, token }) : null
}

// Vercel puts the real client address at the head of x-forwarded-for; everything after it is
// the proxy chain and is attacker-controllable, so only the first entry is trustworthy.
export function clientIp(req) {
  const fwd = req.headers['x-forwarded-for']
  const raw = Array.isArray(fwd) ? fwd[0] : fwd
  const first = typeof raw === 'string' ? raw.split(',')[0].trim() : ''
  return first || req.headers['x-real-ip'] || 'unknown'
}

// Fixed-window counters per IP. Returns how many seconds to wait if a window is full, else 0.
//
// Fails open on a missing or unreachable Redis: losing the rate limit is a nuisance, but
// silently breaking the contact form on a deploy that never configured Redis is a regression.
// The `client` argument exists so this can be exercised without a live Redis.
export async function retryAfterSeconds(ip, client) {
  const redis = client ?? makeRedis()
  if (!redis) return 0

  try {
    for (const { name, max, seconds } of LIMITS) {
      const key = `contact:rate:${name}:${ip}`
      const hits = await redis.incr(key)
      // Only the first hit in a window sets the expiry. Refreshing it on every request would
      // let a persistent sender push the reset forever and lock themselves out indefinitely.
      if (hits === 1) await redis.expire(key, seconds)
      if (hits > max) {
        const ttl = await redis.ttl(key)
        return ttl > 0 ? ttl : seconds
      }
    }
    return 0
  } catch {
    return 0
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'method not allowed' })
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {})

    // Honeypot: a field hidden from real users. If it's filled, it's a bot, so
    // pretend it worked and drop the message silently.
    if (body.company) return res.status(200).json({ ok: true })

    const name = String(body.name ?? '').trim().slice(0, 100)
    const email = String(body.email ?? '').trim().slice(0, 200)
    const message = String(body.message ?? '').trim().slice(0, 5000)

    if (!name || !isEmail(email) || message.length < 2) {
      return res.status(400).json({ error: 'invalid submission' })
    }

    // Counted only once a submission is valid and about to be sent, so someone who mistypes
    // their email three times doesn't burn their whole allowance on failed attempts.
    const retryAfter = await retryAfterSeconds(clientIp(req))
    if (retryAfter > 0) {
      res.setHeader('Retry-After', String(retryAfter))
      return res.status(429).json({ error: 'too many messages', retryAfter })
    }

    // Construct the client here (not at module load) so a missing key returns a
    // clean, diagnosable error instead of crashing the whole function on import.
    if (!process.env.RESEND_API_KEY) {
      return res.status(500).json({ error: 'email not configured' })
    }
    const resend = new Resend(process.env.RESEND_API_KEY)

    const { error } = await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: email, // hitting reply in your inbox goes straight to the sender
      subject: `Portfolio message from ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    })
    if (error) return res.status(502).json({ error: 'could not send' })

    return res.status(200).json({ ok: true })
  } catch {
    return res.status(500).json({ error: 'server error' })
  }
}
