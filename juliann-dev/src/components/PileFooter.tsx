import { useLayoutEffect, useMemo, useRef, useState } from 'react'

type Piece = 'i' | 'o' | 't' | 's' | 'z' | 'j' | 'l'
type Shape = { cells: [number, number][]; w: number; h: number }

// Every real rotation of every tetromino (matching the classic 4 orientations, minus the
// ones that are duplicates by symmetry) — placing pieces in varied rotations instead of
// always the same one is what makes a real Tetris board look mixed instead of repetitive.
const PIECE_ROTATIONS: Record<Piece, Shape[]> = {
  i: [
    { cells: [[0, 0], [1, 0], [2, 0], [3, 0]], w: 4, h: 1 },
    { cells: [[0, 0], [0, 1], [0, 2], [0, 3]], w: 1, h: 4 },
  ],
  o: [
    { cells: [[0, 0], [1, 0], [0, 1], [1, 1]], w: 2, h: 2 },
  ],
  t: [
    { cells: [[1, 0], [0, 1], [1, 1], [2, 1]], w: 3, h: 2 }, // nub up
    { cells: [[0, 0], [1, 0], [2, 0], [1, 1]], w: 3, h: 2 }, // nub down
    { cells: [[0, 0], [0, 1], [1, 1], [0, 2]], w: 2, h: 3 }, // nub right
    { cells: [[1, 0], [0, 1], [1, 1], [1, 2]], w: 2, h: 3 }, // nub left
  ],
  s: [
    { cells: [[1, 0], [2, 0], [0, 1], [1, 1]], w: 3, h: 2 },
    { cells: [[0, 0], [0, 1], [1, 1], [1, 2]], w: 2, h: 3 },
  ],
  z: [
    { cells: [[0, 0], [1, 0], [1, 1], [2, 1]], w: 3, h: 2 },
    { cells: [[1, 0], [0, 1], [1, 1], [0, 2]], w: 2, h: 3 },
  ],
  j: [
    { cells: [[0, 0], [0, 1], [1, 1], [2, 1]], w: 3, h: 2 },
    { cells: [[0, 0], [1, 0], [0, 1], [0, 2]], w: 2, h: 3 },
    { cells: [[0, 0], [1, 0], [2, 0], [2, 1]], w: 3, h: 2 },
    { cells: [[1, 0], [1, 1], [0, 2], [1, 2]], w: 2, h: 3 },
  ],
  l: [
    { cells: [[2, 0], [0, 1], [1, 1], [2, 1]], w: 3, h: 2 },
    { cells: [[0, 0], [0, 1], [0, 2], [1, 2]], w: 2, h: 3 },
    { cells: [[0, 0], [1, 0], [2, 0], [0, 1]], w: 3, h: 2 },
    { cells: [[0, 0], [1, 0], [1, 1], [1, 2]], w: 2, h: 3 },
  ],
}
const PIECE_SEQUENCE: Piece[] = ['i', 'o', 't', 's', 'z', 'j', 'l']
// how many extra copies of each piece's rotation set go into the cycle — o/t/j are boosted
// (yellow O, purple T, dark blue J across its 4 rotations show up more often), s is dialed back
const PIECE_WEIGHT: Record<Piece, number> = { i: 1, o: 3, t: 3, s: 1, z: 2, j: 3, l: 1 }
// every (piece, rotation) combination, repeated per its weight and cycled through — this alone
// gives far more variation than cycling through 7 colors, since almost every piece shows up in
// a different orientation each time it appears
const ALL_VARIANTS: { piece: Piece; shape: Shape }[] = PIECE_SEQUENCE.flatMap((piece) =>
  Array.from({ length: PIECE_WEIGHT[piece] }, () => PIECE_ROTATIONS[piece].map((shape) => ({ piece, shape }))).flat()
)

const TARGET_CELL = 20
const GRID_GAP = 2
// Fixed logical grid width (≈1440px canonical desktop viewport) so the pile is generated
// once and always looks identical — screen width only changes how much of it is visible
// (centered, cropped on narrow viewports), instead of regenerating a different layout per device.
const FIXED_COLS = 72
const BASE_HEIGHT = 10
const JAG_1 = 2
const JAG_2 = 1.3

type PlacedPiece = { piece: Piece; shape: Shape; col: number; topHeight: number }
type Filler = { piece: Piece; col: number; from: number; to: number }

