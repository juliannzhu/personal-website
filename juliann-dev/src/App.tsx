import { useState, useRef, useLayoutEffect, useEffect, useCallback, lazy, Suspense } from 'react'
import { TopNav, FixedFooter, type Screen } from './components/layout/TopNav'
import { AchievementToast } from './components/SiteAchievements'
import { unlock, markSection } from './lib/achievements'
import { useRoute, navigate, back, type Overlay } from './lib/router'
import { FallingField } from './components/layout/FallingField'
import { RevealOnScroll } from './components/ds/RevealOnScroll'
import { Hero } from './screens/Hero'
import { About } from './screens/About'
import { Projects, projectTitle } from './screens/Projects'
import { Now } from './screens/Now'
import { Contact } from './screens/Contact'
import { SideQuests, questTitle } from './screens/SideQuests'
import { HoldBox } from './features/tetris/HoldBox'
import { Loader } from './components/Loader'

// The game engine and the resume are full-screen overlays that most visitors never open,
// so they're split into their own chunks and fetched on demand instead of riding along in
// the initial bundle. HoldBox (always on screen) deliberately lives outside TetrisGame.tsx
// so importing it doesn't drag the engine back in.
const TetrisGame = lazy(() => import('./features/tetris/TetrisGame').then((m) => ({ default: m.TetrisGame })))
const ResumeScreen = lazy(() => import('./screens/ResumeScreen').then((m) => ({ default: m.ResumeScreen })))

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
  .tj-footer-inset { padding-right: 300px; }
  .tj-mobile-nav { display: none !important; }
  .tj-hero-wrap { padding-left: 248px; }
}

/* ---- mobile ---- */
@media (max-width: 720px) {
  /* Root rem scale shrinks down to 14px on desktop's fluid clamp, which reads too
     small on phones — hold it a step above the desktop baseline instead so every
     rem-sized description/caption/tag across the site bumps up together. */
  html { font-size: 17px !important; }

  nav { display: none !important; }
  .tj-mobile-nav { display: flex !important; }
  .tj-hud { display: none !important; }
  .tj-socials-header { display: none !important; }
  .tj-holdbox { display: none !important; }
  .tj-top-header { max-width: 100% !important; padding: 0 12px !important; gap: 8px !important; }

  /* Play/Resume/Sound in the header were flowing off the right edge on phones —
     drop them to icon-only squares so the row actually fits. */
  .tj-navbtn-label { display: none !important; }
  .tj-navbtn { padding: 7px !important; }

  /* Lock the page scroll to vertical only — any element that pokes past 100vw
     (fixed-width tiles, wide grids) no longer makes the whole page draggable
     sideways. Nested horizontal scrollers (quest carousel, filmstrip reel,
     mobile nav strip) each own their own scroll container, so this doesn't
     touch them. */
  .tj-scrollpane { overflow-x: hidden !important; }
  .tj-main { max-width: 100vw !important; }

  /* single-column grids */
  .tj-grid-3 { grid-template-columns: 1fr !important; }
  .tj-grid-2 { grid-template-columns: 1fr !important; }
  .tj-about-grid { grid-template-columns: 1fr !important; }
  .tj-contact-grid { grid-template-columns: 1fr !important; }
  .tj-stats-grid { grid-template-columns: 1fr !important; }

  /* Decorative 3D pieces are positioned for the wide desktop gutter — on a phone the
     About T piece lands off the right edge, so pull it into view but keep it clear of the
     full-width "About Me" title (which ends ~240px): sit it up in the right corner, past
     the text, letting its right edge peek off-screen like the falling-field pieces do.
     Nudge the Projects S piece up a little. (margin, not transform, so the float
     animation's own transform isn't clobbered.) */
  .tj-float-about-t { top: 8px !important; left: 244px !important; }
  .tj-float-projects-s { margin-top: -44px !important; }

  /* hero padding so it clears the mobile nav */
  .tj-hero-section { padding-top: 24px !important; }

  /* name is the first thing on the page — give it more presence than the general
     text bump above on its own would */
  .tj-heroname { font-size: clamp(2.75rem, 12vw, 4.25rem) !important; }

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
  now: <Now />,
  contact: <Contact />,
}

const SITE_TITLE = 'Juliann Zhu · Software Developer & CS Student @ UWaterloo'
const SECTION_TITLES: Record<Screen, string> = {
  home: SITE_TITLE,
  about: 'About · Juliann Zhu',
  projects: 'Project Portfolio · Juliann Zhu',
  sidequests: 'Side Quests · Juliann Zhu',
  now: 'Now · Juliann Zhu',
  contact: 'Contact · Juliann Zhu',
}

