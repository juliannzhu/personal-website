import { HTMLAttributes, ReactNode } from 'react'

const CSS = `
.tj-badge{
  --b: var(--piece-i);
  display:inline-flex;align-items:center;gap:6px;
  font-family:var(--font-mono);font-weight:700;font-size:0.625rem;
  letter-spacing:0.12em;text-transform:uppercase;
  padding:4px 8px;color:var(--text-on-piece);background:var(--b);
  border-radius:var(--radius-1);line-height:1;
  box-shadow: inset 1px 1px 0 rgba(255,255,255,0.3), inset -1px -1px 0 rgba(0,0,0,0.3);
}
.tj-badge--outline{ background:transparent; color:var(--b); box-shadow: inset 0 0 0 1.5px var(--b); }
.tj-badge--soft{ background:color-mix(in srgb, var(--b) 18%, var(--ink-900)); color:var(--b); box-shadow:none; }
.tj-badge--i{--b:var(--piece-i)} .tj-badge--o{--b:var(--piece-o)} .tj-badge--t{--b:var(--piece-t)}
.tj-badge--s{--b:var(--piece-s)} .tj-badge--z{--b:var(--piece-z)} .tj-badge--j{--b:var(--piece-j)} .tj-badge--l{--b:var(--piece-l)}
.tj-badge__dot{ width:6px;height:6px;background:currentColor;border-radius:var(--radius-pill);animation:ds-blink 1.2s steps(1) infinite; }
`

let injected = false
function ensure() {
  if (!injected && typeof document !== 'undefined') {
    const s = document.createElement('style')
    s.setAttribute('data-tj', 'badge')
    s.textContent = CSS
    document.head.appendChild(s)
    injected = true
  }
}

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  piece?: 'i' | 'o' | 't' | 's' | 'z' | 'j' | 'l'
  variant?: 'solid' | 'outline' | 'soft'
  dot?: boolean
  children?: ReactNode
}

export function Badge({ children, piece = 'i', variant = 'solid', dot = false, className = '', ...rest }: BadgeProps) {
  ensure()
  const cls = ['tj-badge', variant !== 'solid' ? `tj-badge--${variant}` : '', `tj-badge--${piece}`, className].filter(Boolean).join(' ')
  return (
    <span className={cls} {...rest}>
      {dot && <span className="tj-badge__dot" />}
      {children}
    </span>
  )
}
