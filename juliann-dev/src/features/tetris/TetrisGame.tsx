import { useRef, useState, useEffect, useCallback, forwardRef } from 'react'
import { Icon } from '@iconify/react'
import { Button } from '../../components/ds/Button'
import { Tetromino } from '../../components/ds/Tetromino'
import { SFX } from '../../audio/soundEngine'

// ---- piece data -------------------------------------------------------
type PieceKey = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L'
type ColorKey = 'i' | 'o' | 't' | 's' | 'z' | 'j' | 'l'

const TET_PIECES: Record<PieceKey, { size: number; color: ColorKey; cells: [number, number][] }> = {
  I: { size: 4, color: 'i', cells: [[0,1],[1,1],[2,1],[3,1]] },
  O: { size: 2, color: 'o', cells: [[0,0],[1,0],[0,1],[1,1]] },
  T: { size: 3, color: 't', cells: [[1,0],[0,1],[1,1],[2,1]] },
  S: { size: 3, color: 's', cells: [[1,0],[2,0],[0,1],[1,1]] },
  Z: { size: 3, color: 'z', cells: [[0,0],[1,0],[1,1],[2,1]] },
  J: { size: 3, color: 'j', cells: [[0,0],[0,1],[1,1],[2,1]] },
  L: { size: 3, color: 'l', cells: [[2,0],[0,1],[1,1],[2,1]] },
}
const TET_KEYS: PieceKey[] = ['I','O','T','S','Z','J','L']

const rotateCells = (cells: [number,number][], size: number): [number,number][] =>
  cells.map(([x,y]) => [size - 1 - y, x])

