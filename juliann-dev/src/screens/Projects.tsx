import { useState, useEffect, useRef } from 'react'
import { Icon } from '@iconify/react'
import { Card } from '../components/ds/Card'
import { Tag } from '../components/ds/Tag'
import { Button } from '../components/ds/Button'
import { Tetromino } from '../components/ds/Tetromino'
import { IconButton } from '../components/ds/IconButton'
import { ScrollTetromino3D } from '../components/ScrollTetromino3D'

type Piece = 'i' | 'o' | 't' | 's' | 'z' | 'j' | 'l'
type Cat = 'all' | 'web' | 'ai' | 'systems' | 'research'

// images live in /public/assets/build-log/<ProjectName>/ — add screenshots and list them in each
// project's `images` array. An entry may be a plain URL or `{ src, caption }` to caption that slide.
type ProjectImage = string | { src: string; caption?: string }
type Project = { id: string; title: string; piece: Piece; tagline: string; tags: string[]; cat: Exclude<Cat, 'all'>; year: string; link?: string; github?: string; devpost?: string; images?: ProjectImage[] }

// images live in /public/assets/build-log/<folder>/
const P = (folder: string, file: string) => `/assets/build-log/${folder}/${file}`

const PROJECTS: Project[] = [
  {
    id: 'caneos',
    title: 'CANEOS',
    piece: 'i',
    tagline: 'Clip-on white cane module that detects overhead hazards for visually impaired users, pairing ToF sensors and YOLOv6 camera detection with companion iPhone and Apple Watch apps for voice narration, emergency SOS alerts, and live location sharing.',
    tags: ['Swift', 'SwiftUI', 'Python', 'C++', 'Gemini API', 'Auth0'],
    cat: 'ai',
    year: 'Jul 2026',
    github: 'https://github.com/Emily3226/CaneOS',
    devpost: 'https://devpost.com/software/caneos',
    images: [
      P('CaneOS', 'app-screens.jpg'),
      P('CaneOS', 'device-test.jpg'),
      P('CaneOS', 'architecture.png'),
      P('CaneOS', 'hackathons-10.jpg'),
      P('CaneOS', 'hackathons-9.jpg'),
      P('CaneOS', 'hackathons-8.jpg'),
      P('CaneOS', 'IMG_7749.jpg'),
      P('CaneOS', 'hackathons-6.jpg'),
      P('CaneOS', 'hackathons-5.jpg'),
    ],
  },
  {
    id: 'trulyher',
    title: 'TRULYHER',
    piece: 'o',
    tagline: 'AI-powered web app that helps women in computer science manage imposter syndrome through speech and text journaling paired with real-time mood detection.',
    tags: ['React', 'JavaScript', 'HTML', 'CSS', 'Base44', 'UI/UX'],
    cat: 'ai',
    year: 'Sep 2025',
    github: 'https://github.com/ErinGu0/TrulyHer',
    devpost: 'https://devpost.com/software/trulyher',
    images: [
      P('TrulyHer', 'app-screens-1.jpg'),
      P('TrulyHer', 'app-screens-2.jpg'),
      P('TrulyHer', 'app-screens-3.jpg'),
      P('TrulyHer', 'app-screens-4.jpg'),
      P('TrulyHer', 'hackathons-11.jpg'),
      P('TrulyHer', 'hackathons-12.jpg'),
    ],
  },
  {
    id: 'llm-security-research',
    title: 'LLM SECURITY RESEARCH',
    piece: 't',
    tagline: 'Co-authoring a Symposium on Usable Privacy and Security (SOUPS) research paper on how users seek security and privacy advice from large language models, evaluating the accuracy of that advice against expert guidance.',
    tags: ['Research', 'LLMs', 'Security', 'Privacy', 'SOUPS'],
    cat: 'research',
    year: '2026',
    images: [
      P('LLM-Security-Research', 'paper-fade.png'),
      P('LLM-Security-Research', 'usenix-flat.png'),
      P('LLM-Security-Research', 'cancwic-crop.jpg'),
    ],
  },
  {
    id: 'tetris-juliann',
    title: 'PERSONAL WEBSITE',
    piece: 's',
    tagline: 'This website: a fully playable Tetris portfolio complete with a leaderboard and achievements, wrapped around my projects, side quests, and resume. You\'re looking at it.',
    tags: ['React', 'TypeScript', 'Vite', 'CSS'],
    cat: 'web',
    year: '2026',
    github: 'https://github.com/juliannzhu/personal-website',
    images: [
      P('tetris-website', 'architecture.svg'),
      P('tetris-website', 'ideation-01.png'),
      P('tetris-website', 'ideation-02.png'),
      P('tetris-website', 'ideation-03.png'),
      P('tetris-website', 'ideation-04.png'),
      P('tetris-website', 'ideation-05.png'),
      { src: P('tetris-website', 'old-radar-chart.png'), caption: 'old radar chart design' },
    ],
  },
  {
    id: 'neuralearn',
    title: 'NEURALEARN',
    piece: 'z',
    tagline: 'AI-driven study tool that generates adaptive quizzes and instant Q&A responses based on your own notes, powered by Gemini AI to make studying more efficient.',
    tags: ['Python', 'Gemini AI', 'NLP', 'HTML', 'CSS', 'API'],
    cat: 'ai',
    year: 'Sep 2024',
    github: 'https://github.com/girish316/HackTheHill',
    devpost: 'https://devpost.com/software/neuralearn',
    images: [
      P('NeuraLearn', 'app-screenshot-01.png'),
      P('NeuraLearn', 'app-screenshot-02.png'),
      P('NeuraLearn', 'app-screenshot-03.png'),
      P('NeuraLearn', 'hackathons-1.jpg'),
      P('NeuraLearn', 'hackathons-2.jpg'),
      P('NeuraLearn', 'hackathons-3.jpg'),
      P('NeuraLearn', 'hackathons-4.jpg'),
    ],
  },
  {
    id: 'geomap',
    title: 'GEOMAP',
    piece: 'j',
    tagline: 'Interactive digital map website built for the IB Geography curriculum, integrating OOP and case-study databases into a browser-compatible visualization tool shaped by iterative client feedback.',
    tags: ['JavaScript', 'HTML', 'CSS', 'Python', 'Window.js'],
    cat: 'web',
    year: 'Jun 2024',
    link: '/geomap/map.html',
    images: [
      P('Geomap', 'geomap-01.png'),
      P('Geomap', 'geomap-02.png'),
      P('Geomap', 'geomap-03.png'),
      P('Geomap', 'geomap-04.png'),
    ],
  },
  {
    id: 'charg-e-design-team',
    title: 'CHARG-E',
    piece: 'l',
    tagline: 'Research and prototype design at the University of Lethbridge. Developed an electromagnetic vibrational energy harvester prototype, exploring how vibrations from car suspension systems could be converted into usable power. Earned the Application of Theme Award from a panel of engineers and industry judges.',
    tags: ['Research', 'Prototyping', 'Green Energy', 'STEAM'],
    cat: 'research',
    year: 'Jul 2024',
    images: [
      P('Charg-E', '209BF43A-1FE5-4546-B40B-D4043B7CA15E.JPG'),
      P('Charg-E', '3684E1A4-2A4F-4FB0-8EDF-CD23A309169D.JPG'),
      P('Charg-E', '46BE028A-E739-4648-82B2-907358B43BC2.JPG'),
      P('Charg-E', '5CAF3E2E-E9EB-4463-AB94-39CE17B5715D.JPG'),
      P('Charg-E', 'IMG_9164.jpg'),
      P('Charg-E', 'IMG_9595.jpg'),
      P('Charg-E', 'IMG_9850.jpg'),
      P('Charg-E', 'IMG_9852.jpg'),
    ],
  },
  {
    id: 'project-tech-careers',
    title: 'PROJECT TECH CAREERS',
    piece: 'i',
    tagline: 'Four-stage mentorship platform supporting women at different stages of their computer science education, connecting them with mentors and resources along the way. Won the Gender Equality Track Award.',
    tags: ['JavaScript', 'HTML', 'CSS', 'UI/UX'],
    cat: 'web',
    year: 'May 2024',
    devpost: 'https://devpost.com/juliannzhu',
  },
  {
    id: 'grafana-dashboards',
    title: 'GRAFANA DASHBOARDS',
    piece: 'o',
    tagline: 'Satellite system monitoring dashboards built with Grafana and MySQL data sources, reduced dashboard load time by 86% through SQL query optimization.',
    tags: ['MySQL', 'SQLAlchemy', 'FastAPI', 'APScheduler', 'MariaDB'],
    cat: 'systems',
    year: '2026',
  },
]

