import React from 'react';

const CSS = `
.tj-switch{ display:inline-flex;align-items:center;gap:10px;cursor:pointer;font-family:var(--font-mono);font-size:12px;color:var(--text-body); user-select:none; }
.tj-switch__track{ position:relative;width:48px;height:24px;background:var(--bg-well);
  border:2px solid var(--border-strong);border-radius:var(--radius-1);transition:background var(--dur); }
.tj-switch__knob{ position:absolute;top:1px;left:1px;width:18px;height:18px;background:var(--ink-400);
  box-shadow: inset 2px 2px 0 rgba(255,255,255,0.25), inset -2px -2px 0 rgba(0,0,0,0.4);
  transition: transform var(--dur) var(--ease-snap), background var(--dur); }
.tj-switch--on .tj-switch__track{ background:color-mix(in srgb, var(--piece-s) 28%, var(--bg-well)); border-color:var(--piece-s); }
.tj-switch--on .tj-switch__knob{ transform:translateX(24px); background:var(--piece-s);
  box-shadow: inset 2px 2px 0 var(--piece-s-lit), inset -2px -2px 0 var(--piece-s-dim); }
.tj-switch--disabled{ opacity:0.45;cursor:not-allowed; }
.tj-switch input{ position:absolute;opacity:0;width:0;height:0; }
`;
let injected=false;
function ensure(){ if(!injected && typeof document!=='undefined'){ const s=document.createElement('style'); s.setAttribute('data-tj','switch'); s.textContent=CSS; document.head.appendChild(s); injected=true; } }

/** Switch — toggle styled as a sliding block. */
export function Switch({ checked = false, onChange, disabled = false, label, className = '', ...rest }) {
  ensure();
  const cls = ['tj-switch', checked ? 'tj-switch--on' : '', disabled ? 'tj-switch--disabled' : '', className].filter(Boolean).join(' ');
  return (
    <label className={cls}>
      <span className="tj-switch__track"><span className="tj-switch__knob" /></span>
      <input type="checkbox" checked={checked} disabled={disabled} onChange={(e) => onChange && onChange(e.target.checked, e)} {...rest} />
      {label && <span>{label}</span>}
    </label>
  );
}
