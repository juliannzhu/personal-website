import { ButtonHTMLAttributes, ReactNode } from 'react'

const CSS = `
.tj-iconbtn{
  --b: var(--ink-600);
  display:inline-flex;align-items:center;justify-content:center;
  background:var(--b);color:var(--text-strong);border:none;cursor:pointer;
  border-radius:var(--radius-1);
  box-shadow: inset 2px 2px 0 rgba(255,255,255,0.18), inset -2px -2px 0 rgba(0,0,0,0.4), 0 3px 0 rgba(0,0,0,0.45);
  transition: transform var(--dur-fast) var(--ease-out), filter var(--dur-fast);
}
.tj-iconbtn:hover{ filter:brightness(1.18); }
.tj-iconbtn:active{ transform:translateY(3px); box-shadow: inset 2px 2px 0 rgba(255,255,255,0.18), inset -2px -2px 0 rgba(0,0,0,0.4); }
.tj-iconbtn:focus-visible{ outline:3px solid var(--piece-i); outline-offset:2px; }
.tj-iconbtn--sm{ width:32px;height:32px;font-size:0.875rem; }
.tj-iconbtn--md{ width:40px;height:40px;font-size:1.125rem; }
.tj-iconbtn--lg{ width:48px;height:48px;font-size:1.375rem; }
.tj-iconbtn--accent{ --b: var(--piece-i); color:var(--text-on-piece); }
.tj-iconbtn--ghost{ background:transparent; box-shadow:none; color:var(--text-muted); }
.tj-iconbtn--ghost:hover{ background:rgba(255,255,255,0.06); color:var(--text-strong); filter:none; }
`

let injected = false
function ensure() {
  if (!injected && typeof document !== 'undefined') {
    const s = document.createElement('style')
    s.setAttribute('data-tj', 'iconbutton')
    s.textContent = CSS
    document.head.appendChild(s)
    injected = true
  }
}

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'accent' | 'ghost'
  label?: string
  children?: ReactNode
}

export function IconButton({ children, size = 'md', variant = 'default', label, className = '', ...rest }: IconButtonProps) {
  ensure()
  const v = variant === 'default' ? '' : `tj-iconbtn--${variant}`
  const cls = ['tj-iconbtn', `tj-iconbtn--${size}`, v, className].filter(Boolean).join(' ')
  return (
    <button className={cls} aria-label={label} {...rest}>{children}</button>
  )
}