export default function App() {
  ensureCSS()
  // The URL is the source of truth for what's on screen: which section, whether a
  // project/quest detail is open inside it, and whether an overlay is up. Every one of
  // those states has a path someone can link to, and the browser's back/forward buttons
  // move through them for free.
  const route = useRoute()
  const activeSection = route.section
  const resumeOpen = route.overlay === 'resume'
  const gameOpen = route.overlay === 'play'

  const [loading, setLoading] = useState(true)
  const scrollPaneRef = useRef<HTMLDivElement>(null)
  const sectionRefs = useRef<Partial<Record<Screen, HTMLDivElement | null>>>({})
  const holdBoxRef = useRef<HTMLElement>(null)

  // Long-lived callbacks (the scroll-spy observer, `go`) need the live route without being
  // torn down and rebuilt on every navigation.
  const routeRef = useRef(route)
  routeRef.current = route

  // The section we last deliberately scrolled to. Anything that moves the scroll position
  // itself records it here, so the route-sync effect below can tell "the URL changed
  // because the user scrolled/clicked" (already in the right place, don't touch it) from
  // "the URL changed underneath us" (browser back/forward, or a cold deep link — scroll).
  const lastScrolledRef = useRef<Screen | null>(null)

  // False until the page has been put where the URL says it should be. The scroll-spy observes
  // from mount, which is while the loader is still up and the stack is still at the top — so
  // without this gate it reports "home", rewrites a /about deep link to /, and the landing
  // scroll below then sees nothing left to do.
  const settledRef = useRef(false)

  // Site-exploration achievements: unlock "Welcome" once the loader clears (so its toast
  // isn't hidden behind the loading screen), then mark each section as the scroll-spy
  // surfaces it (so scrolling OR clicking nav both count toward "Explorer").
  useEffect(() => { if (!loading) unlock('welcome') }, [loading])
  useEffect(() => { markSection(activeSection) }, [activeSection])

  useEffect(() => {
    document.title =
      route.overlay === 'resume' ? 'Resume · Juliann Zhu'
      : route.overlay === 'play' ? 'Play Tetris · Juliann Zhu'
      : route.project ? `${projectTitle(route.project) ?? 'Project Portfolio'} · Juliann Zhu`
      : route.quest ? `${questTitle(route.quest) ?? 'Side Quests'} · Juliann Zhu`
      : SECTION_TITLES[route.section]
  }, [route])

  // Every screen (including home) lives in one continuous scroll stack — navigating
  // anywhere, including to/from the hero, is always just a smooth scroll to that section.
  const go = useCallback((id: Screen) => {
    const r = routeRef.current
    const detailOpen = Boolean(r.project || r.quest)
    // Clicking the section you're already on does nothing, unless a detail page is open —
    // then it closes back out to the grid, which dropping the id from the URL does for us.
    if (r.section === id && !detailOpen) return
    lastScrolledRef.current = id
    navigate({ section: id })
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  const openProject = useCallback((id: string) => navigate({ section: 'projects', project: id }), [])
  const openQuest = useCallback((id: string) => navigate({ section: 'sidequests', quest: id }), [])
  const openOverlay = useCallback((overlay: Overlay) => navigate({ section: routeRef.current.section, overlay }), [])
  const closeTo = useCallback((section: Screen) => back({ section }), [])

  // Scroll-spy: keep the nav highlight and the URL in sync while the user free-scrolls the
  // stack. Uses replace, not push, so a scroll through the page doesn't bury the back
  // button under one entry per section.
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
      if (!best) return
      if (!settledRef.current) return
      // A detail page or an overlay owns the URL while it's open — the sections behind it
      // are still being observed, and letting them write would close it out from under us.
      const r = routeRef.current
      if (r.project || r.quest || r.overlay) return
      if (r.section === best) return
      lastScrolledRef.current = best
      navigate({ section: best }, { replace: true })
    }, { root, threshold: [0.15, 0.3, 0.45, 0.6, 0.75] })
    STACK_IDS.forEach((id) => { const el = sectionRefs.current[id]; if (el) io.observe(el) })
    return () => io.disconnect()
  }, [])

  // Bring the page to the section the URL names when we weren't the ones who moved it:
  // a cold landing on a deep link, or the browser's back/forward buttons. Overlays are
  // skipped — they cover the page, and scrolling behind them would lose the reader's spot.
  useEffect(() => {
    if (loading || route.overlay) return
    if (lastScrolledRef.current !== route.section) {
      const first = lastScrolledRef.current === null
      lastScrolledRef.current = route.section
      // The landing scroll is instant, so by the time the observer next reports, the stack is
      // already in the right place and the spy agrees with the URL instead of fighting it.
      sectionRefs.current[route.section]?.scrollIntoView({ behavior: first ? 'auto' : 'smooth', block: 'start' })
    }
    settledRef.current = true
  }, [route.section, route.overlay, loading])

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
  // 100dvh (not 100vh) so the shell tracks the mobile browser's dynamic chrome — with 100vh
  // the fixed footer sits below the true visible bottom as the toolbar retracts, letting page
  // content peek out beneath it.
  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <FallingField />
      <TopNav current={activeSection} onNav={go} onPlay={() => { unlock('player-one'); openOverlay('play') }} onResume={() => { unlock('paper-trail'); openOverlay('resume') }} />
      <HoldBox ref={holdBoxRef} onPlay={() => { unlock('player-one'); openOverlay('play') }} />
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
                <RevealOnScroll>{
                  id === 'sidequests' ? <SideQuests openId={route.quest ?? null} onOpen={openQuest} onBack={() => closeTo('sidequests')} />
                  : id === 'projects' ? <Projects openId={route.project ?? null} onOpen={openProject} onBack={() => closeTo('projects')} />
                  : STACK_SCREENS[id]
                }</RevealOnScroll>
              </div>
            ))}
          </main>
        </div>
      </div>
      <FixedFooter onNav={go} />
      {/* Both chunks are fetched on open (or on a cold /play or /resume landing). The
          fallback is empty rather than a spinner — the chunks are small enough that a
          flash of loading UI would be more disruptive than the wait. */}
      <Suspense fallback={null}>
        {gameOpen && <TetrisGame onClose={() => closeTo(routeRef.current.section)} />}
        {resumeOpen && <ResumeScreen onClose={() => closeTo(routeRef.current.section)} />}
      </Suspense>
      {loading && <Loader onDone={() => setLoading(false)} />}
      <AchievementToast />
    </div>
  )
}
