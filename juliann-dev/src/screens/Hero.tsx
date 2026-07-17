import type { Screen } from '../components/layout/TopNav'
import { Badge } from '../components/ds/Badge'

const CSS = `
@keyframes tj-blink2 { 0%,55%{opacity:1} 56%,100%{opacity:0.25} }
.tj-heroname span{ display:inline-block; transition:transform 120ms var(--ease-snap); }
.tj-heroname span:hover{ transform:translateY(-6px); }
.tj-pressstart{ display:inline-flex; align-items:center; gap:12px; cursor:pointer;
  background:none; border:none; padding:6px 8px; font-family:var(--font-pixel); text-transform:uppercase;
  font-size:18px; color:var(--piece-o); letter-spacing:0.06em; text-shadow:0 3px 0 rgba(0,0,0,0.4); }
.tj-pressstart .tj-ps-label{ animation:tj-blink2 1.1s steps(1) infinite; }
.tj-pressstart:hover .tj-ps-label{ animation:none; }
.tj-pressstart:hover{ color:var(--piece-o-lit); }
.tj-pressstart:active{ transform:translateY(3px); }
`

let injected = false
function ensureCSS() {
  if (!injected && typeof document !== 'undefined') {
    const s = document.createElement('style')
    s.id = 'tj-hero-css'
    s.textContent = CSS
    document.head.appendChild(s)
    injected = true
  }
}

const NAME_COLORS = ['--piece-i','--piece-o','--piece-t','--piece-s','--piece-z','--piece-j','--piece-l'] as const

export function Hero({ onNav }: { onNav: (id: Screen) => void }) {
  ensureCSS()
  const name = 'JULIANN'
  return (
    <section className="tj-hero-section" style={{ position: 'relative', minHeight: 'calc(100vh - 58px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 24px' }}>
      <div style={{ position: 'relative', width: '100%', maxWidth: 680, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <Badge piece="s" dot>Now playing · CS @ UWATERLOO</Badge>
        </div>
        <h1 className="tj-heroname" style={{ fontFamily: 'var(--font-pixel)', fontSize: 'clamp(34px, 7vw, 68px)', lineHeight: 1.1, textAlign: 'center', margin: 0, textTransform: 'uppercase', letterSpacing: '0.02em' }}>
          {name.split('').map((ch, i) => (
            <span key={i} style={{ color: `var(${NAME_COLORS[i % NAME_COLORS.length]})`, textShadow: '0 4px 0 rgba(0,0,0,0.4)' }}>{ch}</span>
          ))}
        </h1>
        <p style={{ textAlign: 'center', maxWidth: 560, margin: '24px auto 0', fontSize: 18, color: 'var(--text-body)', lineHeight: 1.6 }}>
          Computer science major designing software that makes life a little easier.
          Figuring things out one block at a time.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 36 }}>
          <button className="tj-pressstart" onClick={() => onNav('about')}>
            <span style={{ color: 'var(--piece-o)' }}>▶</span>
            <span className="tj-ps-label">Press Start</span>
          </button>
        </div>
      </div>
    </section>
  )
}
