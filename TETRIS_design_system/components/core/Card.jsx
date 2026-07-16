import React from 'react';

const CSS = `
.tj-card{
  position:relative;background:var(--surface-card);
  border:2px solid var(--border-strong);border-radius:var(--radius-1);
  box-shadow: var(--shadow-block);
  transition: transform var(--dur) var(--ease-out), box-shadow var(--dur) var(--ease-out), border-color var(--dur);
}
.tj-card--pad{ padding:var(--space-5); }
.tj-card--interactive{ cursor:pointer; }
.tj-card--interactive:hover{ transform:translateY(-4px); box-shadow:0 10px 0 rgba(0,0,0,0.45); border-color:var(--card-accent,var(--piece-i)); }
.tj-card--interactive:active{ transform:translateY(0); box-shadow:var(--shadow-block); }
.tj-card__bar{ position:absolute;top:-2px;left:-2px;right:-2px;height:6px;background:var(--card-accent,var(--piece-i)); }
.tj-card--accentbar{ padding-top:calc(var(--space-5) + 6px); }
`;
let injected=false;
function ensure(){ if(!injected && typeof document!=='undefined'){ const s=document.createElement('style'); s.setAttribute('data-tj','card'); s.textContent=CSS; document.head.appendChild(s); injected=true; } }

const PIECE = { i:'--piece-i', o:'--piece-o', t:'--piece-t', s:'--piece-s', z:'--piece-z', j:'--piece-j', l:'--piece-l' };

/** Card — beveled surface panel with a hard drop shadow. Optional top accent bar. */
export function Card({ children, accent, interactive = false, pad = true, accentBar = false, className = '', style = {}, ...rest }) {
  ensure();
  const cls = ['tj-card', pad ? 'tj-card--pad' : '', interactive ? 'tj-card--interactive' : '', accentBar ? 'tj-card--accentbar' : '', className].filter(Boolean).join(' ');
  const ac = accent ? `var(${PIECE[accent] || PIECE.i})` : undefined;
  return (
    <div className={cls} style={{ ...(ac ? { '--card-accent': ac } : {}), ...style }} {...rest}>
      {accentBar && <span className="tj-card__bar" />}
      {children}
    </div>
  );
}
