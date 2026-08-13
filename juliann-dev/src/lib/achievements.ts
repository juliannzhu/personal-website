import { useSyncExternalStore } from 'react'

type Piece = 'i' | 'o' | 't' | 's' | 'z' | 'j' | 'l'
export interface SiteAch { id: string; title: string; desc: string; icon: string; piece: Piece }

// Achievements earned by exploring the SITE itself — separate from the in-game Tetris
// achievements. Progress persists in localStorage across visits.
export const SITE_ACHIEVEMENTS: SiteAch[] = [
  { id: 'welcome',       title: 'Welcome',       desc: 'Load the site for the first time.',    icon: 'pixelarticons:flag',        piece: 'i' },
  { id: 'explorer',      title: 'Explorer',      desc: 'Scroll through every section.',         icon: 'pixelarticons:map',         piece: 'o' },
  { id: 'side-quester',  title: 'Side Quester',  desc: 'Open a side quest.',                    icon: 'pixelarticons:heart',       piece: 't' },
  { id: 'completionist', title: 'Completionist', desc: 'Open all 15 side quests.',              icon: 'pixelarticons:checkbox-on', piece: 's' },
  { id: 'inspector',     title: 'Inspector',     desc: 'Open a project tile',      icon: 'pixelarticons:briefcase',   piece: 'j' },
  { id: 'film-buff',     title: 'Film Buff',     desc: 'Play a video clip.',                    icon: 'pixelarticons:play',        piece: 'z' },
  { id: 'hands-on',      title: 'Hands On',      desc: 'Drag a polaroid photo around.',         icon: 'pixelarticons:move',        piece: 'l' },
  { id: 'player-one',    title: 'Player One',    desc: 'Open the Tetris game.',                 icon: 'pixelarticons:gamepad',     piece: 'i' },
  { id: 'zen',           title: 'Zen Mode',      desc: 'Switch on reduced motion.',             icon: 'pixelarticons:zap-off',     piece: 's' },
  { id: 'paper-trail',   title: 'Paper Trail',   desc: 'Open the resume.',                      icon: 'pixelarticons:file',        piece: 'o' },
]

const TOTAL_QUESTS = 15   // keep in sync with QUESTS in SideQuests.tsx
const TOTAL_SECTIONS = 6  // home, about, projects, sidequests, now, contact

const UNLOCK_KEY = 'tj-site-achievements'
const PROG_KEY = 'tj-site-ach-progress'

let unlocked = new Set<string>()
let pages = new Set<string>()
let quests = new Set<string>()
const stateListeners = new Set<() => void>()
const toastListeners = new Set<(a: SiteAch) => void>()

if (typeof window !== 'undefined') {
  try {
    const u = JSON.parse(localStorage.getItem(UNLOCK_KEY) ?? '[]')
    if (Array.isArray(u)) unlocked = new Set(u)
    const p = JSON.parse(localStorage.getItem(PROG_KEY) ?? '{}')
    if (Array.isArray(p.pages)) pages = new Set(p.pages)
    if (Array.isArray(p.quests)) quests = new Set(p.quests)
  } catch {}
}

function persist() {
  try {
    localStorage.setItem(UNLOCK_KEY, JSON.stringify([...unlocked]))
    localStorage.setItem(PROG_KEY, JSON.stringify({ pages: [...pages], quests: [...quests] }))
  } catch {}
}

export function isUnlocked(id: string) { return unlocked.has(id) }

// Unlock an achievement. No-op if already earned. Fires a toast + re-renders viewers.
export function unlock(id: string) {
  if (unlocked.has(id)) return
  const ach = SITE_ACHIEVEMENTS.find((a) => a.id === id)
  if (!ach) return
  unlocked = new Set(unlocked)   // new ref so useSyncExternalStore re-renders
  unlocked.add(id)
  persist()
  stateListeners.forEach((l) => l())
  toastListeners.forEach((l) => l(ach))
}

// Progress trackers for the multi-step achievements.
export function markSection(section: string) {
  if (pages.has(section)) return
  pages = new Set(pages)
  pages.add(section)
  persist()
  if (pages.size >= TOTAL_SECTIONS) unlock('explorer')
}

export function markQuestOpened(id: string) {
  unlock('side-quester')
  if (quests.has(id)) return
  quests = new Set(quests)
  quests.add(id)
  persist()
  if (quests.size >= TOTAL_QUESTS) unlock('completionist')
}

function subscribeState(cb: () => void) { stateListeners.add(cb); return () => { stateListeners.delete(cb) } }
export function subscribeToast(cb: (a: SiteAch) => void) { toastListeners.add(cb); return () => { toastListeners.delete(cb) } }

// Hook: re-renders the caller whenever an achievement unlocks. Returns the unlocked-id set.
export function useUnlocked() {
  return useSyncExternalStore(subscribeState, () => unlocked, () => unlocked)
}
