import { useState, useRef, useLayoutEffect, useCallback } from 'react'
import { TopNav, FixedFooter, type Screen } from './components/layout/TopNav'
import { FallingField } from './components/layout/FallingField'
import { RevealOnScroll } from './components/ds/RevealOnScroll'
import { Hero } from './screens/Hero'
import { About } from './screens/About'
import { Projects } from './screens/Projects'
import { Now } from './screens/Now'
import { Contact } from './screens/Contact'
import { SideQuests } from './screens/SideQuests'
import { TetrisGame, HoldBox } from './features/tetris/TetrisGame'
import { Loader } from './components/Loader'

type StackId = Exclude<Screen, 'home'>
const STACK_IDS: StackId[] = ['about', 'projects', 'sidequests', 'now', 'contact']
const SCROLL_MASK = 'linear-gradient(to bottom, transparent 0, black 56px, black calc(100% - 56px), transparent 100%)'

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
  .tj-radar-grid { grid-template-columns: 1fr !important; }

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

const STACK_SCREENS: Record<StackId, React.ReactNode> = {
  about: <About />,
  projects: <Projects />,
  sidequests: <SideQuests />,
  now: <Now />,
  contact: <Contact />,
}

export default function App() {
  ensureCSS()
  const [screen, setScreen] = useState<Screen>('home')
  const [activeSection, setActiveSection] = useState<StackId>('about')
  const [loading, setLoading] = useState(true)
  const [gameOpen, setGameOpen] = useState(false)
  const [transId, setTransId] = useState(0)
  const mainRef = useRef<HTMLElement>(null)
  const scrollPaneRef = useRef<HTMLDivElement>(null)
  const sectionRefs = useRef<Partial<Record<StackId, HTMLDivElement | null>>>({})
  const firstLoad = useRef(true)
  const navTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const pendingTarget = useRef<StackId | null>(null)

  const go = useCallback((id: Screen) => {
    // Already inside the continuous stack: just smooth-scroll to the section, no remount.
    if (screen !== 'home' && id !== 'home') {
      if (id === activeSection) return
      sectionRefs.current[id as StackId]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setActiveSection(id as StackId)
      return
    }
    if (id === screen) return
    clearTimeout(navTimer.current)
    const outRoot = screen !== 'home' ? sectionRefs.current[activeSection] ?? mainRef.current : mainRef.current
    const rows = outRoot ? collectRows(outRoot) : []
    const n = rows.length
    const step = stepFor(n)
    rows.forEach((el, i) => {
      const order = n - 1 - i
      ;(el as HTMLElement).style.animation = `tj-elem-fall ${OUT_MS}ms cubic-bezier(0.5,0,0.75,0) ${Math.round(order * step)}ms forwards`
    })
    const outTotal = OUT_MS + Math.max(0, n - 1) * step + 20
    if (id !== 'home') pendingTarget.current = id as StackId
    navTimer.current = setTimeout(() => {
      setScreen(id)
      if (id !== 'home') setActiveSection(id as StackId)
      else if (scrollPaneRef.current) scrollPaneRef.current.scrollTop = 0
      setTransId(t => t + 1)
    }, outTotal)
  }, [screen, activeSection])

  useLayoutEffect(() => {
    if (firstLoad.current) { firstLoad.current = false; return }
    let root: HTMLElement | null = mainRef.current
    if (pendingTarget.current) {
      const el = sectionRefs.current[pendingTarget.current]
      if (el) { el.scrollIntoView({ block: 'start' }); root = el }
      pendingTarget.current = null
    }
    const rows = root ? collectRows(root) : []
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

  // Scroll-spy: keep nav highlight in sync while the user free-scrolls the stack.
  useLayoutEffect(() => {
    if (screen === 'home') return
    const root = scrollPaneRef.current
    if (!root) return
    const ratios = new Map<StackId, number>()
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const id = (entry.target as HTMLElement).dataset.section as StackId
        ratios.set(id, entry.intersectionRatio)
      })
      let best: StackId | null = null
      let bestRatio = 0
      ratios.forEach((ratio, id) => { if (ratio > bestRatio) { bestRatio = ratio; best = id } })
      if (best) setActiveSection(best)
    }, { root, threshold: [0.15, 0.3, 0.45, 0.6, 0.75] })
    STACK_IDS.forEach((id) => { const el = sectionRefs.current[id]; if (el) io.observe(el) })
    return () => io.disconnect()
  }, [screen])

  const isHome = screen === 'home'

  // Footer height: 2px border + 6px rainbow + ~78px copyright row (28px padding each side) = ~86px
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <FallingField />
      <TopNav current={isHome ? 'home' : activeSection} onNav={go} onPlay={() => setGameOpen(true)} />
      <aside className="tj-holdbox" style={{ display: isHome ? undefined : 'none' }}>
        {isHome && <HoldBox onPlay={() => setGameOpen(true)} />}
      </aside>
      <div style={{ position: 'relative', zIndex: 1, flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <div
          ref={scrollPaneRef}
          className="tj-scrollpane"
          style={{
            flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column',
            overflow: isHome ? 'hidden' : 'auto', paddingBottom: 86,
            WebkitMaskImage: isHome ? undefined : SCROLL_MASK,
            maskImage: isHome ? undefined : SCROLL_MASK,
          }}
        >
          <main ref={mainRef} className="tj-main" style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', paddingLeft: isHome ? 248 : undefined }}>
            {isHome ? (
              <Hero onNav={go} />
            ) : (
              STACK_IDS.map((id) => (
                <div key={id} data-section={id} ref={(el) => { sectionRefs.current[id] = el }}>
                  <RevealOnScroll>{STACK_SCREENS[id]}</RevealOnScroll>
                </div>
              ))
            )}
          </main>
        </div>
      </div>
      <FixedFooter onNav={go} />
      {gameOpen && <TetrisGame onClose={() => setGameOpen(false)} />}
      {loading && <Loader onDone={() => setLoading(false)} />}
    </div>
  )
}