const shuffled = (): PieceKey[] => {
  const a = [...TET_KEYS]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// ---- board -------------------------------------------------------
const COLS = 10, ROWS = 20, SPRINT_LINES = 20
type Cell = ColorKey | `ghost-${ColorKey}` | null
const emptyBoard = (): Cell[][] => Array.from({ length: ROWS }, () => Array(COLS).fill(null))

interface ActivePiece {
  type: PieceKey; color: ColorKey; size: number
  cells: [number,number][]; x: number; y: number
}

const spawn = (type: PieceKey): ActivePiece => {
  const p = TET_PIECES[type]
  return { type, color: p.color, size: p.size, cells: p.cells.map(c => [...c] as [number,number]), x: Math.floor((COLS - p.size) / 2), y: 0 }
}

const collides = (board: Cell[][], cells: [number,number][], x: number, y: number): boolean =>
  cells.some(([cx,cy]) => {
    const bx = x + cx, by = y + cy
    if (bx < 0 || bx >= COLS || by >= ROWS) return true
    if (by >= 0 && board[by][bx]) return true
    return false
  })

// ---- time -------------------------------------------------------
const fmtTime = (ms: number | null): string => {
  if (ms == null) return '--:--'
  const cs = Math.floor((ms % 1000) / 10)
  const s = Math.floor(ms / 1000) % 60
  const m = Math.floor(ms / 60000)
  return `${m}:${String(s).padStart(2,'0')}.${String(cs).padStart(2,'0')}`
}

// ---- leaderboard -------------------------------------------------------
interface ScoreEntry { name: string; ms: number; you?: boolean }
const SCORES_KEY = 'tj-tetris-sprint'

// Set this to your leaderboard API URL when deploying to production.
// Leave empty to use localStorage only (works for local dev and testing).
// Expected API contract:
//   GET  {LEADERBOARD_API}/scores           -> ScoreEntry[]  (top 20, sorted by ms asc)
//   POST {LEADERBOARD_API}/scores  { name, ms } -> { rank: number }
const LEADERBOARD_API = ''

const DEFAULT_SCORES: ScoreEntry[] = [
  { name: 'DAN', ms: 19540 },
  { name: 'ACE', ms: 24180 },
  { name: 'NEO', ms: 28610 },
  { name: 'SKY', ms: 32400 },
  { name: 'JUL', ms: 37200 },
  { name: 'ADA', ms: 42800 },
  { name: 'PIX', ms: 49100 },
  { name: 'BIT', ms: 58300 },
  { name: 'CPU', ms: 67900 },
  { name: 'MAX', ms: 79400 },
  { name: 'ZOE', ms: 93200 },
  { name: 'KAI', ms: 109600 },
  { name: 'MON', ms: 128700 },
  { name: 'RYU', ms: 151200 },
  { name: 'LUX', ms: 177400 },
  { name: 'SAM', ms: 208900 },
  { name: 'TOM', ms: 244300 },
  { name: 'KIM', ms: 285600 },
  { name: 'PAT', ms: 330100 },
  { name: 'NWB', ms: 384700 },
]

function loadScores(): ScoreEntry[] {
  try {
    const s = JSON.parse(localStorage.getItem(SCORES_KEY) ?? 'null')
    if (Array.isArray(s) && s.length) return s
  } catch {}
  return DEFAULT_SCORES
}

function saveScore(name: string, ms: number): { list: ScoreEntry[]; rank: number } {
  const trimmed = name.trim().toUpperCase().slice(0, 3) || 'AAA'
  const existing = loadScores().map(r => ({ name: r.name, ms: r.ms }))
  const youEntry = { name: trimmed, ms, you: true as const }
  const all = [...existing, youEntry].sort((a, b) => a.ms - b.ms)
  const rank = all.indexOf(youEntry) + 1
  // persist top 20 without the you flag
  try { localStorage.setItem(SCORES_KEY, JSON.stringify(all.slice(0, 20).map(({ name: n, ms: m }) => ({ name: n, ms: m })))) } catch {}
  // display list: top 20, marking your entry if it made it in
  const list = all.slice(0, 20).map(r => r === youEntry ? { name: r.name, ms: r.ms, you: true } : { name: r.name, ms: r.ms })
  return { list, rank }
}

async function fetchLiveScores(): Promise<ScoreEntry[] | null> {
  if (!LEADERBOARD_API) return null
  try {
    const res = await fetch(`${LEADERBOARD_API}/scores`)
    if (!res.ok) return null
    return await res.json()
  } catch { return null }
}

async function postLiveScore(name: string, ms: number): Promise<number | null> {
  if (!LEADERBOARD_API) return null
  try {
    const res = await fetch(`${LEADERBOARD_API}/scores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, ms }),
    })
    if (!res.ok) return null
    const data = await res.json()
    return data.rank ?? null
  } catch { return null }
}

// ---- achievements -------------------------------------------------------
const ACH_KEY = 'tj-tetris-achievements'
const RANK_DEPTH = 20 // matches the leaderboard's persisted depth, used as the denominator for rank-based progress

interface AchStats {
  gamesPlayed: number
  sprintsCompleted: number
  bestRank: number | null
  bestMs: number | null
  tetrisClears: number
  perfectClears: number
  tSpins: number
  backToBackTetris: boolean
  noHoldClear: boolean
  sub60Clear: boolean
  closeCallClear: boolean
  quickTetrisClear: boolean
  unlocked: string[]
}

const DEFAULT_ACH_STATS: AchStats = {
  gamesPlayed: 0, sprintsCompleted: 0, bestRank: null, bestMs: null,
  tetrisClears: 0, perfectClears: 0, tSpins: 0,
  backToBackTetris: false, noHoldClear: false, sub60Clear: false,
  closeCallClear: false, quickTetrisClear: false,
  unlocked: [],
}

function loadAchStats(): AchStats {
  try { const s = JSON.parse(localStorage.getItem(ACH_KEY) ?? 'null'); if (s) return { ...DEFAULT_ACH_STATS, ...s } } catch {}
  return { ...DEFAULT_ACH_STATS }
}
function saveAchStats(s: AchStats) { try { localStorage.setItem(ACH_KEY, JSON.stringify(s)) } catch {} }

interface Achievement {
  id: string; title: string; desc: string; piece: ColorKey; icon: string
  progress?: (s: AchStats) => number // 0..1, only present for count/rank-style achievements
  unlocked: (s: AchStats) => boolean
}

// Rough heuristic for "how close" a rank-based achievement is: rank 1 -> 1, rank RANK_DEPTH+1 (off the
// list entirely) -> 0, scaled so the target rank itself already reads as fully complete.
const rankProgress = (bestRank: number | null, target: number): number => {
  if (bestRank == null) return 0
  if (bestRank <= target) return 1
  return Math.max(0, Math.min(1, (RANK_DEPTH + 1 - bestRank) / (RANK_DEPTH + 1 - target)))
}

const ACHIEVEMENTS: Achievement[] = [
  // Piece colors below are chosen so that no two tiles sharing an edge in the 4-column grid
  // (horizontally or vertically) end up the same color.
  { id: 'first-clear', title: 'First Clear', desc: 'Complete your first 20-line sprint.', piece: 'o', icon: 'pixelarticons:flag',
    unlocked: (s) => s.sprintsCompleted >= 1 },
  { id: 'regular', title: 'Regular', desc: 'Play 3 games.', piece: 't', icon: 'pixelarticons:repeat',
    progress: (s) => Math.min(1, s.gamesPlayed / 3), unlocked: (s) => s.gamesPlayed >= 3 },
  { id: 'dedicated', title: 'Dedicated', desc: 'Play 10 games.', piece: 's', icon: 'pixelarticons:gamepad',
    progress: (s) => Math.min(1, s.gamesPlayed / 10), unlocked: (s) => s.gamesPlayed >= 10 },
  { id: 'on-the-board', title: 'On the Board', desc: 'Make the leaderboard.', piece: 'z', icon: 'pixelarticons:list',
    progress: (s) => rankProgress(s.bestRank, RANK_DEPTH), unlocked: (s) => s.bestRank != null && s.bestRank <= RANK_DEPTH },
  { id: 'top-10', title: 'Top 10', desc: 'Reach a top 10 sprint time.', piece: 'z', icon: 'pixelarticons:target',
    progress: (s) => rankProgress(s.bestRank, 10), unlocked: (s) => s.bestRank != null && s.bestRank <= 10 },
  { id: 'podium', title: 'Podium', desc: 'Finish in the top 3.', piece: 'j', icon: 'pixelarticons:crown',
    progress: (s) => rankProgress(s.bestRank, 3), unlocked: (s) => s.bestRank != null && s.bestRank <= 3 },
  { id: 'champion', title: 'Champion', desc: 'Take the #1 spot on the leaderboard.', piece: 'l', icon: 'pixelarticons:trophy',
    progress: (s) => rankProgress(s.bestRank, 1), unlocked: (s) => s.bestRank === 1 },
  { id: 'tetris', title: 'Tetris!', desc: 'Clear 4 lines at once.', piece: 'i', icon: 'pixelarticons:zap',
    unlocked: (s) => s.tetrisClears >= 1 },
  { id: 'back-to-back', title: 'Back-to-Back', desc: 'Clear two Tetrises in a row.', piece: 'i', icon: 'pixelarticons:check-double',
    unlocked: (s) => s.backToBackTetris },
  { id: 'perfect-clear', title: 'Perfect Clear', desc: 'Clear every block off the board in one line clear.', piece: 'o', icon: 'pixelarticons:sparkles',
    unlocked: (s) => s.perfectClears >= 1 },
  { id: 't-spin', title: 'T-Spin', desc: 'Clear a line with a T-spin.', piece: 't', icon: 'pixelarticons:reload',
    unlocked: (s) => s.tSpins >= 1 },
  { id: 'speed-demon', title: 'Speed Demon', desc: 'Finish a sprint in under 60 seconds.', piece: 's', icon: 'pixelarticons:fire',
    unlocked: (s) => s.sub60Clear },
  { id: 'no-hold', title: 'No Hold', desc: 'Finish a sprint without using Hold once.', piece: 's', icon: 'pixelarticons:hand',
    unlocked: (s) => s.noHoldClear },
  { id: 'close-call', title: 'Close Call', desc: 'Clear a line while your stack is touching the top row.', piece: 'z', icon: 'pixelarticons:skull',
    unlocked: (s) => s.closeCallClear },
  { id: 'quick-draw', title: 'Quick Draw', desc: 'Score a Tetris within the first 10 seconds.', piece: 'j', icon: 'pixelarticons:speed-fast',
    unlocked: (s) => s.quickTetrisClear },
  { id: 'completionist', title: 'Grandmaster', desc: 'Unlock all 15 other achievements.', piece: 'l', icon: 'pixelarticons:diamond-gem',
    unlocked: (s) => ACHIEVEMENTS.filter((a) => a.id !== 'completionist').every((a) => a.unlocked(s)) },
]

// ---- Achievement tile + modal (MODULE LEVEL — same reconciliation-safety reasoning as the settings sub-components) ----
function AchTile({ a, stats, hovered, onHover }: { a: Achievement; stats: AchStats; hovered: boolean; onHover: () => void }) {
  const unlocked = a.unlocked(stats)
  const progress = a.progress?.(stats) ?? (unlocked ? 1 : 0)
  const c = `var(--piece-${a.piece})`
  return (
    <button
      type="button"
      onMouseEnter={onHover}
      onFocus={onHover}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px 8px', width: '100%', minWidth: 0, height: 118, boxSizing: 'border-box',
        background: unlocked ? `color-mix(in srgb, ${c} 16%, var(--bg-well))` : 'var(--bg-well)',
        border: `2px ${unlocked ? 'solid' : 'dashed'} ${hovered ? c : (unlocked ? c : 'var(--border-strong)')}`,
        borderRadius: 'var(--radius-1)', cursor: 'default',
      }}>
      <div style={{
        width: 32, height: 32, borderRadius: 'var(--radius-1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        background: unlocked ? c : 'transparent',
        boxShadow: unlocked ? 'inset 2px 2px 0 rgba(255,255,255,0.3), inset -2px -2px 0 rgba(0,0,0,0.3)' : `inset 0 0 0 2px ${c}`,
        opacity: unlocked ? 1 : 0.55,
      }}>
        <Icon icon={a.icon} style={{ fontSize: '1rem', color: unlocked ? 'var(--text-on-piece)' : c }} />
      </div>
      <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.5625rem', letterSpacing: '-0.01em', textAlign: 'center', lineHeight: 1.5, height: 28, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: unlocked ? 'var(--text-strong)' : 'var(--text-faint)', textTransform: 'uppercase', overflowWrap: 'break-word' }}>{a.title}</span>
      <div style={{ width: '100%', height: 4, background: 'var(--border-hairline)', borderRadius: 2, overflow: 'hidden', visibility: (a.progress && progress < 1) ? 'visible' : 'hidden' }}>
        <div style={{ height: '100%', width: `${progress * 100}%`, background: c, transition: 'width 200ms' }} />
      </div>
    </button>
  )
}

function AchievementsModal({ stats, onClose }: { stats: AchStats; onClose: () => void }) {
  const [hoveredId, setHoveredId] = useState<string>(ACHIEVEMENTS[0].id)
  const hovered = ACHIEVEMENTS.find((a) => a.id === hoveredId) ?? ACHIEVEMENTS[0]
  const unlockedCount = ACHIEVEMENTS.filter((a) => a.unlocked(stats)).length
  const c = `var(--piece-${hovered.piece})`
  const progress = hovered.progress?.(stats) ?? (hovered.unlocked(stats) ? 1 : 0)

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      style={{ position: 'fixed', inset: 0, zIndex: 9600, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(5,5,9,0.82)', backdropFilter: 'blur(6px)' }}>
      <div style={{ background: 'var(--ink-1000)', border: '2px solid var(--border-strong)', width: 720, maxHeight: '88vh', display: 'flex', flexDirection: 'column', borderRadius: 'var(--radius-1)', overflow: 'hidden', boxShadow: '0 0 40px rgba(0,0,0,0.6)' }}>

        {/* Title bar */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '14px 18px', borderBottom: '2px solid var(--border-strong)', background: 'var(--ink-900)', flexShrink: 0 }}>
          <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.875rem', color: 'var(--text-strong)', textTransform: 'uppercase', flex: 1, letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Icon icon="pixelarticons:trophy" style={{ fontSize: '1.25rem', color: 'var(--piece-o)' }} /> Achievements
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-faint)', textTransform: 'none', letterSpacing: 0 }}>{unlockedCount}/{ACHIEVEMENTS.length}</span>
          </span>
          <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-faint)', cursor: 'pointer', fontSize: '1.25rem', lineHeight: 1, padding: '0 4px' }}>✕</button>
        </div>

        {/* Grid + side detail panel, side by side so the panel's varying content (some
            achievements have a progress bar, some don't) never resizes the modal itself. */}
        <div style={{ display: 'flex', gap: 16, padding: 18, overflow: 'hidden' }}>
          <div style={{ flex: 1, minWidth: 0, display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 10, overflowY: 'auto', alignContent: 'start' }}>
            {ACHIEVEMENTS.map((a) => (
              <AchTile key={a.id} a={a} stats={stats} hovered={hoveredId === a.id} onHover={() => setHoveredId(a.id)} />
            ))}
          </div>

          {/* Detail panel for the hovered/selected achievement — fixed width, and the progress
              bar's space is always reserved (hidden, not removed) so its own height never changes either. */}
          <aside style={{ width: 200, flexShrink: 0, display: 'flex', flexDirection: 'column', padding: '18px 16px', background: 'var(--bg-well)', border: `2px solid ${c}`, borderRadius: 'var(--radius-1)' }}>
            <div style={{
              width: 44, height: 44, borderRadius: 'var(--radius-1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginBottom: 14,
              background: hovered.unlocked(stats) ? c : 'transparent',
              boxShadow: hovered.unlocked(stats) ? 'inset 2px 2px 0 rgba(255,255,255,0.3), inset -2px -2px 0 rgba(0,0,0,0.3)' : `inset 0 0 0 2px ${c}`,
            }}>
              <Icon icon={hovered.icon} style={{ fontSize: '1.375rem', color: hovered.unlocked(stats) ? 'var(--text-on-piece)' : c }} />
            </div>
            <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.75rem', color: c, textTransform: 'uppercase', lineHeight: 1.4 }}>{hovered.title}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 6, color: hovered.unlocked(stats) ? 'var(--piece-s)' : 'var(--text-faint)' }}>
              {hovered.unlocked(stats) ? '✓ Unlocked' : 'Locked'}
            </span>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-muted)', margin: '12px 0 0', lineHeight: 1.6, flex: 1 }}>{hovered.desc}</p>
            <div style={{ marginTop: 12, visibility: (hovered.progress && progress < 1) ? 'visible' : 'hidden' }}>
              <div style={{ height: 6, background: 'var(--border-hairline)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${progress * 100}%`, background: c, transition: 'width 200ms' }} />
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--text-faint)', marginTop: 5, textAlign: 'right' }}>{Math.round(progress * 100)}%</div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

const ACH_CSS = `
@keyframes tj-ach-toast-in { from { transform: translateX(24px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
.tj-ach-toast { animation: tj-ach-toast-in 220ms var(--ease-snap) both; }
`
let achCssInjected = false
function ensureAchCSS() {
  if (!achCssInjected && typeof document !== 'undefined') {
    const s = document.createElement('style'); s.textContent = ACH_CSS; document.head.appendChild(s); achCssInjected = true
  }
}

function AchievementToasts({ toasts }: { toasts: Achievement[] }) {
  if (!toasts.length) return null
  return (
    <div style={{ position: 'fixed', top: 24, right: 24, zIndex: 9750, display: 'flex', flexDirection: 'column', gap: 10, pointerEvents: 'none' }}>
      {toasts.map((a) => (
        <div key={a.id} className="tj-ach-toast" style={{
          display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', minWidth: 220,
          background: 'var(--ink-1000)', border: `2px solid var(--piece-${a.piece})`, borderRadius: 'var(--radius-1)',
          boxShadow: `0 0 24px color-mix(in srgb, var(--piece-${a.piece}) 45%, transparent)`,
        }}>
          <div style={{
            width: 30, height: 30, flexShrink: 0, borderRadius: 'var(--radius-1)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: `var(--piece-${a.piece})`, boxShadow: 'inset 2px 2px 0 rgba(255,255,255,0.3), inset -2px -2px 0 rgba(0,0,0,0.3)',
          }}>
            <Icon icon={a.icon} style={{ fontSize: '0.9375rem', color: 'var(--text-on-piece)' }} />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Achievement Unlocked</div>
            <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.6875rem', color: `var(--piece-${a.piece})`, marginTop: 3, textTransform: 'uppercase' }}>{a.title}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ---- settings -------------------------------------------------------
const SETTINGS_KEY  = 'tj-tetris-settings'
const KEYBINDS_KEY  = 'tj-tetris-keybinds'

interface GameSettings {
  das: number; arr: number; sdf: number
  ghost: boolean; grid: boolean; countdown: boolean; finesse: boolean
  skin: 'bevel' | 'flat' | 'outline'
}

interface KeyBinds {
  left: string; right: string; rotateCW: string; rotateCCW: string
  hardDrop: string; softDrop: string; hold: string; restart: string
}

const DEFAULT_SETTINGS: GameSettings = { das: 133, arr: 33, sdf: 5, ghost: true, grid: true, countdown: false, finesse: false, skin: 'bevel' }
const DEFAULT_KEYBINDS: KeyBinds = { left: 'ArrowLeft', right: 'ArrowRight', rotateCW: 'ArrowUp', rotateCCW: 'z', hardDrop: ' ', softDrop: 'ArrowDown', hold: 'Shift', restart: 'r' }

function loadSettings(): GameSettings {
  try { const s = JSON.parse(localStorage.getItem(SETTINGS_KEY) ?? 'null'); if (s) return { ...DEFAULT_SETTINGS, ...s } } catch {}
  return { ...DEFAULT_SETTINGS }
}
function loadKeybinds(): KeyBinds {
  try { const k = JSON.parse(localStorage.getItem(KEYBINDS_KEY) ?? 'null'); if (k) return { ...DEFAULT_KEYBINDS, ...k } } catch {}
  return { ...DEFAULT_KEYBINDS }
}

function keyLabel(k: string): string {
  const MAP: Record<string, string> = { ArrowLeft: '←', ArrowRight: '→', ArrowUp: '↑', ArrowDown: '↓', ' ': 'Space', Shift: 'Shift', Control: 'Ctrl', Alt: 'Alt', Escape: 'Esc', Enter: 'Enter' }
  return MAP[k] ?? k.toUpperCase()
}

// ---- Settings sub-components (MODULE LEVEL — not inside render fn to avoid React reconciliation bugs) ----
interface TabBtnProps { id: string; current: string; label: string; onSelect: (id: string) => void }
function SettingsTabBtn({ id, current, label, onSelect }: TabBtnProps) {
  const active = id === current
  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      style={{
        flex: 1, padding: '10px 0', fontFamily: 'var(--font-pixel)', fontSize: '0.625rem', textTransform: 'uppercase',
        letterSpacing: '0.06em', cursor: 'pointer', border: 'none',
        background: active ? 'color-mix(in srgb, var(--piece-i) 18%, var(--bg-well))' : 'var(--bg-well)',
        color: active ? 'var(--piece-i)' : 'var(--text-muted)',
        borderBottom: active ? '2px solid var(--piece-i)' : '2px solid transparent',
      }}>
      {label}
    </button>
  )
}

interface SliderRowProps { label: string; val: number; min: number; max: number; step: number; unit: string; onChange: (v: number) => void }
function SettingsSlider({ label, val, min, max, step, unit, onChange }: SliderRowProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border-hairline)' }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)', width: 108, flexShrink: 0 }}>{label}</span>
      <input type="range" min={min} max={max} step={step} value={val}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ flex: 1, accentColor: 'var(--piece-i)', cursor: 'pointer' }} />
      <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.625rem', color: 'var(--piece-i)', width: 52, textAlign: 'right', flexShrink: 0 }}>{val}{unit}</span>
    </div>
  )
}

