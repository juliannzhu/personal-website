import { useState } from 'react'
import { Icon } from '@iconify/react'
import { Card } from '../components/ds/Card'
import { Tag } from '../components/ds/Tag'
import { Button } from '../components/ds/Button'
import { Tetromino } from '../components/ds/Tetromino'
import { ScrollTetromino3D } from '../components/ScrollTetromino3D'

type Piece = 'i' | 'o' | 't' | 's' | 'z' | 'j' | 'l'
type Cat = 'all' | 'web' | 'ai' | 'systems' | 'research'

// images live in /public/assets/projects/ — add screenshots and list them in each project's `images` array
type Project = { id: string; title: string; piece: Piece; tagline: string; tags: string[]; cat: Exclude<Cat, 'all'>; year: string; link?: string; devpost?: string; images?: string[] }

const PROJECTS: Project[] = [
  {
    id: 'caneos',
    title: 'CANEOS',
    piece: 'i',
    tagline: 'Clip-on white cane module that detects overhead hazards for visually impaired users, pairing ToF sensors and YOLOv6 camera detection with companion iPhone and Apple Watch apps.',
    tags: ['Swift', 'SwiftUI', 'Python', 'C++', 'Gemini API', 'Auth0'],
    cat: 'ai',
    year: 'Jul 2026',
  },
  {
    id: 'trulyher',
    title: 'TRULYHER',
    piece: 'o',
    tagline: 'AI-powered web app that helps women in CS manage imposter syndrome through speech/text journaling and mood detection.',
    tags: ['React', 'JavaScript', 'Base44', 'AI', 'UI/UX'],
    cat: 'ai',
    year: 'Sep 2025',
    devpost: 'https://devpost.com/juliannzhu',
  },
  {
    id: 'neuralearn',
    title: 'NEURALEARN',
    piece: 't',
    tagline: 'AI-driven study tool that generates adaptive quizzes and instant Q&A responses based on your notes using Gemini AI.',
    tags: ['Python', 'Gemini AI', 'NLP', 'HTML/CSS', 'API'],
    cat: 'ai',
    year: 'Sep 2024',
    devpost: 'https://devpost.com/juliannzhu',
  },
  {
    id: 'project-tech-careers',
    title: 'PROJECT TECH CAREERS',
    piece: 's',
    tagline: 'Four-stage mentorship platform supporting women at different stages of their CS education. Won the Gender Equality Track Award.',
    tags: ['JavaScript', 'HTML', 'CSS', 'UI/UX'],
    cat: 'web',
    year: 'May 2024',
    devpost: 'https://devpost.com/juliannzhu',
  },
  {
    id: 'grafana-dashboards',
    title: 'GRAFANA DASHBOARDS',
    piece: 'z',
    tagline: 'Satellite system monitoring dashboards with MySQL data sources. Reduced dashboard load time by 86% via SQL optimization.',
    tags: ['Grafana', 'MySQL', 'SQL', 'Data Viz', 'InfluxDB'],
    cat: 'systems',
    year: '2026',
  },
  {
    id: 'llm-security-research',
    title: 'LLM SECURITY RESEARCH',
    piece: 'j',
    tagline: 'Co-authoring a SOUPS research paper on how users seek security & privacy advice from LLMs and evaluating accuracy vs expert guidance.',
    tags: ['Research', 'LLMs', 'Security', 'Privacy', 'SOUPS'],
    cat: 'research',
    year: '2026',
  },
  {
    id: 'tetris-juliann',
    title: 'TETRIS.JULIANN',
    piece: 'l',
    tagline: 'This website: a fully playable Tetris portfolio built with React, Vite, and TypeScript. You\'re looking at it.',
    tags: ['React', 'TypeScript', 'Vite', 'CSS', 'Web Audio'],
    cat: 'web',
    year: '2026',
    link: '#',
  },
  {
    id: 'charg-e-design-team',
    title: 'CHARG-E DESIGN TEAM',
    piece: 'i',
    tagline: 'Research and Prototype Design Lead at the University of Lethbridge. Developed an electromagnetic vibrational energy harvester prototype, earning the Application of Theme Award from a panel of engineers and industry judges.',
    tags: ['Research', 'Prototyping', 'Green Energy', 'STEAM'],
    cat: 'research',
    year: 'Jul 2024',
  },
  {
    id: 'geomap',
    title: 'GEOMAP',
    piece: 'o',
    tagline: 'Interactive digital map website for the IB Geography curriculum. Integrated OOP and case-study databases into a browser-compatible visualization tool, built with iterative client feedback.',
    tags: ['JavaScript', 'HTML', 'CSS', 'Python', 'Window.js'],
    cat: 'web',
    year: 'Jun 2024',
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
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-faint)' }}>{p.year}</span>
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

function ProjectDetail({ p, onBack }: { p: Project; onBack: () => void }) {
  const c = `var(--piece-${p.piece})`
  const images = p.images ?? []
  return (
    <section className="tj-project-detail" style={{ maxWidth: 1080, margin: '0 auto', padding: '48px 24px 72px' }}>
      <BackButton c={c} onBack={onBack} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 28 }}>
        <Tetromino piece={p.piece} size={18} />
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: c, marginBottom: 6 }}>{`// ${p.year}`}</div>
          <h2 style={{ fontFamily: 'var(--font-pixel)', fontSize: '1.375rem', color: 'var(--text-strong)', margin: 0, textTransform: 'uppercase' }}>{p.title}</h2>
        </div>
      </div>

      <p style={{ fontSize: '1rem', color: 'var(--text-muted)', maxWidth: 640, lineHeight: 1.7, marginBottom: 24 }}>{p.tagline}</p>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 32 }}>
        {p.tags.map((t) => <Tag key={t} piece={p.piece}>{t}</Tag>)}
      </div>

      {(p.link || p.devpost) && (
        <div style={{ display: 'flex', gap: 16, marginBottom: 40 }}>
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <MediaSlot key={i} src={images[i]} index={i} />
        ))}
      </div>

      <div style={{ marginTop: 24, padding: '16px 20px', background: 'var(--bg-well)', border: '2px solid var(--border-hairline)', borderRadius: 'var(--radius-1)' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-faint)' }}>
          {'// Add screenshots to public/assets/projects/ and list them in the images array in Projects.tsx'}
        </span>
      </div>

      <div style={{ marginTop: 40 }}>
        <BackButton c={c} onBack={onBack} />
      </div>
    </section>
  )
}

export function Projects() {
  ensureCSS()
  const [filter, setFilter] = useState<Cat>('all')
  const [openId, setOpenId] = useState<string | null>(null)
  const shown = PROJECTS.filter((p) => filter === 'all' || p.cat === filter)

  if (openId) {
    const project = PROJECTS.find((p) => p.id === openId)!
    return <ProjectDetail p={project} onBack={() => setOpenId(null)} />
  }

  return (
    <section style={{ maxWidth: 1080, margin: '0 auto', padding: '56px 24px 72px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, marginBottom: 28 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--piece-i)' }}>// Completed lines</div>
          <h2 style={{ fontFamily: 'var(--font-pixel)', fontSize: '1.625rem', color: 'var(--text-strong)', margin: '14px 0 0', textTransform: 'uppercase' }}>Build Log</h2>
        </div>
        <ScrollTetromino3D
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
