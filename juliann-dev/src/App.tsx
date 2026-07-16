import { useState, useRef, useLayoutEffect, useCallback } from 'react'
import { TopNav, FixedFooter, type Screen } from './components/layout/TopNav'
import { FallingField } from './components/layout/FallingField'
import { Hero } from './screens/Hero'
import { About } from './screens/About'
import { Projects } from './screens/Projects'
import { Now } from './screens/Now'
import { Contact } from './screens/Contact'
import { SideQuests } from './screens/SideQuests'
import { TetrisGame, HoldBox } from './features/tetris/TetrisGame'
import { Loader } from './components/Loader'

const CSS = `
/* ---- page transitions ---- */
@keyframes tj-elem-fall {
  0%   { transform: translateY(0)    scaleY(1);    opacity: 1; }
  100% { transform: translateY(62px) scaleY(0.94); opacity: 0; }
}
@keyframes tj-elem-drop {
  0%   { transform: translateY(-60px) scaleY(1.06); opacity: 0; }
  55%  { opacity: 1; }
  78%  { transform: translateY(7px)   scaleY(0.96); }
  100% { transform: translateY(0)     scaleY(1);    opacity: 1; }
}

/* ---- CRT effects ---- */
body::after {
  content: ""; position: fixed; inset: 0; pointer-events: none; z-index: 9999;
  background-image: var(--scanlines); background-size: 100% 4px; opacity: 0.5; mix-blend-mode: multiply;
}
body::before {
  content: ""; position: fixed; inset: 0; pointer-events: none; z-index: 9998;
  background: radial-gradient(120% 120% at 50% 40%, transparent 55%, rgba(0,0,0,0.45) 100%);
}

/* ---- desktop: push content left of sidebar ---- */
@media (min-width: 721px) {
  .tj-main { padding-right: 300px; }
  .tj-mobile-nav { display: none !important; }
}

/* ---- mobile ---- */
@media (max-width: 720px) {
  nav { display: none !important; }
  .tj-mobile-nav { display: flex !important; }
  .tj-hud { display: none !important; }
  .tj-socials-header { display: none !important; }
  .tj-holdbox { display: none !important; }
  .tj-top-header { max-width: 100% !important; }

  /* single-column grids */
  .tj-grid-3 { grid-template-columns: 1fr !important; }
  .tj-grid-2 { grid-template-columns: 1fr !important; }
  .tj-about-grid { grid-template-columns: 1fr !important; }
  .tj-contact-grid { grid-template-columns: 1fr !important; }
  .tj-stats-grid { grid-template-columns: 1fr 1fr !important; }

  /* hero padding so it clears the mobile nav */
  .tj-hero-section { padding-top: 24px !important; }

  /* reduce section padding */
  section { padding-left: 16px !important; padding-right: 16px !important; }

  /* footer: shorten copyright text on tiny screens */
  .tj-footer-copy { font-size: 9px !important; }
}
`
let cssInjected = false
function ensureCSS() {
  if (!cssInjected && typeof document !== 'undefined') {
    const s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s); cssInjected = true
  }
}

const STEP = 60, OUT_MS = 220, IN_MS = 340, CAP = 680

function collectRows(root: HTMLElement): Element[] {
  let node: Element | null = root.querySelector('section') || root.firstElementChild
  if (!node) return []
  while (node.children.length === 1 && node.children[0].children.length) node = node.children[0]
  const out: Element[] = []
  Array.from(node.children).forEach((child) => {
    const cs = getComputedStyle(child)
    const isGroup = child.children.length > 1 && (cs.display === 'grid' || cs.display === 'flex')
    if (isGroup) out.push(...Array.from(child.children))
    else out.push(child)
  })
  return out
}

const stepFor = (n: number) => n > 1 ? Math.min(STEP, CAP / (n - 1)) : STEP

export default function App() {
  ensureCSS()
  const [screen, setScreen] = useState<Screen>('home')
  const [loading, setLoading] = useState(true)
  const [gameOpen, setGameOpen] = useState(false)
  const [transId, setTransId] = useState(0)
  const mainRef = useRef<HTMLElement>(null)
  const firstLoad = useRef(true)
  const navTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const go = useCallback((id: Screen) => {
    if (id === screen) return
    clearTimeout(navTimer.current)
    const rows = mainRef.current ? collectRows(mainRef.current) : []
    const n = rows.length
    const step = stepFor(n)
    rows.forEach((el, i) => {
      const order = n - 1 - i
      ;(el as HTMLElement).style.animation = `tj-elem-fall ${OUT_MS}ms cubic-bezier(0.5,0,0.75,0) ${Math.round(order * step)}ms forwards`
    })
    const outTotal = OUT_MS + Math.max(0, n - 1) * step + 20
    navTimer.current = setTimeout(() => {
      setScreen(id)
      window.scrollTo({ top: 0 })
      setTransId(t => t + 1)
    }, outTotal)
  }, [screen])

  useLayoutEffect(() => {
    if (firstLoad.current) { firstLoad.current = false; return }
    const rows = mainRef.current ? collectRows(mainRef.current) : []
    const n = rows.length
    const step = stepFor(n)
    rows.forEach((el, i) => {
      const order = n - 1 - i
      ;(el as HTMLElement).style.animation = `tj-elem-drop ${IN_MS}ms var(--ease-snap) ${Math.round(order * step)}ms both`
    })
    const total = IN_MS + Math.max(0, n - 1) * step + 80
    const clearT = setTimeout(() => { rows.forEach(el => { (el as HTMLElement).style.animation = '' }) }, total)
    return () => clearTimeout(clearT)
  }, [transId])

  const isHome = screen === 'home'

  let view: React.ReactNode
  if (screen === 'home')            view = <Hero onNav={go} />
  else if (screen === 'about')      view = <About />
  else if (screen === 'projects')   view = <Projects />
  else if (screen === 'now')        view = <Now />
  else if (screen === 'sidequests') view = <SideQuests />
  else if (screen === 'contact')    view = <Contact />

  // Footer height: 2px border + 6px rainbow + ~78px copyright row (28px padding each side) = ~86px
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: isHome ? 'hidden' : 'auto', paddingBottom: 86 }}>
      <FallingField />
      <TopNav current={screen} onNav={go} onPlay={() => setGameOpen(true)} />
      <aside className="tj-holdbox" style={{ display: isHome ? undefined : 'none' }}>
        {isHome && <HoldBox onPlay={() => setGameOpen(true)} />}
      </aside>
      <div style={{ position: 'relative', zIndex: 1, flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <main ref={mainRef} className="tj-main" style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', paddingLeft: isHome ? 248 : undefined }}>
          {view}
        </main>
      </div>
      <FixedFooter onNav={go} />
      {gameOpen && <TetrisGame onClose={() => setGameOpen(false)} />}
      {loading && <Loader onDone={() => setLoading(false)} />}
    </div>
  )
}
