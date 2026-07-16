import React from 'react';

const CSS = `
.tj-tetromino{ display:inline-grid; gap:2px; }
.tj-tetromino__cell{ background:var(--p);
  box-shadow: inset 2px 2px 0 var(--p-lit), inset -2px -2px 0 var(--p-dim); }
.tj-tetromino__cell--empty{ background:transparent;box-shadow:none; }
@keyframes tj-tetromino-bob{ 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
.tj-tetromino--bob{ animation: tj-tetromino-bob 2.4s ease-in-out infinite; }
`;
let injected=false;
function ensure(){ if(!injected && typeof document!=='undefined'){ const s=document.createElement('style'); s.setAttribute('data-tj','tetromino'); s.textContent=CSS; document.head.appendChild(s); injected=true; } }

// [cells as (col,row)], grid width, grid height
const SHAPES = {
  i: { cells:[[0,0],[1,0],[2,0],[3,0]], w:4, h:1 },
  o: { cells:[[0,0],[1,0],[0,1],[1,1]], w:2, h:2 },
  t: { cells:[[1,0],[0,1],[1,1],[2,1]], w:3, h:2 },
  s: { cells:[[1,0],[2,0],[0,1],[1,1]], w:3, h:2 },
  z: { cells:[[0,0],[1,0],[1,1],[2,1]], w:3, h:2 },
  j: { cells:[[0,0],[0,1],[1,1],[2,1]], w:3, h:2 },
  l: { cells:[[2,0],[0,1],[1,1],[2,1]], w:3, h:2 },
};

/** Tetromino — a decorative beveled piece rendered from divs. */
export function Tetromino({ piece = 't', size = 24, bob = false, className = '', style = {}, ...rest }) {
  ensure();
  const shp = SHAPES[piece] || SHAPES.t;
  const filled = new Set(shp.cells.map(([c, r]) => `${c},${r}`));
  const cells = [];
  for (let r = 0; r < shp.h; r++) {
    for (let c = 0; c < shp.w; c++) {
      const on = filled.has(`${c},${r}`);
      cells.push(<div key={`${c},${r}`} className={'tj-tetromino__cell' + (on ? '' : ' tj-tetromino__cell--empty')} style={{ width: size, height: size }} />);
    }
  }
  const cls = ['tj-tetromino', bob ? 'tj-tetromino--bob' : '', className].filter(Boolean).join(' ');
  return (
    <div className={cls} style={{
      gridTemplateColumns: `repeat(${shp.w}, ${size}px)`,
      '--p': `var(--piece-${piece})`,
      '--p-lit': `var(--piece-${piece}-lit)`,
      '--p-dim': `var(--piece-${piece}-dim)`,
      ...style,
    }} {...rest}>
      {cells}
    </div>
  );
}
