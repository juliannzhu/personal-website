import { useLayoutEffect, useRef, useState } from 'react'
import { Card } from '../components/ds/Card'
import { ProgressBar } from '../components/ds/ProgressBar'
import { Tag } from '../components/ds/Tag'
import { Tetromino } from '../components/ds/Tetromino'
import { Avatar } from '../components/ds/Avatar'
import { RadarChart } from '../components/ds/RadarChart'
import { ScrollTetromino3D } from '../components/ScrollTetromino3D'

const SKILLS = [
  { name: 'Python',              value: 92, piece: 'o' },
  { name: 'JavaScript / React',  value: 88, piece: 'i' },
  { name: 'C',                   value: 80, piece: 'z' },
  { name: 'SQL / MySQL',         value: 82, piece: 's' },
  { name: 'HTML / CSS',          value: 85, piece: 'l' },
  { name: 'Bash / Linux',        value: 70, piece: 't' },
  { name: 'Git / GitHub',        value: 87, piece: 'j' },
] as const

// Substrings within `where` that should render as links to the org's official site —
// matched and swapped for <a> tags at render time instead of hand-splitting each string.
type TimelineLink = { text: string; href: string }

const TIMELINE: { piece: PK; when: string; what: string; where: string; links?: TimelineLink[] }[] = [
  {
    piece: 'i', when: 'Sep 2025 – Present', what: 'B.CS Honours + Co-op',
    where: 'University of Waterloo · Computer Science · President Scholarship',
    links: [{ text: 'University of Waterloo', href: 'https://uwaterloo.ca/future-students/programs/computer-science' }],
  },
  {
    piece: 'l', when: 'May 2026 – Present', what: 'Network Engineering Intern',
    where: 'ORBCOMM / Skywave: satellite system dashboards, SQL, Grafana',
    links: [{ text: 'ORBCOMM', href: 'https://www.orbcomm.com' }],
  },
  {
    piece: 's', when: 'Jan 2026 – Present', what: 'Undergraduate Research Mentee',
    where: 'UW Security & Privacy Research: SOUPS paper on LLM advice',
    links: [{ text: 'SOUPS', href: 'https://www.usenix.org/conferences/byname/108' }],
  },
  { piece: 't', when: 'May 2024',            what: 'Hackathon: Gender Equality Award', where: 'Project Tech Careers: platform for women in CS (UN SDG track)' },
  { piece: 'j', when: 'Sep 2021 – Jun 2025', what: 'Volleyball Team Captain, NCSSAA Tier 1 Finalist', where: "Merivale HS Volleyball Club: 2x MVP, 4 straight Marauder's Cups" },
  {
    piece: 'o', when: 'Sep 2012 – Jun 2025', what: 'RCM Level 10 Piano Certificate',
    where: 'Royal Conservatory of Music: 13 years of lessons, 10 hours / week',
    links: [{ text: 'Royal Conservatory of Music', href: 'https://www.rcmusic.com' }],
  },
]

// Splits `where` on each link's text and swaps those spans for <a> tags, leaving
// everything else as plain text — avoids hand-writing JSX fragments per timeline entry.
function linkifyWhere(text: string, links: TimelineLink[] | undefined, color: string) {
  if (!links || links.length === 0) return text
  const pattern = new RegExp(`(${links.map((l) => l.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`)
  return text.split(pattern).map((part, i) => {
    const link = links.find((l) => l.text === part)
    if (!link) return part
    return (
      <a key={i} href={link.href} target="_blank" rel="noopener noreferrer"
        style={{ color, textDecoration: 'underline', textUnderlineOffset: 2 }}
        onClick={(e) => e.stopPropagation()}>
        {part}
      </a>
    )
  })
}

