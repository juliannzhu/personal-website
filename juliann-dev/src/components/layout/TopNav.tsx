import { useState } from 'react'
import { Icon } from '@iconify/react'
import { Tetromino } from '../ds/Tetromino'
import { isEnabled, setEnabled, SFX } from '../../audio/soundEngine'
import { useReducedMotion, setReduced } from '../../lib/reducedMotion'

export type Screen = 'home' | 'about' | 'projects' | 'now' | 'sidequests' | 'contact'

export const NAV_ITEMS: { id: Screen; label: string; piece: 'i' | 'o' | 't' | 's' | 'z' | 'j' | 'l' }[] = [
  { id: 'home',       label: 'Home',     piece: 'i' },
  { id: 'about',      label: 'About',    piece: 'o' },
  { id: 'projects',   label: 'Projects', piece: 's' },
  { id: 'sidequests', label: 'Quests',   piece: 'j' },
  { id: 'now',        label: 'Now',      piece: 'l' },
  { id: 'contact',    label: 'Contact',  piece: 'z' },
]

const HUD_HRS   = '02847'
const HUD_TERMS = '02'

function Logo({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} style={{ display: 'flex', alignItems: 'flex-end', gap: 12, background: 'none', border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0 }}>
      <Tetromino piece="t" size={9} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-start' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', visibility: 'hidden' }}>&nbsp;</span>
        <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.875rem', color: 'var(--text-strong)', textTransform: 'uppercase', letterSpacing: '0.02em' }}>JULIANN</span>
      </div>
    </button>
  )
}

function HudStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, padding: '0 10px', borderLeft: '2px solid var(--border-hairline)' }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</span>
      <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.75rem', color, letterSpacing: '0.06em' }}>{value}</span>
    </div>
  )
}

function SoundToggle() {
  const [on, setOn] = useState(() => isEnabled())
  const toggle = () => {
    const next = !on
    setEnabled(next)
    setOn(next)
    if (next) SFX.uiClick()
  }
  return (
    <button
      className="tj-navbtn"
      onClick={toggle}
      title={on ? 'Sound ON, click to mute' : 'Sound OFF, click for 8-bit audio'}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--text-muted)'; e.currentTarget.style.color = 'var(--text-strong)' }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.color = 'var(--text-muted)' }}
      style={{
        display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 6,
        padding: '5px 12px',
        background: 'var(--bg-well)',
        border: '2px solid var(--border-strong)',
        borderRadius: 'var(--radius-1)',
        cursor: 'pointer',
        color: 'var(--text-muted)',
        transition: 'border-color 140ms, color 140ms',
      }}>
      <div style={{ position: 'relative', width: 14, height: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon icon="pixelarticons:volume" style={{ fontSize: '0.875rem', color: 'inherit' }} />
        {!on && (
          <svg viewBox="0 0 14 14" style={{ position: 'absolute', inset: 0, width: 14, height: 14, pointerEvents: 'none' }}>
            <line x1="2" y1="2" x2="12" y2="12" stroke="var(--piece-z)" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        )}
      </div>
      <span className="tj-navbtn-label" style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        {on ? 'SFX' : 'MUTE'}
      </span>
    </button>
  )
}

function MotionToggle() {
  const reduced = useReducedMotion()
  const toggle = () => { setReduced(!reduced); SFX.uiClick() }
  return (
    <button
      className="tj-navbtn"
      onClick={toggle}
      title={reduced ? 'Reduced motion ON, click to enable animations' : 'Animations ON, click to reduce motion'}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--text-muted)'; e.currentTarget.style.color = 'var(--text-strong)' }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.color = 'var(--text-muted)' }}
      style={{
        display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 6,
        padding: '5px 12px',
        background: 'var(--bg-well)',
        border: '2px solid var(--border-strong)',
        borderRadius: 'var(--radius-1)',
        cursor: 'pointer',
        color: 'var(--text-muted)',
        transition: 'border-color 140ms, color 140ms',
      }}>
      <div style={{ position: 'relative', width: 14, height: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon icon={reduced ? 'pixelarticons:zap-off' : 'pixelarticons:zap'} style={{ fontSize: '0.875rem', color: 'inherit' }} />
      </div>
      <span className="tj-navbtn-label" style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        {reduced ? 'STILL' : 'MOTION'}
      </span>
    </button>
  )
}

function ResumeButton({ onOpen }: { onOpen: () => void }) {
  return (
    <button className="tj-navbtn" onClick={onOpen}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--text-muted)'; e.currentTarget.style.color = 'var(--text-strong)' }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.color = 'var(--text-muted)' }}
      style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '5px 12px', cursor: 'pointer',
        fontFamily: 'var(--font-pixel)', fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.04em',
        color: 'var(--text-muted)',
        background: 'var(--bg-well)',
        border: '2px solid var(--border-strong)',
        borderRadius: 'var(--radius-1)',
        transition: 'border-color 140ms, color 140ms',
      }}>
      <Icon icon="pixelarticons:file" style={{ fontSize: '0.875rem' }} />
      <span className="tj-navbtn-label">RESUME</span>
    </button>
  )
}