interface ToggleRowProps { label: string; desc?: string; val: boolean; onChange: (v: boolean) => void }
function SettingsToggle({ label, desc, val, onChange }: ToggleRowProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border-hairline)' }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{label}</div>
        {desc && <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--text-faint)', marginTop: 2 }}>{desc}</div>}
      </div>
      <button type="button" onClick={() => onChange(!val)} style={{
        width: 44, height: 22, borderRadius: 11, border: 'none', cursor: 'pointer', flexShrink: 0,
        background: val ? 'var(--piece-s)' : 'var(--border-strong)', position: 'relative', transition: 'background 140ms',
      }}>
        <span style={{ position: 'absolute', top: 3, left: val ? 23 : 3, width: 16, height: 16, borderRadius: 8, background: 'white', transition: 'left 140ms' }} />
      </button>
    </div>
  )
}

// ---- mini piece preview -------------------------------------------------------
function MiniPiece({ type, cell = 13 }: { type: PieceKey; cell?: number }) {
  const p = TET_PIECES[type]
  const cellsSet = new Set(p.cells.map(([x,y]) => `${x},${y}`))
  const items = []
  for (let y = 0; y < p.size; y++) for (let x = 0; x < p.size; x++) {
    const on = cellsSet.has(`${x},${y}`)
    items.push(<div key={`${x},${y}`} style={{ width: cell, height: cell, background: on ? `var(--piece-${p.color})` : 'transparent', boxShadow: on ? 'inset 2px 2px 0 rgba(255,255,255,0.35), inset -2px -2px 0 rgba(0,0,0,0.35)' : 'none' }} />)
  }
  return <div style={{ display: 'grid', gridTemplateColumns: `repeat(${p.size}, ${cell}px)`, gap: 2 }}>{items}</div>
}

