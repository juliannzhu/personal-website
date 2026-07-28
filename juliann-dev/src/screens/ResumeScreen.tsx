import { useEffect, useRef } from 'react'
import { Icon } from '@iconify/react'
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

function EntryHeader({ title, sub, role, location, date, piece }: { title: string; sub?: string; role: string; location: string; date: string; piece: Piece }) {
  return (
    <div className="tj-resume-entry-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <Tetromino piece={piece} size={9} />
          <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.8125rem', color: 'var(--text-strong)', textTransform: 'uppercase' }}>{title}</span>
        </div>
        {sub && <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-faint)', marginTop: 4, marginLeft: 19 }}>{sub}</div>}
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: `var(--piece-${piece})`, marginTop: 6, marginLeft: 19 }}>{role}</div>
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

const EXPERIENCE = [
  {
    title: 'ORBCOMM, SKYWAVE',
    sub: 'Network Services Department',
    role: 'Network Engineering Intern',
    location: 'Ottawa, ON',
    date: 'May 2026 - Present',
    piece: 's' as Piece,
    bullets: [
      'Developed 8 Grafana dashboards with MySQL data sources to monitor satellite network performance across 12 metrics, cutting load times by 86% through dynamic filtering and optimized SQL queries.',
      'Shipped an AI-driven analytics service that generates summaries, detects unusual network activity, extends predictive forecasting by 60x, cuts pipeline runtime by 78%, lowers false-positive anomaly alerts by 80%.',
      'Delivered the system’s architecture and new AI-driven monitoring features to engineering leadership, backed by a high-level design document and live technical demo of visualization and usability improvements.',
    ],
  },
  {
    title: 'Usable Security & Privacy Research',
    sub: 'Women in Math DRP, University of Waterloo',
    role: 'Undergraduate Research Mentee',
    location: 'Waterloo, ON',
    date: 'Jan 2026 - Present',
    piece: 'j' as Piece,
    bullets: [
      'Co-authoring an academic research paper for the Symposium On Usable Privacy and Security investigating how users seek security and privacy advice from LLMs, with findings to be presented at the Annual Celebration of Women in Computing 2026 Conference (CAN-CWiC) and IEEE S&P.',
      'Analyzing 2 LLMs against 78 privacy and usable security prompts sourced from 54 online databases, evaluating advice against expert feedback from 3 security researchers to assess accuracy and risks.',
    ],
  },
]

const RESUME_PROJECTS = [
  {
    title: 'CaneOS',
    sub: 'Hack the 6ix',
    role: 'Full Stack & Embedded Developer',
    location: 'Toronto, ON',
    date: 'Jul 2026',
    piece: 'l' as Piece,
    tools: ['Swift', 'Python', 'C++', 'SwiftUI', 'MongoDB Atlas', 'Auth0', 'Gemini API', 'Vercel', 'Websockets'],
    bullets: [
      'Built a clip-on white cane module that detects overhead hazards within a 4m range for visually impaired users, pairing ToF sensors and 30 FPS YOLOv6 camera detection on an Arduino UNO Q feed into a Python/FastAPI pipeline to classify hazards via Gemini vision and narrate within 3 seconds via ElevenLabs.',
      'Developed companion SwiftUI iPhone and Apple Watch apps with directional haptics, 4-tier SOS alerts, and Auth0-secured sync of incidents and contacts to MongoDB Atlas via a Node.js serverless proxy.',
    ],
  },
  {
    title: 'TrulyHer',
    sub: 'Technova',
    role: 'AI Integration & Front-End Developer',
    location: 'Waterloo, ON',
    date: 'Sep 2025',
    piece: 't' as Piece,
    tools: ['React', 'JavaScript', 'HTML', 'CSS', 'Base44', 'VS Code'],
    bullets: [
      'Developed an AI-powered web application with speech and text input helping women in computer science manage imposter syndrome, featuring journaling and mood detection across 11 tracked emotional states.',
      'Designed an interactive dashboard visualizing emotional trends and personalized insights from 200+ journal entries across 5 chart views, encouraging mental health awareness and empowering underrepresented groups.',
    ],
  },
  {
    title: 'Project Tech Careers Hackathon',
    role: 'Platform Designer and UI/UX Developer',
    location: 'Ottawa, ON',
    date: 'May - Jun 2024',
    piece: 'z' as Piece,
    tools: ['JavaScript', 'HTML', 'CSS', 'VS Code'],
    bullets: [
      'Designed a 4-stage platform, curating 100+ resources, to help women in computer science industries at different stages of their education find mentorship, scholarships, programs, and community resources.',
      'Awarded the Gender Equality Track Award over 45 competing teams for innovation, design, and impact in addressing the UN Sustainable Development Goals by addressing the gender gap.',
    ],
  },
]

const SKILLS: { label: string; piece: Piece; items: string[] }[] = [
  { label: 'Languages',          piece: 'i', items: ['Python', 'JavaScript', 'HTML/CSS', 'C/C++', 'Racket', 'SQL', 'Bash', 'Swift'] },
  { label: 'Data and Analytics', piece: 'o', items: ['MySQL', 'MongoDB Atlas', 'InfluxDB', 'pandas', 'NumPy', 'Grafana'] },
  { label: 'Frameworks and APIs',piece: 't', items: ['React', 'Gemini API', 'Node.js', 'REST APIs', 'SQLAlchemy', 'Uvicorn', 'Resend API'] },
  { label: 'Tools and Systems',  piece: 's', items: ['Git/Github', 'Linux', 'Google Cloud Platform', 'VirtualBox', 'VS Code', 'Xcode'] },
]

const CONTACT = [
  { icon: 'pixelarticons:phone',     label: '(613) 981-6078',            href: 'tel:+16139816078' },
  { icon: 'pixelarticons:mail',      label: 'j478zhu@uwaterloo.ca',      href: 'mailto:j478zhu@uwaterloo.ca' },
  { icon: 'pixelarticons:briefcase', label: 'linkedin.com/in/juliann-zhu', href: 'https://linkedin.com/in/juliann-zhu/' },
  { icon: 'pixelarticons:github',    label: 'github.com/juliannzhu',     href: 'https://github.com/juliannzhu' },
]

export function ResumeScreen({ onClose }: { onClose: () => void }) {
  ensureCSS()
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div ref={scrollRef} style={{ position: 'fixed', inset: 0, zIndex: 9800, background: 'var(--bg-page)', backgroundImage: 'var(--grid-bg)', overflowY: 'auto' }}>
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
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: 8 }}>BCS, Honours Computer Science with Co-operative Program</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--piece-o)', marginTop: 8 }}>President Scholarship of Distinction</div>
              </div>
              <div className="tj-resume-meta tj-resume-meta-flush" style={{ textAlign: 'right', flexShrink: 0 }}>
                <div className="tj-resume-date" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Sep 2025 - Present</div>
                <div className="tj-resume-loc" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-faint)', marginTop: 2 }}>Waterloo, ON</div>
              </div>
            </div>
          </Card>
        </section>

        {/* skills */}
        <section style={{ marginBottom: 44 }}>
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

        {/* experience */}
        <section style={{ marginBottom: 44 }}>
          <Kicker piece="s">Relevant Experience</Kicker>
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
        <section>
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
