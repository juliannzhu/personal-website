import { useEffect, useRef } from 'react'

/**
 * ScrollTetromino3D
 * A large, stationary tetromino built from real 3D CSS cubes that spins
 * cinematically as the user scrolls. Each cube face is a real 3D plane
 * (translateZ), and the piece's transform reads a `--sy` custom property via
 * calc(), so rotation is driven purely by scroll position (no React re-render
 * per frame).
 */

type PieceType = 'i' | 'o' | 't' | 's' | 'z' | 'j' | 'l'

// Relative cell coordinates [col, row] for each tetromino.
const SHAPES: Record<PieceType, [number, number][]> = {
  i: [[0, 1], [1, 1], [2, 1], [3, 1]],
  o: [[1, 0], [2, 0], [1, 1], [2, 1]],
  t: [[1, 0], [0, 1], [1, 1], [2, 1]],
  s: [[1, 0], [2, 0], [0, 1], [1, 1]],
  z: [[0, 0], [1, 0], [1, 1], [2, 1]],
  j: [[0, 0], [0, 1], [1, 1], [2, 1]],
  l: [[2, 0], [0, 1], [1, 1], [2, 1]],
}

// The seven classic tetromino colors, each with a lit (top bevel) and dim
// (side/bottom bevel) shade — matches the site's --piece-* tokens.
const COLORS: Record<PieceType, { base: string; lit: string; dim: string }> = {
  i: { base: '#00f0f0', lit: '#7df9f9', dim: '#00a3a3' },
  o: { base: '#f5d800', lit: '#fdee7a', dim: '#b39d00' },
  t: { base: '#b14cff', lit: '#d49bff', dim: '#7a23c4' },
  s: { base: '#3cf000', lit: '#97f87a', dim: '#27a300' },
  z: { base: '#ff3b3b', lit: '#ff8a8a', dim: '#c41f1f' },
  j: { base: '#3d6bff', lit: '#88a4ff', dim: '#2546b8' },
  l: { base: '#ff9f1c', lit: '#ffc674', dim: '#c47200' },
}

const CSS = `
@keyframes stet3d-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
.stet3d-float { animation: stet3d-float 6.5s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) { .stet3d-float { animation: none; } }
`
let cssInjected = false
function ensureCSS() {
  if (!cssInjected && typeof document !== 'undefined') {
    const s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s); cssInjected = true
  }
}

export interface ScrollTetromino3DProps {
  /** Which tetromino to render. Default: 't'. */
  piece?: PieceType
  /** Cube edge length in px. Default: 28. */
  size?: number
  /** Degrees of X-axis rotation per pixel scrolled. Default: 0.22. */
  rotXPerPx?: number
  /** Degrees of Y-axis rotation per pixel scrolled. Default: 0.5. */
  rotYPerPx?: number
  /** Fixed X-axis rotation baked in on top of the scroll-driven spin. Default: 0. */
  baseRotateX?: number
  /** Fixed Y-axis rotation baked in on top of the scroll-driven spin. Default: 0. */
  baseRotateY?: number
  /** Static Z-axis cant (deg) applied to the whole piece, so the spin reads as
   * tumbling at an angle rather than spinning dead level. Default: 0. */
  tiltDeg?: number
  /** Degrees of additional Z-axis rotation per pixel scrolled, layered on top of
   * `tiltDeg` — this is the flat, facing-the-viewer spin a real Tetris piece
   * does when rotated. Default: 0. */
  rotZPerPx?: number
  /** Turn the piece slightly to face the cursor when it's nearby. Default: false. */
  mouseFollow?: boolean
  /** Max extra degrees of tilt from mouse-follow, reached only right at the
   * piece's center. Default: 16. */
  mouseMaxDeg?: number
  /** How quickly the eased tilt catches up to the cursor each frame (0-1, lower
   * is slower/laggier). Default: 0.05. */
  mouseEase?: number
  /** Radius in px around the piece's center within which the cursor has any
   * effect at all — this is what makes it "hovering around it", not the whole
   * page. Default: 480. */
  mouseRadius?: number
  /** Add a gentle idle up/down float. Default: true. */
  float?: boolean
  /** Perspective depth in px — smaller = more dramatic. Default: 820. */
  perspective?: number
  className?: string
  style?: React.CSSProperties
}