// ---- game state -------------------------------------------------------
type Status = 'ready' | 'playing' | 'won' | 'topout'
interface GameState {
  board: Cell[][]; queue: PieceKey[]; cur: ActivePiece | null
  hold: PieceKey | null; canHold: boolean; lines: number
  status: Status; startTime: number; finishMs: number; saved: boolean
}

const ensureQueue = (s: GameState) => { while (s.queue.length < 8) s.queue.push(...shuffled()) }
const freshState = (status: Status = 'ready'): GameState => {
  const queue = [...shuffled(), ...shuffled()]
  return { board: emptyBoard(), queue, cur: null, hold: null, canHold: true, lines: 0, status, startTime: 0, finishMs: 0, saved: false }
}

// ---- Settings Modal -------------------------------------------------------
const BIND_ACTIONS: { key: keyof KeyBinds; label: string }[] = [
  { key: 'left',      label: 'Move Left'   },
  { key: 'right',     label: 'Move Right'  },
  { key: 'rotateCW',  label: 'Rotate CW'  },
  { key: 'rotateCCW', label: 'Rotate CCW' },
  { key: 'hardDrop',  label: 'Hard Drop'  },
  { key: 'softDrop',  label: 'Soft Drop'  },
  { key: 'hold',      label: 'Hold'       },
  { key: 'restart',   label: 'Restart (hold 3s)' },
]

const SKINS: { id: GameSettings['skin']; label: string; desc: string }[] = [
  { id: 'bevel',   label: 'Bevel',   desc: '3D block effect (default)' },
  { id: 'flat',    label: 'Flat',    desc: 'Solid colour, no bevel'    },
  { id: 'outline', label: 'Outline', desc: 'Transparent with border'   },
]

interface SettingsModalProps {
  settings: GameSettings
  keybinds: KeyBinds
  onSave: (s: GameSettings, k: KeyBinds) => void
  onClose: () => void
}

function SettingsModal({ settings, keybinds, onSave, onClose }: SettingsModalProps) {
  const [tab, setTab] = useState<string>('controls')
  const [s, setS] = useState<GameSettings>({ ...settings })
  const [k, setK] = useState<KeyBinds>({ ...keybinds })
  const [rebinding, setRebinding] = useState<keyof KeyBinds | null>(null)

  useEffect(() => {
    if (!rebinding) return
    const handler = (e: KeyboardEvent) => {
      e.preventDefault(); e.stopPropagation()
      if (e.key === 'Escape') { setRebinding(null); return }
      setK(prev => ({ ...prev, [rebinding]: e.key }))
      setRebinding(null)
    }
    window.addEventListener('keydown', handler, true)
    return () => window.removeEventListener('keydown', handler, true)
  }, [rebinding])

  const panel: React.CSSProperties = { background: 'var(--ink-1000)', border: '2px solid var(--border-strong)' }

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      style={{ position: 'fixed', inset: 0, zIndex: 9600, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(5,5,9,0.82)', backdropFilter: 'blur(6px)' }}>
      <div style={{ ...panel, width: 440, maxHeight: '88vh', display: 'flex', flexDirection: 'column', borderRadius: 'var(--radius-1)', overflow: 'hidden', boxShadow: '0 0 40px rgba(0,0,0,0.6)' }}>

        {/* Title bar */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '12px 18px', borderBottom: '2px solid var(--border-strong)', background: 'var(--ink-900)', flexShrink: 0 }}>
          <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.6875rem', color: 'var(--text-strong)', textTransform: 'uppercase', flex: 1, letterSpacing: '0.04em', display: 'flex', alignItems: 'flex-end', gap: 8 }}><span style={{ fontSize: '1.375rem', lineHeight: 1, marginBottom: 4 }}>⚙</span> SETTINGS</span>
          <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-faint)', cursor: 'pointer', fontSize: '1.125rem', lineHeight: 1, padding: '0 4px' }}>✕</button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '2px solid var(--border-strong)', flexShrink: 0, background: 'var(--bg-well)' }}>
          <SettingsTabBtn id="controls" current={tab} label="Controls" onSelect={setTab} />
          <SettingsTabBtn id="game"     current={tab} label="Game"     onSelect={setTab} />
          <SettingsTabBtn id="skin"     current={tab} label="Skin"     onSelect={setTab} />
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '14px 18px' }}>

          {tab === 'controls' && (
            <div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--text-faint)', margin: '0 0 12px', lineHeight: 1.6 }}>
                Click a key to rebind. Press Esc to cancel.
              </p>
              {BIND_ACTIONS.map(({ key, label }) => (
                <div key={key} style={{ display: 'flex', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border-hairline)' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)', flex: 1 }}>{label}</span>
                  <button
                    type="button"
                    onClick={() => setRebinding(rebinding === key ? null : key)}
                    style={{
                      fontFamily: 'var(--font-pixel)', fontSize: '0.625rem', textTransform: 'uppercase',
                      padding: '5px 12px', cursor: 'pointer', borderRadius: 'var(--radius-1)', minWidth: 80, textAlign: 'center',
                      background: rebinding === key ? 'color-mix(in srgb, var(--piece-o) 22%, transparent)' : 'var(--bg-well)',
                      border: rebinding === key ? '2px solid var(--piece-o)' : '2px solid var(--border-strong)',
                      color: rebinding === key ? 'var(--piece-o)' : 'var(--text-strong)',
                    }}>
                    {rebinding === key ? '· · ·' : keyLabel(k[key])}
                  </button>
                </div>
              ))}
            </div>
          )}

          {tab === 'game' && (
            <div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--text-faint)', margin: '0 0 6px', lineHeight: 1.6 }}>
                Movement timing and gameplay toggles.
              </p>
              <SettingsSlider label="DAS" val={s.das} min={0} max={300} step={1} unit="ms" onChange={(v) => setS(p => ({ ...p, das: v }))} />
              <SettingsSlider label="ARR" val={s.arr} min={0} max={200} step={1} unit="ms" onChange={(v) => setS(p => ({ ...p, arr: v }))} />
              <SettingsSlider label="SDF" val={s.sdf} min={1} max={41} step={1} unit="x"  onChange={(v) => setS(p => ({ ...p, sdf: v }))} />
              <SettingsToggle label="Ghost piece"  desc="Show piece shadow"            val={s.ghost}     onChange={(v) => setS(p => ({ ...p, ghost: v }))}     />
              <SettingsToggle label="Grid lines"   desc="Show board grid"              val={s.grid}      onChange={(v) => setS(p => ({ ...p, grid: v }))}      />
              <SettingsToggle label="Countdown"    desc="3-2-1 before game starts"     val={s.countdown} onChange={(v) => setS(p => ({ ...p, countdown: v }))} />
              <SettingsToggle label="Finesse mode" desc="Highlight suboptimal moves"   val={s.finesse}   onChange={(v) => setS(p => ({ ...p, finesse: v }))}   />
              <div style={{ marginTop: 14, fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--text-faint)', lineHeight: 2 }}>
                <b style={{ color: 'var(--text-muted)' }}>DAS</b>: delay before auto-repeat (Jstris default: 133ms)<br />
                <b style={{ color: 'var(--text-muted)' }}>ARR</b>: speed of auto-repeat (Jstris default: 33ms)<br />
                <b style={{ color: 'var(--text-muted)' }}>SDF</b>: soft drop multiplier (Jstris default: 5x, 41=infinity)
              </div>
            </div>
          )}

          {tab === 'skin' && (
            <div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--text-faint)', margin: '0 0 14px', lineHeight: 1.6 }}>
                Choose how blocks are rendered on the board.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {SKINS.map((skin) => (
                  <button key={skin.id} type="button" onClick={() => setS(p => ({ ...p, skin: skin.id }))}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 16, padding: '14px 16px', cursor: 'pointer',
                      borderRadius: 'var(--radius-1)', textAlign: 'left',
                      background: s.skin === skin.id ? 'color-mix(in srgb, var(--piece-i) 14%, var(--bg-well))' : 'var(--bg-well)',
                      border: s.skin === skin.id ? '2px solid var(--piece-i)' : '2px solid var(--border-strong)',
                    }}>
                    <div style={{ display: 'flex', gap: 3, flexShrink: 0 }}>
                      {(['i','o','t','s','z'] as const).map((c) => (
                        <div key={c} style={{
                          width: 20, height: 20,
                          background: skin.id === 'outline' ? 'transparent' : `var(--piece-${c})`,
                          border: skin.id !== 'bevel' ? `2px solid var(--piece-${c})` : 'none',
                          boxShadow: skin.id === 'bevel' ? 'inset 2px 2px 0 rgba(255,255,255,0.35), inset -2px -2px 0 rgba(0,0,0,0.35)' : 'none',
                        }} />
                      ))}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.625rem', color: s.skin === skin.id ? 'var(--piece-i)' : 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 3 }}>{skin.label}</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-faint)' }}>{skin.desc}</div>
                    </div>
                    {s.skin === skin.id && <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.6875rem', color: 'var(--piece-s)', flexShrink: 0 }}>✓</span>}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', gap: 10, padding: '12px 18px', borderTop: '2px solid var(--border-strong)', background: 'var(--ink-900)', flexShrink: 0 }}>
          <button type="button" onClick={() => { setS({ ...DEFAULT_SETTINGS }); setK({ ...DEFAULT_KEYBINDS }) }}
            style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.5625rem', textTransform: 'uppercase', padding: '8px 12px', cursor: 'pointer', background: 'transparent', border: '2px solid var(--border-strong)', color: 'var(--text-muted)', borderRadius: 'var(--radius-1)' }}>
            Reset All
          </button>
          <div style={{ flex: 1 }} />
          <button type="button" onClick={() => { onSave(s, k); onClose() }}
            style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.625rem', textTransform: 'uppercase', padding: '8px 20px', cursor: 'pointer', background: 'var(--piece-s)', border: '2px solid var(--piece-s)', color: 'var(--text-on-piece)', borderRadius: 'var(--radius-1)', boxShadow: 'inset 2px 2px 0 rgba(255,255,255,0.25), inset -2px -2px 0 rgba(0,0,0,0.25)' }}>
            Save & Close
          </button>
        </div>
      </div>
    </div>
  )
}

