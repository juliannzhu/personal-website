import { useEffect, useState } from 'react'
import { Icon } from '@iconify/react'

type Piece = 'i' | 'o' | 't' | 's' | 'z' | 'j' | 'l'

// One achievement toast card, shared by the site-wide badges and the in-game Tetris
// achievements so both animate identically: it slides in from the right edge while
// fading in, sits in the corner, then slides back out and fades away. Self-managing —
// calls onDone once it has fully left, so the parent can drop it from its queue.
// Uses CSS transitions (not keyframes) so it still appears/holds under "reduce motion"
// (the slide just becomes instant), instead of flashing past.
export function SlideToast({ icon, title, piece, onDone }: { icon: string; title: string; piece: Piece; onDone: () => void }) {
  const [shown, setShown] = useState(false)
  useEffect(() => {
    // mount off-screen, then flip to shown on the next frame so the transition runs
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)))
    const hide = setTimeout(() => setShown(false), 2900)  // hold in the corner, then leave
    const done = setTimeout(onDone, 3450)                 // drop it after the slide-out
    return () => { cancelAnimationFrame(raf); clearTimeout(hide); clearTimeout(done) }
  }, [])

  const c = `var(--piece-${piece})`
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px 14px 14px', minWidth: 240, maxWidth: '90vw',
      background: 'var(--ink-1000)', border: `3px solid ${c}`, borderRadius: 'var(--radius-1)',
      boxShadow: `0 12px 30px rgba(0,0,0,0.55), 0 0 22px color-mix(in srgb, ${c} 38%, transparent)`,
      transform: shown ? 'translateX(0)' : 'translateX(calc(100% + 44px))',
      opacity: shown ? 1 : 0,
      transition: 'transform 480ms var(--ease-out), opacity 400ms ease',
      pointerEvents: 'none',
    }}>
      <div style={{
        width: 44, height: 44, flexShrink: 0, borderRadius: 'var(--radius-1)', background: c,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: 'inset 2px 2px 0 rgba(255,255,255,0.3), inset -2px -2px 0 rgba(0,0,0,0.3)',
      }}>
        <Icon icon={icon} style={{ fontSize: '1.375rem', color: 'var(--text-on-piece)' }} />
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: c, fontWeight: 700 }}>Achievement unlocked</div>
        <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.75rem', color: 'var(--text-strong)', textTransform: 'uppercase', marginTop: 6 }}>{title}</div>
      </div>
    </div>
  )
}
