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
`
let injected = false
function ensure() {
  if (!injected && typeof document !== 'undefined') {
    const s = document.createElement('style'); s.setAttribute('data-tj', 'reveal'); s.textContent = CSS; document.head.appendChild(s); injected = true
  }
}

export function RevealOnScroll({ children, className = '', style, threshold = 0.15 }: { children: ReactNode; className?: string; style?: CSSProperties; threshold?: number }) {
  ensure()
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { setVisible(true); io.unobserve(el) }
      })
    }, { threshold, rootMargin: '0px 0px -6% 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])

  return (
    <div ref={ref} className={['tj-reveal', visible ? 'tj-reveal--visible' : '', className].filter(Boolean).join(' ')} style={style}>
      {children}
    </div>
  )
}