// ---- TetrisGame -------------------------------------------------------
export function TetrisGame({ onClose }: { onClose: () => void }) {
  const CELL = 20
  const g = useRef<GameState>(freshState('ready'))
  const [, force] = useState(0)
  const [, setClock] = useState(0)
  const rerender = useCallback(() => force(n => n + 1), [])
  const [scores, setScores] = useState<ScoreEntry[]>(loadScores)
  const [myResult, setMyResult] = useState<{ name: string; ms: number; rank: number } | null>(null)
  const [settings, setSettings] = useState<GameSettings>(loadSettings)
  const [keybinds, setKeybinds] = useState<KeyBinds>(loadKeybinds)
  const [showSettings, setShowSettings] = useState(false)
  const [enteringInitials, setEnteringInitials] = useState(false)
  const [initials, setInitials] = useState('')
  const [restartProgress, setRestartProgress] = useState(0)
  const yourRowRef = useRef<HTMLDivElement>(null)

  const dasTimer  = useRef<ReturnType<typeof setTimeout> | null>(null)
  const arrTimer  = useRef<ReturnType<typeof setInterval> | null>(null)
  const softTimer = useRef<ReturnType<typeof setInterval> | null>(null)
  const restartInterval = useRef<ReturnType<typeof setInterval> | null>(null)
  const restartStart = useRef<number | null>(null)

  // Achievements
  ensureAchCSS()
  const achRef = useRef<AchStats>(loadAchStats())
  const usedHoldRef = useRef(false)
  const lastActionWasRotateRef = useRef(false)
  const lastClearWasTetrisRef = useRef(false)
  const [, setAchTick] = useState(0)
  const [showAchievements, setShowAchievements] = useState(false)
  const [toasts, setToasts] = useState<Achievement[]>([])

  const checkAchievements = useCallback(() => {
    const s = achRef.current
    // Loop until stable so a meta-achievement (e.g. "unlock everything else") can cascade in
    // the same pass as the last regular achievement it depends on.
    let newly: Achievement[] = []
    for (;;) {
      const found = ACHIEVEMENTS.filter((a) => !s.unlocked.includes(a.id) && a.unlocked(s))
      if (!found.length) break
      s.unlocked = [...s.unlocked, ...found.map((a) => a.id)]
      newly = newly.concat(found)
    }
    if (newly.length) {
      setToasts((t) => [...t, ...newly])
      newly.forEach((a) => { setTimeout(() => setToasts((t) => t.filter((x) => x.id !== a.id)), 4200) })
    }
    saveAchStats(s)
    setAchTick((v) => v + 1)
  }, [])

  const startGame = useCallback(() => {
    const s = freshState('playing')
    const t = s.queue.shift()!; ensureQueue(s)
    s.cur = spawn(t); s.startTime = Date.now()
    g.current = s; setEnteringInitials(false); setInitials(''); setRestartProgress(0); setClock(Date.now())
    usedHoldRef.current = false; lastActionWasRotateRef.current = false; lastClearWasTetrisRef.current = false
    achRef.current.gamesPlayed++
    checkAchievements()
    rerender()
  }, [rerender, checkAchievements])

  const lockAndNext = useCallback(() => {
    const s = g.current
    SFX.lock()
    // T-spin check happens against the board as it stood before this piece merges in — a T piece
    // whose last successful action was a rotation, snugly wedged into a slot with 3+ blocked corners.
    const isTSpin = s.cur!.type === 'T' && lastActionWasRotateRef.current && (() => {
      const corners: [number, number][] = [[0, 0], [2, 0], [0, 2], [2, 2]]
      let blocked = 0
      for (const [cx, cy] of corners) {
        const bx = s.cur!.x + cx, by = s.cur!.y + cy
        if (bx < 0 || bx >= COLS || by >= ROWS || (by >= 0 && s.board[by][bx])) blocked++
      }
      return blocked >= 3
    })()
    s.cur!.cells.forEach(([cx,cy]) => {
      const by = s.cur!.y + cy, bx = s.cur!.x + cx
      if (by >= 0) (s.board[by][bx] as ColorKey) = s.cur!.color
    })
    // Stack height right at lock time, before the clear removes any rows — used for "Close Call".
    const toppedOut = s.board[0].some((c) => c)
    let cleared = 0
    s.board = s.board.filter(row => { const full = row.every(c => c); if (full) cleared++; return !full })
    while (s.board.length < ROWS) s.board.unshift(Array(COLS).fill(null))
    s.lines += cleared
    if (cleared === 4) SFX.tetris(); else if (cleared > 0) SFX.clear()

    const as = achRef.current
    if (cleared > 0) {
      if (cleared === 4) {
        as.tetrisClears++
        if (lastClearWasTetrisRef.current) as.backToBackTetris = true
        lastClearWasTetrisRef.current = true
        if (Date.now() - s.startTime < 10000) as.quickTetrisClear = true
      } else {
        lastClearWasTetrisRef.current = false
      }
      if (isTSpin) as.tSpins++
      if (s.board.every(row => row.every(c => !c))) as.perfectClears++
      if (toppedOut) as.closeCallClear = true
    }

    if (s.lines >= SPRINT_LINES) {
      s.status = 'won'; s.finishMs = Date.now() - s.startTime; SFX.win(); setEnteringInitials(true)
      as.sprintsCompleted++
      if (!usedHoldRef.current) as.noHoldClear = true
      if (s.finishMs < 60000) as.sub60Clear = true
      checkAchievements()
      return
    }
    checkAchievements()
    const t = s.queue.shift()!; ensureQueue(s); s.cur = spawn(t); s.canHold = true
    if (collides(s.board, s.cur.cells, s.cur.x, s.cur.y)) { s.status = 'topout'; SFX.gameOver() }
  }, [checkAchievements])

  const move = useCallback((dx: number, dy: number): boolean => {
    const s = g.current; if (s.status !== 'playing') return false
    if (!collides(s.board, s.cur!.cells, s.cur!.x + dx, s.cur!.y + dy)) {
      s.cur!.x += dx; s.cur!.y += dy
      if (dx !== 0) lastActionWasRotateRef.current = false
      rerender(); return true
    }
    if (dy > 0) { lockAndNext(); rerender(); return false }
    return false
  }, [rerender, lockAndNext])

  const rotate = useCallback(() => {
    const s = g.current; if (s.status !== 'playing') return
    const nc = rotateCells(s.cur!.cells, s.cur!.size)
    for (const k of [0, -1, 1, -2, 2]) {
      if (!collides(s.board, nc, s.cur!.x + k, s.cur!.y)) { s.cur!.cells = nc; s.cur!.x += k; lastActionWasRotateRef.current = true; SFX.rotate(); rerender(); return }
    }
  }, [rerender])

  const hardDrop = useCallback(() => {
    const s = g.current; if (s.status !== 'playing') return
    let d = 0; while (!collides(s.board, s.cur!.cells, s.cur!.x, s.cur!.y + d + 1)) d++
    s.cur!.y += d; SFX.hardDrop(); lockAndNext(); rerender()
  }, [rerender, lockAndNext])

  const holdPiece = useCallback(() => {
    const s = g.current; if (s.status !== 'playing' || !s.canHold) return
    const curType = s.cur!.type
    usedHoldRef.current = true
    if (s.hold == null) { s.hold = curType; const t = s.queue.shift()!; ensureQueue(s); s.cur = spawn(t) }
    else { const h = s.hold; s.hold = curType; s.cur = spawn(h) }
    s.canHold = false; SFX.hold()
    if (collides(s.board, s.cur.cells, s.cur.x, s.cur.y)) { g.current.status = 'topout'; SFX.gameOver() }
    rerender()
  }, [rerender])

  const stopAutoRepeat = useCallback(() => {
    if (dasTimer.current) { clearTimeout(dasTimer.current); dasTimer.current = null }
    if (arrTimer.current) { clearInterval(arrTimer.current); arrTimer.current = null }
  }, [])

  const stopSoftDrop = useCallback(() => {
    if (softTimer.current) { clearInterval(softTimer.current); softTimer.current = null }
  }, [])

  const beginRestartHold = useCallback(() => {
    if (restartInterval.current || g.current.status !== 'playing') return
    restartStart.current = Date.now()
    setRestartProgress(0.1)
    restartInterval.current = setInterval(() => {
      const elapsed = Date.now() - (restartStart.current ?? Date.now())
      const pct = Math.min(100, (elapsed / 3000) * 100)
      setRestartProgress(pct)
      if (pct >= 100) {
        if (restartInterval.current) { clearInterval(restartInterval.current); restartInterval.current = null }
        restartStart.current = null
        startGame()
      }
    }, 50)
  }, [startGame])

  const cancelRestartHold = useCallback(() => {
    if (restartInterval.current) { clearInterval(restartInterval.current); restartInterval.current = null }
    restartStart.current = null
    setRestartProgress(0)
  }, [])

  // Gravity
  useEffect(() => {
    if (g.current.status !== 'playing') return
    const id = setInterval(() => { if (g.current.status === 'playing') move(0, 1) }, 800)
    return () => clearInterval(id)
  }, [g.current.status, move])

  // Clock
  useEffect(() => {
    if (g.current.status !== 'playing' || showSettings) return
    const id = setInterval(() => setClock(Date.now()), 50)
    return () => clearInterval(id)
  }, [g.current.status, showSettings])

  // Keyboard
  useEffect(() => {
    const settingsRef = { current: showSettings }
    settingsRef.current = showSettings

    const onKeyDown = (e: KeyboardEvent) => {
      if (showSettings || enteringInitials) return
      const k = e.key
      if (['ArrowLeft','ArrowRight','ArrowUp','ArrowDown',' '].includes(k)) e.preventDefault()
      if (k === 'Escape') { onClose(); return }
      const st = g.current.status
      if (st === 'ready' || st === 'topout') { if (k === 'Enter' || k === ' ') startGame(); return }
      if (st === 'won') {
        if (!enteringInitials && (k === 'Enter' || k === ' ')) startGame()
        return
      }
      // playing
      if (k === keybinds.left)       { e.preventDefault(); const s = settings; const arr = s.arr; const das = s.das; move(-1, 0); SFX.move(); stopAutoRepeat(); dasTimer.current = setTimeout(() => { if (arr === 0) { while (move(-1, 0)) { SFX.move() } } else { arrTimer.current = setInterval(() => { move(-1, 0); SFX.move() }, arr) } }, das) }
      else if (k === keybinds.right) { e.preventDefault(); const s = settings; const arr = s.arr; const das = s.das; move(1, 0); SFX.move(); stopAutoRepeat(); dasTimer.current = setTimeout(() => { if (arr === 0) { while (move(1, 0)) { SFX.move() } } else { arrTimer.current = setInterval(() => { move(1, 0); SFX.move() }, arr) } }, das) }
      else if (k === keybinds.rotateCW)  rotate()
      else if (k === keybinds.rotateCCW) rotate()
      else if (k === keybinds.softDrop)  { stopSoftDrop(); const interval = Math.max(1, Math.floor(800 / (settings.sdf === 41 ? 800 : settings.sdf))); softTimer.current = setInterval(() => { move(0, 1); SFX.softDrop() }, interval) }
      else if (k === keybinds.hardDrop)  hardDrop()
      else if (k === keybinds.hold)      holdPiece()
      else if (k.toLowerCase() === keybinds.restart.toLowerCase()) beginRestartHold()
    }

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === keybinds.left || e.key === keybinds.right) stopAutoRepeat()
      if (e.key === keybinds.softDrop) stopSoftDrop()
      if (e.key.toLowerCase() === keybinds.restart.toLowerCase()) cancelRestartHold()
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => { window.removeEventListener('keydown', onKeyDown); window.removeEventListener('keyup', onKeyUp) }
  }, [keybinds, showSettings, enteringInitials, settings, move, rotate, hardDrop, holdPiece, startGame, stopAutoRepeat, stopSoftDrop, beginRestartHold, cancelRestartHold, onClose])

  // On mount, try to load live scores if an API is configured
  useEffect(() => {
    fetchLiveScores().then(live => { if (live?.length) setScores(live) })
  }, [])

  // Auto-scroll leaderboard to user's row whenever it changes
  useEffect(() => {
    if (yourRowRef.current) {
      yourRowRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [scores])

  const handleSaveSettings = (s: GameSettings, k: KeyBinds) => {
    setSettings(s); setKeybinds(k)
    try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(s)); localStorage.setItem(KEYBINDS_KEY, JSON.stringify(k)) } catch {}
  }

  const recordRank = (rank: number, ms: number) => {
    const as = achRef.current
    if (as.bestRank == null || rank < as.bestRank) as.bestRank = rank
    if (as.bestMs == null || ms < as.bestMs) as.bestMs = ms
    checkAchievements()
  }

  const handleSubmitInitials = async () => {
    const name = initials.trim() || 'AAA'
    const s = g.current
    const { list, rank } = saveScore(name, s.finishMs)
    const trimmed = name.trim().toUpperCase().slice(0, 3) || 'AAA'
    setScores(list)
    setMyResult({ name: trimmed, ms: s.finishMs, rank })
    recordRank(rank, s.finishMs)
    // If live API configured, post and refresh
    const liveRank = await postLiveScore(trimmed, s.finishMs)
    if (liveRank !== null) {
      setMyResult(prev => prev ? { ...prev, rank: liveRank } : prev)
      recordRank(liveRank, s.finishMs)
      fetchLiveScores().then(live => { if (live?.length) setScores(live) })
    }
    s.saved = true; setEnteringInitials(false); rerender()
  }

  const st = g.current
  const linesLeft = Math.max(0, SPRINT_LINES - st.lines)
  const elapsed = st.status === 'won' ? st.finishMs : (st.status === 'playing' ? Date.now() - st.startTime : 0)

  // Build display grid
  const disp = st.board.map(row => row.slice()) as Cell[][]
  if (st.cur) {
    let gd = 0; while (!collides(st.board, st.cur.cells, st.cur.x, st.cur.y + gd + 1)) gd++
    if (settings.ghost) st.cur.cells.forEach(([cx,cy]) => { const by = st.cur!.y + gd + cy, bx = st.cur!.x + cx; if (by >= 0 && !disp[by][bx]) disp[by][bx] = `ghost-${st.cur!.color}` as Cell })
    st.cur.cells.forEach(([cx,cy]) => { const by = st.cur!.y + cy, bx = st.cur!.x + cx; if (by >= 0) disp[by][bx] = st.cur!.color })
  }

  const cells = []
  for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) {
    const v = disp[y][x]
    const ghost = typeof v === 'string' && v.startsWith('ghost-')
    const color = ghost ? (v as string).slice(6) : v
    let bg = 'rgba(255,255,255,0.015)'
    let shadow = settings.grid ? 'inset 0 0 0 1px rgba(255,255,255,0.03)' : 'none'
    if (color && !ghost) {
      if (settings.skin === 'bevel')   { bg = `var(--piece-${color})`; shadow = 'inset 2px 2px 0 rgba(255,255,255,0.35), inset -2px -2px 0 rgba(0,0,0,0.35)' }
      if (settings.skin === 'flat')    { bg = `var(--piece-${color})`; shadow = 'none' }
      if (settings.skin === 'outline') { bg = 'transparent'; shadow = `inset 0 0 0 2px var(--piece-${color})` }
    }
    if (ghost && settings.ghost) { bg = 'transparent'; shadow = `inset 0 0 0 2px color-mix(in srgb, var(--piece-${color}) 45%, transparent)` }
    cells.push(<div key={`${x},${y}`} style={{ width: CELL, height: CELL, background: bg, boxShadow: shadow }} />)
  }

  const panel: React.CSSProperties = { background: 'var(--ink-1000)', border: '2px solid var(--border-strong)' }
  const panelHead: React.CSSProperties = { fontFamily: 'var(--font-pixel)', fontSize: '0.625rem', color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12, textAlign: 'center' }

  const BigStat = ({ label, val, color }: { label: string; val: string; color: string }) => (
    <div style={{ flex: 1, ...panel, padding: '12px 8px', textAlign: 'center' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', letterSpacing: '0.14em', color: 'var(--text-faint)', textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '1.125rem', color, marginTop: 8 }}>{val}</div>
    </div>
  )

  return (
    <>
      <div onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
        style={{ position: 'fixed', inset: 0, zIndex: 9500, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(5,5,9,0.86)', backdropFilter: 'blur(6px)', padding: 20 }}>

        <button onClick={() => setShowAchievements(true)} title="Achievements"
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--piece-o)'; e.currentTarget.style.color = 'var(--piece-o)' }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.color = 'var(--text-faint)' }}
          style={{ position: 'absolute', top: 20, right: 20, display: 'flex', alignItems: 'center', gap: 8, padding: '9px 14px', cursor: 'pointer', background: 'var(--ink-1000)', border: '2px solid var(--border-strong)', borderRadius: 'var(--radius-1)', color: 'var(--text-faint)', fontFamily: 'var(--font-pixel)', fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.04em', transition: 'color 140ms, border-color 140ms' }}>
          <Icon icon="pixelarticons:trophy" style={{ fontSize: '0.9375rem' }} />
          Achievements
        </button>

        <div style={{ display: 'flex', gap: 18, alignItems: 'stretch', flexWrap: 'wrap', justifyContent: 'center' }}>

          {/* HOLD */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: 92 }}>
            <button onClick={holdPiece} title={`Hold (${keyLabel(keybinds.hold)})`}
              style={{ ...panel, padding: 12, cursor: st.status === 'playing' ? 'pointer' : 'default', opacity: st.canHold ? 1 : 0.45, borderColor: (st.canHold && st.hold) ? 'var(--piece-t)' : 'var(--border-strong)' }}>
              <div style={panelHead}>Hold</div>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 32 }}>
                {st.hold ? <MiniPiece type={st.hold} /> : <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--text-faint)' }}>{keyLabel(keybinds.hold)}</span>}
              </div>
            </button>
          </div>

          {/* BOARD */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
            <div style={{ position: 'relative', padding: 6, background: 'var(--ink-1000)', border: '4px solid var(--border-strong)', boxShadow: 'var(--shadow-soft)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${COLS}, ${CELL}px)` }}>{cells}</div>

              {st.status === 'ready' && (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18, background: 'rgba(5,5,9,0.8)', textAlign: 'center', padding: 20 }}>
                  <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '1rem', color: 'var(--piece-o)', textTransform: 'uppercase', textShadow: '0 3px 0 rgba(0,0,0,0.5)' }}>20-Line Sprint</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)', maxWidth: 180, lineHeight: 1.6 }}>Clear 20 lines as fast as you can.</div>
                  <Button size="md" onClick={startGame} style={{ '--b': 'var(--piece-o)', '--b-lit': 'var(--piece-o-lit)', '--b-dim': 'var(--piece-o-dim)', color: 'var(--text-on-piece)' } as React.CSSProperties}>Start</Button>
                </div>
              )}
              {st.status === 'won' && !enteringInitials && (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, background: 'rgba(5,5,9,0.86)' }}>
                  <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '1.125rem', color: 'var(--piece-s)', textTransform: 'uppercase' }}>Finish!</div>
                  <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '1.625rem', color: 'var(--piece-o)' }}>{fmtTime(st.finishMs)}</div>
                  <Button variant="success" size="sm" onClick={startGame}>Play Again</Button>
                </div>
              )}
              {st.status === 'topout' && (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, background: 'rgba(5,5,9,0.86)' }}>
                  <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '1.125rem', color: 'var(--piece-o)', textTransform: 'uppercase' }}>Game Over</div>
                  <Button size="sm" onClick={startGame} style={{ '--b': 'var(--piece-o)', '--b-lit': 'var(--piece-o-lit)', '--b-dim': 'var(--piece-o-dim)', color: 'var(--text-on-piece)' } as React.CSSProperties}>Retry</Button>
                </div>
              )}

              {/* Restart hold progress */}
              {st.status === 'playing' && restartProgress > 0 && (
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(5,5,9,0.88)', padding: '10px 14px' }}>
                  <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.5625rem', color: 'var(--piece-z)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6, textAlign: 'center' }}>
                    Hold to restart...
                  </div>
                  <div style={{ height: 5, background: 'var(--bg-well)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${restartProgress}%`, background: 'var(--piece-z)', transition: 'width 50ms linear' }} />
                  </div>
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: 10, width: COLS * CELL + 20 }}>
              <BigStat label="Lines Left" val={String(linesLeft)} color={linesLeft === 0 ? 'var(--piece-s)' : 'var(--piece-i)'} />
              <BigStat label="Time" val={fmtTime(elapsed)} color="var(--piece-o)" />
            </div>
          </div>

          {/* NEXT + controls + settings */}
          <div style={{ width: 96, position: 'relative', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ ...panel, padding: 12 }}>
              <div style={panelHead}>Next</div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
                {st.queue.slice(0, 5).map((t, i) => <MiniPiece key={i} type={t} cell={i === 0 ? 13 : 11} />)}
              </div>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', lineHeight: 1.9, color: 'var(--text-faint)', textAlign: 'center' }}>
              {keyLabel(keybinds.left)}{keyLabel(keybinds.right)} MOVE<br/>
              {keyLabel(keybinds.rotateCW)} ROTATE<br/>
              {keyLabel(keybinds.softDrop)} SOFT<br/>
              {keyLabel(keybinds.hardDrop)} HARD<br/>
              {keyLabel(keybinds.hold)} HOLD<br/>
              ESC QUIT
            </div>
            {/* absolutely positioned so it stays bottom-aligned with the Lines Left / Time
                row regardless of how tall the Next preview happens to be for the current queue */}
            <button onClick={() => setShowSettings(true)}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--piece-i)'; e.currentTarget.style.color = 'var(--piece-i)' }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.color = 'var(--text-faint)' }}
              style={{ position: 'absolute', top: ROWS * CELL + 32, left: 0, right: 0, height: 97, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', gap: 9, fontFamily: 'var(--font-pixel)', fontSize: '0.5625rem', textTransform: 'uppercase', color: 'var(--text-faint)', background: 'transparent', border: '2px solid var(--border-strong)', paddingTop: 4, paddingRight: 9, paddingBottom: 9, paddingLeft: 9, cursor: 'pointer', borderRadius: 'var(--radius-1)', letterSpacing: '0.04em' }}>
              <span style={{ fontSize: '2.75rem', lineHeight: 1 }}>⚙</span>
              <span>Settings</span>
            </button>
          </div>

          {/* LEADERBOARD */}
          <div style={{ width: 260, padding: 18, background: 'color-mix(in srgb, var(--ink-1000) 92%, transparent)', border: '2px solid var(--border-strong)', boxShadow: 'var(--shadow-soft)', display: 'flex', flexDirection: 'column', maxHeight: 540 }}>
            <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.6875rem', color: 'var(--text-strong)', textTransform: 'uppercase', textAlign: 'center', paddingBottom: 14, borderBottom: '2px solid var(--border-hairline)', flexShrink: 0 }}>Fastest Sprints</div>

            {/* Scrollable scores list */}
            <div style={{ overflowY: 'auto', flex: 1, marginTop: 12, display: 'flex', flexDirection: 'column', gap: 2, scrollbarWidth: 'thin', scrollbarColor: 'var(--border-strong) transparent' }}>
              {scores.map((row, i) => (
                <div key={i}
                  ref={row.you ? yourRowRef : undefined}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', background: row.you ? 'color-mix(in srgb, var(--piece-i) 16%, transparent)' : 'transparent', border: row.you ? '2px solid var(--piece-i)' : '2px solid transparent', flexShrink: 0 }}>
                  <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.6875rem', color: i === 0 ? 'var(--piece-o)' : 'var(--text-faint)', width: 26 }}>{String(i+1).padStart(2,'0')}</span>
                  <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.6875rem', color: row.you ? 'var(--piece-i)' : 'var(--text-body)', flex: 1 }}>{row.name}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-strong)' }}>{fmtTime(row.ms)}</span>
                </div>
              ))}
            </div>

            {/* Sticky user rank — visible even when scrolled away from their entry */}
            {myResult && (
              <div style={{ flexShrink: 0, borderTop: '2px solid var(--border-hairline)', marginTop: 8, paddingTop: 8 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>
                  Your rank: #{myResult.rank}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', background: 'color-mix(in srgb, var(--piece-i) 16%, transparent)', border: '2px solid var(--piece-i)' }}>
                  <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.6875rem', color: 'var(--text-faint)', width: 26 }}>{String(myResult.rank).padStart(2,'0')}</span>
                  <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.6875rem', color: 'var(--piece-i)', flex: 1 }}>{myResult.name}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-strong)' }}>{fmtTime(myResult.ms)}</span>
                </div>
              </div>
            )}

            <button onClick={onClose}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--piece-z)'; e.currentTarget.style.color = 'var(--piece-z)' }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.color = 'var(--text-muted)' }}
              style={{ flexShrink: 0, marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontFamily: 'var(--font-pixel)', fontSize: '0.625rem', textTransform: 'uppercase', color: 'var(--text-muted)', background: 'transparent', border: '2px solid var(--border-strong)', padding: '12px', cursor: 'pointer', borderRadius: 'var(--radius-1)' }}>
              <span style={{ lineHeight: 1, position: 'relative', top: -3 }}>✕</span>
              <span>Close [esc]</span>
            </button>
          </div>
        </div>
      </div>

      {/* Initials entry overlay */}
      {enteringInitials && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'var(--ink-900)', border: '2px solid var(--piece-s)', borderRadius: 'var(--radius-1)', padding: '32px 36px', textAlign: 'center', boxShadow: '0 0 40px color-mix(in srgb, var(--piece-s) 40%, transparent)', minWidth: 280 }}>
            <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '1.125rem', color: 'var(--piece-s)', textTransform: 'uppercase', marginBottom: 8 }}>Finish!</div>
            <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '1.75rem', color: 'var(--piece-o)', marginBottom: 4 }}>{fmtTime(st.finishMs)}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-faint)', marginBottom: 24 }}>Enter your initials</div>
            <input
              autoFocus
              maxLength={3}
              value={initials}
              onChange={(e) => setInitials(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSubmitInitials() }}
              placeholder="AAA"
              style={{ fontFamily: 'var(--font-pixel)', fontSize: '2rem', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.2em', background: 'var(--bg-well)', color: 'var(--piece-i)', border: '2px solid var(--piece-i)', borderRadius: 'var(--radius-1)', padding: '12px 16px', width: 140, display: 'block', margin: '0 auto 20px', outline: 'none' }} />
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <Button variant="ghost" size="sm" onClick={() => { setEnteringInitials(false); g.current.saved = true; rerender() }}>Skip</Button>
              <Button variant="success" size="sm" onClick={handleSubmitInitials}>Submit</Button>
            </div>
          </div>
        </div>
      )}

      {showSettings && (
        <SettingsModal settings={settings} keybinds={keybinds} onSave={handleSaveSettings} onClose={() => setShowSettings(false)} />
      )}

      {showAchievements && (
        <AchievementsModal stats={achRef.current} onClose={() => setShowAchievements(false)} />
      )}

      <AchievementToasts toasts={toasts} />
    </>
  )
}