// Flat skyline with gentle jaggedness (two low-amplitude sine terms), not a big wave.
function jaggedTarget(cols: number): number[] {
  return Array.from({ length: cols }, (_, i) =>
    Math.max(1, Math.round(BASE_HEIGHT + JAG_1 * Math.sin(i * 1.3) + JAG_2 * Math.sin(i * 0.53 + 2)))
  )
}

function colProfile(shape: Shape) {
  const colMinRow = new Array(shape.w).fill(Infinity)
  const colMaxRow = new Array(shape.w).fill(-Infinity)
  shape.cells.forEach(([c, r]) => {
    colMinRow[c] = Math.min(colMinRow[c], r)
    colMaxRow[c] = Math.max(colMaxRow[c], r)
  })
  return { colMinRow, colMaxRow }
}

// Greedily drops REAL tetromino pieces (real Tetris landing physics, in varied rotations) at
// the leftmost column still under its target height, until the whole width is filled — no
// empty columns. Among every rotation that wouldn't touch the same color to its left, right,
// or directly underneath, the one that lands flattest (smallest gap under it) wins, which
// keeps the pile dense and well mixed. Whatever small gap is still left under a piece's
// uneven underside is patched with that same piece's own color, so nothing merges into an
// unrelated neighbor's color.
function layoutPile(cols: number): { placed: PlacedPiece[]; fillers: Filler[]; colHeight: number[] } {
  const target = jaggedTarget(cols)
  const colHeight = new Array(cols).fill(0)
  const colorAtCol: (Piece | null)[] = new Array(cols).fill(null)
  const placed: PlacedPiece[] = []
  const fillers: Filler[] = []
  // tracks how many times each piece has actually been placed so far, so selection can
  // favor whichever piece is currently under-represented relative to its target weight —
  // just having more copies in ALL_VARIANTS isn't enough, since simple shapes like I are
  // easy to land flush almost anywhere and would otherwise dominate regardless of weight
  const placedCount: Record<Piece, number> = { i: 0, o: 0, t: 0, s: 0, z: 0, j: 0, l: 0 }
  let vi = 0
  let guard = 0
  while (guard++ < cols * 20 + 200) {
    let col = -1
    for (let c = 0; c < cols; c++) { if (colHeight[c] < target[c]) { col = c; break } }
    if (col === -1) break

    type Candidate = { variant: typeof ALL_VARIANTS[0]; start: number; topHeight: number; gapSize: number; deficit: number }
    let best: Candidate | null = null
    // Cramped corners (mainly the rightmost columns, where every shape gets clamped to the
    // same start position) can run out of fully safe candidates entirely. Without this middle
    // tier, the code fell straight through to bestUnsafe, which ignores belowConflict too —
    // and since belowConflict is what stops a piece from stacking directly on its own color,
    // that let the same color repeat straight up a column into a solid-looking line. This tier
    // still forbids stacking a color directly on itself; only left/right touches are allowed
    // to slip, which reads far less like an obvious solid line.
    let bestBelowSafe: Candidate | null = null
    let bestUnsafe: Candidate | null = null
    for (let attempt = 0; attempt < ALL_VARIANTS.length; attempt++) {
      const variant = ALL_VARIANTS[(vi + attempt) % ALL_VARIANTS.length]
      const w = variant.shape.w
      let start = col
      if (start + w > cols) start = Math.max(0, cols - w)
      const leftNeighbor = start > 0 ? colorAtCol[start - 1] : null
      const rightNeighbor = start + w < cols ? colorAtCol[start + w] : null
      let belowConflict = false
      for (let c = 0; c < w; c++) { if (colorAtCol[start + c] === variant.piece) { belowConflict = true; break } }
      const safe = variant.piece !== leftNeighbor && variant.piece !== rightNeighbor && !belowConflict

      const { colMaxRow } = colProfile(variant.shape)
      let topHeight = 0
      for (let c = 0; c < w; c++) { if (colMaxRow[c] === -Infinity) continue; topHeight = Math.max(topHeight, colHeight[start + c] + colMaxRow[c]) }
      let gapSize = 0
      for (let c = 0; c < w; c++) { if (colMaxRow[c] === -Infinity) continue; gapSize += Math.max(0, (topHeight - colMaxRow[c]) - colHeight[start + c]) }
      // how under-represented this piece type is right now vs. its target share — lower is "owed" more
      const deficit = placedCount[variant.piece] / PIECE_WEIGHT[variant.piece]

      const candidate: Candidate = { variant, start, topHeight, gapSize, deficit }
      if (safe) {
        if (!best || deficit < best.deficit || (deficit === best.deficit && gapSize < best.gapSize)) best = candidate
      } else if (!belowConflict) {
        if (!bestBelowSafe || deficit < bestBelowSafe.deficit || (deficit === bestBelowSafe.deficit && gapSize < bestBelowSafe.gapSize)) bestBelowSafe = candidate
      } else if (!bestUnsafe || gapSize < bestUnsafe.gapSize) {
        bestUnsafe = candidate
      }
    }
    const chosen = (best ?? bestBelowSafe ?? bestUnsafe)!
    vi++
    placedCount[chosen.variant.piece]++

    const { piece: type, shape } = chosen.variant
    const startCol = chosen.start
    const { colMinRow, colMaxRow } = colProfile(shape)
    // this piece's own color patches any gap between the previous terrain and where it actually lands
    for (let c = 0; c < shape.w; c++) {
      if (colMaxRow[c] === -Infinity) continue
      const trueLowestRow = chosen.topHeight - colMaxRow[c]
      const prevHeight = colHeight[startCol + c]
      if (trueLowestRow > prevHeight) fillers.push({ piece: type, col: startCol + c, from: prevHeight, to: trueLowestRow })
    }
    for (let c = 0; c < shape.w; c++) {
      if (colMinRow[c] === Infinity) continue
      colHeight[startCol + c] = chosen.topHeight - colMinRow[c] + 1
      colorAtCol[startCol + c] = type
    }
    placed.push({ piece: type, shape, col: startCol, topHeight: chosen.topHeight })
  }
  return { placed, fillers, colHeight }
}

