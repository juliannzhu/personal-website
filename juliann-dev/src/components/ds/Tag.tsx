import { HTMLAttributes, ReactNode } from 'react'

const CSS = `
.tj-tag{
  display:inline-flex;align-items:center;gap:6px;
  font-family:var(--font-mono);font-size:0.75rem;font-weight:500;
  padding:5px 10px;color:var(--text-body);
  background:var(--surface-elevated);
  border:1px solid var(--border-hairline);border-radius:var(--radius-2);
  line-height:1;transition:border-color var(--dur),color var(--dur);
}
.tj-tag::before{ content:""; width:8px;height:8px;background:var(--tag-c,var(--piece-i));
  box-shadow: inset 1px 1px 0 rgba(255,255,255,0.4), inset -1px -1px 0 rgba(0,0,0,0.3); flex-shrink:0; }
.tj-tag--interactive{ cursor:pointer; }
.tj-tag--interactive:hover{ border-color:var(--tag-c,var(--piece-i)); color:var(--text-strong); }
.tj-tag--active{ border-color:var(--tag-c,var(--piece-i)); color:var(--text-strong);
  background:color-mix(in srgb, var(--tag-c, var(--piece-i)) 14%, var(--surface-elevated)); }
`

const PIECE: Record<string, string> = { i:'--piece-i', o:'--piece-o', t:'--piece-t', s:'--piece-s', z:'--piece-z', j:'--piece-j', l:'--piece-l' }

let injected = false
function ensure() {
  if (!injected && typeof document !== 'undefined') {
    const s = document.createElement('style')
    s.setAttribute('data-tj', 'tag')
    s.textContent = CSS
    document.head.appendChild(s)
    injected = true
  }
}

interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  piece?: 'i' | 'o' | 't' | 's' | 'z' | 'j' | 'l'
  interactive?: boolean
  active?: boolean
  children?: ReactNode
}

export function Tag({ children, piece = 'i', interactive = false, active = false, className = '', style = {}, ...rest }: TagProps) {
  ensure()
  const cls = ['tj-tag', interactive ? 'tj-tag--interactive' : '', active ? 'tj-tag--active' : '', className].filter(Boolean).join(' ')
  return (
    <span className={cls} style={{ '--tag-c': `var(${PIECE[piece] || PIECE.i})`, ...style } as React.CSSProperties} {...rest}>
      {children}
    </span>
  )
}
