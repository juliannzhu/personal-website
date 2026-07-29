import { Resend } from 'resend'

// Where contact messages are delivered. Without a verified custom domain, Resend
// only permits sending to the account owner's address, so this must match the
// email the Resend account was created with. Overridable via env var.
const TO = process.env.CONTACT_TO || 'juliann.zhu07@gmail.com'
// Resend's shared onboarding sender, usable without verifying a domain.
const FROM = 'Portfolio Contact <onboarding@resend.dev>'

const isEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)

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
