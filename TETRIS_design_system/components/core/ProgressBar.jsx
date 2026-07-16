import React from 'react';

const CSS = `
.tj-progress{ width:100%; }
.tj-progress__track{
  display:flex;gap:3px;padding:4px;background:var(--bg-well);
  border:2px solid var(--border-strong);border-radius:var(--radius-1);
}
.tj-progress__cell{ flex:1;height:var(--cell-h,16px);background:var(--ink-700);
  transition: background var(--dur) var(--ease-snap); }
.tj-progress__cell--on{ background:var(--prog-c,var(--piece-s));
  box-shadow: inset 1px 1px 0 rgba(255,255,255,0.35), inset -1px -1px 0 rgba(0,0,0,0.3); }
.tj-progress__meta{ display:flex;justify-content:space-between;margin-top:8px;
  font-family:var(--font-mono);font-size:11px;color:var(--text-muted); }
`;
let injected=false;
function ensure(){ if(!injected && typeof document!=='undefined'){ const s=document.createElement('style'); s.setAttribute('data-tj','progress'); s.textContent=CSS; document.head.appendChild(s); injected=true; } }

const PIECE = { i:'--piece-i', o:'--piece-o', t:'--piece-t', s:'--piece-s', z:'--piece-z', j:'--piece-j', l:'--piece-l' };

/** ProgressBar — segmented "stacked block" progress meter. */
export function ProgressBar({ value = 0, cells = 10, piece = 's', label, showValue = true, cellHeight = 16, className = '', style = {}, ...rest }) {
  ensure();
  const pct = Math.max(0, Math.min(100, value));
  const filled = Math.round((pct / 100) * cells);
  return (
    <div className={['tj-progress', className].filter(Boolean).join(' ')} style={{ '--prog-c': `var(${PIECE[piece] || PIECE.s})`, ...style }} {...rest}>
      <div className="tj-progress__track" style={{ '--cell-h': `${cellHeight}px` }}>
        {Array.from({ length: cells }).map((_, i) => (
          <div key={i} className={'tj-progress__cell' + (i < filled ? ' tj-progress__cell--on' : '')} />
        ))}
      </div>
      {(label || showValue) && (
        <div className="tj-progress__meta">
          <span>{label}</span>
          {showValue && <span>{pct}%</span>}
        </div>
      )}
    </div>
  );
}