export function ScrollTetromino3D({
  piece = 't',
  size = 28,
  rotXPerPx = 0.22,
  rotYPerPx = 0.5,
  baseRotateX = 0,
  baseRotateY = 0,
  tiltDeg = 0,
  rotZPerPx = 0,
  mouseFollow = false,
  mouseMaxDeg = 16,
  mouseEase = 0.05,
  mouseRadius = 480,
  float = true,
  perspective = 820,
  className,
  style,
}: ScrollTetromino3DProps) {
  ensureCSS()
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    // The site scrolls inside a custom `.tj-scrollpane` container (see App.tsx),
    // not the window — read scrollTop from that ancestor instead of window.scrollY,
    // falling back to window for portability if dropped into another layout.
    const scroller = el.closest('.tj-scrollpane') as HTMLElement | null
    const target: EventTarget = scroller ?? window
    let raf = 0
    const update = () => {
      const sy = scroller ? scroller.scrollTop : window.scrollY
      el.style.setProperty('--sy', String(sy))
    }
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update) }
    update()
    target.addEventListener('scroll', onScroll, { passive: true })
    return () => { target.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf) }
  }, [])

  useEffect(() => {
    if (!mouseFollow) return
    const el = rootRef.current
    if (!el) return
    // Target is set instantly on mousemove; the rAF loop eases the applied
    // value toward it every frame, which is what makes the piece turn "very
    // slightly and slowly" compared to the actual cursor movement.
    const targetPos = { x: 0, y: 0 }
    const current = { x: 0, y: 0 }
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const dx = e.clientX - (rect.left + rect.width / 2)
      const dy = e.clientY - (rect.top + rect.height / 2)
      const dist = Math.hypot(dx, dy)
      if (dist < mouseRadius) {
        targetPos.x = Math.max(-1, Math.min(1, dx / mouseRadius))
        targetPos.y = Math.max(-1, Math.min(1, dy / mouseRadius))
      } else {
        targetPos.x = 0
        targetPos.y = 0
      }
    }
    let raf = 0
    const tick = () => {
      current.x += (targetPos.x - current.x) * mouseEase
      current.y += (targetPos.y - current.y) * mouseEase
      el.style.setProperty('--mx', current.x.toFixed(4))
      el.style.setProperty('--my', current.y.toFixed(4))
      raf = requestAnimationFrame(tick)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    raf = requestAnimationFrame(tick)
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf) }
  }, [mouseFollow, mouseEase, mouseRadius])

  const cells = SHAPES[piece]
  const c = COLORS[piece]
  const bw = Math.max(...cells.map((p) => p[0])) + 1
  const bh = Math.max(...cells.map((p) => p[1])) + 1
  const half = size / 2

  const faceBase: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    boxShadow: 'inset 3px 3px 0 rgba(255,255,255,.16), inset -3px -3px 0 rgba(0,0,0,.3)',
  }

  return (
    <div
      ref={rootRef}
      className={[float ? 'stet3d-float' : '', className].filter(Boolean).join(' ')}
      aria-hidden="true"
      style={{
        position: 'relative',
        width: bw * size,
        height: bh * size,
        pointerEvents: 'none',
        ...style,
      }}
    >
      <div style={{ position: 'absolute', inset: 0, perspective: `${perspective}px` }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transformStyle: 'preserve-3d',
            transformOrigin: `${(bw * size) / 2}px ${(bh * size) / 2}px`,
            willChange: 'transform',
            transform: `rotateZ(calc(${tiltDeg}deg + var(--sy, 0) * ${rotZPerPx}deg)) rotateX(calc(var(--sy, 0) * ${rotXPerPx}deg + ${baseRotateX}deg + var(--my, 0) * ${mouseMaxDeg}deg)) rotateY(calc(var(--sy, 0) * ${rotYPerPx}deg + ${baseRotateY}deg + var(--mx, 0) * ${mouseMaxDeg}deg))`,
          }}
        >
          {cells.map(([cx, cy]) => (
            <div
              key={`${cx},${cy}`}
              style={{
                position: 'absolute',
                width: size,
                height: size,
                left: cx * size,
                top: cy * size,
                transformStyle: 'preserve-3d',
              }}
            >
              <div style={{ ...faceBase, background: c.base, transform: `translateZ(${half}px)` }} />
              <div style={{ ...faceBase, background: c.dim, transform: `rotateY(180deg) translateZ(${half}px)` }} />
              <div style={{ ...faceBase, background: c.dim, transform: `rotateY(90deg) translateZ(${half}px)` }} />
              <div style={{ ...faceBase, background: c.dim, transform: `rotateY(-90deg) translateZ(${half}px)` }} />
              <div style={{ ...faceBase, background: c.lit, transform: `rotateX(90deg) translateZ(${half}px)` }} />
              <div style={{ ...faceBase, background: c.dim, transform: `rotateX(-90deg) translateZ(${half}px)` }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
