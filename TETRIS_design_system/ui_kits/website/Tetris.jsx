/* HOLD box (left rail) + a playable Tetris 20-LINE SPRINT with time leaderboard.
   The HOLD box mirrors the NEXT rail on the right and only shows on home. */

const { Tetromino: TJTetromino, Button: TJButton } = window.TETRISJULIANNDesignSystem_af17e8;

/* ---- piece data ---------------------------------------------------------- */
const TET_PIECES = {
  I: { size: 4, color: 'i', cells: [[0,1],[1,1],[2,1],[3,1]] },
  O: { size: 2, color: 'o', cells: [[0,0],[1,0],[0,1],[1,1]] },
  T: { size: 3, color: 't', cells: [[1,0],[0,1],[1,1],[2,1]] },
  S: { size: 3, color: 's', cells: [[1,0],[2,0],[0,1],[1,1]] },
  Z: { size: 3, color: 'z', cells: [[0,0],[1,0],[1,1],[2,1]] },
  J: { size: 3, color: 'j', cells: [[0,0],[0,1],[1,1],[2,1]] },
  L: { size: 3, color: 'l', cells: [[2,0],[0,1],[1,1],[2,1]] },
};
const TET_KEYS = ['I','O','T','S','Z','J','L'];
const rotateCells = (cells, size) => cells.map(([x,y]) => [size - 1 - y, x]);
const shuffled = () => { const a = [...TET_KEYS]; for (let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };

const COLS = 10, ROWS = 20, SPRINT_LINES = 20;
const emptyBoard = () => Array.from({ length: ROWS }, () => Array(COLS).fill(null));
const spawn = (type) => { const p = TET_PIECES[type]; return { type, color: p.color, size: p.size, cells: p.cells.map((c)=>[...c]), x: Math.floor((COLS - p.size) / 2), y: 0 }; };
const collides = (board, cells, x, y) => cells.some(([cx,cy]) => {
  const bx = x + cx, by = y + cy;
  if (bx < 0 || bx >= COLS || by >= ROWS) return true;
  if (by >= 0 && board[by][bx]) return true;
  return false;
});

/* ---- time formatting + leaderboard (sorted by fastest time) -------------- */
const fmtTime = (ms) => {
  if (ms == null) return '--:--';
  const cs = Math.floor((ms % 1000) / 10);
  const s = Math.floor(ms / 1000) % 60;
  const m = Math.floor(ms / 60000);
  return `${m}:${String(s).padStart(2,'0')}.${String(cs).padStart(2,'0')}`;
};
const SCORES_KEY = 'tj-tetris-sprint';
const DEFAULT_SCORES = [
  { name: 'JUL', ms: 38200 }, { name: 'ADA', ms: 45100 }, { name: 'NEO', ms: 52400 },
  { name: 'PIX', ms: 63800 }, { name: 'BIT', ms: 78500 }, { name: 'CPU', ms: 102000 },
];
function loadScores() {
  try { const s = JSON.parse(localStorage.getItem(SCORES_KEY)); if (Array.isArray(s) && s.length) return s; } catch (e) {}
  return DEFAULT_SCORES;
}
function saveScore(ms) {
  if (!ms) return loadScores();
  const list = [...loadScores().map((r) => ({ name: r.name, ms: r.ms })), { name: 'YOU', ms, you: true }]
    .sort((a, b) => a.ms - b.ms).slice(0, 8);
  try { localStorage.setItem(SCORES_KEY, JSON.stringify(list.map(({ name, ms }) => ({ name, ms })))); } catch (e) {}
  return list;
}

/* ---- mini piece preview -------------------------------------------------- */
function MiniPiece({ type, cell = 13 }) {
  const p = TET_PIECES[type];
  const cellsSet = new Set(p.cells.map(([x,y]) => `${x},${y}`));
  const items = [];
  for (let y = 0; y < p.size; y++) for (let x = 0; x < p.size; x++) {
    const on = cellsSet.has(`${x},${y}`);
    items.push(<div key={`${x},${y}`} style={{ width: cell, height: cell,
      background: on ? `var(--piece-${p.color})` : 'transparent',
      boxShadow: on ? 'inset 2px 2px 0 rgba(255,255,255,0.35), inset -2px -2px 0 rgba(0,0,0,0.35)' : 'none' }} />);
  }
  return <div style={{ display: 'grid', gridTemplateColumns: `repeat(${p.size}, ${cell}px)`, gap: 2 }}>{items}</div>;
}

/* ---- the game ------------------------------------------------------------ */
const ensureQueue = (s) => { while (s.queue.length < 8) s.queue.push(...shuffled()); };
const freshState = (status) => {
  const queue = shuffled().concat(shuffled());
  return { board: emptyBoard(), queue, cur: null, hold: null, canHold: true, lines: 0, status: status || 'ready', startTime: 0, finishMs: 0, saved: false };
};

function TetrisGame({ onClose }) {
  const CELL = 20;
  const g = React.useRef(null);
  const [, force] = React.useState(0);
  const [, setClock] = React.useState(0);
  const rerender = () => force((n) => n + 1);
  const [scores, setScores] = React.useState(loadScores);
  if (!g.current) g.current = freshState('ready');

  const startGame = () => {
    const s = freshState('playing');
    const t = s.queue.shift(); ensureQueue(s);
    s.cur = spawn(t); s.startTime = Date.now();
    g.current = s; setClock(Date.now()); rerender();
  };

  const lockAndNext = () => {
    const s = g.current;
    s.cur.cells.forEach(([cx,cy]) => { const by = s.cur.y + cy, bx = s.cur.x + cx; if (by >= 0) s.board[by][bx] = s.cur.color; });
    let cleared = 0;
    s.board = s.board.filter((row) => { const full = row.every((c) => c); if (full) cleared++; return !full; });
    while (s.board.length < ROWS) s.board.unshift(Array(COLS).fill(null));
    if (cleared) s.lines += cleared;
    if (s.lines >= SPRINT_LINES) {
      s.status = 'won'; s.finishMs = Date.now() - s.startTime;
      if (!s.saved) { s.saved = true; setScores(saveScore(s.finishMs)); }
      return;
    }
    const t = s.queue.shift(); ensureQueue(s); s.cur = spawn(t); s.canHold = true;
    if (collides(s.board, s.cur.cells, s.cur.x, s.cur.y)) s.status = 'topout';
  };

  const move = (dx, dy) => {
    const s = g.current; if (s.status !== 'playing') return false;
    if (!collides(s.board, s.cur.cells, s.cur.x + dx, s.cur.y + dy)) { s.cur.x += dx; s.cur.y += dy; rerender(); return true; }
    if (dy > 0) { lockAndNext(); rerender(); return false; }
    return false;
  };
  const rotate = () => {
    const s = g.current; if (s.status !== 'playing') return;
    const nc = rotateCells(s.cur.cells, s.cur.size);
    for (const k of [0, -1, 1, -2, 2]) { if (!collides(s.board, nc, s.cur.x + k, s.cur.y)) { s.cur.cells = nc; s.cur.x += k; rerender(); return; } }
  };
  const hardDrop = () => {
    const s = g.current; if (s.status !== 'playing') return;
    let d = 0; while (!collides(s.board, s.cur.cells, s.cur.x, s.cur.y + d + 1)) d++;
    s.cur.y += d; lockAndNext(); rerender();
  };
  const holdPiece = () => {
    const s = g.current; if (s.status !== 'playing' || !s.canHold) return;
    const curType = s.cur.type;
    if (s.hold == null) { s.hold = curType; const t = s.queue.shift(); ensureQueue(s); s.cur = spawn(t); }
    else { const h = s.hold; s.hold = curType; s.cur = spawn(h); }
    s.canHold = false;
    if (collides(s.board, s.cur.cells, s.cur.x, s.cur.y)) s.status = 'topout';
    rerender();
  };

  // gravity loop (constant sprint speed)
  React.useEffect(() => {
    if (g.current.status !== 'playing') return;
    const id = setInterval(() => { if (g.current.status === 'playing') move(0, 1); }, 800);
    return () => clearInterval(id);
  }, [g.current.status]);

  // timer tick
  React.useEffect(() => {
    if (g.current.status !== 'playing') return;
    const id = setInterval(() => setClock(Date.now()), 50);
    return () => clearInterval(id);
  }, [g.current.status]);

  // keyboard
  React.useEffect(() => {
    const onKey = (e) => {
      const k = e.key;
      if (['ArrowLeft','ArrowRight','ArrowUp','ArrowDown',' '].includes(k)) e.preventDefault();
      if (k === 'Escape') { onClose(); return; }
      const st = g.current.status;
      if (st === 'ready') { if (k === 'Enter' || k === ' ') startGame(); return; }
      if (st === 'won' || st === 'topout') { if (k === 'Enter' || k === ' ') startGame(); return; }
      if (k === 'ArrowLeft') move(-1, 0);
      else if (k === 'ArrowRight') move(1, 0);
      else if (k === 'ArrowDown') move(0, 1);
      else if (k === 'ArrowUp') rotate();
      else if (k === ' ') hardDrop();
      else if (k === 'Shift') holdPiece();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const s = g.current;
  const linesLeft = Math.max(0, SPRINT_LINES - s.lines);
  const elapsed = s.status === 'won' ? s.finishMs : (s.status === 'playing' ? Date.now() - s.startTime : 0);

  // build display grid (board + ghost + active piece)
  const disp = s.board.map((row) => row.slice());
  if (s.cur) {
    let gd = 0; while (!collides(s.board, s.cur.cells, s.cur.x, s.cur.y + gd + 1)) gd++;
    s.cur.cells.forEach(([cx,cy]) => { const by = s.cur.y + gd + cy, bx = s.cur.x + cx; if (by >= 0 && !disp[by][bx]) disp[by][bx] = `ghost-${s.cur.color}`; });
    s.cur.cells.forEach(([cx,cy]) => { const by = s.cur.y + cy, bx = s.cur.x + cx; if (by >= 0) disp[by][bx] = s.cur.color; });
  }
  const cells = [];
  for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) {
    const v = disp[y][x];
    const ghost = typeof v === 'string' && v.startsWith('ghost-');
    const color = ghost ? v.slice(6) : v;
    cells.push(<div key={`${x},${y}`} style={{
      width: CELL, height: CELL,
      background: ghost ? 'transparent' : (color ? `var(--piece-${color})` : 'rgba(255,255,255,0.015)'),
      boxShadow: ghost ? `inset 0 0 0 2px color-mix(in srgb, var(--piece-${color}) 45%, transparent)`
        : (color ? 'inset 2px 2px 0 rgba(255,255,255,0.35), inset -2px -2px 0 rgba(0,0,0,0.35)' : 'inset 0 0 0 1px rgba(255,255,255,0.03)'),
    }} />);
  }

  const panel = { background: 'var(--ink-1000)', border: '2px solid var(--border-strong)' };
  const panelHead = { fontFamily: 'var(--font-pixel)', fontSize: 10, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12, textAlign: 'center' };
  const bigStat = (label, val, color) => (
    <div style={{ flex: 1, ...panel, padding: '12px 8px', textAlign: 'center' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em', color: 'var(--text-faint)', textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-pixel)', fontSize: 18, color, marginTop: 8 }}>{val}</div>
    </div>
  );

  return (
    <div onClick={(e) => { if (e.target === e.currentTarget) onClose(); }} style={{
      position: 'fixed', inset: 0, zIndex: 9500, display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(5,5,9,0.86)', backdropFilter: 'blur(6px)', padding: 20,
    }}>
     <div style={{ display: 'flex', gap: 18, alignItems: 'stretch', flexWrap: 'wrap', justifyContent: 'center' }}>

      {/* left rail — HOLD on top */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: 92 }}>
        <button onClick={holdPiece} title="Hold (Shift)" style={{
          ...panel, padding: 12, cursor: s.status === 'playing' ? 'pointer' : 'default',
          opacity: s.canHold ? 1 : 0.45, borderColor: s.canHold && s.hold ? 'var(--piece-t)' : 'var(--border-strong)',
        }}>
          <div style={panelHead}>Hold</div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 32 }}>
            {s.hold ? <MiniPiece type={s.hold} /> : <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-faint)' }}>SHIFT</span>}
          </div>
        </button>
      </div>

      {/* center — board + timer/lines beneath */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
        <div style={{ position: 'relative', padding: 6, background: 'var(--ink-1000)', backgroundImage: 'var(--grid-bg)', border: '4px solid var(--border-strong)', boxShadow: 'var(--shadow-soft)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${COLS}, ${CELL}px)`, gap: 0 }}>{cells}</div>
          {s.status === 'ready' && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18, background: 'rgba(5,5,9,0.8)', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-pixel)', fontSize: 16, color: 'var(--piece-o)', textTransform: 'uppercase', textShadow: '0 3px 0 rgba(0,0,0,0.5)' }}>20-Line Sprint</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', maxWidth: 180, lineHeight: 1.6 }}>Clear 20 lines as fast as you can.</div>
              <TJButton size="md" onClick={startGame} style={{ '--b': 'var(--piece-o)', '--b-lit': 'var(--piece-o-lit)', '--b-dim': 'var(--piece-o-dim)', color: 'var(--text-on-piece)' }}>Start</TJButton>
            </div>
          )}
          {s.status === 'won' && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, background: 'rgba(5,5,9,0.86)' }}>
              <div style={{ fontFamily: 'var(--font-pixel)', fontSize: 18, color: 'var(--piece-s)', textTransform: 'uppercase', textShadow: '0 3px 0 rgba(0,0,0,0.5)' }}>Finish!</div>
              <div style={{ fontFamily: 'var(--font-pixel)', fontSize: 26, color: 'var(--piece-o)' }}>{fmtTime(s.finishMs)}</div>
              <TJButton variant="success" size="sm" onClick={startGame}>Play Again</TJButton>
            </div>
          )}
          {s.status === 'topout' && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, background: 'rgba(5,5,9,0.86)' }}>
              <div style={{ fontFamily: 'var(--font-pixel)', fontSize: 18, color: 'var(--piece-z)', textTransform: 'uppercase', textShadow: '0 3px 0 rgba(0,0,0,0.5)' }}>Top Out</div>
              <TJButton variant="danger" size="sm" onClick={startGame}>Retry</TJButton>
            </div>
          )}
        </div>
        {/* timer + lines-left beneath the box */}
        <div style={{ display: 'flex', gap: 10, width: COLS * CELL + 12 }}>
          {bigStat('Lines Left', linesLeft, linesLeft === 0 ? 'var(--piece-s)' : 'var(--piece-i)')}
          {bigStat('Time', fmtTime(elapsed), 'var(--piece-o)')}
        </div>
      </div>

      {/* right rail — NEXT (5) + controls */}
      <div style={{ width: 96, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ ...panel, padding: 12 }}>
          <div style={panelHead}>Next</div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
            {s.queue.slice(0, 5).map((t, i) => <MiniPiece key={i} type={t} cell={i === 0 ? 13 : 11} />)}
          </div>
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, lineHeight: 1.8, color: 'var(--text-faint)', textAlign: 'center' }}>
          ← → MOVE<br/>↑ ROTATE<br/>↓ SOFT DROP<br/>SPACE HARD<br/>SHIFT HOLD<br/>ESC QUIT
        </div>
      </div>

      {/* leaderboard — sorted by fastest time */}
      <div style={{ width: 250, padding: 18, background: 'color-mix(in srgb, var(--ink-1000) 92%, transparent)', border: '2px solid var(--border-strong)', boxShadow: 'var(--shadow-soft)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontFamily: 'var(--font-pixel)', fontSize: 11, color: 'var(--text-strong)', textTransform: 'uppercase', textAlign: 'center', paddingBottom: 14, borderBottom: '2px solid var(--border-hairline)' }}>Fastest Sprints</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 12 }}>
          {scores.map((row, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px',
              background: row.you ? 'color-mix(in srgb, var(--piece-i) 16%, transparent)' : 'transparent',
              border: row.you ? '2px solid var(--piece-i)' : '2px solid transparent' }}>
              <span style={{ fontFamily: 'var(--font-pixel)', fontSize: 11, color: i === 0 ? 'var(--piece-o)' : 'var(--text-faint)', width: 26 }}>{String(i+1).padStart(2,'0')}</span>
              <span style={{ fontFamily: 'var(--font-pixel)', fontSize: 11, color: row.you ? 'var(--piece-i)' : 'var(--text-body)', flex: 1 }}>{row.name}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: 'var(--text-strong)' }}>{fmtTime(row.ms)}</span>
            </div>
          ))}
        </div>
        <button onClick={onClose} style={{ marginTop: 'auto', fontFamily: 'var(--font-pixel)', fontSize: 10, textTransform: 'uppercase', color: 'var(--text-muted)', background: 'transparent', border: '2px solid var(--border-strong)', padding: '12px', cursor: 'pointer', borderRadius: 'var(--radius-1)' }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--piece-z)'; e.currentTarget.style.color = 'var(--piece-z)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
        >✕ Close [esc]</button>
      </div>
     </div>
    </div>
  );
}