type PK = 'i' | 'o' | 't' | 's' | 'z' | 'j' | 'l'
const MINI_BOARD: (PK | 0)[][] = [
  [0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0 ],
  [0,   0,   0,  'z',  0,   0,   0,   0,   0,   0,   0,   0,   0,   0 ],
  [0,   0,  'z', 'z',  0,   0,   0,  's',  0,  's',  0,   0,  'z',  0 ],
  [0,   0,  'z', 'l', 'j', 'j', 'j', 's', 's', 's', 's',  'z', 'z',  0 ],
  [0,  'l', 'l', 'l', 'o', 'o', 'j', 't', 's', 'j', 's',  'z', 'o', 'o'],
  ['i','i', 'i', 'i', 'o', 'o', 't', 't', 't', 'j', 'j', 'j', 'o', 'o'],
]

const JSTRIS_PBS = [
  { label: '20L',  piece: 'i' as const, time: '24.115',    blocks: '51',  date: 'MAY 31, 2022' },
  { label: '40L',  piece: 'o' as const, time: '45.480',    blocks: '103', date: 'DEC 27, 2022' },
  { label: '100L', piece: 't' as const, time: '2:12.887',  blocks: '253', date: 'DEC 31, 2021' },
]

const JSTRIS_STATS: [string, string, string, string][] = [
  ['Games',        '1,591',    'Max. APM',     '121.49'],
  ['Total time',   '48 hours', 'Max. Combo',   '11'],
  ['Lines sent',   '70,956',   'Longest game', '3.07 min'],
  ['Lines received', '66,895', 'Total B2Bs',   '2,010'],
  ['Placed blocks', '218,216', 'Most sent',    '132'],
  ['10-games APM', '13.54',    '10-games PPS', '0.75'],
]

const ATTRIBUTES = [
  { key: 'str', label: 'STR', name: 'Strength',     desc: 'Backend/Systems Processing: handling heavy computations and low-level code.', value: 6, piece: 'z' as const },
  { key: 'agi', label: 'AGI', name: 'Agility',      desc: 'Frontend Performance: writing fluid animations and highly responsive, fast web interfaces.', value: 7, piece: 'i' as const },
  { key: 'int', label: 'INT', name: 'Intelligence', desc: 'AI & LLM Research: technical depth across data, models, and machine learning.', value: 9, piece: 't' as const },
  { key: 'vit', label: 'VIT', name: 'Vitality',     desc: 'Resilience / Bug Fixing: untangling chaotic logic and surviving intense study terms.', value: 7, piece: 's' as const },
  { key: 'dex', label: 'DEX', name: 'Dexterity',    desc: 'Piano & UI Crafting: fine motor skills, typing speed, and aesthetic precision.', value: 9, piece: 'o' as const },
  { key: 'cha', label: 'CHA', name: 'Charisma',     desc: 'User Experience & Human Impact: designing tools that make people happy.', value: 8, piece: 'l' as const },
]

function SectionTitle({ kicker, children, size = 26 }: { kicker: string; children: string; size?: number }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--piece-i)' }}>{kicker}</div>
      <h2 style={{ fontFamily: 'var(--font-pixel)', fontSize: `${size / 16}rem`, color: 'var(--text-strong)', margin: '14px 0 0', textTransform: 'uppercase' }}>{children}</h2>
    </div>
  )
}

const ABOUT_CSS = `
@keyframes tj-about-float-a {
  0%, 100% { transform: translateY(0)   rotate(0deg);   }
  40%       { transform: translateY(-8px) rotate(6deg);  }
  70%       { transform: translateY(-4px) rotate(-4deg); }
}
@keyframes tj-about-float-b {
  0%, 100% { transform: translateY(0)    rotate(0deg);  }
  30%       { transform: translateY(-6px) rotate(-8deg); }
  65%       { transform: translateY(-10px) rotate(5deg); }
}
@keyframes tj-about-float-c {
  0%, 100% { transform: translateY(0)   rotate(0deg);  }
  50%       { transform: translateY(-12px) rotate(10deg); }
}
.tj-about-floater-a { animation: tj-about-float-a 4.2s ease-in-out infinite; }
.tj-about-floater-b { animation: tj-about-float-b 3.6s ease-in-out infinite 0.8s; }
.tj-about-floater-c { animation: tj-about-float-c 5.1s ease-in-out infinite 1.4s; }
`
let aboutCssInjected = false
function ensureAboutCSS() {
  if (!aboutCssInjected && typeof document !== 'undefined') {
    const s = document.createElement('style'); s.textContent = ABOUT_CSS; document.head.appendChild(s); aboutCssInjected = true
  }
}

