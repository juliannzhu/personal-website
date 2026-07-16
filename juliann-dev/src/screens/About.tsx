import { Card } from '../components/ds/Card'
import { ProgressBar } from '../components/ds/ProgressBar'
import { Tag } from '../components/ds/Tag'
import { Tetromino } from '../components/ds/Tetromino'
import { Avatar } from '../components/ds/Avatar'

const SKILLS = [
  { name: 'Python',              value: 92, piece: 'o' },
  { name: 'JavaScript / React',  value: 88, piece: 'i' },
  { name: 'C',                   value: 80, piece: 'z' },
  { name: 'SQL / MySQL',         value: 82, piece: 's' },
  { name: 'HTML / CSS',          value: 85, piece: 'l' },
  { name: 'Bash / Linux',        value: 70, piece: 't' },
  { name: 'Git / GitHub',        value: 87, piece: 'j' },
] as const

const TIMELINE = [
  { piece: 'i' as const, when: 'Sep 2025 – Present', what: 'B.CS Honours + Co-op', where: 'University of Waterloo · GPA 3.93 · President Scholarship' },
  { piece: 'l' as const, when: 'May 2026 – Present',  what: 'Network Engineering Intern', where: 'ORBCOMM / Skywave: satellite system dashboards, SQL, Grafana' },
  { piece: 's' as const, when: 'Jan 2026 – Present',  what: 'Undergraduate Research Mentee', where: 'UW Usable Security & Privacy Research: co-authoring SOUPS paper on LLM security advice' },
  { piece: 't' as const, when: 'May 2024',            what: 'Hackathon: Gender Equality Award', where: 'Project Tech Careers: platform for women in CS (UN SDG track)' },
]

type PK = 'i' | 'o' | 't' | 's' | 'z' | 'j' | 'l'
const MINI_BOARD: (PK | 0)[][] = [
  [0,   0,   0,   0,   0,   0  ],
  [0,   0,   0,   0,   0,   0  ],
  [0,   0,  't', 't',  0,   0  ],
  [0,   0,   0,  't',  0,   0  ],
  [0,  'j', 'j', 's', 's',  0  ],
  ['l', 'j',  0,  's',  0,   0  ],
  ['l', 'l', 'i', 'i', 'i', 'i'],
  ['z', 'z', 'o', 'o', 't', 't'],
  [0,  'z', 'o', 'o', 't',  0  ],
  ['j', 'j', 'j', 'l', 'l', 'l'],
]

function SectionTitle({ kicker, children }: { kicker: string; children: string }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--piece-i)' }}>{kicker}</div>
      <h2 style={{ fontFamily: 'var(--font-pixel)', fontSize: 26, color: 'var(--text-strong)', margin: '14px 0 0', textTransform: 'uppercase' }}>{children}</h2>
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
  return (
    <section style={{ maxWidth: 1080, margin: '0 auto', padding: '56px 24px 72px' }}>
      <SectionTitle kicker="// Player 1">About</SectionTitle>
      <div className="tj-about-grid" style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 40, alignItems: 'start' }}>
        <div>
          <div style={{ display: 'flex', gap: 18, alignItems: 'center', marginBottom: 24 }}>
            <Avatar initials="JZ" piece="t" size="xl" />
            <div>
              <div style={{ fontFamily: 'var(--font-pixel)', fontSize: 16, color: 'var(--text-strong)' }}>JULIANN ZHU</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>CS @ UWaterloo · she/her · 📍 Ottawa, ON</div>
            </div>
          </div>
          <p style={{ fontSize: 17, lineHeight: 1.7, color: 'var(--text-body)' }}>
            I'm Juliann, a computer science student who loves breaking down problems until the pieces
            fall into place. Right now, I'm focused on the intersection of AI and user experience,
            whether it's through my research on cultural alignment and privacy in LLMs, or bringing
            new, creative ideas to life.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.7, color: 'var(--text-body)', marginTop: 16 }}>
            I love building tools that feel fast and look fun, from low-level systems puzzles to
            playful web apps with a tangible human impact. When I'm away from my keyboard, you'll
            usually find me learning a new song on the piano, taking cute photos of my friends, or
            chasing a new side quest.
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 24 }}>
            <Tag piece="i">Open source</Tag>
            <Tag piece="o">Puzzle games</Tag>
            <Tag piece="s">Coffee</Tag>
            <Tag piece="t">Pixel art</Tag>
            <Tag piece="j">Competitive Tetris</Tag>
            <Tag piece="l">UI/UX</Tag>
          </div>

          <div style={{ marginTop: 40 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 16 }}>
              <h3 style={{ fontFamily: 'var(--font-pixel)', fontSize: 10, color: 'var(--piece-o)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Achievements Unlocked</h3>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-faint)' }}>4 / 4</span>
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
                        <div style={{ fontSize: 15, color: 'var(--text-strong)', fontWeight: 600, lineHeight: 1.3 }}>{t.what}</div>
                        <span style={{ fontFamily: 'var(--font-pixel)', fontSize: 7, background: c, color: 'var(--ink-900)', padding: '3px 5px', flexShrink: 0, letterSpacing: '0.04em', alignSelf: 'flex-start' }}>UNLOCKED</span>
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 3 }}>{t.when}</div>
                      <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5, marginTop: 3 }}>{t.where}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div>
          <Card accent="i" accentBar>
            <h3 style={{ fontFamily: 'var(--font-pixel)', fontSize: 12, color: 'var(--text-strong)', margin: '0 0 20px', textTransform: 'uppercase' }}>Skill Meter</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {SKILLS.map((s) => (
                <ProgressBar key={s.name} value={s.value} piece={s.piece} label={s.name} cells={12} cellHeight={14} />
              ))}
            </div>
          </Card>

          {/* Bottom-right: mini Tetris board graphic */}
          <div style={{ marginTop: 20, border: '2px solid var(--border-hairline)', borderRadius: 'var(--radius-1)', background: 'var(--bg-well)', overflow: 'hidden' }}>
            <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border-hairline)', fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
              // current board
            </div>
            <div style={{ padding: '14px 16px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 11px)', gridTemplateRows: 'repeat(10, 11px)', gap: 2, flexShrink: 0 }}>
                {MINI_BOARD.flat().map((cell, i) => (
                  <div key={i} style={{
                    width: 11, height: 11,
                    background: cell !== 0 ? `var(--piece-${cell})` : 'rgba(255,255,255,0.04)',
                    boxShadow: cell !== 0 ? 'inset 1px 1px 0 rgba(255,255,255,0.32), inset -1px -1px 0 rgba(0,0,0,0.38)' : 'none',
                  }} />
                ))}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
                {([
                  { label: 'SCORE', value: '048,270', color: 'var(--piece-o)' },
                  { label: 'LINES', value: '128', color: 'var(--piece-i)' },
                  { label: 'LEVEL', value: '09', color: 'var(--piece-s)' },
                  { label: 'B2B', value: '47', color: 'var(--piece-t)' },
                ] as const).map(({ label, value, color }) => (
                  <div key={label}>
                    <div style={{ fontFamily: 'var(--font-pixel)', fontSize: 7, color: 'var(--text-faint)', letterSpacing: '0.08em', marginBottom: 3 }}>{label}</div>
                    <div style={{ fontFamily: 'var(--font-pixel)', fontSize: 13, color, letterSpacing: '0.04em' }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ borderTop: '1px solid var(--border-hairline)', padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-pixel)', fontSize: 8, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>One block at a time</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-faint)' }}>CS @ UW · '29</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
