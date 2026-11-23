import { Icon } from '@iconify/react'
import { useDialog } from '../lib/useDialog'
import { Card } from '../components/ds/Card'
import { Tag } from '../components/ds/Tag'
import { Button } from '../components/ds/Button'
import { Tetromino } from '../components/ds/Tetromino'

type Piece = 'i' | 'o' | 't' | 's' | 'z' | 'j' | 'l'

const CSS = `
@keyframes tj-resume-in { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
.tj-resume-page { animation: tj-resume-in 260ms var(--ease-snap) both; }
.tj-resume-bullet { display:flex; gap:10px; align-items:flex-start; }
.tj-resume-bullet::before { content:""; width:7px; height:7px; margin-top:7px; flex-shrink:0; background:var(--bc, var(--piece-i));
  box-shadow: inset 1px 1px 0 rgba(255,255,255,0.4), inset -1px -1px 0 rgba(0,0,0,0.3); }
.tj-resume-contact a { color:var(--text-muted); text-decoration:none; transition:color 140ms; }
.tj-resume-contact a:hover { color:var(--text-strong); }
.tj-resume-close:hover { color:var(--text-strong) !important; border-color:var(--text-muted) !important; }

/* On phones the right-aligned date/location column gets cramped and wraps awkwardly.
   Drop it below the role instead, left-aligned on one line as "date · location". */
@media (max-width: 720px) {
  .tj-resume-entry-head { flex-direction: column; gap: 8px; }
  .tj-resume-meta {
    text-align: left !important;
    margin-left: 19px;
    display: flex; flex-wrap: wrap; align-items: baseline; gap: 2px 8px;
  }
  .tj-resume-loc { margin-top: 0 !important; }
  .tj-resume-loc::before { content: "·"; margin-right: 8px; color: var(--text-faint); }
  /* Education title has no tetromino, so its title sits flush-left — align its
     date/location line to match, instead of the 19px experience-entry indent. */
  .tj-resume-meta-flush { margin-left: 0 !important; }
}
`
let injected = false
function ensureCSS() {
  if (!injected && typeof document !== 'undefined') {
    const s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s); injected = true
  }
}

const NAME_COLORS: Piece[] = ['i', 'o', 't', 's', 'z', 'j', 'l']

function Kicker({ children, piece }: { children: string; piece: Piece }) {
  return <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: `var(--piece-${piece})`, marginBottom: 14 }}>{`// ${children}`}</div>
}

function Bullets({ items, piece }: { items: string[]; piece: Piece }) {
  return (
    <ul style={{ listStyle: 'none', margin: '14px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: 9 }}>
      {items.map((b, i) => (
        <li key={i} className="tj-resume-bullet" style={{ '--bc': `var(--piece-${piece})` } as React.CSSProperties}>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{b}</span>
        </li>
      ))}
    </ul>
  )
}

function EntryHeader({ title, sub, role, location, date, piece }: { title: string; sub?: string; role?: string; location: string; date: string; piece: Piece }) {
  return (
    <div className="tj-resume-entry-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <Tetromino piece={piece} size={9} />
          <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.8125rem', color: 'var(--text-strong)', textTransform: 'uppercase' }}>{title}</span>
        </div>
        {sub && <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-faint)', marginTop: 4, marginLeft: 19 }}>{sub}</div>}
        {role && <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: `var(--piece-${piece})`, marginTop: 6, marginLeft: 19 }}>{role}</div>}
      </div>
      {/* Desktop: right-aligned date-over-location column. Mobile: this reflows to a single
          left-aligned "date · location" line under the role (see the media query in CSS). */}
      <div className="tj-resume-meta" style={{ textAlign: 'right', flexShrink: 0 }}>
        <div className="tj-resume-date" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{date}</div>
        <div className="tj-resume-loc" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-faint)', marginTop: 2 }}>{location}</div>
      </div>
    </div>
  )
}