/* ---- HOLD box (left rail of the site) ------------------------------------ */
function HoldBox({ onPlay }) {
  return (
    <aside style={{
      position: 'fixed', top: '50%', left: 22, transform: 'translateY(-50%)', zIndex: 100,
      display: 'flex', flexDirection: 'column', gap: 12, padding: 16, width: 224,
      background: 'color-mix(in srgb, var(--ink-1000) 90%, transparent)', backdropFilter: 'blur(8px)',
      border: '2px solid var(--border-strong)', borderRadius: 'var(--radius-1)', boxShadow: 'var(--shadow-soft)',
    }}>
      <div style={{ fontFamily: 'var(--font-pixel)', fontSize: 13, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'center', padding: '4px 0 12px', borderBottom: '2px solid var(--border-hairline)' }}>Hold</div>
      <button onClick={onPlay} title="Play Tetris" style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, width: '100%', padding: '20px 14px', cursor: 'pointer',
        backgroundColor: 'color-mix(in srgb, var(--piece-t) 20%, var(--bg-well))', borderWidth: '2px', borderStyle: 'solid',
        borderColor: 'var(--piece-t)', borderRadius: 'var(--radius-1)', boxShadow: '0 0 14px color-mix(in srgb, var(--piece-t) 45%, transparent)',
      }}
        onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 0 22px color-mix(in srgb, var(--piece-t) 60%, transparent)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 0 14px color-mix(in srgb, var(--piece-t) 45%, transparent)'; }}
      >
        <TJTetromino piece="t" size={14} bob />
        <span style={{ fontFamily: 'var(--font-pixel)', fontSize: 14, color: 'var(--text-strong)', textTransform: 'uppercase' }}>Play</span>
      </button>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-faint)', textAlign: 'center', lineHeight: 1.6 }}>20-line sprint — beat the fastest time</div>
    </aside>
  );
}

Object.assign(window, { HoldBox, TetrisGame });
