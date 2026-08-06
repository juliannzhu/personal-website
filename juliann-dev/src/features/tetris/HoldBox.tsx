import { forwardRef } from 'react'
import { Tetromino } from '../../components/ds/Tetromino'

// ---- HoldBox (left rail, home only) -------------------------------------------------------
// Lives in its own module rather than in TetrisGame.tsx: this rail is on screen for every
// visitor, while the game itself is lazy-loaded and most people never open it. Sharing a
// module would drag the whole engine into the initial bundle just to render this button.
//
// Forwards its ref to the root element so the scroll-driven fade/drift in App.tsx can
// animate it directly, rather than fighting a transformed wrapper's containing-block quirks.
export const HoldBox = forwardRef<HTMLElement, { onPlay: () => void }>(function HoldBox({ onPlay }, ref) {
  return (
    <aside ref={ref} className="tj-holdbox" style={{ position: 'fixed', top: '50%', left: 22, transform: 'translateY(-50%)', zIndex: 100, display: 'flex', flexDirection: 'column', gap: 12, padding: 16, width: 224, background: 'color-mix(in srgb, var(--ink-1000) 90%, transparent)', backdropFilter: 'blur(8px)', border: '2px solid var(--border-strong)', borderRadius: 'var(--radius-1)', boxShadow: 'var(--shadow-soft)' }}>
      <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.8125rem', color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'center', padding: '4px 0 12px', borderBottom: '2px solid var(--border-hairline)' }}>Hold</div>
      <button onClick={onPlay} title="Play Tetris"
        onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 0 22px color-mix(in srgb, var(--piece-t) 60%, transparent)' }}
        onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 0 14px color-mix(in srgb, var(--piece-t) 45%, transparent)' }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, width: '100%', padding: '20px 14px', cursor: 'pointer', backgroundColor: 'color-mix(in srgb, var(--piece-t) 20%, var(--bg-well))', borderWidth: '2px', borderStyle: 'solid', borderColor: 'var(--piece-t)', borderRadius: 'var(--radius-1)', boxShadow: '0 0 14px color-mix(in srgb, var(--piece-t) 45%, transparent)' }}>
        <Tetromino piece="t" size={14} bob />
        <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.875rem', color: 'var(--text-strong)', textTransform: 'uppercase' }}>Play</span>
      </button>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--text-faint)', textAlign: 'center', lineHeight: 1.6 }}>20-line sprint, beat the fastest time</div>
    </aside>
  )
})
