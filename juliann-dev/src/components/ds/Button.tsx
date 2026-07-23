import { ButtonHTMLAttributes, ReactNode } from 'react'

const CSS = `
.tj-btn{
  --b: var(--piece-i);--b-lit: var(--piece-i-lit);--b-dim: var(--piece-i-dim);
  display:inline-flex;align-items:center;justify-content:center;gap:8px;
  font-family:var(--font-pixel);text-transform:uppercase;letter-spacing:0.02em;
  color:var(--text-on-piece);background:var(--b);
  border:none;border-radius:var(--radius-1);cursor:pointer;
  box-shadow: inset 2px 2px 0 var(--b-lit), inset -2px -2px 0 var(--b-dim), 0 4px 0 rgba(0,0,0,0.45);
  transition: transform var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out), filter var(--dur-fast);
  user-select:none;white-space:nowrap;
}
.tj-btn:hover{ filter:brightness(1.12); }
.tj-btn:active{ transform:translateY(4px); box-shadow: inset 2px 2px 0 var(--b-lit), inset -2px -2px 0 var(--b-dim), 0 0 0 rgba(0,0,0,0.45); }
.tj-btn:focus-visible{ outline:3px solid var(--text-strong); outline-offset:3px; }
.tj-btn--sm{ font-size:0.625rem; padding:9px 14px; }
.tj-btn--md{ font-size:0.8125rem; padding:13px 20px; }
.tj-btn--lg{ font-size:1rem; padding:17px 28px; }
.tj-btn--secondary{ --b: var(--ink-600); --b-lit: var(--ink-500); --b-dim: var(--ink-1000); color:var(--text-strong); }
.tj-btn--danger{ --b: var(--piece-z); --b-lit: var(--piece-z-lit); --b-dim: var(--piece-z-dim); }
.tj-btn--success{ --b: var(--piece-s); --b-lit: var(--piece-s-lit); --b-dim: var(--piece-s-dim); }
.tj-btn--warning{ --b: var(--piece-l); --b-lit: var(--piece-l-lit); --b-dim: var(--piece-l-dim); }
.tj-btn--magic{ --b: var(--piece-t); --b-lit: var(--piece-t-lit); --b-dim: var(--piece-t-dim); color:var(--text-strong); }
.tj-btn--ghost{ background:transparent; color:var(--b); box-shadow: inset 0 0 0 2px var(--b); }
.tj-btn--ghost:hover{ background:color-mix(in srgb, var(--b) 14%, transparent); filter:none; }
.tj-btn--ghost:active{ transform:translateY(2px); }
.tj-btn--block{ width:100%; }
.tj-btn[disabled]{ cursor:not-allowed; filter:grayscale(0.7) brightness(0.6); transform:none; }
`

let injected = false
function ensure() {
  if (!injected && typeof document !== 'undefined') {
    const s = document.createElement('style')
    s.setAttribute('data-tj', 'button')
    s.textContent = CSS
    document.head.appendChild(s)
    injected = true
  }
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'warning' | 'magic'
  size?: 'sm' | 'md' | 'lg'
  block?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  block = false,
  disabled = false,
  leftIcon,
  rightIcon,
  className = '',
  style,
  ...rest
}: ButtonProps) {
  ensure()
  const variantClass = variant === 'primary' ? '' : `tj-btn--${variant}`
  const cls = ['tj-btn', `tj-btn--${size}`, variantClass, block ? 'tj-btn--block' : '', className]
    .filter(Boolean).join(' ')
  return (
    <button className={cls} disabled={disabled} style={style as React.CSSProperties} {...rest}>
      {leftIcon}
      {children}
      {rightIcon}
    </button>
  )
}