const SOCIALS: { icon: string; label: string; href: string; color: string }[] = [
  { icon: 'pixelarticons:github',    label: 'GitHub',    href: 'https://github.com/juliannzhu',         color: 'var(--piece-i)' },
  { icon: 'pixelarticons:briefcase', label: 'LinkedIn',  href: 'https://linkedin.com/in/juliann-zhu/', color: 'var(--piece-s)' },
  { icon: 'pixelarticons:code',      label: 'Devpost',   href: 'https://devpost.com/juliannzhu',        color: 'var(--piece-t)' },
  { icon: 'pixelarticons:camera',    label: 'Instagram', href: 'https://instagram.com/juliann.zhu',    color: 'var(--piece-l)' },
  { icon: 'pixelarticons:mail',      label: 'Email',     href: 'mailto:j478zhu@uwaterloo.ca',           color: 'var(--piece-o)' },
  { icon: 'pixelarticons:contact',   label: 'Discord',   href: '#',                                     color: 'var(--piece-j)' },
]

function SocialIcons() {
  return (
    <div className="tj-socials-header" style={{ display: 'flex', gap: 4, alignItems: 'center', borderLeft: '2px solid var(--border-hairline)', paddingLeft: 10 }}>
      {SOCIALS.map((s) => (
        <a key={s.label} href={s.href}
          target={s.href.startsWith('http') ? '_blank' : undefined}
          rel={s.href.startsWith('http') ? 'noopener noreferrer' : undefined}
          onClick={s.href === '#' ? (e) => e.preventDefault() : undefined}
          title={s.label}
          onMouseEnter={(e) => { const el = e.currentTarget as HTMLAnchorElement; el.style.color = s.color; el.style.borderColor = s.color }}
          onMouseLeave={(e) => { const el = e.currentTarget as HTMLAnchorElement; el.style.color = 'var(--text-faint)'; el.style.borderColor = 'transparent' }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 30, fontSize: '1.125rem', color: 'var(--text-faint)', textDecoration: 'none', border: '2px solid transparent', borderRadius: 'var(--radius-1)', transition: 'color 140ms, border-color 140ms' }}>
          <Icon icon={s.icon} />
        </a>
      ))}
    </div>
  )
}

function NextSlot({ item, active, onNav }: { item: typeof NAV_ITEMS[0]; active: boolean; onNav: (id: Screen) => void }) {
  const c = `var(--piece-${item.piece})`
  return (
    <button
      onClick={() => onNav(item.id)}
      title={item.label}
      aria-current={active ? 'page' : undefined}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.borderColor = c
          const lbl = e.currentTarget.querySelector<HTMLSpanElement>('.tj-slot-lbl')
          if (lbl) lbl.style.color = 'var(--text-strong)'
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.borderColor = 'var(--border-strong)'
          const lbl = e.currentTarget.querySelector<HTMLSpanElement>('.tj-slot-lbl')
          if (lbl) lbl.style.color = 'var(--text-muted)'
        }
      }}
      style={{
        display: 'flex', alignItems: 'center', gap: 14, width: '100%',
        padding: '13px 16px', cursor: 'pointer', textAlign: 'left',
        backgroundColor: active ? `color-mix(in srgb, ${c} 20%, var(--bg-well))` : 'var(--bg-well)',
        borderWidth: '2px', borderStyle: 'solid',
        borderColor: active ? c : 'var(--border-strong)',
        borderRadius: 'var(--radius-1)',
        boxShadow: active ? `0 0 14px color-mix(in srgb, ${c} 45%, transparent)` : 'none',
      }}
    >
      <span style={{ width: 40, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, filter: active ? 'none' : 'saturate(0.45) brightness(0.85)', opacity: active ? 1 : 0.7, transition: 'filter 140ms, opacity 140ms' }}>
        <Tetromino piece={item.piece} size={8} />
      </span>
      <span className="tj-slot-lbl" style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.75rem', letterSpacing: '0.02em', textTransform: 'uppercase', color: active ? 'var(--text-strong)' : 'var(--text-muted)', transition: 'color 140ms' }}>
        {item.label}
      </span>
    </button>
  )
}

function MobileNav({ current, onNav }: { current: Screen; onNav: (id: Screen) => void }) {
  return (
    <div className="tj-mobile-nav" style={{ display: 'flex', overflowX: 'auto', borderBottom: '2px solid var(--border-strong)', background: 'var(--bg-page)', WebkitOverflowScrolling: 'touch' as React.CSSProperties['WebkitOverflowScrolling'] }}>
      {NAV_ITEMS.map((it) => {
        const active = current === it.id
        const c = `var(--piece-${it.piece})`
        return (
          <button key={it.id} onClick={() => onNav(it.id)}
            style={{
              flex: '0 0 auto', padding: '10px 14px', border: 'none', cursor: 'pointer',
              background: 'transparent',
              borderBottom: `3px solid ${active ? c : 'transparent'}`,
              fontFamily: 'var(--font-pixel)', fontSize: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.04em',
              color: active ? c : 'var(--text-faint)',
              whiteSpace: 'nowrap',
              transition: 'color 140ms',
            }}>
            {it.label}
          </button>
        )
      })}
    </div>
  )
}

