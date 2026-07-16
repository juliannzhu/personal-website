const PIECES = ['i', 'o', 't', 's', 'z', 'j', 'l'] as const

const drops = Array.from({ length: 18 }, (_, i) => ({
  p: PIECES[i % 7],
  left: (i * 5.6 + 2) % 97,
  size: 18 + (i % 4) * 8,
  dur: 9 + (i % 6) * 2.3,
  delay: -(i * 1.4),
  rot: i % 2 ? 90 : -90,
}))

const CSS = `
@keyframes tj-fallfield { 0%{ transform:translateY(-160px) rotate(0deg); } 100%{ transform:translateY(110vh) rotate(var(--rot,90deg)); } }
.tj-fallfield-piece{ position:absolute; top:0; opacity:0.15; animation:tj-fallfield linear infinite; will-change:transform; }
`
let injected = false
function ensureCSS() {
  if (!injected && typeof document !== 'undefined') {
    const s = document.createElement('style')
    s.id = 'tj-fallfield-css'
    s.textContent = CSS
    document.head.appendChild(s)
    injected = true
  }
}

export function FallingField() {
  ensureCSS()
  return (
    <div aria-hidden="true" style={{ position: 'fixed', top: 80, bottom: 80, left: 0, right: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {drops.map((d, i) => (
        <img
          key={i}
          src={`/assets/pieces/${d.p}.svg`}
          className="tj-fallfield-piece"
          style={{ left: `${d.left}%`, height: d.size, ['--rot' as string]: `${d.rot}deg`, animationDuration: `${d.dur}s`, animationDelay: `${d.delay}s` }}
        />
      ))}
    </div>
  )
}