// Explicit, hand-picked falling pieces (not derived from the pile's cycling sequence) so each
// one has a stable identity to tweak — position is a fraction of the total width (stable across
// screen sizes), with an optional colOffset to nudge a specific piece left/right by N squares.
type FallingSlotDef = { piece: Piece; shape: Shape; xFraction: number; colOffset?: number; smearFrom?: 'center' | 'bottom' }
const FALLING_SLOTS: FallingSlotDef[] = [
  { piece: 'i', shape: PIECE_ROTATIONS.i[1], xFraction: 0.04, colOffset: 0 }, // leftmost, shifted right
  { piece: 'o', shape: PIECE_ROTATIONS.o[0], xFraction: 0.22, colOffset: 1 }, // shifted left
  { piece: 't', shape: PIECE_ROTATIONS.t[0], xFraction: 0.40, colOffset: -2 }, // middle slot: was a red Z, now a T
  { piece: 'j', shape: PIECE_ROTATIONS.j[3], xFraction: 0.58, smearFrom: 'bottom' }, // was green S, now a purple J, rotated one step CCW from spawn; smear from its bottom
  { piece: 'i', shape: PIECE_ROTATIONS.i[1], xFraction: 0.76, colOffset: -2 }, // was a red Z, now a vertical I piece
  { piece: 't', shape: PIECE_ROTATIONS.t[0], xFraction: 0.94 }, // rightmost slot: was a red Z, now a T with its 3-wide side facing down
]

// A handful of columns get a piece that endlessly re-falls into place, aligned to the exact
// same grid as the stationary pile — its rest position is precisely where it would actually
// land if it were a real placement, so it visibly touches the top of the highest block there
// before fading out and repeating.
function pickFallingSpots(cols: number, colHeight: number[]): { piece: Piece; shape: Shape; col: number; restRow: number; smearFrom: 'center' | 'bottom' }[] {
  return FALLING_SLOTS.map(({ piece, shape, xFraction, colOffset = 0, smearFrom = 'center' }) => {
    let col = Math.round(xFraction * cols) + colOffset
    col = Math.max(0, Math.min(col, cols - shape.w))
    let restRow = 0
    for (let c = 0; c < shape.w; c++) restRow = Math.max(restRow, colHeight[col + c])
    return { piece, shape, col, restRow, smearFrom }
  })
}

function renderCells(piece: Piece, shape: Shape, cellSize: number) {
  const filled = new Set(shape.cells.map(([c, r]) => `${c},${r}`))
  const cells: React.ReactNode[] = []
  for (let r = 0; r < shape.h; r++) {
    for (let c = 0; c < shape.w; c++) {
      const on = filled.has(`${c},${r}`)
      cells.push(
        <div key={`${c}-${r}`} style={{
          width: cellSize, height: cellSize,
          background: on ? `var(--piece-${piece})` : 'transparent',
          boxShadow: on ? 'inset 2px 2px 0 rgba(255,255,255,0.3), inset -2px -2px 0 rgba(0,0,0,0.35)' : 'none',
        }} />
      )
    }
  }
  return cells
}

