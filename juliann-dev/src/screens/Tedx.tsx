import { useEffect, useState } from 'react'
import { Tetromino } from '../components/ds/Tetromino'

type Piece = 'i' | 'o' | 't' | 's' | 'z' | 'j' | 'l'

const PHOTOGRAPHER = { name: 'Lindsey Gibeau', url: 'https://lindseygibeauphotography.com/' }
const EVENT_URL = 'https://www.tedxottawa.net/'
const photo = (id: string) => `/assets/tedx/TED_X__LGP${id}.jpg`

// Shown above the photos, in the same voice as the Notes on a project page.
const NOTE = "My talk explores what happens to our memories when they all live behind our screens. I took the stage at TEDxOttawa alongside 11 other incredible speakers. I started with just an idea, and I'm leaving with a talk that's authentically mine and a group of people I'm lucky to call family."

// Each part follows a section of the script. `idea` is a line from that section, and
// `photo` is the still shown on the screen while the part is selected.
const PARTS: { piece: Piece; title: string; idea: string; photo: string; alt: string; focus?: string }[] = [
  { piece: 'i', title: 'Opening',
    idea: 'We have become the most documented generation in human history. We assume that because everything is stored, everything will be remembered. But what if the opposite is true?',
    photo: photo('2062'), alt: 'Juliann mid-gesture on stage in front of the TEDx letters', focus: 'center 64%' },
  { piece: 'o', title: 'History and paradox',
    idea: 'Ironically, the generation documenting itself the most may ultimately leave behind the least.',
    photo: photo('2063'), alt: 'Wide view of Juliann on the red circle at TEDxOttawa, with the audience in the foreground' },
  { piece: 't', title: 'Data vs. meaning',
    idea: "We've solved the problem of recording our lives. And in solving it, we've optimized memories for convenience, not longevity.",
    photo: photo('2088'), alt: 'A full TEDxOttawa audience applauding as Juliann stands on stage' },
  { piece: 'z', title: 'Continuum',
    idea: "Someday, your children might find a trace of the life you lived. They won't see a timestamp or a file size. Instead, they'll see the meaning.",
    photo: photo('2612'), alt: 'Juliann with the TEDxOttawa 2026 group behind the TEDx letters, under a slide reading Join us next year' },
  { piece: 's', title: 'Closing',
    idea: 'Every generation inherits a story, and every generation gets to decide which parts of that story survive. What will you leave behind?',
    photo: photo('2101'), alt: 'An audience member in a TEDxOttawa lanyard writing a note on her lap' },
]

const CSS = `
.tj-tedx-grid { display: grid; grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr); gap: 40px; align-items: stretch; }
.tj-tedx-col { display: flex; flex-direction: column; }
.tj-tedx-level { transition: border-color 120ms, background 120ms, box-shadow 120ms; }
.tj-tedx-level:hover { border-color: var(--border-strong) !important; background: var(--surface-raised) !important; }
.tj-tedx-level:focus-visible { outline: 2px solid var(--piece-i); outline-offset: 2px; }
.tj-tedx-btn { transition: filter 120ms, transform 120ms; }
.tj-tedx-btn:hover { filter: brightness(1.12); transform: translateY(-1px); }
@keyframes tj-flash {
  0%, 100% { box-shadow: 0 0 0 0 transparent; }
  20%, 65% { box-shadow: 0 0 0 3px var(--piece-o), 0 0 26px color-mix(in srgb, var(--piece-o) 60%, transparent); }
}
.tj-flash { animation: tj-flash 1.4s ease-in-out; }
@media (max-width: 720px) {
  .tj-tedx-grid { grid-template-columns: 1fr; gap: 28px; }
}
`
// Scrolls to the TEDx card in Now's "Coming soon" list, then pulses it once it's in view so
// the visitor knows which card the button meant.
function showComingSoon(e: React.MouseEvent) {
  const card = document.getElementById('now-tedx')
  if (!card) return
  e.preventDefault()
  card.scrollIntoView({ behavior: 'smooth', block: 'center' })
  const flash = () => { card.classList.remove('tj-flash'); void card.offsetWidth; card.classList.add('tj-flash') }
  const io = new IntersectionObserver(([entry]) => {
    if (entry.intersectionRatio >= 0.9) { io.disconnect(); clearTimeout(fallback); flash() }
  }, { threshold: 0.9 })
  const fallback = setTimeout(() => { io.disconnect(); flash() }, 1500)
  io.observe(card)
}

let injected = false
function ensureTedxCSS() {
  if (!injected && typeof document !== 'undefined') {
    const s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s); injected = true
  }
}

