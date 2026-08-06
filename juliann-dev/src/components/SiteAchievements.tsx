import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Icon } from '@iconify/react'
import { SITE_ACHIEVEMENTS, subscribeToast, useUnlocked, type SiteAch } from '../lib/achievements'
import { SlideToast } from './AchievementToastCard'

// ---- Toast: slides in at the top-right when an achievement unlocks, one at a time ----
export function AchievementToast() {
  const [queue, setQueue] = useState<SiteAch[]>([])
  useEffect(() => subscribeToast((a) => setQueue((q) => [...q, a])), [])

  const a = queue[0]
  if (!a) return null
  return createPortal(
    // z above the CRT scanline/vignette overlays (9998/9999) so it isn't dimmed
    <div style={{ position: 'fixed', top: 72, right: 20, zIndex: 10000, pointerEvents: 'none' }}>
      <SlideToast key={a.id} icon={a.icon} title={a.title} piece={a.piece} onDone={() => setQueue((q) => q.slice(1))} />
    </div>,
    document.body
  )
}

// ---- Viewer modal ----
function AchievementsModal({ unlocked, onClose }: { unlocked: Set<string>; onClose: () => void }) {
  const count = SITE_ACHIEVEMENTS.filter((a) => unlocked.has(a.id)).length
  return createPortal(
    <div onClick={(e) => { if (e.target === e.currentTarget) onClose() }} style={{
      position: 'fixed', inset: 0, zIndex: 9600, display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(5,5,9,0.82)', backdropFilter: 'blur(6px)', padding: 16,
    }}>
      <div style={{
        background: 'var(--ink-1000)', border: '2px solid var(--border-strong)', width: 640, maxWidth: '100%',
        maxHeight: '86vh', display: 'flex', flexDirection: 'column', borderRadius: 'var(--radius-1)', overflow: 'hidden',
        boxShadow: '0 0 40px rgba(0,0,0,0.6)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', padding: '14px 18px', borderBottom: '2px solid var(--border-strong)', background: 'var(--ink-900)', flexShrink: 0 }}>
          <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.875rem', color: 'var(--text-strong)', textTransform: 'uppercase', letterSpacing: '0.04em', flex: 1, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Icon icon="pixelarticons:trophy" style={{ fontSize: '1.25rem', color: 'var(--piece-o)' }} /> Explorer Badges
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-faint)', textTransform: 'none', letterSpacing: 0 }}>{count}/{SITE_ACHIEVEMENTS.length}</span>
          </span>
          <button onClick={onClose} aria-label="Close" style={{ background: 'none', border: 'none', color: 'var(--text-faint)', cursor: 'pointer', fontSize: '1.25rem', lineHeight: 1, padding: '0 4px' }}>✕</button>
        </div>

        <div className="tj-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, padding: 18, overflowY: 'auto' }}>
          {SITE_ACHIEVEMENTS.map((a) => {
            const got = unlocked.has(a.id)
            const c = `var(--piece-${a.piece})`
            return (
              <div key={a.id} style={{
                display: 'flex', gap: 12, alignItems: 'flex-start', padding: 12, minWidth: 0,
                background: got ? `color-mix(in srgb, ${c} 12%, var(--bg-well))` : 'var(--bg-well)',
                border: `2px ${got ? 'solid' : 'dashed'} ${got ? c : 'var(--border-strong)'}`,
                borderRadius: 'var(--radius-1)', opacity: got ? 1 : 0.7,
              }}>
                <div style={{
                  width: 34, height: 34, flexShrink: 0, borderRadius: 'var(--radius-1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: got ? c : 'transparent',
                  boxShadow: got ? 'inset 2px 2px 0 rgba(255,255,255,0.3), inset -2px -2px 0 rgba(0,0,0,0.3)' : `inset 0 0 0 2px ${c}`,
                }}>
                  <Icon icon={got ? a.icon : 'pixelarticons:lock'} style={{ fontSize: '1.0625rem', color: got ? 'var(--text-on-piece)' : c }} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.5625rem', textTransform: 'uppercase', lineHeight: 1.5, color: got ? 'var(--text-strong)' : 'var(--text-faint)' }}>{a.title}</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.45, marginTop: 5 }}>{a.desc}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>,
    document.body
  )
}

// ---- Nav button that shows the count and opens the viewer ----
export function AchievementsButton() {
  const unlocked = useUnlocked()
  const [open, setOpen] = useState(false)
  const count = SITE_ACHIEVEMENTS.filter((a) => unlocked.has(a.id)).length
  return (
    <>
      <button
        className="tj-navbtn"
        onClick={() => setOpen(true)}
        title="Explorer badges"
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--text-muted)'; e.currentTarget.style.color = 'var(--text-strong)' }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.color = 'var(--text-muted)' }}
        style={{
          display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 6, padding: '5px 12px',
          background: 'var(--bg-well)', border: '2px solid var(--border-strong)', borderRadius: 'var(--radius-1)',
          cursor: 'pointer', color: 'var(--text-muted)', transition: 'border-color 140ms, color 140ms',
        }}>
        <Icon icon="pixelarticons:trophy" style={{ fontSize: '0.875rem', color: 'inherit' }} />
        <span className="tj-navbtn-label" style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {count}/{SITE_ACHIEVEMENTS.length}
        </span>
      </button>
      {open && <AchievementsModal unlocked={unlocked} onClose={() => setOpen(false)} />}
    </>
  )
}
