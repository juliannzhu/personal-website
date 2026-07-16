import { HTMLAttributes } from 'react'

const CSS = `
.tj-tetromino{ display:inline-grid; gap:2px; }
.tj-tetromino__cell{ background:var(--p);
  box-shadow: inset 2px 2px 0 var(--p-lit), inset -2px -2px 0 var(--p-dim); }
.tj-tetromino__cell--empty{ background:transparent;box-shadow:none; }
@keyframes tj-tetromino-bob{ 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
.tj-tetromino--bob{ animation: tj-tetromino-bob 2.4s ease-in-out infinite; }

@keyframes tj-piece-spin {
  0%         { transform: rotate(0deg)   scale(1);    }
  14%        { transform: rotate(88deg)  scale(1.14); }
  18%        { transform: rotate(93deg)  scale(0.88); }
  24%, 32%   { transform: rotate(90deg)  scale(1);    }
  46%        { transform: rotate(178deg) scale(1.14); }
  50%        { transform: rotate(183deg) scale(0.88); }
  56%, 64%   { transform: rotate(180deg) scale(1);    }
  78%        { transform: rotate(268deg) scale(1.14); }
  82%        { transform: rotate(273deg) scale(0.88); }
  88%, 96%   { transform: rotate(270deg) scale(1);    }
  100%       { transform: rotate(360deg) scale(1);    }
}
.tj-tetromino:hover {
  animation: tj-piece-spin 2s cubic-bezier(0.22,0.61,0.36,1) infinite !important;
  cursor: default;
}
`

const SHAPES: Record<string, { cells: [number,number][]; w: number; h: number }> = {
  i: { cells:[[0,0],[1,0],[2,0],[3,0]], w:4, h:1 },
  o: { cells:[[0,0],[1,0],[0,1],[1,1]], w:2, h:2 },
  t: { cells:[[1,0],[0,1],[1,1],[2,1]], w:3, h:2 },
  s: { cells:[[1,0],[2,0],[0,1],[1,1]], w:3, h:2 },
  z: { cells:[[0,0],[1,0],[1,1],[2,1]], w:3, h:2 },
  j: { cells:[[0,0],[0,1],[1,1],[2,1]], w:3, h:2 },
  l: { cells:[[2,0],[0,1],[1,1],[2,1]], w:3, h:2 },
}

let injected = false
function ensure() {
  if (!injected && typeof document !== 'undefined') {
    const s = document.createElement('style')
    s.setAttribute('data-tj', 'tetromino')
    s.textContent = CSS
    document.head.appendChild(s)
    injected = true
  }
}

interface TetrominoProps extends HTMLAttributes<HTMLDivElement> {
  piece?: 'i' | 'o' | 't' | 's' | 'z' | 'j' | 'l'
  size?: number
  bob?: boolean
}

export function Tetromino({ piece = 't', size = 24, bob = false, className = '', style = {}, ...rest }: TetrominoProps) {
  ensure()
  const shp = SHAPES[piece] || SHAPES.t
  const filled = new Set(shp.cells.map(([c, r]) => `${c},${r}`))
  const cells = []
  for (let r = 0; r < shp.h; r++) {
    for (let c = 0; c < shp.w; c++) {
      const on = filled.has(`${c},${r}`)
      cells.push(<div key={`${c},${r}`} className={'tj-tetromino__cell' + (on ? '' : ' tj-tetromino__cell--empty')} style={{ width: size, height: size }} />)
    }
  }
  const cls = ['tj-tetromino', bob ? 'tj-tetromino--bob' : '', className].filter(Boolean).join(' ')
  return (
    <div className={cls} style={{
      gridTemplateColumns: `repeat(${shp.w}, ${size}px)`,
      '--p': `var(--piece-${piece})`,
      '--p-lit': `var(--piece-${piece}-lit)`,
      '--p-dim': `var(--piece-${piece}-dim)`,
      ...style,
    } as React.CSSProperties} {...rest}>
      {cells}
    </div>
  )
}