export function About() {
  ensureAboutCSS()
  const achievementsRef = useRef<HTMLDivElement>(null)
  const [achHeight, setAchHeight] = useState<number>()

  useLayoutEffect(() => {
    const el = achievementsRef.current
    if (!el) return
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) setAchHeight(entry.contentRect.height)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <section style={{ maxWidth: 1080, margin: '0 auto', padding: '56px 24px 72px', position: 'relative' }}>
      <SectionTitle kicker="// Player 1">About</SectionTitle>
      {/* Floated in the gutter between the two grid columns, level with the "About"
          heading above the Juliann Zhu / Skill Meter row. */}
      <ScrollTetromino3D
        piece="t"
        size={54}
        baseRotateX={-20}
        baseRotateY={35}
        tiltDeg={-94}
        rotZPerPx={0.14}
        rotXPerPx={0.08}
        rotYPerPx={0.18}
        mouseFollow
        style={{ position: 'absolute', top: 85, left: 420, opacity: 0.72, zIndex: 1 }}
      />
      <div className="tj-about-grid" style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 40, alignItems: 'start' }}>
        <div>
          <div style={{ display: 'flex', gap: 18, alignItems: 'center', marginBottom: 24 }}>
            <Avatar initials="JZ" piece="t" size="xl" />
            <div>
              <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '1.25rem', color: 'var(--text-strong)' }}>JULIANN ZHU</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 8 }}>CS @ UWaterloo · she/her · 📍 Ottawa, ON</div>
            </div>
          </div>
          <p style={{ fontSize: '1.0625rem', lineHeight: 1.7, color: 'var(--text-body)' }}>
            I'm Juliann, a computer science student who loves breaking down problems until the pieces
            fall into place. Right now, I'm focused on the intersection of AI and user experience,
            whether it's through my research on cultural alignment and privacy in LLMs, or bringing
            new, creative ideas to life.
          </p>
          <p style={{ fontSize: '1.0625rem', lineHeight: 1.7, color: 'var(--text-body)', marginTop: 16 }}>
            I love building tools that feel fast and look fun, from low-level systems puzzles to
            playful web apps with a tangible human impact. When I'm away from my keyboard, you'll
            usually find me learning a new song on the piano, taking cute photos of my friends, or
            chasing a new side quest.
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 24 }}>
            <Tag piece="i">React</Tag>
            <Tag piece="o">Python</Tag>
            <Tag piece="s">SQL & Grafana</Tag>
            <Tag piece="t">UI/UX Design</Tag>
            <Tag piece="j">Security Research</Tag>
            <Tag piece="l">Full Stack Development</Tag>
          </div>

          <div ref={achievementsRef} style={{ marginTop: 40 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 16 }}>
              <h3 style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.75rem', color: 'var(--piece-o)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Achievements Unlocked</h3>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--text-faint)' }}>6 / 6</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {TIMELINE.map((t, i) => {
                const c = `var(--piece-${t.piece})`
                return (
                  <div key={i} style={{
                    display: 'flex', gap: 12, alignItems: 'flex-start',
                    padding: '10px 12px 10px 14px',
                    background: `color-mix(in srgb, ${c} 7%, var(--bg-well))`,
                    border: '2px solid var(--border-hairline)',
                    borderLeft: `4px solid ${c}`,
                    borderRadius: 'var(--radius-1)',
                  }}>
                    <div style={{ paddingTop: 3, flexShrink: 0 }}><Tetromino piece={t.piece} size={9} /></div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                        <div style={{ fontSize: '0.9375rem', color: 'var(--text-strong)', fontWeight: 600, lineHeight: 1.3 }}>{t.what}</div>
                        <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.4375rem', background: c, color: 'var(--ink-900)', padding: '3px 5px', flexShrink: 0, letterSpacing: '0.04em', alignSelf: 'flex-start' }}>UNLOCKED</span>
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 3 }}>{t.when}</div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.5, marginTop: 3 }}>{linkifyWhere(t.where, t.links, c)}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div>
          <Card accent="i" accentBar>
            <h3 style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.875rem', color: 'var(--text-strong)', margin: '0 0 20px', textTransform: 'uppercase' }}>Skill Meter</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {SKILLS.map((s) => (
                <ProgressBar key={s.name} value={s.value} piece={s.piece} label={s.name} cells={12} cellHeight={14} />
              ))}
            </div>
          </Card>

          {/* Bottom-right: Jstris profile card, height synced to Achievements Unlocked.
              Subtract 28px: this column starts ~28px lower than the achievements column
              (Skill Meter card is taller than the bio header above it), so matching
              raw heights would overshoot the achievements block's bottom edge. */}
          <div style={{
            marginTop: 20, minHeight: achHeight ? achHeight - 28 : achHeight,
            border: '2px solid var(--border-hairline)', borderRadius: 'var(--radius-1)',
            background: 'var(--bg-well)', overflow: 'hidden',
            display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border-hairline)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>// jstris profile</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', color: 'var(--text-faint)' }}>jstris.jezevec10.eu</span>
            </div>

            <div style={{ padding: '10px 16px', display: 'flex', gap: 14, alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-hairline)' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.9375rem', color: 'var(--text-strong)' }}>JAMBO722</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--text-faint)', marginTop: 5 }}>40L PB 45.480 · 103 BLOCKS</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(14, 6px)', gridTemplateRows: 'repeat(6, 6px)', gap: 1, flexShrink: 0, transform: 'translate(-8px, -8px)' }}>
                {MINI_BOARD.flat().map((cell, i) => (
                  <div key={i} style={{
                    width: 6, height: 6,
                    background: cell !== 0 ? `var(--piece-${cell})` : 'rgba(255,255,255,0.04)',
                    boxShadow: cell !== 0 ? 'inset 1px 1px 0 rgba(255,255,255,0.32), inset -1px -1px 0 rgba(0,0,0,0.38)' : 'none',
                  }} />
                ))}
              </div>
            </div>

            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-hairline)' }}>
              <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.5rem', color: 'var(--text-faint)', letterSpacing: '0.08em', marginBottom: 9 }}>PERSONAL BESTS</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                {JSTRIS_PBS.map((pb) => (
                  <div key={pb.label} style={{ display: 'grid', gridTemplateColumns: '38px 1fr auto', gap: 8, alignItems: 'baseline' }}>
                    <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.625rem', color: `var(--piece-${pb.piece})` }}>{pb.label}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-strong)' }}>{pb.time} <span style={{ color: 'var(--text-faint)', fontSize: '0.625rem' }}>· {pb.blocks} blocks</span></span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', color: 'var(--text-faint)', whiteSpace: 'nowrap' }}>{pb.date}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ padding: '12px 16px', flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.5rem', color: 'var(--text-faint)', letterSpacing: '0.08em', marginBottom: 9 }}>ALL-TIME STATS</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 16px' }}>
                {JSTRIS_STATS.flatMap(([l1, v1, l2, v2]) => [[l1, v1], [l2, v2]]).map(([label, value], i) => (
                  <div key={i}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
                    <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.6875rem', color: 'var(--text-strong)', marginTop: 3 }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-hairline)', padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.5rem', color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>One block at a time</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', color: 'var(--text-faint)' }}>CS @ UW · '30</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 64 }}>
        <SectionTitle kicker="// Player stats" size={20}>How I Stack</SectionTitle>
        <Card accent="t" accentBar>
          <div className="tj-radar-grid" style={{ display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: 24, alignItems: 'center' }}>
            <RadarChart points={ATTRIBUTES.map((a) => ({ key: a.key, label: a.label, value: a.value, piece: a.piece }))} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              {ATTRIBUTES.map((a) => (
                <div key={a.key} style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: `var(--piece-${a.piece})`, flexShrink: 0, marginBottom: 1 }} />
                  <div style={{ minWidth: 0 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--text-strong)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{a.label} · {a.name}</span>
                    <span style={{ fontSize: '0.7188rem', color: 'var(--text-faint)', lineHeight: 1.4 }}> · {a.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}
