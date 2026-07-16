/* About screen — bio + skill meters. */
const { Card, ProgressBar, Tag, Tetromino, Avatar } = window.TETRISJULIANNDesignSystem_af17e8;

const SKILLS = [
  { name: 'Python', value: 90, piece: 'o' },
  { name: 'C / C++', value: 78, piece: 'z' },
  { name: 'JavaScript / React', value: 84, piece: 'i' },
  { name: 'Algorithms', value: 88, piece: 't' },
  { name: 'Rust', value: 52, piece: 'l' },
  { name: 'Systems', value: 64, piece: 's' },
];

const TIMELINE = [
  { piece: 'i', when: '2024 — now', what: 'B.S. Computer Science', where: 'State University · GPA 3.9' },
  { piece: 's', when: 'Summer 2025', what: 'SWE Intern', where: 'Built internal tooling for a fintech team' },
  { piece: 't', when: '2024', what: 'Hackathon — 1st place', where: 'Real-time collab whiteboard' },
];

function SectionTitle({ kicker, children }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--piece-i)' }}>{kicker}</div>
      <h2 style={{ fontFamily: 'var(--font-pixel)', fontSize: 26, color: 'var(--text-strong)', margin: '14px 0 0', textTransform: 'uppercase' }}>{children}</h2>
    </div>
  );
}

function About() {
  return (
    <section style={{ maxWidth: 1080, margin: '0 auto', padding: '56px 24px' }}>
      <SectionTitle kicker="// Player 1">About</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 40, alignItems: 'start' }}>
        <div>
          <div style={{ display: 'flex', gap: 18, alignItems: 'center', marginBottom: 24 }}>
            <Avatar initials="JU" piece="t" size="xl" />
            <div>
              <div style={{ fontFamily: 'var(--font-pixel)', fontSize: 16, color: 'var(--text-strong)' }}>JULIANN</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>cs major · she/her · caffeine → code</div>
            </div>
          </div>
          <p style={{ fontSize: 17, lineHeight: 1.7, color: 'var(--text-body)' }}>
            Hi! I'm Juliann — a computer science major who treats every problem like a falling
            tetromino: rotate it, find where it fits, clear the line. I love building things that
            feel fast and look fun, from systems-level puzzles to playful web apps.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.7, color: 'var(--text-body)', marginTop: 16 }}>
            When I'm not stacking commits, you'll find me chasing a high score, sketching UI ideas,
            or over-engineering my coffee setup.
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 24 }}>
            <Tag piece="i">Open source</Tag>
            <Tag piece="o">Puzzle games</Tag>
            <Tag piece="s">Coffee</Tag>
            <Tag piece="t">Pixel art</Tag>
          </div>

          <h3 style={{ fontFamily: 'var(--font-pixel)', fontSize: 13, color: 'var(--text-strong)', margin: '40px 0 20px', textTransform: 'uppercase' }}>Timeline</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {TIMELINE.map((t, i) => (
              <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{ paddingTop: 2 }}><Tetromino piece={t.piece} size={10} /></div>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{t.when}</div>
                  <div style={{ fontSize: 16, color: 'var(--text-strong)', fontWeight: 600, marginTop: 2 }}>{t.what}</div>
                  <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>{t.where}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Card accent="i" accentBar>
          <h3 style={{ fontFamily: 'var(--font-pixel)', fontSize: 12, color: 'var(--text-strong)', margin: '0 0 20px', textTransform: 'uppercase' }}>Skill Meter</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {SKILLS.map((s) => (
              <ProgressBar key={s.name} value={s.value} piece={s.piece} label={s.name} cells={12} cellHeight={14} />
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
}

Object.assign(window, { About, SectionTitle });
