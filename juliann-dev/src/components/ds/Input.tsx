import { InputHTMLAttributes } from 'react'

const CSS = `
.tj-field{ display:flex;flex-direction:column;gap:6px;font-family:var(--font-body); }
.tj-field__label{ font-family:var(--font-mono);font-size:0.6875rem;letter-spacing:0.12em;
  text-transform:uppercase;color:var(--text-muted); }
.tj-input{
  font-family:var(--font-mono);font-size:0.875rem;color:var(--text-strong);
  background:var(--bg-well);border:2px solid var(--border-strong);
  border-radius:var(--radius-2);padding:11px 13px;width:100%;outline:none;
  transition:border-color var(--dur),box-shadow var(--dur);
}
.tj-input::placeholder{ color:var(--text-faint); }
.tj-input:hover{ border-color:var(--ink-300); }
.tj-input:focus{ border-color:var(--piece-i); box-shadow:0 0 0 3px color-mix(in srgb,var(--piece-i) 25%,transparent); }
.tj-input--invalid{ border-color:var(--piece-z); }
.tj-input--invalid:focus{ box-shadow:0 0 0 3px color-mix(in srgb,var(--piece-z) 25%,transparent); }
.tj-field__hint{ font-size:0.75rem;color:var(--text-faint); }
.tj-field__hint--err{ color:var(--piece-z);font-family:var(--font-mono); }
.tj-input[disabled]{ opacity:0.5;cursor:not-allowed; }
`

let injected = false
function ensure() {
  if (!injected && typeof document !== 'undefined') {
    const s = document.createElement('style')
    s.setAttribute('data-tj', 'input')
    s.textContent = CSS
    document.head.appendChild(s)
    injected = true
  }
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
  error?: string
}

export function Input({ label, hint, error, id, className = '', ...rest }: InputProps) {
  ensure()
  const inputId = id || (label ? 'tj-' + label.replace(/\s+/g, '-').toLowerCase() : undefined)
  const cls = ['tj-input', error ? 'tj-input--invalid' : '', className].filter(Boolean).join(' ')
  return (
    <div className="tj-field">
      {label && <label className="tj-field__label" htmlFor={inputId}>{label}</label>}
      <input id={inputId} className={cls} aria-invalid={!!error} {...rest} />
      {error ? <span className="tj-field__hint tj-field__hint--err">{error}</span>
        : hint ? <span className="tj-field__hint">{hint}</span> : null}
    </div>
  )
}
