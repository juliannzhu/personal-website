import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from 'react'

const CSS = `
.tj-reveal {
  opacity: 0;
  transform: translateY(36px) scale(0.98);
  clip-path: inset(10% 0 10% 0);
  transition: opacity 700ms cubic-bezier(0.16,1,0.3,1), transform 700ms cubic-bezier(0.16,1,0.3,1), clip-path 700ms cubic-bezier(0.16,1,0.3,1);
  will-change: opacity, transform;
}
.tj-reveal--visible { opacity: 1; transform: translateY(0) scale(1); clip-path: inset(0 0 0 0); }
/* Once the reveal transition finishes, drop the clip-path entirely — otherwise it
   permanently clips anything inside that visually bleeds past this box (e.g. a
   tilted/rotated 3D decoration), even though the inset is nominally a no-op. */
.tj-reveal--settled { clip-path: none; }

/* Phone: sections are several times taller than the viewport, so a threshold measured as a
   fraction of the element meant scrolling a long way into a section that was still at
   opacity 0. The observer options are loosened below; here the motion itself is shortened
   so it reads as a settle rather than a slide, and the clip-path inset is dropped because
   on a short screen it hides a visible band of the section while it animates. */
@media (max-width: 720px) {
  .tj-reveal { transform: translateY(10px) scale(1); transition-duration: 300ms; }
  .tj-reveal, .tj-reveal--visible { clip-path: none; }
}
`
let injected = false
function ensure() {
  if (!injected && typeof document !== 'undefined') {
    const s = document.createElement('style'); s.setAttribute('data-tj', 'reveal'); s.textContent = CSS; document.head.appendChild(s); injected = true
  }
}

const mobile = () =>
  typeof window !== 'undefined' && window.matchMedia('(max-width: 720px)').matches

export function RevealOnScroll({ children, className = '', style, threshold = 0.15 }: { children: ReactNode; className?: string; style?: CSSProperties; threshold?: number }) {
  ensure()
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [settled, setSettled] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { setVisible(true); io.unobserve(el) }
      })
      // On a phone the element is much taller than the root, so any threshold expressed as a
      // fraction of the element resolves to hundreds of pixels of scrolling before it trips.
      // Fire on the first pixel instead, and expand the root downward so the section has
      // already begun revealing by the time it reaches the screen.
    }, mobile()
      ? { threshold: 0, rootMargin: '0px 0px 20% 0px' }
      : { threshold, rootMargin: '0px 0px -6% 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])

  useEffect(() => {
    if (!visible) return
    const t = setTimeout(() => setSettled(true), 720)
    return () => clearTimeout(t)
  }, [visible])

  return (
    <div ref={ref} className={['tj-reveal', visible ? 'tj-reveal--visible' : '', settled ? 'tj-reveal--settled' : '', className].filter(Boolean).join(' ')} style={style}>
      {children}
    </div>
  )
}