// Mirrors public/assets/JuliannZhu-resume.pdf. Update both together.
const EXPERIENCE: { title: string; sub?: string; role?: string; location: string; date: string; piece: Piece; bullets: string[] }[] = [
  {
    title: 'ORBCOMM',
    sub: 'Network Services Department',
    role: 'Network Engineering Intern',
    location: 'Ottawa, ON',
    date: 'May 2026 - Sep 2026',
    piece: 's',
    bullets: [
      'Developed 8 Grafana dashboards with MySQL pipelines monitoring satellite network performance metrics.',
      'Cut dashboard load times by 86% through dynamic filtering and optimized SQL queries across the pipeline.',
      'Shipped an AI analytics service extending predictive forecasting 60x and cutting pipeline runtime 78%.',
      'Lowered false-positive anomaly alerts by 80% using FastAPI, APScheduler, PyMySQL, Jinja2, and MariaDB.',
      'Launched the service internally for 7 engineering teams, presenting system design and a live demo to leadership.',
    ],
  },
  {
    title: 'Usable Security & Privacy Research',
    sub: 'University of Waterloo',
    role: 'Undergraduate Research Assistant',
    location: 'Waterloo, ON',
    date: 'Jan 2026 - Present',
    piece: 'j',
    bullets: [
      'Co-authored a research paper on how users seek security and privacy advice from Large Language Models (LLMs).',
      'Reached 500+ attendees from 50 faculties and 29 schools across Canada presenting at CAN-CWiC conference.',
      'Evaluated 2 LLMs against 100 security and privacy prompts spanning 15 categories of user concerns.',
      'Built a validated 54-database golden-answer dataset and scoring rubric with Master\'s and PhD researchers.',
    ],
  },
  {
    title: 'TEDxOttawa',
    sub: '"The Paradox of Digital Permanence"',
    role: 'TEDx Speaker',
    location: 'Ottawa, ON',
    date: 'Nov 2026',
    piece: 'z',
    bullets: [
      'Selected as 1 of 12 speakers from 363 applicants (top 3%) to deliver a talk at TEDxOttawa\'s Continuum event.',
      'Examined the impact of digital convenience and cloud infrastructure on how future generations inherit memory.',
      'Synthesized complex topics into a compelling, accessible narrative through iterative speaker coaching.',
    ],
  },
]

const RESUME_PROJECTS: { title: string; sub?: string; role?: string; location: string; date: string; piece: Piece; tools: string[]; bullets: string[] }[] = [
  {
    title: 'Lighthouse Keepers',
    sub: 'EEG Neurofeedback Game',
    location: 'Waterloo, ON',
    date: 'Sep 2026 - Dec 2026',
    piece: 'i',
    tools: ['Python', 'Swift', 'JavaScript', 'Bluetooth RFCOMM'],
    bullets: [
      'Co-designing a brain-computer interface (BCI) attention trainer for children with ADHD and a parent.',
      'Built a Python hardware bridge that decodes raw EEG and band-power packets from the ThinkGear protocol.',
      'Engineered serial, Bluetooth RFCOMM, and TCP data paths through a custom Swift/IOBluetooth helper.',
      'Streamed EEG data to the browser via Server-Sent Events and rendered hand-built HTML5 Canvas charts.',
    ],
  },
  {
    title: 'CaneOS',
    sub: 'Hack the 6ix',
    role: 'Full Stack & Embedded Developer',
    location: 'Toronto, ON',
    date: 'Jul 2026',
    piece: 'l',
    tools: ['Swift', 'Python', 'C++', 'SwiftUI', 'MongoDB Atlas', 'Auth0', 'Gemini API', 'Vercel', 'Websockets'],
    bullets: [
      'Built a clip-on white cane module for visually impaired users using ToF sensors and an Arduino UNO Q.',
      'Ran 30 FPS YOLOv6 camera detection within a 4m hazard-detection range, feeding a Python/FastAPI pipeline.',
      'Classified hazards via Gemini vision and narrated results in 3 seconds via ElevenLabs at 98% accuracy.',
      'Developed companion SwiftUI iPhone and Apple Watch apps with directional haptics and 4-tier SOS alerts.',
    ],
  },
  {
    title: 'TrulyHer',
    sub: 'TechNova',
    role: 'AI Integration & Full Stack Developer',
    location: 'Waterloo, ON',
    date: 'Sep 2025 - Aug 2026',
    piece: 't',
    tools: ['React', 'TypeScript', 'PostgreSQL', 'pgvector', 'Node.js', 'PyTorch', 'ONNX', 'Vercel'],
    bullets: [
      'Built a full-stack RAG app with React, Node.js, and PostgreSQL to help women manage imposter syndrome.',
      'Enabled semantic search across 200+ journal entries using pgvector and HNSW vector embeddings.',
      'Detected imposter syndrome at 0.92 F1 on 200 hand-labeled journal entries using a DistilBERT classifier.',
      'Calibrated the classifier\'s confidence scores and exported it to ONNX with INT8 quantization.',
    ],
  },
]

