/* Projects screen — filterable grid of project cards. */
const { Card, Tag, Button, Tetromino } = window.TETRISJULIANNDesignSystem_af17e8;

const PROJECTS = [
  { title: 'BLOCKDROP', piece: 't', tagline: 'A modern Tetris clone in the browser', tags: ['TypeScript', 'Canvas', 'WebAudio'], cat: 'game', year: '2025' },
  { title: 'PATHFINDER', piece: 'i', tagline: 'Interactive A* & Dijkstra maze visualizer', tags: ['React', 'Algorithms'], cat: 'web', year: '2025' },
  { title: 'SHELLDB', piece: 's', tagline: 'A tiny relational database written in C', tags: ['C', 'Systems'], cat: 'systems', year: '2024' },
  { title: 'COMMITSTREAK', piece: 'o', tagline: 'GitHub contribution heatmap, reimagined', tags: ['Next.js', 'GraphQL'], cat: 'web', year: '2024' },
  { title: 'RAYCASTER', piece: 'z', tagline: 'A Wolfenstein-style 3D engine from scratch', tags: ['C++', 'Graphics'], cat: 'systems', year: '2024' },
  { title: 'STUDYBUDDY', piece: 'l', tagline: 'Pomodoro + spaced-repetition study app', tags: ['React Native', 'SQLite'], cat: 'app', year: '2023' },
];

const FILTERS = [
  { id: 'all', label: 'All', piece: 'i' },
  { id: 'web', label: 'Web', piece: 'i' },
  { id: 'game', label: 'Games', piece: 't' },
  { id: 'systems', label: 'Systems', piece: 's' },
  { id: 'app', label: 'Apps', piece: 'l' },
];

function ProjectCard({ p, onOpen }) {
  return (
    <Card accent={p.piece} interactive accentBar onClick={onOpen} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Tetromino piece={p.piece} size={14} />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-faint)' }}>{p.year}</span>
      </div>
      <h3 style={{ fontFamily: 'var(--font-pixel)', fontSize: 15, color: 'var(--text-strong)', margin: '20px 0 0', textTransform: 'uppercase' }}>{p.title}</h3>
      <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: '12px 0 0', lineHeight: 1.55, flex: 1 }}>{p.tagline}</p>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 18 }}>
        {p.tags.map((t) => <Tag key={t} piece={p.piece}>{t}</Tag>)}
      </div>
    </Card>
  );
}

function Projects({ onNav }) {
  const [filter, setFilter] = React.useState('all');
  const shown = PROJECTS.filter((p) => filter === 'all' || p.cat === filter);
  return (
    <section style={{ maxWidth: 1080, margin: '0 auto', padding: '56px 24px' }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--piece-i)' }}>// High scores</div>
        <h2 style={{ fontFamily: 'var(--font-pixel)', fontSize: 26, color: 'var(--text-strong)', margin: '14px 0 0', textTransform: 'uppercase' }}>Selected Work</h2>
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
        {FILTERS.map((f) => (
          <Tag key={f.id} piece={f.piece} interactive active={filter === f.id} onClick={() => setFilter(f.id)}>{f.label}</Tag>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
        {shown.map((p) => <ProjectCard key={p.title} p={p} onOpen={() => onNav('contact')} />)}
      </div>
      <div style={{ textAlign: 'center', marginTop: 40 }}>
        <Button variant="secondary" leftIcon={<iconify-icon icon="pixelarticons:github"></iconify-icon>}>More on GitHub</Button>
      </div>
    </section>
  );
}

Object.assign(window, { Projects });
