import { useSyncExternalStore } from 'react'
import type { Screen } from '../components/layout/TopNav'

// Real-path routing (not hash fragments) over the History API, so every view of the site
// has a URL someone can copy, share, or land on directly. Mirrors the reducedMotion/sound
// pattern: a small module holding the state, plus a useSyncExternalStore hook on top.
//
// Deep links only resolve on a server that serves index.html for unknown paths — see
// vercel.json's rewrite. Vercel checks the filesystem first, so /assets/*, /geomap/*, and
// /api/* still hit their real files.

export type Overlay = 'resume' | 'play'

// A route is the whole navigable state of the app: which section is showing, whether a
// project/quest detail is open inside it, and whether a full-screen overlay is up.
export type Route = {
  section: Screen
  project?: string
  quest?: string
  overlay?: Overlay
}

// The section id used internally ('sidequests') differs from the one in the URL ('quests'),
// which reads better in a link and matches the nav label.
const PATH_TO_SECTION: Record<string, Screen> = {
  '': 'home',
  about: 'about',
  projects: 'projects',
  quests: 'sidequests',
  now: 'now',
  contact: 'contact',
}

const SECTION_TO_PATH: Record<Screen, string> = {
  home: '/',
  about: '/about',
  projects: '/projects',
  sidequests: '/quests',
  now: '/now',
  contact: '/contact',
}

export function routeToPath(r: Route): string {
  if (r.overlay) return `/${r.overlay}`
  if (r.project) return `/projects/${encodeURIComponent(r.project)}`
  if (r.quest) return `/quests/${encodeURIComponent(r.quest)}`
  return SECTION_TO_PATH[r.section]
}

export function parsePath(pathname: string): Route {
  const [head = '', tail = ''] = pathname.replace(/^\/+|\/+$/g, '').split('/')

  if (head === 'resume') return { section: 'home', overlay: 'resume' }
  if (head === 'play') return { section: 'home', overlay: 'play' }

  const section = PATH_TO_SECTION[head]
  // Unknown path (typo, stale link, crawler noise) falls back to the home view rather
  // than rendering nothing. The id in `tail` is validated by the screen that consumes it.
  if (!section) return { section: 'home' }

  const id = tail ? decodeURIComponent(tail) : ''
  if (section === 'projects' && id) return { section, project: id }
  if (section === 'sidequests' && id) return { section, quest: id }
  return { section }
}

// ---- store ----------------------------------------------------------------------------

const listeners = new Set<() => void>()
let current: Route = typeof window === 'undefined' ? { section: 'home' } : parsePath(window.location.pathname)

// Each history entry we create is stamped with its depth, so `back()` can tell an entry we
// pushed (safe to pop) from a cold landing (where history.back() would leave the site).
let depth = 0

if (typeof window !== 'undefined') {
  // The scroll stack is an inner element, not the document, so the browser's own scroll
  // restoration has nothing useful to restore and only causes jumps.
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual'

  const state = history.state as { tjDepth?: number } | null
  depth = state?.tjDepth ?? 0
  if (state?.tjDepth == null) {
    history.replaceState({ tjDepth: depth }, '', window.location.pathname + window.location.search)
  }

  window.addEventListener('popstate', () => {
    depth = (history.state as { tjDepth?: number } | null)?.tjDepth ?? 0
    current = parsePath(window.location.pathname)
    listeners.forEach((l) => l())
  })
}

export function navigate(next: Route, { replace = false }: { replace?: boolean } = {}) {
  const path = routeToPath(next)
  if (path === routeToPath(current)) return

  if (replace) {
    history.replaceState({ tjDepth: depth }, '', path)
  } else {
    depth += 1
    history.pushState({ tjDepth: depth }, '', path)
  }
  current = next
  listeners.forEach((l) => l())
}

// Step back one entry if we put one there, otherwise rewrite the current entry to
// `fallback` — so "Back to Build Log" works the same whether the visitor clicked in from
// the grid or landed on the detail page from a shared link.
export function back(fallback: Route) {
  if (depth > 0) history.back()
  else navigate(fallback, { replace: true })
}

export function getRoute() {
  return current
}

function subscribe(cb: () => void) {
  listeners.add(cb)
  return () => { listeners.delete(cb) }
}

export function useRoute() {
  return useSyncExternalStore(subscribe, getRoute, getRoute)
}
