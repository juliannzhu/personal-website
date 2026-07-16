/* Now page — what Juliann is currently up to. */
const { Card, Badge, Tag, ProgressBar, Tetromino } = window.TETRISJULIANNDesignSystem_af17e8;

const NOW = [
  { piece: 'i', label: 'Building', text: 'BLOCKDROP v2 — adding online multiplayer and a spectator mode.' },
  { piece: 'o', label: 'Learning', text: 'Rust ownership for real this time. The borrow checker and I are friends now (mostly).' },
  { piece: 's', label: 'Reading', text: '“Designing Data-Intensive Applications” — slowly, with many highlights.' },
  { piece: 't', label: 'Playing', text: 'Tetris Effect: Connected. Chasing a sub-2-minute 40-line sprint.' },
];

function Now() {
  return (
    <section style={{ maxWidth: 860, margin: '0 auto', padding: '56px 24px' }}>
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--piece-i)' }}>// Current state</div>
        <h2 style={{ fontFamily: 'var(--font-pixel)', fontSize: 26, color: 'var(--text-strong)', margin: '14px 0 0', textTransform: 'uppercase' }}>Now</h2>
      </div>
      <p style={{ fontSize: 16, color: 'var(--text-muted)', maxWidth: 520, lineHeight: 1.6, marginBottom: 32 }}>
        A snapshot of what's on my board right now. Last updated June 2026.
        <span style={{ display: 'inline-block', marginLeft: 8, verticalAlign: 'middle' }}><Badge piece="s" dot>live</Badge></span>
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        {NOW.map((n) => (
          <Card key={n.label} accent={n.piece}>
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <Tetromino piece={n.piece} size={12} />
              <div>
                <div style={{ fontFamily: 'var(--font-pixel)', fontSize: 11, color: `var(--piece-${n.piece})`, textTransform: 'uppercase', marginBottom: 10 }}>{n.label}</div>
                <p style={{ margin: 0, fontSize: 15, color: 'var(--text-body)', lineHeight: 1.6 }}>{n.text}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card accent="o" accentBar style={{ marginTop: 18 }}>
        <div style={{ fontFamily: 'var(--font-pixel)', fontSize: 11, color: 'var(--text-strong)', textTransform: 'uppercase', marginBottom: 16 }}>This week's stats</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
          <ProgressBar value={80} piece="i" label="Commits" cells={10} cellHeight={12} />
          <ProgressBar value={45} piece="t" label="Sleep" cells={10} cellHeight={12} />
          <ProgressBar value={95} piece="o" label="Coffee" cells={10} cellHeight={12} />
        </div>
      </Card>
    </section>
  );
}

Object.assign(window, { Now });
