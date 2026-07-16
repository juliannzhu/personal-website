/* Loader — a ~4s Tetris loading screen.
   Real tetromino pieces drop and stack from the bottom up, filling the well
   like a progress bar; at 100% the rows flash white and clear (bottom-up),
   then the screen fades to reveal the page. */

(function injectLoaderCSS() {
  if (document.getElementById('tj-loader-css')) return;
  const s = document.createElement('style');
  s.id = 'tj-loader-css';
  s.textContent = `
  @keyframes tj-loader-blink { 0%,55%{opacity:1} 56%,100%{opacity:0.35} }
  @keyframes tj-piece-drop { 0%{ transform:translateY(-60px); opacity:0; } 70%{ opacity:1; } 100%{ transform:translateY(0); opacity:1; } }
  .tj-piece-group { animation: tj-piece-drop 150ms var(--ease-snap) both; }
  .tj-loader-cell { transition: opacity 200ms linear, transform 200ms var(--ease-snap); }
  `;
  document.head.appendChild(s);
})();

// Tetromino orientations as [col,row] cells (row increases downward).
const TJ_SHAPES = {
  i: { color: 'i', rots: [[[0,0],[1,0],[2,0],[3,0]], [[0,0],[0,1],[0,2],[0,3]]] },
  o: { color: 'o', rots: [[[0,0],[1,0],[0,1],[1,1]]] },
  t: { color: 't', rots: [[[0,0],[1,0],[2,0],[1,1]], [[1,0],[0,1],[1,1],[2,1]], [[1,0],[0,1],[1,1],[1,2]], [[0,0],[0,1],[1,1],[0,2]]] },
  s: { color: 's', rots: [[[1,0],[2,0],[0,1],[1,1]], [[0,0],[0,1],[1,1],[1,2]]] },
  z: { color: 'z', rots: [[[0,0],[1,0],[1,1],[2,1]], [[1,0],[0,1],[1,1],[0,2]]] },
  j: { color: 'j', rots: [[[0,0],[0,1],[1,1],[2,1]], [[0,0],[1,0],[0,1],[0,2]], [[0,0],[1,0],[2,0],[2,1]], [[1,0],[1,1],[0,2],[1,2]]] },
  l: { color: 'l', rots: [[[2,0],[0,1],[1,1],[2,1]], [[0,0],[0,1],[0,2],[1,2]], [[0,0],[1,0],[2,0],[0,1]], [[0,0],[1,0],[1,1],[1,2]]] },
};

// Deterministically simulate pieces dropping into a W×H well, stacking bottom-up.
function simulateStack(W, H) {
  const grid = Array.from({ length: H }, () => new Array(W).fill(null));
  const heights = new Array(W).fill(0);            // filled rows per column (from bottom)
  const placements = [];
  const bag = ['l', 'j', 'i', 's', 't', 'z', 'o'];

  const colHeight = (c) => heights[c];
  const recompute = (c) => { let h = 0; for (let r = H - 1; r >= 0; r--) { if (grid[r][c]) { h = r + 1; break; } } heights[c] = h; };

  for (let n = 0; n < 80; n++) {
    const def = TJ_SHAPES[bag[n % bag.length]];
    let best = null;
    def.rots.forEach((cells, ri) => {
      const maxX = Math.max(...cells.map((c) => c[0]));
      const maxY = Math.max(...cells.map((c) => c[1]));
      const colLowest = {};
      for (const [x, y] of cells) { if (colLowest[x] === undefined || y > colLowest[x]) colLowest[x] = y; }
      for (let off = 0; off + maxX < W; off++) {
        // landing base row (bounding-box bottom) so the piece rests on the stack
        let base = 0;
        for (const xs in colLowest) {
          const x = +xs; const bottomOffset = maxY - colLowest[x];
          const need = colHeight(off + x) - bottomOffset;
          if (need > base) base = need;
        }
        const abs = cells.map(([x, y]) => ({ col: off + x, row: base + (maxY - y) }));
        if (abs.some((c) => c.row >= H || c.row < 0 || grid[c.row][c.col])) continue;
        // score: prefer low landing + few holes created underneath
        let holes = 0;
        const lowestPerCol = {};
        for (const c of abs) { if (lowestPerCol[c.col] === undefined || c.row < lowestPerCol[c.col]) lowestPerCol[c.col] = c.row; }
        for (const cs in lowestPerCol) { const gap = lowestPerCol[cs] - colHeight(+cs); if (gap > 0) holes += gap; }
        const top = Math.max(...abs.map((c) => c.row));
        const score = top + holes * 5;
        if (!best || score < best.score) best = { abs, score, color: def.color };
      }
    });
    if (!best) break;
    for (const c of best.abs) grid[c.row][c.col] = best.color;
    const cols = new Set(best.abs.map((c) => c.col));
    cols.forEach(recompute);
    placements.push({ cells: best.abs, color: best.color });
    if (Math.max(...heights) >= H) break;
  }
  const maxRow = placements.reduce((m, p) => Math.max(m, ...p.cells.map((c) => c.row)), -1);
  return { placements, maxStack: maxRow + 1 };
}