function PlayButton({ onPlay }: { onPlay: () => void }) {
  return (
    <button
      className="tj-navbtn"
      onClick={onPlay}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--piece-t)'; e.currentTarget.style.color = 'var(--piece-t)' }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.color = 'var(--text-muted)' }}
      style={{
        display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 6,
        padding: '5px 12px',
        background: 'var(--bg-well)',
        border: '2px solid var(--border-strong)',
        borderRadius: 'var(--radius-1)',
        cursor: 'pointer',
        color: 'var(--text-muted)',
        fontFamily: 'var(--font-pixel)', fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.04em',
        transition: 'border-color 140ms, color 140ms',
      }}>
      <Icon icon="pixelarticons:gamepad" style={{ fontSize: '0.875rem', color: 'inherit' }} />
      <span className="tj-navbtn-label">PLAY</span>
    </button>
  )
}

export function TopNav({ current, onNav, onPlay, onResume }: { current: Screen; onNav: (id: Screen) => void; onPlay?: () => void; onResume: () => void }) {
  return (
    <>
      <header style={{ position: 'sticky', top: 0, zIndex: 100, background: 'color-mix(in srgb, var(--bg-page) 90%, transparent)', backdropFilter: 'blur(8px)', borderBottom: '2px solid var(--border-strong)' }}>
        <div className="tj-top-header" style={{ maxWidth: 'calc(100vw - 300px)', margin: '0 auto', height: 58, padding: '0 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <Logo onClick={() => onNav('home')} />
          <div className="tj-hud" style={{ display: 'flex', alignItems: 'center', gap: 0, marginLeft: 8 }}>
            <HudStat label="HRS" value={HUD_HRS} color="var(--piece-o)" />
            <HudStat label="TERMS" value={HUD_TERMS} color="var(--piece-i)" />
          </div>
          <div style={{ flex: 1 }} />
          {onPlay && <PlayButton onPlay={onPlay} />}
          <ResumeButton onOpen={onResume} />
          <MotionToggle />
          <SoundToggle />
          <SocialIcons />
        </div>
      </header>
      <MobileNav current={current} onNav={onNav} />
      <nav style={{ position: 'fixed', top: '50%', right: 22, transform: 'translateY(-50%)', zIndex: 100, display: 'flex', flexDirection: 'column', gap: 8, padding: 14, width: 252, background: 'color-mix(in srgb, var(--ink-1000) 90%, transparent)', backdropFilter: 'blur(8px)', border: '2px solid var(--border-strong)', borderRadius: 'var(--radius-1)', boxShadow: 'var(--shadow-soft)' }}>
        <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.75rem', color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'center', padding: '2px 0 10px', borderBottom: '2px solid var(--border-hairline)' }}>NEXT</div>
        {NAV_ITEMS.map((it) => (
          <NextSlot key={it.id} item={it} active={current === it.id} onNav={onNav} />
        ))}
      </nav>
    </>
  )
}

// Fixed bottom bar: rainbow stripe then copyright row
const PIECES = ['i', 'o', 't', 's', 'z', 'j', 'l'] as const
export function FixedFooter({ onNav }: { onNav: (id: Screen) => void }) {
  return (
    <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 200, borderTop: '2px solid var(--border-strong)', background: 'color-mix(in srgb, var(--bg-page) 95%, transparent)', backdropFilter: 'blur(8px)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div style={{ display: 'flex', height: 6 }}>
        {PIECES.map((p) => <div key={p} style={{ flex: 1, background: `var(--piece-${p})` }} />)}
      </div>
      {/* tj-footer-inset reserves the same 300px right gutter as .tj-main on desktop, so the copyright
          row's centered 1080 column lines up with the left edge of the page's content panels. */}
      <div className="tj-footer-inset">
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '28px 24px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-faint)' }}>
            © 2026 JULIANN · BUILT ONE BLOCK AT A TIME
          </span>
        </div>
      </div>
      {/* Back to top is pinned to the far-right edge of the viewport (outside the content gutter),
          vertically centered on the copyright row. */}
      <button
        onClick={() => onNav('home')}
        onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-strong)' }}
        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-faint)' }}
        style={{ position: 'absolute', right: 24, top: 6, bottom: 0, display: 'flex', alignItems: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--text-faint)', background: 'none', border: 'none', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.08em', transition: 'color 140ms' }}>
        Back to top
      </button>
    </div>
  )
}
