import { Card } from '../components/ds/Card'
import { Badge } from '../components/ds/Badge'
import { ProgressBar } from '../components/ds/ProgressBar'
import { Tetromino } from '../components/ds/Tetromino'

type Piece = 'i' | 'o' | 't' | 's' | 'z' | 'j' | 'l'

const NOW: { piece: Piece; label: string; text: string }[] = [
  {
    piece: 'i',
    label: 'Building',
    text: 'MySQL and Grafana dashboards for satellite telemetry at ORBCOMM. Prototyping an AI layer to flag signal anomalies automatically.',
  },
  {
    piece: 'o',
    label: 'Learning',
    text: 'Apple Watch development and bridging Swift into existing code. Prepping for Hack the 6ix this summer.',
  },
  {
    piece: 's',
    label: 'Reading',
    text: '"Designing Data-Intensive Applications" and an IEEE article on query optimization for a systems report.',
  },
  {
    piece: 't',
    label: 'Playing',
    text: 'Working through Talking to the Moon by Bruno Mars on piano. The bridge has other ideas, but I\'m gaining on it.',
  },
]

export function Now() {
  return (
    <section style={{ maxWidth: 860, margin: '0 auto', padding: '56px 24px' }}>
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--piece-i)' }}>// Current directory</div>
        <h2 style={{ fontFamily: 'var(--font-pixel)', fontSize: 26, color: 'var(--text-strong)', margin: '14px 0 0', textTransform: 'uppercase' }}>Now Loading...</h2>
      </div>

      {/* Single-line header with badge inline */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32, flexWrap: 'wrap' }}>
        <p style={{ fontSize: 16, color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
          A sneak peak of what's on my board right now. Last updated July 2026.
        </p>
        <Badge piece="s" dot>live</Badge>
      </div>

      <div className="tj-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        {NOW.map((n) => (
          <Card key={n.label} accent={n.piece}>
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <Tetromino piece={n.piece} size={12} />
              <div>
                <div style={{ fontFamily: 'var(--font-pixel)', fontSize: 11, color: `var(--piece-${n.piece})`, textTransform: 'uppercase', marginBottom: 10 }}>{n.label}</div>
                <p style={{ margin: 0, fontSize: 15, color: 'var(--text-body)', lineHeight: 1.6 }}>{n.text}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card accent="o" accentBar style={{ marginTop: 18 }}>
        <div style={{ fontFamily: 'var(--font-pixel)', fontSize: 11, color: 'var(--text-strong)', textTransform: 'uppercase', marginBottom: 16 }}>This week's stats</div>
        <div className="tj-stats-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
          <ProgressBar value={62} piece="l" label="Piano piece" cells={10} cellHeight={12} />
          <ProgressBar value={35} piece="o" label="IG post"     cells={10} cellHeight={12} />
          <ProgressBar value={71} piece="j" label="Research"    cells={10} cellHeight={12} />
        </div>
      </Card>
    </section>
  )
}