function PieceShape({ piece, shape, cellSize, style }: { piece: Piece; shape: Shape; cellSize: number; style: React.CSSProperties }) {
  return (
    <div style={{ position: 'absolute', display: 'grid', gridTemplateColumns: `repeat(${shape.w}, ${cellSize}px)`, gridTemplateRows: `repeat(${shape.h}, ${cellSize}px)`, gap: GRID_GAP, ...style }}>
      {renderCells(piece, shape, cellSize)}
    </div>
  )
}

function FallingPiece({ piece, shape, unit, cellSize, left, restBottom, delay, smearFrom = 'center' }: {
  piece: Piece; shape: Shape; unit: number; cellSize: number
  left: number; restBottom: number; delay: number; smearFrom?: 'center' | 'bottom'
}) {
  const pieceWidth = shape.w * unit - GRID_GAP
  const pieceHeight = shape.h * unit - GRID_GAP
  const smearWidth = shape.w * unit - unit + unit * 0.36
  const trailHeight = pieceHeight * 5
  const smearBottom = smearFrom === 'bottom' ? 0 : pieceHeight / 2
  return (
    <div style={{
      position: 'absolute', left, bottom: restBottom, width: shape.w * unit,
      animation: 'tj-pile-fall-loop 4.5s cubic-bezier(0.36,0.6,0.4,1) infinite',
      animationDelay: `${delay}ms`,
    }}>
      {/* originates from the piece's center (or its bottom, for smearFrom:'bottom'), extends upward */}
      <div style={{
        position: 'absolute', left: pieceWidth / 2 - smearWidth / 2, bottom: smearBottom,
        width: smearWidth, height: trailHeight,
        background: `linear-gradient(to top, var(--piece-${piece}) 0%, color-mix(in srgb, var(--piece-${piece}) 60%, transparent) 20%, transparent 100%)`,
        opacity: 0.6, pointerEvents: 'none',
      }} />
      <div style={{ position: 'absolute', display: 'grid', gridTemplateColumns: `repeat(${shape.w}, ${cellSize}px)`, gridTemplateRows: `repeat(${shape.h}, ${cellSize}px)`, gap: GRID_GAP, bottom: 0, left: 0, opacity: 0.92 }}>
        {renderCells(piece, shape, cellSize)}
      </div>
    </div>
  )
}

const PILE_CSS = `
@keyframes tj-pile-fall-loop {
  0%   { transform: translateY(-260px); opacity: 0; }
  10%  { opacity: 1; }
  70%  { transform: translateY(0); opacity: 1; }
  85%  { transform: translateY(0); opacity: 1; }
  100% { transform: translateY(0); opacity: 0; }
}
/* PileFooter breaks out to full viewport width, escaping .tj-main's desktop
   padding-right:300px (reserved for the fixed NEXT sidebar) — this reproduces that same
   reservation just for the quote overlay, so its centered column lines up with the rest
   of the page's content instead of centering across the full, sidebar-ignorant width. */
@media (min-width: 721px) {
  .tj-quote-inset { padding-right: 300px; }
}
`
let pileCssInjected = false
function ensurePileCSS() {
  if (!pileCssInjected && typeof document !== 'undefined') {
    const s = document.createElement('style'); s.textContent = PILE_CSS; document.head.appendChild(s); pileCssInjected = true
  }
}

