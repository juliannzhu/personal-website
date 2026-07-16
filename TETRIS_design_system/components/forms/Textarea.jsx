import React from 'react';

const CSS = `
.tj-field{ display:flex;flex-direction:column;gap:6px;font-family:var(--font-body); }
.tj-field__label{ font-family:var(--font-mono);font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:var(--text-muted); }
.tj-field__hint{ font-size:12px;color:var(--text-faint); }
.tj-textarea{ font-family:var(--font-body);font-size:14px;color:var(--text-strong);
  background:var(--bg-well);border:2px solid var(--border-strong);border-radius:var(--radius-2);
  padding:12px 13px;width:100%;outline:none;resize:vertical;min-height:96px;line-height:1.6;
  transition:border-color var(--dur),box-shadow var(--dur); }
.tj-textarea::placeholder{ color:var(--text-faint); }
.tj-textarea:focus{ border-color:var(--piece-i); box-shadow:0 0 0 3px color-mix(in srgb,var(--piece-i) 25%,transparent); }
`;
let injected=false;
function ensure(){ if(!injected && typeof document!=='undefined'){ const s=document.createElement('style'); s.setAttribute('data-tj','textarea'); s.textContent=CSS; document.head.appendChild(s); injected=true; } }

/** Textarea — multi-line field matching Input's styling. */
export function Textarea({ label, hint, id, className = '', ...rest }) {
  ensure();
  const tid = id || (label ? 'tj-' + label.replace(/\s+/g, '-').toLowerCase() : undefined);
  return (
    <div className="tj-field">
      {label && <label className="tj-field__label" htmlFor={tid}>{label}</label>}
      <textarea id={tid} className={['tj-textarea', className].filter(Boolean).join(' ')} {...rest} />
      {hint && <span className="tj-field__hint">{hint}</span>}
    </div>
  );
}
