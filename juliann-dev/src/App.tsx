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
import { ResumeScreen } from './screens/ResumeScreen'

const STACK_IDS: Screen[] = ['home', 'about', 'projects', 'sidequests', 'now', 'contact']
const SCROLL_MASK = 'linear-gradient(to bottom, transparent 0, black 56px, black calc(100% - 56px), transparent 100%)'
const HOLDBOX_FADE_DISTANCE = 420

const CSS = `
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
  .tj-hero-wrap { padding-left: 248px; }
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
  .tj-footer-copy { font-size:0.5625rem !important; }
}
`
let cssInjected = false
function ensureCSS() {
  if (!cssInjected && typeof document !== 'undefined') {
    const s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s); cssInjected = true
  }
}

type StackScreenId = Exclude<Screen, 'home'>
const REST_IDS: StackScreenId[] = ['about', 'projects', 'sidequests', 'now', 'contact']
const STACK_SCREENS: Partial<Record<StackScreenId, React.ReactNode>> = {
  about: <About />,
  projects: <Projects />,
  now: <Now />,
  contact: <Contact />,
}

export default function App() {
  ensureCSS()
  const [activeSection, setActiveSection] = useState<Screen>('home')
  const [loading, setLoading] = useState(true)
  const [gameOpen, setGameOpen] = useState(false)
  const [resumeOpen, setResumeOpen] = useState(false)
  // Bumped whenever "Quests" is clicked while already on the side quests section, so a
  // quest detail page that's open can be told to close back to the grid of tiles.
  const [questsResetTick, setQuestsResetTick] = useState(0)
  const scrollPaneRef = useRef<HTMLDivElement>(null)
  const sectionRefs = useRef<Partial<Record<Screen, HTMLDivElement | null>>>({})
  const holdBoxRef = useRef<HTMLElement>(null)

  // Every screen (including home) lives in one continuous scroll stack — navigating
  // anywhere, including to/from the hero, is always just a smooth scroll to that section.
  const go = useCallback((id: Screen) => {
    if (id === activeSection) {
      if (id === 'sidequests') setQuestsResetTick((t) => t + 1)
      return
    }
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setActiveSection(id)
  }, [activeSection])

  // Scroll-spy: keep nav highlight in sync while the user free-scrolls the stack.
  useLayoutEffect(() => {
    const root = scrollPaneRef.current
    if (!root) return
    const ratios = new Map<Screen, number>()
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const id = (entry.target as HTMLElement).dataset.section as Screen
        ratios.set(id, entry.intersectionRatio)
      })
      let best: Screen | null = null
      let bestRatio = 0
      ratios.forEach((ratio, id) => { if (ratio > bestRatio) { bestRatio = ratio; best = id } })
      if (best) setActiveSection(best)
    }, { root, threshold: [0.15, 0.3, 0.45, 0.6, 0.75] })
    STACK_IDS.forEach((id) => { const el = sectionRefs.current[id]; if (el) io.observe(el) })
    return () => io.disconnect()
  }, [])

  // Drive the HoldBox's drift/fade directly off scroll position (not React state) so it
  // animates smoothly on every scroll tick instead of snapping at a visibility threshold.
  useLayoutEffect(() => {
    const root = scrollPaneRef.current
    const el = holdBoxRef.current
    if (!root || !el) return
    let raf = 0
    const update = () => {
      const p = Math.min(1, root.scrollTop / HOLDBOX_FADE_DISTANCE)
      el.style.opacity = String(1 - p)
      el.style.transform = `translate(${-80 * p}px, calc(-50% - ${60 * p}px))`
      el.style.pointerEvents = p >= 1 ? 'none' : 'auto'
    }
    update()
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update) }
    root.addEventListener('scroll', onScroll, { passive: true })
    return () => { root.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf) }
  }, [])

  // Footer height: 2px border + 6px rainbow + ~78px copyright row (28px padding each side) = ~86px
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <FallingField />
      <TopNav current={activeSection} onNav={go} onPlay={() => setGameOpen(true)} onResume={() => setResumeOpen(true)} />
      <HoldBox ref={holdBoxRef} onPlay={() => setGameOpen(true)} />
      <div style={{ position: 'relative', zIndex: 1, flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <div
          ref={scrollPaneRef}
          className="tj-scrollpane"
          style={{
            flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column',
            overflow: 'auto', paddingBottom: 86,
            WebkitMaskImage: SCROLL_MASK,
            maskImage: SCROLL_MASK,
          }}
        >
          <main className="tj-main" style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
            <div className="tj-hero-wrap" data-section="home" ref={(el) => { sectionRefs.current.home = el }}>
              <RevealOnScroll><Hero onNav={go} play={!loading} /></RevealOnScroll>
            </div>
            {REST_IDS.map((id) => (
              <div key={id} data-section={id} ref={(el) => { sectionRefs.current[id] = el }}>
                <RevealOnScroll>{id === 'sidequests' ? <SideQuests resetSignal={questsResetTick} /> : STACK_SCREENS[id]}</RevealOnScroll>
              </div>
            ))}
          </main>
        </div>
      </div>
      <FixedFooter onNav={go} />
      {gameOpen && <TetrisGame onClose={() => setGameOpen(false)} />}
      {resumeOpen && <ResumeScreen onClose={() => setResumeOpen(false)} />}
      {loading && <Loader onDone={() => setLoading(false)} />}
    </div>
  )
}
