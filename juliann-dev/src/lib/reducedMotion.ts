import { useSyncExternalStore } from 'react'

// In-app "reduce motion" setting. Mirrors the sound engine: a small module holding a
// persisted flag, plus a data attribute on <html> that global CSS keys off. Defaults to
// the OS `prefers-reduced-motion` preference on first visit, then remembers the choice.
const KEY = 'tj-reduced-motion'
const listeners = new Set<() => void>()
let reduced = false

function apply() {
  if (typeof document === 'undefined') return
  const el = document.documentElement
  if (reduced) el.setAttribute('data-reduce-motion', 'true')
  else el.removeAttribute('data-reduce-motion')
}

// Initialize on module load (imports resolve before first paint, so no flash of motion).
if (typeof window !== 'undefined') {
  try {
    const saved = localStorage.getItem(KEY)
    reduced = saved != null ? saved === '1' : window.matchMedia('(prefers-reduced-motion: reduce)').matches
  } catch { reduced = false }
  apply()
}

export function isReduced() { return reduced }

export function setReduced(on: boolean) {
  reduced = on
  try { localStorage.setItem(KEY, on ? '1' : '0') } catch {}
  apply()
  listeners.forEach((l) => l())
}

function subscribe(cb: () => void) {
  listeners.add(cb)
  return () => { listeners.delete(cb) }
}

// React hook: re-renders the caller whenever the setting changes.
export function useReducedMotion() {
  return useSyncExternalStore(subscribe, isReduced, isReduced)
}