export function Tedx() {
  ensureTedxCSS()
  const [active, setActive] = useState(0)
  const part = PARTS[active]
  const c = `var(--piece-${part.piece})`

  // Warm the cache so flipping between parts swaps the still without a blank frame.
  useEffect(() => { PARTS.forEach((l) => { new Image().src = l.photo }) }, [])

  return (
    <section style={{ maxWidth: 1080, margin: '0 auto', padding: '48px 24px' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--piece-o)' }}>// Speaker mode</div>
      <h2 style={{ fontFamily: 'var(--font-pixel)', fontSize: '1.625rem', color: 'var(--text-strong)', margin: '14px 0 12px', textTransform: 'uppercase' }}>TEDx Talk</h2>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--text-muted)', margin: 0 }}>The Paradox of Digital Permanence · TEDxOttawa · Nov 7, 2026</p>

      <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.7, margin: '24px 0 32px' }}>{NOTE}</p>

      <div className="tj-tedx-grid">
        <div className="tj-tedx-col">
          {/* The "screen": a framed still with a part readout and a segmented progress bar. */}
          <div style={{ background: 'var(--bg-well)', border: '3px solid var(--border-hairline)', padding: 14 }}>
            <div style={{ position: 'relative', aspectRatio: '16 / 9', overflow: 'hidden', background: 'var(--ink-800)' }}>
              <img src={part.photo} alt={part.alt} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: part.focus ?? 'center', display: 'block' }} />
              <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'var(--scanlines)', backgroundSize: '100% 4px', opacity: 0.35, pointerEvents: 'none' }} />
              <a href={PHOTOGRAPHER.url} target="_blank" rel="noopener noreferrer" style={{ position: 'absolute', bottom: 8, left: 10, fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'rgba(255,255,255,0.75)', background: 'rgba(5,5,9,0.6)', padding: '3px 7px', textDecoration: 'none' }}>Photo: {PHOTOGRAPHER.name}</a>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, marginTop: 14 }}>
              <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.75rem', color: c, textTransform: 'uppercase' }}>Part {active + 1} · {part.title}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>VIDEO COMING SOON</span>
            </div>
            <div style={{ display: 'flex', gap: 4, marginTop: 12 }}>
              {PARTS.map((l, i) => {
                return (
                  <span key={l.title} style={{
                    flexGrow: 1, height: 8,
                    background: `var(--piece-${l.piece})`,
                    boxShadow: `inset 0 -2px 0 var(--piece-${l.piece}-dim)`,
                    opacity: i <= active ? 1 : 0.22,
                    transition: 'opacity 200ms',
                  }} />
                )
              })}
            </div>
          </div>

          <p style={{ margin: '12px 0 0', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-faint)', lineHeight: 1.6 }}>
            Photography by <a href={PHOTOGRAPHER.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--piece-i)' }}>{PHOTOGRAPHER.name} ↗</a>. Huge thank you for capturing the day.
          </p>

          <div style={{ marginTop: 14, flex: 1, background: 'var(--surface-raised)', border: '2px solid var(--border-hairline)', borderLeft: `4px solid ${c}`, padding: '14px 20px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: 8 }}>Key idea</div>
            {/* Every idea sits in the same grid cell so the box is always as tall as the longest
                one, and switching parts never shifts the layout. */}
            <div style={{ display: 'grid' }}>
              {PARTS.map((p, i) => (
                <p key={p.title} aria-hidden={i !== active} style={{ gridArea: '1 / 1', margin: 0, fontSize: '0.9375rem', color: 'var(--text-strong)', lineHeight: 1.55, visibility: i === active ? 'visible' : 'hidden' }}>{p.idea}</p>
              ))}
            </div>
          </div>
        </div>

        <div className="tj-tedx-col">
          <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.9375rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 16 }}>Inside the talk</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16, flex: 1 }}>
            {PARTS.map((l, i) => {
              const on = i === active
              const lc = `var(--piece-${l.piece})`
              return (
                <button
                  key={l.title}
                  type="button"
                  className="tj-tedx-level"
                  aria-pressed={on}
                  onClick={() => setActive(i)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 18, width: '100%', flex: 1, textAlign: 'left', cursor: 'pointer',
                    padding: '8px 18px',
                    background: on ? `color-mix(in srgb, ${lc} 8%, var(--bg-well))` : 'var(--bg-well)',
                    border: `2px solid ${on ? lc : 'var(--border-hairline)'}`,
                    boxShadow: on ? `0 0 14px color-mix(in srgb, ${lc} 45%, transparent)` : 'none',
                    color: 'inherit', font: 'inherit',
                  }}
                >
                  <span style={{ width: 40, display: 'flex', justifyContent: 'center', flexShrink: 0 }}><Tetromino piece={l.piece} size={l.piece === 'i' ? 7 : 8} /></span>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: 'block', fontFamily: 'var(--font-pixel)', fontSize: '0.75rem', color: 'var(--text-strong)', textTransform: 'uppercase' }}>{l.title}</span>
                    <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-faint)', marginTop: 6 }}>PART {i + 1}</span>
                  </span>
                </button>
              )
            })}
          </div>

          {/* The recording isn't out yet, so this points at its card on the Now page. Swap the
              href for the video once it's up, and drop the onClick. */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 'auto' }}>
            <a className="tj-tedx-btn" href="/now" onClick={showComingSoon} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '16px 12px',
              background: 'var(--piece-o)', color: 'var(--ink-900)', textDecoration: 'none',
              boxShadow: 'inset 2px 2px 0 var(--piece-o-lit), inset -2px -2px 0 var(--piece-o-dim)',
              fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer',
            }}>▶ Video coming soon</a>
            <a className="tj-tedx-btn" href={EVENT_URL} target="_blank" rel="noopener noreferrer" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '16px 12px',
              background: 'var(--bg-well)', color: 'var(--text-strong)', textDecoration: 'none',
              border: '2px solid var(--border-strong)',
              fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer',
            }}>TEDxOttawa ↗</a>
          </div>
        </div>
      </div>
    </section>
  )
}