const FILTERS: { id: Cat; label: string; piece: Piece }[] = [
  { id: 'all',      label: 'All',      piece: 'i' },
  { id: 'web',      label: 'Web',      piece: 'i' },
  { id: 'ai',       label: 'AI',       piece: 't' },
  { id: 'systems',  label: 'Systems',  piece: 's' },
  { id: 'research', label: 'Research', piece: 'j' },
]

// ---- CSS ----
const CSS = `
@keyframes tj-project-slide-in {
  from { transform: translateX(-24px); opacity: 0; }
  to   { transform: translateX(0);     opacity: 1; }
}
.tj-project-detail { animation: tj-project-slide-in 240ms var(--ease-snap) both; }
`

let cssInjected = false
function ensureCSS() {
  if (!cssInjected && typeof document !== 'undefined') {
    const s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s); cssInjected = true
  }
}

function ProjectCard({ p, onOpen }: { p: Project; onOpen: (id: string) => void }) {
  return (
    <Card accent={p.piece} interactive accentBar onClick={() => onOpen(p.id)} style={{ display: 'flex', flexDirection: 'column', height: '100%', cursor: 'pointer' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Tetromino piece={p.piece} size={14} />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-faint)' }}>{p.year}</span>
      </div>
      <h3 style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.8125rem', color: 'var(--text-strong)', margin: '20px 0 0', textTransform: 'uppercase', lineHeight: 1.4 }}>{p.title}</h3>
      <p style={{
        fontSize: '0.875rem', color: 'var(--text-muted)', margin: '12px 0 0', lineHeight: 1.55, flex: 1,
        display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
      }}>{p.tagline}</p>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 18 }}>
        {p.tags.map((t) => <Tag key={t} piece={p.piece}>{t}</Tag>)}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 14, fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: `var(--piece-${p.piece})`, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        View details <Icon icon="pixelarticons:arrow-right" style={{ fontSize: '0.8125rem' }} />
      </div>
    </Card>
  )
}

