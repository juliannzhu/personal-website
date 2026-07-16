import { HTMLAttributes } from 'react'

const CSS = `
.tj-avatar{ display:inline-flex;align-items:center;justify-content:center;
  font-family:var(--font-pixel);color:var(--text-on-piece);overflow:hidden;
  background:var(--av-c,var(--piece-i));
  box-shadow: inset 2px 2px 0 rgba(255,255,255,0.35), inset -2px -2px 0 rgba(0,0,0,0.35);
  border-radius:var(--radius-1); }
.tj-avatar img{ width:100%;height:100%;object-fit:cover;display:block; }
.tj-avatar--round{ border-radius:var(--radius-pill); }
`

const PIECE: Record<string, string> = { i:'--piece-i', o:'--piece-o', t:'--piece-t', s:'--piece-s', z:'--piece-z', j:'--piece-j', l:'--piece-l' }
const SIZES: Record<string, number> = { sm:32, md:44, lg:64, xl:96 }

let injected = false
function ensure() {
  if (!injected && typeof document !== 'undefined') {
    const s = document.createElement('style')
    s.setAttribute('data-tj', 'avatar')
    s.textContent = CSS
    document.head.appendChild(s)
    injected = true
  }
}

interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  src?: string
  alt?: string
  initials?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | number
  piece?: 'i' | 'o' | 't' | 's' | 'z' | 'j' | 'l'
  round?: boolean
}

export function Avatar({ src, alt = '', initials, size = 'md', piece = 'i', round = false, className = '', style = {}, ...rest }: AvatarProps) {
  ensure()
  const px = typeof size === 'number' ? size : (SIZES[size] || SIZES.md)
  const cls = ['tj-avatar', round ? 'tj-avatar--round' : '', className].filter(Boolean).join(' ')
  return (
    <span className={cls} style={{ width: px, height: px, fontSize: Math.round(px * 0.34), '--av-c': `var(${PIECE[piece] || PIECE.i})`, ...style } as React.CSSProperties} {...rest}>
      {src ? <img src={src} alt={alt} /> : (initials || '').slice(0, 2).toUpperCase()}
    </span>
  )
}