const SKILLS: { label: string; piece: Piece; items: string[] }[] = [
  { label: 'Languages',          piece: 'i', items: ['Python', 'C/C++', 'Java', 'JavaScript', 'TypeScript', 'HTML/CSS', 'SQL', 'Bash', 'Swift', 'R'] },
  { label: 'Frameworks and APIs',piece: 'o', items: ['React', 'Node.js', 'REST APIs', 'PyTorch', 'SQLAlchemy', 'Gemini API', 'Uvicorn', 'Resend API'] },
  { label: 'Data and Analytics', piece: 't', items: ['PostgreSQL', 'MongoDB Atlas', 'pgvector', 'InfluxDB', 'pandas', 'NumPy', 'Grafana', 'scikit-learn'] },
  { label: 'Tools and Systems',  piece: 's', items: ['Git/GitHub', 'Linux', 'AWS', 'Google Cloud Platform', 'Vercel', 'VS Code', 'Xcode', 'VirtualBox'] },
]

const CONTACT = [
  { icon: 'pixelarticons:phone',     label: '(613) 981-6078',            href: 'tel:+16139816078' },
  { icon: 'pixelarticons:mail',      label: 'j478zhu@uwaterloo.ca',      href: 'mailto:j478zhu@uwaterloo.ca' },
  { icon: 'pixelarticons:briefcase', label: 'linkedin.com/in/juliann-zhu', href: 'https://linkedin.com/in/juliann-zhu/' },
  { icon: 'pixelarticons:github',    label: 'github.com/juliannzhu',     href: 'https://github.com/juliannzhu' },
]

