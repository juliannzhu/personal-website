import { useState } from 'react'
import { Icon } from '@iconify/react'
import { Card } from '../components/ds/Card'
import { Tag } from '../components/ds/Tag'
import { Button } from '../components/ds/Button'
import { Tetromino } from '../components/ds/Tetromino'

type Piece = 'i' | 'o' | 't' | 's' | 'z' | 'j' | 'l'
type Cat = 'all' | 'web' | 'ai' | 'systems' | 'research'

const PROJECTS: { title: string; piece: Piece; tagline: string; tags: string[]; cat: Exclude<Cat, 'all'>; year: string; link?: string; devpost?: string }[] = [
  {
    title: 'TRULYHER',
    piece: 't',
    tagline: 'AI-powered web app that helps women in CS manage imposter syndrome through speech/text journaling and mood detection.',
    tags: ['React', 'JavaScript', 'Base44', 'AI', 'UI/UX'],
    cat: 'ai',
    year: 'Sep 2025',
    devpost: 'https://devpost.com/juliannzhu',
  },
  {
    title: 'NEURALEARN',
    piece: 'i',
    tagline: 'AI-driven study tool that generates adaptive quizzes and instant Q&A responses based on your notes using Gemini AI.',
    tags: ['Python', 'Gemini AI', 'NLP', 'HTML/CSS', 'API'],
    cat: 'ai',
    year: 'Sep 2024',
    devpost: 'https://devpost.com/juliannzhu',
  },
  {
    title: 'PROJECT TECH CAREERS',
    piece: 'o',
    tagline: 'Four-stage mentorship platform supporting women at different stages of their CS education. Won the Gender Equality Track Award.',
    tags: ['JavaScript', 'HTML', 'CSS', 'UI/UX'],
    cat: 'web',
    year: 'May 2024',
    devpost: 'https://devpost.com/juliannzhu',
  },
  {
    title: 'GRAFANA DASHBOARDS',
    piece: 's',
    tagline: 'Satellite system monitoring dashboards with MySQL data sources. Reduced dashboard load time by 86% via SQL optimization.',
    tags: ['Grafana', 'MySQL', 'SQL', 'Data Viz', 'InfluxDB'],
    cat: 'systems',
    year: '2026',
  },
  {
    title: 'LLM SECURITY RESEARCH',
    piece: 'j',
    tagline: 'Co-authoring a SOUPS research paper on how users seek security & privacy advice from LLMs and evaluating accuracy vs expert guidance.',
    tags: ['Research', 'LLMs', 'Security', 'Privacy', 'SOUPS'],
    cat: 'research',
    year: '2026',
  },
  {
    title: 'TETRIS.JULIANN',
    piece: 'l',
    tagline: 'This website: a fully playable Tetris portfolio built with React, Vite, and TypeScript. You\'re looking at it.',
    tags: ['React', 'TypeScript', 'Vite', 'CSS', 'Web Audio'],
    cat: 'web',
    year: '2026',
    link: '#',
  },
  {
    title: 'CHARG-E DESIGN TEAM',
    piece: 't',
    tagline: 'Research and Prototype Design Lead at the University of Lethbridge. Developed an electromagnetic vibrational energy harvester prototype, earning the Application of Theme Award from a panel of engineers and industry judges.',
    tags: ['Research', 'Prototyping', 'Green Energy', 'STEAM'],
    cat: 'research',
    year: 'Jul 2024',
  },
  {
    title: 'GEOMAP',
    piece: 'j',
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

function ProjectCard({ p }: { p: typeof PROJECTS[0] }) {
  return (
    <Card accent={p.piece} interactive accentBar style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Tetromino piece={p.piece} size={14} />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-faint)' }}>{p.year}</span>
      </div>
      <h3 style={{ fontFamily: 'var(--font-pixel)', fontSize: 13, color: 'var(--text-strong)', margin: '20px 0 0', textTransform: 'uppercase', lineHeight: 1.4 }}>{p.title}</h3>
      <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: '12px 0 0', lineHeight: 1.55, flex: 1 }}>{p.tagline}</p>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 18 }}>
        {p.tags.map((t) => <Tag key={t} piece={p.piece}>{t}</Tag>)}
      </div>
      {(p.link || p.devpost) && (
        <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
          {p.devpost && (
            <a href={p.devpost} target="_blank" rel="noopener noreferrer"
              style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: `var(--piece-${p.piece})`, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
              Devpost
            </a>
          )}
          {p.link && p.link !== '#' && (
            <a href={p.link} target="_blank" rel="noopener noreferrer"
              style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: `var(--piece-${p.piece})`, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
              Live
            </a>
          )}
        </div>
      )}
    </Card>
  )
}

export function Projects() {
  const [filter, setFilter] = useState<Cat>('all')
  const shown = PROJECTS.filter((p) => filter === 'all' || p.cat === filter)
  return (
    <section style={{ maxWidth: 1080, margin: '0 auto', padding: '56px 24px 72px' }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--piece-i)' }}>// Completed lines</div>
        <h2 style={{ fontFamily: 'var(--font-pixel)', fontSize: 26, color: 'var(--text-strong)', margin: '14px 0 0', textTransform: 'uppercase' }}>Build Log</h2>
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
        {FILTERS.map((f) => (
          <Tag key={f.id} piece={f.piece} interactive active={filter === f.id} onClick={() => setFilter(f.id)}>{f.label}</Tag>
        ))}
      </div>
      <div className="tj-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
        {shown.map((p) => <ProjectCard key={p.title} p={p} />)}
      </div>
      <div style={{ textAlign: 'center', marginTop: 40 }}>
        <a href="https://github.com/juliannzhu" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
          <Button variant="secondary" leftIcon={<Icon icon="pixelarticons:github" />}>More on GitHub</Button>
        </a>
      </div>
    </section>
  )
}