// ---- HoldBox (left rail, home only) -------------------------------------------------------
// Forwards its ref to the root element so the scroll-driven fade/drift in App.tsx can
// animate it directly, rather than fighting a transformed wrapper's containing-block quirks.
export const HoldBox = forwardRef<HTMLElement, { onPlay: () => void }>(function HoldBox({ onPlay }, ref) {
  return (
    <aside ref={ref} className="tj-holdbox" style={{ position: 'fixed', top: '50%', left: 22, transform: 'translateY(-50%)', zIndex: 100, display: 'flex', flexDirection: 'column', gap: 12, padding: 16, width: 224, background: 'color-mix(in srgb, var(--ink-1000) 90%, transparent)', backdropFilter: 'blur(8px)', border: '2px solid var(--border-strong)', borderRadius: 'var(--radius-1)', boxShadow: 'var(--shadow-soft)' }}>
      <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.8125rem', color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'center', padding: '4px 0 12px', borderBottom: '2px solid var(--border-hairline)' }}>Hold</div>
      <button onClick={onPlay} title="Play Tetris"
        onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 0 22px color-mix(in srgb, var(--piece-t) 60%, transparent)' }}
        onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 0 14px color-mix(in srgb, var(--piece-t) 45%, transparent)' }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, width: '100%', padding: '20px 14px', cursor: 'pointer', backgroundColor: 'color-mix(in srgb, var(--piece-t) 20%, var(--bg-well))', borderWidth: '2px', borderStyle: 'solid', borderColor: 'var(--piece-t)', borderRadius: 'var(--radius-1)', boxShadow: '0 0 14px color-mix(in srgb, var(--piece-t) 45%, transparent)' }}>
        <Tetromino piece="t" size={14} bob />
        <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.875rem', color: 'var(--text-strong)', textTransform: 'uppercase' }}>Play</span>
      </button>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--text-faint)', textAlign: 'center', lineHeight: 1.6 }}>20-line sprint, beat the fastest time</div>
    </aside>
  )
})
