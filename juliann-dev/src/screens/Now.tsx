import { useEffect, useState } from 'react'
import { Icon } from '@iconify/react'
import { Card } from '../components/ds/Card'
import { Badge } from '../components/ds/Badge'
import { ProgressBar } from '../components/ds/ProgressBar'
import { Tetromino } from '../components/ds/Tetromino'

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
        <Icon icon="pixelarticons:volume-2" style={{ fontSize: 13, color: c }} />
        <span style={{ fontFamily: 'var(--font-pixel)', fontSize: 11, color: 'var(--text-strong)', textTransform: 'uppercase' }}>Now playing on Spotify</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{
          width: 52, height: 52, flexShrink: 0, borderRadius: 'var(--radius-1)',
          background: `linear-gradient(135deg, ${c}, color-mix(in srgb, ${c} 40%, var(--ink-900)))`,
          boxShadow: 'inset 2px 2px 0 rgba(255,255,255,0.25), inset -2px -2px 0 rgba(0,0,0,0.35)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon icon="pixelarticons:music" style={{ fontSize: 22, color: 'var(--ink-900)' }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
            <div style={{ fontSize: 15, color: 'var(--text-strong)', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{song.title}</div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-faint)', flexShrink: 0 }}>{formatTime(elapsed)} / {formatTime(song.duration)}</span>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)', marginTop: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{song.artist} · {song.album}</div>
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

      <NowPlaying />

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
