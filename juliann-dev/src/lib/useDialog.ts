import { useEffect, useRef } from 'react'

// What counts as keyboard-reachable. `video[controls]` matters here: the player is the main
// thing inside the quest lightboxes, and it's tabbable.
const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'video[controls]',
  'audio[controls]',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')

type Options = {
  // Leave off for a dialog that already handles Escape itself, so the key isn't acted on
  // twice. The Tetris overlay is the case in point: its Escape is context-sensitive (it must
  // not fire while the settings panel is open) and a second handler here would fight it.
  closeOnEscape?: boolean
}

/**
 * Gives a modal the keyboard behaviour people expect, and returns the ref for its container.
 *
 * - Escape closes it.
 * - Tab is trapped inside, so a keyboard user can't wander off into the page behind the
 *   overlay and start tabbing through links they can't see.
 * - Focus moves into the dialog when it opens and returns to whatever opened it when it
 *   closes, so dismissing a lightbox doesn't dump you back at the top of the page.
 *
 * The dialog element wants `tabIndex={-1}` (so it can take focus), `role="dialog"`,
 * `aria-modal="true"` and a label. Only call this from a component that mounts when the
 * dialog opens — the effect runs on mount, not on an `open` prop.
 */
export function useDialog<T extends HTMLElement>(onClose: () => void, { closeOnEscape = true }: Options = {}) {
  const ref = useRef<T>(null)

  // Held in refs so an inline arrow from the caller doesn't retrigger the effect — that would
  // tear down and re-run the whole thing, restoring focus, on every render.
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose
  const escapeRef = useRef(closeOnEscape)
  escapeRef.current = closeOnEscape

  useEffect(() => {
    const root = ref.current
    const restoreTo = document.activeElement as HTMLElement | null

    // Focus the container itself rather than the first control: a screen reader announces the
    // dialog and its label, and Tab moves on to the controls from there. Focusing the close
    // button instead would announce "close" as the first thing you hear.
    root?.focus()

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && escapeRef.current) {
        // Escape's first job is always to leave fullscreen. Closing the dialog underneath a
        // video the visitor had expanded would be the wrong thing and would lose their place.
        if (document.fullscreenElement) return
        e.stopPropagation()
        onCloseRef.current()
        return
      }
      if (e.key !== 'Tab' || !root) return

      const items = Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.offsetParent !== null)
      if (items.length === 0) {
        // Nothing to land on, so keep focus pinned to the dialog rather than letting Tab
        // wander out into the page underneath.
        e.preventDefault()
        root.focus()
        return
      }

      const first = items[0]
      const last = items[items.length - 1]
      const active = document.activeElement
      // `escaped` covers focus sitting on the container itself, where neither edge matches.
      const escaped = !active || !root.contains(active) || active === root

      if (e.shiftKey && (active === first || escaped)) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && (active === last || escaped)) {
        e.preventDefault()
        first.focus()
      }
    }

    // Capture phase, not bubble. A <video controls> player owns a shadow DOM full of native
    // buttons, and once focus is in there Chromium's media UI swallows Escape before a
    // bubble-phase listener on document would ever see it — so the lightbox wouldn't close.
    // Capturing gets us the key on the way down instead.
    document.addEventListener('keydown', onKeyDown, true)
    return () => {
      document.removeEventListener('keydown', onKeyDown, true)
      // Only restore if the opener is still around — the tile that launched a quest video can
      // itself be gone by the time the dialog closes.
      if (restoreTo && document.contains(restoreTo)) restoreTo.focus()
    }
  }, [])

  return ref
}
