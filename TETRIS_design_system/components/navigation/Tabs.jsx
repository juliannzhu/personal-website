import React from 'react';

const CSS = `
.tj-tabs{ display:flex;gap:4px;border-bottom:2px solid var(--border-strong); }
.tj-tab{
  font-family:var(--font-pixel);font-size:11px;text-transform:uppercase;letter-spacing:0.02em;
  color:var(--text-muted);background:transparent;border:none;cursor:pointer;
  padding:12px 16px;position:relative;transition:color var(--dur);
  border-top-left-radius:var(--radius-1);border-top-right-radius:var(--radius-1);
}
.tj-tab:hover{ color:var(--text-body); background:rgba(255,255,255,0.04); }
.tj-tab--active{ color:var(--text-on-piece); background:var(--tab-c,var(--piece-i)); }
.tj-tab--active::after{ content:"";position:absolute;left:0;right:0;bottom:-2px;height:2px;background:var(--tab-c,var(--piece-i)); }
.tj-tab:focus-visible{ outline:3px solid var(--text-strong);outline-offset:-3px; }
`;
let injected=false;
function ensure(){ if(!injected && typeof document!=='undefined'){ const s=document.createElement('style'); s.setAttribute('data-tj','tabs'); s.textContent=CSS; document.head.appendChild(s); injected=true; } }

const PIECE = { i:'--piece-i', o:'--piece-o', t:'--piece-t', s:'--piece-s', z:'--piece-z', j:'--piece-j', l:'--piece-l' };

/**
 * Tabs — pixel-label tab strip. Controlled via `value` + `onChange`.
 * `items` = [{ value, label }].
 */
export function Tabs({ items = [], value, onChange, piece = 'i', className = '', ...rest }) {
  ensure();
  return (
    <div className={['tj-tabs', className].filter(Boolean).join(' ')} role="tablist" style={{ '--tab-c': `var(${PIECE[piece] || PIECE.i})` }} {...rest}>
      {items.map((it) => (
        <button
          key={it.value}
          role="tab"
          aria-selected={value === it.value}
          className={'tj-tab' + (value === it.value ? ' tj-tab--active' : '')}
          onClick={() => onChange && onChange(it.value)}
        >
          {it.label}
        </button>
      ))}
    </div>
  );
}