function BackButton({ c, onBack }: { c: string; onBack: () => void }) {
  return (
    <button onClick={onBack}
      onMouseEnter={(e) => { e.currentTarget.style.color = c }}
      onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)' }}
      style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', padding: 0, marginBottom: 32, transition: 'color 140ms' }}>
      <Icon icon="pixelarticons:arrow-left" style={{ fontSize: '0.875rem' }} />
      Back to Build Log
    </button>
  )
}

function MediaSlot({ src, index }: { src?: string; index: number }) {
  return (
    <div style={{
      aspectRatio: index === 0 ? '16/9' : '4/3',
      gridColumn: index === 0 ? 'span 2' : undefined,
      borderRadius: 'var(--radius-1)', overflow: 'hidden',
      background: src ? 'transparent' : 'var(--bg-well)',
      border: src ? 'none' : '2px dashed var(--border-hairline)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10,
    }}>
      {src ? (
        <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <>
          <span style={{ fontSize: '1.75rem', opacity: 0.35 }}>+</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            {index === 0 ? 'Add featured screenshot' : 'Add screenshot'}
          </span>
        </>
      )}
    </div>
  )
}

// Same slide duration/easing and arrow/dot styling as the Side Quests carousel.
const CAROUSEL_TRANSITION_MS = 600
const CAROUSEL_EASING = 'cubic-bezier(0.65, 0, 0.35, 1)'

