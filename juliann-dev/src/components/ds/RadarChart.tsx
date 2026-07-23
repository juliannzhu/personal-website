const CSS = `
.tj-radar-poly { filter: drop-shadow(0 0 6px color-mix(in srgb, var(--piece-t) 35%, transparent)); }
`
let injected = false
function ensure() {
  if (!injected && typeof document !== 'undefined') {
    const s = document.createElement('style'); s.setAttribute('data-tj', 'radar'); s.textContent = CSS; injected = true
    document.head.appendChild(s)
  }
}

export type RadarPoint = { key: string; label: string; value: number; max?: number; piece: 'i' | 'o' | 't' | 's' | 'z' | 'j' | 'l' }

export function RadarChart({ points, size = 420 }: { points: RadarPoint[]; size?: number }) {
  ensure()
  const cx = size / 2
  const cy = size / 2
  const R = size * 0.32
  const n = points.length
  const angleFor = (i: number) => -Math.PI / 2 + i * ((2 * Math.PI) / n)
  const ptAt = (i: number, r: number): [number, number] => {
    const a = angleFor(i)
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)]
  }
  const rings = [0.2, 0.4, 0.6, 0.8, 1]
  const ringPolys = rings.map((f) => points.map((_, i) => ptAt(i, R * f).join(',')).join(' '))
  const axisEnds = points.map((_, i) => ptAt(i, R))
  const dataPoly = points.map((p, i) => ptAt(i, (R * p.value) / (p.max ?? 10)).join(',')).join(' ')
  const labelR = R + 32

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width="100%" style={{ maxWidth: size, display: 'block', margin: '0 auto', overflow: 'visible' }}>
      {ringPolys.map((poly, i) => (
        <polygon key={i} points={poly} fill="none" stroke="var(--border-hairline)" strokeWidth={1} opacity={0.4} />
      ))}
      {axisEnds.map(([x, y], i) => (
        <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="var(--border-hairline)" strokeWidth={1} opacity={0.4} />
      ))}
      <polygon
        className="tj-radar-poly"
        points={dataPoly}
        fill="color-mix(in srgb, var(--piece-t) 14%, transparent)"
        stroke="color-mix(in srgb, var(--piece-t) 75%, var(--text-strong))"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      {points.map((p, i) => {
        const [x, y] = ptAt(i, (R * p.value) / (p.max ?? 10))
        return <circle key={p.key} cx={x} cy={y} r={3} fill={`var(--piece-${p.piece})`} stroke="var(--ink-900)" strokeWidth={1} opacity={0.9} />
      })}
      {points.map((p, i) => {
        const [x, y] = ptAt(i, labelR)
        const anchor = x > cx + 4 ? 'start' : x < cx - 4 ? 'end' : 'middle'
        return (
          <g key={p.key}>
            <text x={x} y={y - 6} textAnchor={anchor} dominantBaseline="middle"
              style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.6875rem', fill: 'var(--text-muted)', textTransform: 'uppercase' }}>
              {p.label}
            </text>
            <text x={x} y={y + 8} textAnchor={anchor} dominantBaseline="middle"
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', fill: 'var(--text-faint)' }}>
              {p.value}/{p.max ?? 10}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