export function ResumeScreen({ onClose }: { onClose: () => void }) {
  ensureCSS()
  // Doubles as the scroll container ref used by "back to top" below — same element, so one ref
  // serves both. Escape-to-close now comes from the hook rather than a listener here.
  const scrollRef = useDialog<HTMLDivElement>(onClose)

  return (
    <div ref={scrollRef} role="dialog" aria-modal="true" aria-label="Resume" tabIndex={-1}
      style={{ position: 'fixed', inset: 0, zIndex: 9800, background: 'var(--bg-page)', backgroundImage: 'var(--grid-bg)', overflowY: 'auto', outline: 'none' }}>
      <div className="tj-resume-page" style={{ maxWidth: 860, margin: '0 auto', padding: '40px 24px 96px' }}>

        {/* top bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40, gap: 12, flexWrap: 'wrap' }}>
          <button onClick={onClose} className="tj-resume-close"
            style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-well)', border: '2px solid var(--border-strong)', borderRadius: 'var(--radius-1)', padding: '9px 16px', cursor: 'pointer', color: 'var(--text-muted)', fontFamily: 'var(--font-pixel)', fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.04em', transition: 'color 140ms, border-color 140ms' }}>
            <Icon icon="pixelarticons:arrow-left" style={{ fontSize: '0.875rem' }} />
            Back to site
          </button>
          <a href="/assets/JuliannZhu-resume.pdf" download style={{ textDecoration: 'none' }}>
            <Button variant="secondary" leftIcon={<Icon icon="pixelarticons:download" />}>Download PDF</Button>
          </a>
        </div>

        {/* header */}
        <div style={{ marginBottom: 44 }}>
          <h1 style={{ fontFamily: 'var(--font-pixel)', fontSize: 'clamp(1.625rem, 5vw, 2.5rem)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.02em', lineHeight: 1.2 }}>
            {'JULIANN ZHU'.split('').map((ch, i) => (
              <span key={i} style={{ color: ch === ' ' ? undefined : `var(--piece-${NAME_COLORS[i % NAME_COLORS.length]})`, textShadow: ch === ' ' ? undefined : '0 3px 0 rgba(0,0,0,0.4)' }}>{ch === ' ' ? ' ' : ch}</span>
            ))}
          </h1>
          <div className="tj-resume-contact" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 22px', marginTop: 18 }}>
            {CONTACT.map((c) => (
              <a key={c.label} href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                style={{ display: 'flex', alignItems: 'center', gap: 7, fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}>
                <Icon icon={c.icon} style={{ fontSize: '0.9375rem' }} />
                {c.label}
              </a>
            ))}
          </div>
        </div>

        {/* education */}
        <section style={{ marginBottom: 44 }}>
          <Kicker piece="o">Education</Kicker>
          <Card accent="o" accentBar>
            <div className="tj-resume-entry-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
              <div>
                <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.8125rem', color: 'var(--text-strong)', textTransform: 'uppercase' }}>University of Waterloo</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: 8 }}>BCS, Honours Computer Science with Co-operative Program, GPA: 3.7/4.0</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--piece-o)', marginTop: 8 }}>President Scholarship of Distinction</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-faint)', marginTop: 8, lineHeight: 1.6 }}>Relevant coursework: Data Structures &amp; Algorithms, Object-Oriented Programming, Functional Programming, Logic &amp; Computation</div>
              </div>
              <div className="tj-resume-meta tj-resume-meta-flush" style={{ textAlign: 'right', flexShrink: 0 }}>
                <div className="tj-resume-date" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Sep 2025 - Apr 2029</div>
                <div className="tj-resume-loc" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-faint)', marginTop: 2 }}>Waterloo, ON</div>
              </div>
            </div>
          </Card>
        </section>

        {/* experience */}
        <section style={{ marginBottom: 44 }}>
          <Kicker piece="s">Experience</Kicker>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {EXPERIENCE.map((e) => (
              <Card key={e.title} accent={e.piece} accentBar>
                <EntryHeader title={e.title} sub={e.sub} role={e.role} location={e.location} date={e.date} piece={e.piece} />
                <Bullets items={e.bullets} piece={e.piece} />
              </Card>
            ))}
          </div>
        </section>

        {/* projects */}
        <section style={{ marginBottom: 44 }}>
          <Kicker piece="l">Projects</Kicker>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {RESUME_PROJECTS.map((p) => (
              <Card key={p.title} accent={p.piece} accentBar>
                <EntryHeader title={p.title} sub={p.sub} role={p.role} location={p.location} date={p.date} piece={p.piece} />
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 14, marginLeft: 19 }}>
                  {p.tools.map((t) => <Tag key={t} piece={p.piece}>{t}</Tag>)}
                </div>
                <Bullets items={p.bullets} piece={p.piece} />
              </Card>
            ))}
          </div>
        </section>

        {/* skills */}
        <section>
          <Kicker piece="i">Technical Skills</Kicker>
          <Card accent="i" accentBar style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {SKILLS.map((s, i) => (
              <div key={s.label} style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingBottom: i < SKILLS.length - 1 ? 12 : 0, borderBottom: i < SKILLS.length - 1 ? '1px solid var(--border-hairline)' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 8, height: 8, flexShrink: 0, background: `var(--piece-${s.piece})`, boxShadow: 'inset 1px 1px 0 rgba(255,255,255,0.4), inset -1px -1px 0 rgba(0,0,0,0.3)' }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: `var(--piece-${s.piece})`, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</span>
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {s.items.map((it) => <Tag key={it} piece={s.piece}>{it}</Tag>)}
                </div>
              </div>
            ))}
          </Card>
        </section>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 56 }}>
          <button
            onClick={() => scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
            className="tj-resume-close"
            style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-well)', border: '2px solid var(--border-strong)', borderRadius: 'var(--radius-1)', padding: '9px 16px', cursor: 'pointer', color: 'var(--text-muted)', fontFamily: 'var(--font-pixel)', fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.04em', transition: 'color 140ms, border-color 140ms' }}>
            <Icon icon="pixelarticons:arrow-up" style={{ fontSize: '0.875rem' }} />
            Back to top
          </button>
        </div>

      </div>
    </div>
  )
}