function ProjectCarousel({ images, c }: { images: { src: string; caption?: string }[]; c: string }) {
  const [index, setIndex] = useState(0)
  const goPrev = () => setIndex((i) => Math.max(0, i - 1))
  const goNext = () => setIndex((i) => Math.min(images.length - 1, i + 1))

  return (
    <div>
      <div style={{ position: 'relative', width: '100%', height: 'clamp(420px, 60vh, 720px)', overflow: 'hidden', borderRadius: 'var(--radius-1)', background: 'var(--bg-well)' }}>
        <div style={{
          display: 'flex', width: '100%', height: '100%',
          transform: `translateX(-${index * 100}%)`,
          transition: `transform ${CAROUSEL_TRANSITION_MS}ms ${CAROUSEL_EASING}`,
        }}>
          {images.map((im, i) => (
            <img key={i} src={im.src} alt={im.caption ?? ''} style={{ width: '100%', height: '100%', flexShrink: 0, objectFit: 'contain' }} />
          ))}
        </div>

        {images[index]?.caption && (
          <div style={{
            position: 'absolute', left: 0, right: 0, bottom: 0, padding: '10px 14px',
            background: 'linear-gradient(to top, rgba(5,5,9,0.82), transparent)',
            fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center',
          }}>
            {'// '}{images[index].caption}
          </div>
        )}

        {index > 0 && (
          <IconButton size="md" variant="ghost" label="Previous photo" onClick={goPrev}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--text-strong)'; e.currentTarget.style.background = 'rgba(5,5,9,0.85)' }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.background = 'rgba(5,5,9,0.6)' }}
            style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', zIndex: 1, background: 'rgba(5,5,9,0.6)', border: '2px solid var(--border-strong)', color: 'var(--text-strong)', backdropFilter: 'blur(4px)' }}>
            <Icon icon="pixelarticons:chevron-left" />
          </IconButton>
        )}
        {index < images.length - 1 && (
          <IconButton size="md" variant="ghost" label="Next photo" onClick={goNext}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--text-strong)'; e.currentTarget.style.background = 'rgba(5,5,9,0.85)' }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.background = 'rgba(5,5,9,0.6)' }}
            style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', zIndex: 1, background: 'rgba(5,5,9,0.6)', border: '2px solid var(--border-strong)', color: 'var(--text-strong)', backdropFilter: 'blur(4px)' }}>
            <Icon icon="pixelarticons:chevron-right" />
          </IconButton>
        )}
      </div>

      {images.length > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 14 }}>
          {images.map((_, i) => (
            <button key={i} onClick={() => setIndex(i)} aria-label={`Go to photo ${i + 1}`}
              style={{
                width: i === index ? 20 : 7, height: 7, borderRadius: 4, padding: 0, border: 'none', cursor: 'pointer',
                background: i === index ? c : 'var(--border-strong)',
                transition: 'width 200ms, background 200ms',
              }} />
          ))}
        </div>
      )}
    </div>
  )
}