export function PileFooter({ quote, kicker = '// words i play by' }: { quote?: string; kicker?: string } = {}) {
  ensurePileCSS()
  const ref = useRef<HTMLDivElement>(null)
  const [breakout, setBreakout] = useState({ width: 0, marginLeft: 0 })

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => {
      const rect = el.getBoundingClientRect()
      const viewportWidth = document.documentElement.clientWidth
      setBreakout({ width: viewportWidth, marginLeft: -rect.left })
    }
    measure()
    window.addEventListener('resize', measure)
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => { window.removeEventListener('resize', measure); ro.disconnect() }
  }, [])

  // Cell size and column count are both fixed (not derived from viewport width) so the
  // generated pile is always the exact same artwork on every screen — see FIXED_COLS above.
  const cols = FIXED_COLS
  const unit = TARGET_CELL
  const cellSize = Math.max(1, unit - GRID_GAP)
  const artworkWidth = cols * unit
  // Scale the whole fixed artwork down to fit narrower screens (never up past its native
  // size) so every device shows the exact same composition, just smaller — never a cropped
  // fragment, which was cutting off pieces and leaving mismatched-looking sparse leftovers.
  const scale = breakout.width > 0 ? Math.min(1, breakout.width / artworkWidth) : 1

  const { placed, fillers, fallingSpots, maxRow } = useMemo(() => {
    const { placed, fillers, colHeight } = layoutPile(cols)
    const fallingSpots = pickFallingSpots(cols, colHeight)
    return { placed, fillers, fallingSpots, maxRow: Math.max(1, ...colHeight) }
  }, [cols])

  // The footer band's own height follows the scaled-down pile height (plus fixed headroom
  // for the quote text) instead of a flat 65vh — otherwise a shrunk mobile pile would sit as
  // a thin strip at the bottom of a tall, mostly-empty band.
  const pileHeight = maxRow * unit * scale
  const footerHeight = Math.max(360, Math.min(760, pileHeight + 280))

  return (
    <div ref={ref} style={{
      width: breakout.width || undefined, marginLeft: breakout.width ? breakout.marginLeft : undefined,
      height: footerHeight,
      borderTop: '2px solid var(--border-strong)', position: 'relative', overflow: 'hidden',
    }}>
      {/* pile graphic — kept at its own dimmed opacity so it reads as backdrop, independent
          of the fully-opaque quote layer sitting on top of it */}
      <div style={{
        position: 'absolute', inset: 0, background: 'var(--bg-well)', opacity: 0.8,
        backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.035) 1px, transparent 1px)',
        backgroundSize: `${unit}px ${unit}px`,
      }}>
        {/* fixed-width artwork, centered and scaled to fit — narrower viewports shrink the
            whole composition instead of ever cropping it or regenerating a different pile */}
        <div style={{
          position: 'absolute', left: '50%', bottom: 0, width: artworkWidth, height: maxRow * unit,
          transform: `translateX(-50%) scale(${scale})`, transformOrigin: 'center bottom',
        }}>
          {placed.map((p, i) => {
            const bottomRows = p.topHeight - (p.shape.h - 1)
            return (
              <PieceShape key={`p${i}`} piece={p.piece} shape={p.shape} cellSize={cellSize}
                style={{ left: p.col * unit, bottom: bottomRows * unit }} />
            )
          })}
          {fillers.flatMap((f, fi) => {
            const squares = []
            for (let row = f.from; row < f.to; row++) {
              squares.push(
                <div key={`f${fi}-${row}`} style={{
                  position: 'absolute', left: f.col * unit, bottom: row * unit,
                  width: cellSize, height: cellSize,
                  background: `var(--piece-${f.piece})`,
                  boxShadow: 'inset 2px 2px 0 rgba(255,255,255,0.3), inset -2px -2px 0 rgba(0,0,0,0.35)',
                }} />
              )
            }
            return squares
          })}
          {fallingSpots.map((f, i) => (
            <FallingPiece key={`fall${i}`} piece={f.piece} shape={f.shape} unit={unit} cellSize={cellSize}
              left={f.col * unit} restBottom={f.restRow * unit} delay={i * 620} smearFrom={f.smearFrom} />
          ))}
        </div>
      </div>

      {quote && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-start', paddingTop: 72, background: 'rgba(5,5,9,0.6)' }}>
          <div className="tj-quote-inset" style={{ width: '100%' }}>
            <div style={{ maxWidth: 1080, width: '100%', margin: '0 auto', padding: '0 24px' }}>
              <div style={{ position: 'relative', paddingLeft: 32, borderLeft: '3px solid var(--piece-i)', maxWidth: 760 }}>
                <span style={{ position: 'absolute', left: -20, top: -38, fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '6rem', lineHeight: 1, color: 'var(--piece-i)', opacity: 0.32, userSelect: 'none' }} aria-hidden="true">&ldquo;</span>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--piece-i)', marginBottom: 16 }}>{kicker}</div>
                <blockquote style={{ margin: 0, fontFamily: 'var(--font-pixel)', textTransform: 'uppercase', letterSpacing: '0.02em', fontSize: 'clamp(0.8125rem, 1.5vw, 1.0625rem)', color: 'var(--text-strong)', lineHeight: 1.7 }}>
                  {quote.split('\n').map((line, i, arr) => (
                    <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
                  ))}
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