function Loader({ onDone }) {
  const W = 10, H = 12, CELL = 30;
  const FILL_MS = 3500, FLASH_MS = 180, CLEAR_ROW_MS = 42, FADE_MS = 320;

  const sim = React.useMemo(() => simulateStack(W, H), []);
  const N = sim.placements.length;

  const [revealed, setRevealed] = React.useState(0);
  const [phase, setPhase] = React.useState('fill');     // fill | clear
  const [flashing, setFlashing] = React.useState(false);
  const [clearedRows, setClearedRows] = React.useState(0);
  const [revealedOverlay, setRevealedOverlay] = React.useState(false);

  // Reveal pieces over FILL_MS (timer-driven so it always completes).
  React.useEffect(() => {
    const start = Date.now();
    const id = setInterval(() => {
      const e = Date.now() - start;
      const rev = Math.min(N, Math.round((e / FILL_MS) * N));
      setRevealed(rev);
      if (e >= FILL_MS) { clearInterval(id); setRevealed(N); setPhase('clear'); }
    }, 40);
    return () => clearInterval(id);
  }, [N]);

  // Clear: flash white, wipe rows bottom-up, fade to reveal the page.
  React.useEffect(() => {
    if (phase !== 'clear') return;
    const timers = [];
    setFlashing(true);
    timers.push(setTimeout(() => {
      setFlashing(false);
      for (let r = 0; r < sim.maxStack; r++) {
        timers.push(setTimeout(() => setClearedRows(r + 1), r * CLEAR_ROW_MS));
      }
      const wipe = sim.maxStack * CLEAR_ROW_MS;
      timers.push(setTimeout(() => setRevealedOverlay(true), wipe + 40));
      timers.push(setTimeout(() => onDone && onDone(), wipe + 40 + FADE_MS));
    }, FLASH_MS));
    return () => timers.forEach(clearTimeout);
  }, [phase]);

  const pct = N ? Math.round((revealed / N) * 100) : 100;

  const groups = [];
  for (let i = 0; i < revealed; i++) {
    const p = sim.placements[i];
    const cells = p.cells.map((c, ci) => {
      const rowCleared = phase === 'clear' && c.row < clearedRows;
      const white = flashing && !rowCleared;
      return (
        <div key={ci} className="tj-loader-cell" style={{
          position: 'absolute', left: c.col * CELL, top: (H - 1 - c.row) * CELL,
          width: CELL - 2, height: CELL - 2,
          background: white ? 'var(--text-strong)' : `var(--piece-${p.color})`,
          boxShadow: white ? 'none' : 'inset 2px 2px 0 rgba(255,255,255,0.35), inset -2px -2px 0 rgba(0,0,0,0.35)',
          opacity: rowCleared ? 0 : 1, transform: rowCleared ? 'scaleY(0.08)' : 'scaleY(1)',
        }} />
      );
    });
    groups.push(<div key={i} className="tj-piece-group" style={{ position: 'absolute', inset: 0 }}>{cells}</div>);
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9000,
      background: 'var(--bg-well)', backgroundImage: 'var(--grid-bg)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 30,
      opacity: revealedOverlay ? 0 : 1, transition: `opacity ${FADE_MS}ms linear`,
    }}>
      <div style={{
        fontFamily: 'var(--font-pixel)', fontSize: 18, color: 'var(--text-strong)',
        textTransform: 'uppercase', letterSpacing: '0.08em', animation: 'tj-loader-blink 1s steps(1) infinite',
      }}>Loading</div>
      <div style={{
        position: 'relative', width: W * CELL, height: H * CELL,
        padding: 0, background: 'var(--ink-1000)', backgroundImage: 'var(--grid-bg)',
        border: '4px solid var(--border-strong)', boxShadow: 'var(--shadow-soft)',
      }}>
        {groups}
      </div>
      <div style={{ fontFamily: 'var(--font-pixel)', fontSize: 30, color: 'var(--piece-o)', textShadow: '0 3px 0 rgba(0,0,0,0.4)' }}>{pct}%</div>
    </div>
  );
}

Object.assign(window, { Loader });
