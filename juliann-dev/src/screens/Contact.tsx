import { useState } from 'react'
import { Icon } from '@iconify/react'
import { Card } from '../components/ds/Card'
import { Input } from '../components/ds/Input'
import { Textarea } from '../components/ds/Textarea'
import { Button } from '../components/ds/Button'
import { Tetromino } from '../components/ds/Tetromino'
import { PileFooter } from '../components/PileFooter'
import { ScrollTetromino3D } from '../components/ScrollTetromino3D'

type Piece = 'i' | 'o' | 't' | 's' | 'z' | 'j' | 'l'

// Resume, Instagram, Jstris live in the top nav — keep this list focused on direct contact
const LINKS: { label: string; handle: string; icon: string; piece: Piece; href: string }[] = [
  { label: 'Email',     handle: 'j478zhu@uwaterloo.ca',        icon: 'pixelarticons:mail',      piece: 'o', href: 'mailto:j478zhu@uwaterloo.ca' },
  { label: 'GitHub',    handle: 'github.com/juliannzhu',       icon: 'pixelarticons:github',    piece: 'i', href: 'https://github.com/juliannzhu' },
  { label: 'LinkedIn',  handle: 'linkedin.com/in/juliann-zhu', icon: 'pixelarticons:briefcase', piece: 's', href: 'https://linkedin.com/in/juliann-zhu/' },
  { label: 'Devpost',   handle: 'devpost.com/juliannzhu',      icon: 'pixelarticons:code',      piece: 't', href: 'https://devpost.com/juliannzhu' },
  { label: 'Discord',   handle: 'jambo7607',                   icon: 'pixelarticons:contact',   piece: 'j', href: '#' },
]

export function Contact() {
  const [sent, setSent] = useState(false)
  return (
    <>
      <section style={{ maxWidth: 1080, margin: '0 auto', padding: '56px 24px 72px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, marginBottom: 28 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--piece-i)' }}>// Enter player 2</div>
          <h2 style={{ fontFamily: 'var(--font-pixel)', fontSize: '1.625rem', color: 'var(--text-strong)', margin: '14px 0 0', textTransform: 'uppercase' }}>Let's Connect</h2>
        </div>
        <ScrollTetromino3D
          piece="i"
          size={60}
          baseRotateY={180}
          tiltDeg={18}
          rotZPerPx={0.14}
          rotXPerPx={0.08}
          rotYPerPx={0.18}
          mouseFollow
          style={{ opacity: 0.72, marginRight: 60 }}
        />
      </div>
      <h3 style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.75rem', color: 'var(--text-strong)', margin: '0 0 14px', textTransform: 'uppercase', textAlign: 'right' }}>Find me</h3>
      {/* Grid stretches both columns to equal height, so both boxes start and end flush */}
      <div className="tj-contact-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 32, alignItems: 'stretch' }}>
        <Card accent="i" accentBar style={{ display: 'flex', flexDirection: 'column' }}>
          {sent ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 0' }}>
              <Tetromino piece="s" size={22} />
              <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '1rem', color: 'var(--piece-s)', margin: '20px 0 8px', textTransform: 'uppercase' }}>Line Cleared!</div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem' }}>Thanks! I'll get back to you soon.</p>
              <div style={{ marginTop: 20 }}><Button variant="ghost" size="sm" onClick={() => setSent(false)}>Send Another</Button></div>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSent(true) }} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <Input label="Name" placeholder="Your name" required />
                <Input label="Email" type="email" placeholder="you@email.com" required />
              </div>
              <div style={{ marginBottom: 20, flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Textarea label="Message" placeholder="What are we building?" required style={{ flex: 1, minHeight: 120 }} />
              </div>
              <Button variant="success" type="submit" block>Send Message</Button>
            </form>
          )}
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, height: '100%' }}>
          {LINKS.map((l) => (
            <a key={l.label} href={l.href}
              target={l.href.startsWith('http') ? '_blank' : undefined}
              rel={l.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              onClick={l.href === '#' ? (e) => e.preventDefault() : undefined}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = `var(--piece-${l.piece})`; e.currentTarget.style.transform = 'translateX(4px)' }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.transform = 'translateX(0)' }}
              style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px', flex: 1, textDecoration: 'none', background: 'var(--surface-card)', border: '2px solid var(--border-strong)', borderRadius: 'var(--radius-1)', transition: 'border-color 140ms, transform 140ms' }}>
              <span style={{ color: `var(--piece-${l.piece})`, fontSize: '1.25rem', display: 'flex' }}><Icon icon={l.icon} /></span>
              <span style={{ flex: 1 }}>
                <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>{l.label}</span>
                <span style={{ display: 'block', color: 'var(--text-strong)', fontSize: '0.8125rem', fontWeight: 600 }}>{l.handle}</span>
              </span>
              <Icon icon="pixelarticons:chevron-right" style={{ color: 'var(--text-faint)' }} />
            </a>
          ))}
        </div>
      </div>
      </section>
      <PileFooter quote={'Perfection is a cleared board,\nthen the next piece drops anyway.'} />
    </>
  )
}
