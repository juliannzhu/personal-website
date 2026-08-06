import { useEffect, useState } from 'react'
import { Icon } from '@iconify/react'
import { Card } from '../components/ds/Card'
import { Badge } from '../components/ds/Badge'
import { Tetromino } from '../components/ds/Tetromino'
import { ScrollTetromino3D } from '../components/ScrollTetromino3D'

type Piece = 'i' | 'o' | 't' | 's' | 'z' | 'j' | 'l'

// duration in seconds — real track lengths, so the progress bar takes the actual song length to fill
const NOW_PLAYING_SONGS: { title: string; artist: string; album: string; piece: Piece; duration: number }[] = [
  { title: 'As It Was',       artist: 'Harry Styles', album: "Harry's House",             piece: 'i', duration: 167 },
  { title: 'Blinding Lights', artist: 'The Weeknd',   album: 'After Hours',               piece: 'o', duration: 200 },
  { title: 'Anti-Hero',       artist: 'Taylor Swift', album: 'Midnights',                 piece: 't', duration: 200 },
  { title: 'Flowers',         artist: 'Miley Cyrus',  album: 'Endless Summer Vacation',   piece: 's', duration: 200 },
  { title: 'Cruel Summer',    artist: 'Taylor Swift', album: 'Lover',                     piece: 'l', duration: 178 },
]
const TICK_MS = 250

function formatTime(totalSeconds: number) {
  const s = Math.max(0, Math.floor(totalSeconds))
  const m = Math.floor(s / 60)
  const rem = s % 60
  return `${m}:${rem.toString().padStart(2, '0')}`
}

const NOW_PLAYING_CSS = `
@keyframes tj-eq-a { 0%,100% { height: 4px; }  50% { height: 14px; } }
@keyframes tj-eq-b { 0%,100% { height: 11px; } 40% { height: 3px; }  75% { height: 13px; } }
@keyframes tj-eq-c { 0%,100% { height: 6px; }  30% { height: 14px; } 65% { height: 4px; } }
@keyframes tj-eq-d { 0%,100% { height: 12px; } 45% { height: 4px; }  80% { height: 10px; } }
.tj-eq-bar-0 { animation: tj-eq-a 0.9s ease-in-out infinite; }
.tj-eq-bar-1 { animation: tj-eq-b 1.1s ease-in-out infinite; }
.tj-eq-bar-2 { animation: tj-eq-c 0.8s ease-in-out infinite; }
.tj-eq-bar-3 { animation: tj-eq-d 1.0s ease-in-out infinite; }
.tj-np-progress { transition: width ${TICK_MS}ms linear; }
`
let nowPlayingCssInjected = false
function ensureNowPlayingCSS() {
  if (!nowPlayingCssInjected && typeof document !== 'undefined') {
    const s = document.createElement('style'); s.textContent = NOW_PLAYING_CSS; document.head.appendChild(s); nowPlayingCssInjected = true
  }
}

function NowPlaying() {
  ensureNowPlayingCSS()
  const [index, setIndex] = useState(0)
  const [elapsed, setElapsed] = useState(0)

  const song = NOW_PLAYING_SONGS[index]

  useEffect(() => {
    setElapsed(0)
    const t = setInterval(() => {
      setElapsed((e) => {
        const next = e + TICK_MS / 1000
        if (next >= song.duration) {
          setIndex((i) => (i + 1) % NOW_PLAYING_SONGS.length)
          return 0
        }
        return next
      })
    }, TICK_MS)
    return () => clearInterval(t)
  }, [index, song.duration])

  const c = `var(--piece-${song.piece})`
  const pct = Math.min(100, (elapsed / song.duration) * 100)

  return (
    <Card accent={song.piece} accentBar style={{ marginTop: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <Icon icon="pixelarticons:volume-2" style={{ fontSize: '0.8125rem', color: c }} />
        <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.6875rem', color: 'var(--text-strong)', textTransform: 'uppercase' }}>Now playing on Spotify</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{
          width: 52, height: 52, flexShrink: 0, borderRadius: 'var(--radius-1)',
          background: `linear-gradient(135deg, ${c}, color-mix(in srgb, ${c} 40%, var(--ink-900)))`,
          boxShadow: 'inset 2px 2px 0 rgba(255,255,255,0.25), inset -2px -2px 0 rgba(0,0,0,0.35)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon icon="pixelarticons:music" style={{ fontSize: '1.375rem', color: 'var(--ink-900)' }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
            <div style={{ fontSize: '0.9375rem', color: 'var(--text-strong)', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{song.title}</div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--text-faint)', flexShrink: 0 }}>{formatTime(elapsed)} / {formatTime(song.duration)}</span>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{song.artist} · {song.album}</div>
          <div style={{ marginTop: 9, height: 3, background: 'var(--bg-well)', borderRadius: 2, overflow: 'hidden' }}>
            <div className="tj-np-progress" style={{ height: '100%', width: `${pct}%`, background: c }} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 14, flexShrink: 0 }}>
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className={`tj-eq-bar-${i}`} style={{ width: 3, background: 'var(--piece-s)', borderRadius: 1 }} />
          ))}
        </div>
      </div>
    </Card>
  )
}

const NOW: { piece: Piece; label: string; text: string }[] = [
  {
    piece: 'i',
    label: 'Building',
    text: 'MySQL and Grafana dashboards for satellite telemetry at ORBCOMM. Prototyping an AI layer to flag signal anomalies automatically.',
  },
  {
    piece: 'o',
    label: 'Learning',
    text: 'A rotation of easy recipes that survive a dorm kitchen and I could bring to a potluck.',
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

const UPCOMING: { piece: Piece; title: string; when: string; text: string }[] = [
  {
    piece: 'z',
    title: 'TEDx Ottawa',
    when: 'Fall 2026',
    text: 'Writing and delivering a TEDxOttawa talk exploring this year\'s theme, Continuum, and the ideas it sparks for me.',
  },
  {
    piece: 'j',
    title: 'UR2PhD @ Waterloo',
    when: 'Fall 2026',
    text: 'Researching gamified attention training for children with ADHD through Waterloo\'s UR2PhD program.',
  },
  {
    piece: 's',
    title: 'WiM Directed Reading',
    when: 'Fall 2026',
    text: 'Studying privacy-preserving techniques for database query processing in the Women in Math Directed Reading Program.',
  },
]

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
          A sneak peak of what's on my board right now. Last updated August 2026.
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

      <NowPlaying />

      <div style={{ marginTop: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.6875rem', color: 'var(--text-strong)', textTransform: 'uppercase' }}>Coming soon</span>
          <Badge piece="j" dot>next term</Badge>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {UPCOMING.map((u) => {
            const c = `var(--piece-${u.piece})`
            return (
              <div key={u.title} style={{
                display: 'flex', gap: 12, alignItems: 'flex-start',
                padding: '10px 12px 10px 14px',
                background: `color-mix(in srgb, ${c} 7%, var(--bg-well))`,
                border: '2px solid var(--border-hairline)',
                borderLeft: `4px solid ${c}`,
                borderRadius: 'var(--radius-1)',
              }}>
                <div style={{ paddingTop: 3, flexShrink: 0 }}><Tetromino piece={u.piece} size={9} /></div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                    <div style={{ fontSize: '0.9375rem', color: 'var(--text-strong)', fontWeight: 600, lineHeight: 1.3 }}>{u.title}</div>
                    <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.4375rem', background: c, color: 'var(--ink-900)', padding: '3px 5px', flexShrink: 0, letterSpacing: '0.04em', alignSelf: 'flex-start' }}>SOON</span>
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 3 }}>{u.when}</div>
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
