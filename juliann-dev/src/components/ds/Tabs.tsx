import { HTMLAttributes, useEffect, useLayoutEffect, useRef, useState } from 'react'

const CSS = `
.tj-tabs{ display:flex;gap:4px;border-bottom:2px solid var(--border-strong);position:relative; }
.tj-tab{
  font-family:var(--font-pixel);font-size:0.6875rem;text-transform:uppercase;letter-spacing:0.02em;
  color:var(--text-muted);background:transparent;border:none;cursor:pointer;
  padding:12px 16px;position:relative;z-index:1;transition:color var(--dur);
  border-top-left-radius:var(--radius-1);border-top-right-radius:var(--radius-1);
}
.tj-tabs--full{ display:flex; }
.tj-tabs--full .tj-tab{ flex:1 1 0; text-align:center; }
.tj-tab:hover{ color:var(--text-body); background:rgba(255,255,255,0.04); }
.tj-tab--active{ color:var(--text-on-piece); }
.tj-tab--active:hover{ background:transparent; }
.tj-tab:focus-visible{ outline:3px solid var(--text-strong);outline-offset:-3px; }

/* The lit pill behind the active tab. One element that slides, rather than a background
   toggled on each button, so the highlight travels instead of jumping. Sits at bottom:-2px
   to cover the strip's own border, which is what the old ::after underline did. */
.tj-tab-ind{
  position:absolute;top:0;bottom:-2px;left:0;
  width:var(--ind-w,0);transform:translateX(var(--ind-x,0));
  background:var(--tab-c,var(--piece-i));
  border-top-left-radius:var(--radius-1);border-top-right-radius:var(--radius-1);
  pointer-events:none;z-index:0;
}
/* Added only after the first measurement, so the pill starts under the active tab instead
   of sliding in from the left edge on mount. */
.tj-tabs--animate .tj-tab-ind{
  transition:transform var(--dur-slow) var(--ease-out), width var(--dur-slow) var(--ease-out);
}
`

const PIECE: Record<string, string> = { i:'--piece-i', o:'--piece-o', t:'--piece-t', s:'--piece-s', z:'--piece-z', j:'--piece-j', l:'--piece-l' }

let injected = false
function ensure() {
  if (!injected && typeof document !== 'undefined') {
    const s = document.createElement('style')
    s.setAttribute('data-tj', 'tabs')
    s.textContent = CSS
    document.head.appendChild(s)
    injected = true
  }
}

interface TabItem { value: string; label: string }
interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  items?: TabItem[]
  value?: string
  onChange?: (value: string) => void
  piece?: 'i' | 'o' | 't' | 's' | 'z' | 'j' | 'l'
  full?: boolean
}

export function Tabs({ items = [], value, onChange, piece = 'i', full = false, className = '', ...rest }: TabsProps) {
  ensure()
  const listRef = useRef<HTMLDivElement>(null)
  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const [ind, setInd] = useState<{ x: number; w: number } | null>(null)
  const [animate, setAnimate] = useState(false)

  useLayoutEffect(() => {
    const measure = () => {
      const el = value != null ? btnRefs.current[value] : null
      if (!el) { setInd(null); return }
      setInd({ x: el.offsetLeft, w: el.offsetWidth })
    }
    measure()
    const list = listRef.current
    if (!list) return
    // With `full`, tabs are flex children whose widths follow the container rather than the
    // label, so the pill has to be re-measured whenever the strip is resized.
    const ro = new ResizeObserver(measure)
    ro.observe(list)
    return () => ro.disconnect()
  }, [value, items])

  // Enable the transition one frame after the pill is first placed.
  useEffect(() => {
    if (!ind || animate) return
    const id = requestAnimationFrame(() => setAnimate(true))
    return () => cancelAnimationFrame(id)
  }, [ind, animate])

  return (
    <div
      ref={listRef}
      className={['tj-tabs', full && 'tj-tabs--full', animate && 'tj-tabs--animate', className].filter(Boolean).join(' ')}
      role="tablist"
      style={{
        '--tab-c': `var(${PIECE[piece] || PIECE.i})`,
        '--ind-x': `${ind?.x ?? 0}px`,
        '--ind-w': `${ind?.w ?? 0}px`,
      } as React.CSSProperties}
      {...rest}
    >
      <span className="tj-tab-ind" aria-hidden="true" style={{ opacity: ind ? 1 : 0 }} />
      {items.map((it) => (
        <button key={it.value} role="tab" aria-selected={value === it.value}
          ref={(el) => { btnRefs.current[it.value] = el }}
          className={'tj-tab' + (value === it.value ? ' tj-tab--active' : '')}
          onClick={() => onChange && onChange(it.value)}>
          {it.label}
        </button>
      ))}
    </div>
  )
}