function ProjectDetail({ p, onBack }: { p: Project; onBack: () => void }) {
  const c = `var(--piece-${p.piece})`
  // Normalize plain-URL and { src, caption } entries into one shape for the carousel.
  const images = (p.images ?? []).map((im) => (typeof im === 'string' ? { src: im } : im))
  const topRef = useRef<HTMLDivElement>(null)
  // Opening a project from partway down the grid would otherwise land on its detail
  // page still scrolled to that position — snap the scroll stack back to the top of it.
  useEffect(() => { topRef.current?.scrollIntoView({ block: 'start' }) }, [])
  return (
    <section ref={topRef} className="tj-project-detail" style={{ maxWidth: 1080, margin: '0 auto', padding: '48px 24px 72px' }}>
      <BackButton c={c} onBack={onBack} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 28 }}>
        <Tetromino piece={p.piece} size={18} />
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: c, marginBottom: 6 }}>{`// ${p.year}`}</div>
          <h2 style={{ fontFamily: 'var(--font-pixel)', fontSize: '1.375rem', color: 'var(--text-strong)', margin: 0, textTransform: 'uppercase' }}>{p.title}</h2>
        </div>
      </div>

      <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 24 }}>{p.tagline}</p>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 32 }}>
        {p.tags.map((t) => <Tag key={t} piece={p.piece}>{t}</Tag>)}
      </div>

      {images.length > 0 ? (
        <ProjectCarousel images={images} c={c} />
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <MediaSlot key={i} src={images[i]?.src} index={i} />
            ))}
          </div>

          <div style={{ marginTop: 24, padding: '16px 20px', background: 'var(--bg-well)', border: '2px solid var(--border-hairline)', borderRadius: 'var(--radius-1)' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-faint)' }}>
              {'// Add screenshots to public/assets/build log/<ProjectName>/ and list them in the images array in Projects.tsx'}
            </span>
          </div>
        </>
      )}

      {(p.link || p.github || p.devpost) && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 40 }}>
          {p.github && (
            <a href={p.github} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
              <Button variant="secondary" leftIcon={<Icon icon="pixelarticons:github" />}>GitHub</Button>
            </a>
          )}
          {p.devpost && (
            <a href={p.devpost} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
              <Button variant="secondary" leftIcon={<Icon icon="pixelarticons:external-link" />}>Devpost</Button>
            </a>
          )}
          {p.link && p.link !== '#' && (
            <a href={p.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
              <Button variant="secondary" leftIcon={<Icon icon="pixelarticons:external-link" />}>Live</Button>
            </a>
          )}
        </div>
      )}

      <div style={{ marginTop: 40 }}>
        <BackButton c={c} onBack={onBack} />
      </div>
    </section>
  )
}

export function Projects({ resetSignal }: { resetSignal?: number } = {}) {
  ensureCSS()
  const [filter, setFilter] = useState<Cat>('all')
  const [openId, setOpenId] = useState<string | null>(null)
  const shown = PROJECTS.filter((p) => filter === 'all' || p.cat === filter)

  // Bumped by App.tsx when "Projects" is clicked again while already on this section —
  // closes whatever project detail is open so the full Build Log grid is visible again.
  useEffect(() => { setOpenId(null) }, [resetSignal])

  if (openId) {
    const project = PROJECTS.find((p) => p.id === openId)!
    return <ProjectDetail p={project} onBack={() => setOpenId(null)} />
  }

  return (
    <section style={{ maxWidth: 1080, margin: '0 auto', padding: '56px 24px 72px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, marginBottom: 28 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--piece-i)' }}>// Completed lines</div>
          <h2 style={{ fontFamily: 'var(--font-pixel)', fontSize: '1.625rem', color: 'var(--text-strong)', margin: '14px 0 0', textTransform: 'uppercase' }}>Build Log</h2>
        </div>
        <ScrollTetromino3D
          className="tj-float-projects-s"
          piece="s"
          size={60}
          baseRotateY={180}
          tiltDeg={18}
          rotZPerPx={0.14}
          rotXPerPx={0.08}
          rotYPerPx={0.18}
          mouseFollow
          style={{ opacity: 0.72, marginRight: 110 }}
        />
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
        {FILTERS.map((f) => (
          <Tag key={f.id} piece={f.piece} interactive active={filter === f.id} onClick={() => setFilter(f.id)}>{f.label}</Tag>
        ))}
      </div>
      <div className="tj-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
        {shown.map((p) => <ProjectCard key={p.id} p={p} onOpen={setOpenId} />)}
      </div>
    </section>
  )
}
