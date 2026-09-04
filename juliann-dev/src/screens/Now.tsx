import { Card } from '../components/ds/Card'
import { Badge } from '../components/ds/Badge'
import { Tetromino } from '../components/ds/Tetromino'
import { ScrollTetromino3D } from '../components/ScrollTetromino3D'

type Piece = 'i' | 'o' | 't' | 's' | 'z' | 'j' | 'l'

const NOW: { piece: Piece; label: string; text: string }[] = [
  {
    piece: 'i',
    label: 'Building',
    text: 'This website. Still adding projects, side quests, and details nobody asked for.',
  },
  {
    piece: 'o',
    label: 'Learning',
    text: 'Getting the AWS Practitioner certification through AWS Educate.',
  },
  {
    piece: 's',
    label: 'Reading',
    text: '"Designing Data-Intensive Applications" and an IEEE article on query optimization for a systems report.',
  },
  {
    piece: 't',
    label: 'Playing',
    text: 'Learning Everybody Wants to Rule the World by Tears for Fears on piano.',
  },
]

// `when` replaces the generic SOON badge once a date is actually known.
const UPCOMING: { piece: Piece; title: string; text: string; when?: string }[] = [
  {
    piece: 'z',
    title: 'TEDx Ottawa',
    when: 'Nov 2026',
    text: 'Writing and delivering a TEDxOttawa talk exploring this year\'s theme, Continuum, and the ideas it sparks for me.',
  },
  {
    piece: 'j',
    title: 'UR2PhD @ Waterloo',
    text: 'Researching gamified attention training for children with ADHD through Waterloo\'s UR2PhD program.',
  },
  {
    piece: 's',
    title: 'WiM Directed Reading',
    text: 'Studying privacy-preserving techniques for database query processing in the Women in Math Directed Reading Program.',
  },
]

// Bump this whenever the copy above actually changes. Deliberately hand-written rather than
// derived from the build date — this should say when the Now section was last true, not when
// the site last happened to deploy.
const LAST_UPDATED = 'September 2026'

// One cell, then the date: the smallest thing that still reads as a Tetris stamp.
function LastUpdated() {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 7,
      fontFamily: 'var(--font-mono)', fontSize: '0.625rem',
      color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.14em',
      whiteSpace: 'nowrap',
    }}>
      <span aria-hidden="true" style={{ width: 6, height: 6, background: 'var(--piece-l)', flexShrink: 0 }} />
      Last updated {LAST_UPDATED}
    </span>
  )
}

export function Now() {
  return (
    <section style={{ maxWidth: 1080, margin: '0 auto', padding: '56px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, marginBottom: 12 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--piece-i)' }}>// Current directory</div>
          <h2 style={{ fontFamily: 'var(--font-pixel)', fontSize: '1.625rem', color: 'var(--text-strong)', margin: '14px 0 0', textTransform: 'uppercase' }}>Now Loading...</h2>
        </div>
        <ScrollTetromino3D
          piece="l"
          size={60}
          baseRotateY={180}
          tiltDeg={18}
          rotZPerPx={0.14}
          rotXPerPx={0.08}
          rotYPerPx={0.18}
          mouseFollow
          style={{ opacity: 0.72, marginRight: 60 }}
        />
      </div>

      {/* Single-line header with badge inline */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32, flexWrap: 'wrap' }}>
        <p style={{ fontSize: '1rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
          A sneak peek of what's on my board right now.
        </p>
        <Badge piece="s" dot>live</Badge>
      </div>

      <div className="tj-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        {NOW.map((n) => (
          <Card key={n.label} accent={n.piece}>
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <Tetromino piece={n.piece} size={12} />
              <div>
                <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.6875rem', color: `var(--piece-${n.piece})`, textTransform: 'uppercase', marginBottom: 10 }}>{n.label}</div>
                <p style={{ margin: 0, fontSize: '0.9375rem', color: 'var(--text-body)', lineHeight: 1.6 }}>{n.text}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div style={{ marginTop: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
          <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.75rem', color: 'var(--piece-o)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Coming soon</span>
          <LastUpdated />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {UPCOMING.map((u) => {
            const c = `var(--piece-${u.piece})`
            return (
              <div key={u.title} style={{
                display: 'flex', gap: 12, alignItems: 'flex-start',
                padding: '16px 12px 16px 14px',
                background: `color-mix(in srgb, ${c} 7%, var(--bg-well))`,
                border: '2px solid var(--border-hairline)',
                borderLeft: `4px solid ${c}`,
                borderRadius: 'var(--radius-1)',
              }}>
                <div style={{ paddingTop: 3, flexShrink: 0 }}><Tetromino piece={u.piece} size={9} /></div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                    <div style={{ fontSize: '0.9375rem', color: 'var(--text-strong)', fontWeight: 600, lineHeight: 1.3 }}>{u.title}</div>
                    <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.4375rem', background: c, color: 'var(--ink-900)', padding: '3px 5px', flexShrink: 0, letterSpacing: '0.04em', alignSelf: 'flex-start', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{u.when ?? 'SOON'}</span>
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.5, marginTop: 3 }}>{u.text}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
