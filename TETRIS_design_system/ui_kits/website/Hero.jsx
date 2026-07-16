/* Hero / landing screen + decorative falling-blocks background. */
const { Button, Badge } = window.TETRISJULIANNDesignSystem_af17e8;

(function injectHeroCSS() {
  if (document.getElementById('tj-hero-css')) return;
  const s = document.createElement('style');
  s.id = 'tj-hero-css';
  s.textContent = `
  @keyframes tj-fall { 0%{ transform:translateY(-120px) rotate(0deg); } 100%{ transform:translateY(820px) rotate(var(--rot,0deg)); } }
  @keyframes tj-blink2 { 0%,55%{opacity:1} 56%,100%{opacity:0.25} }
  .tj-fallpiece{ position:absolute; top:0; opacity:0.16; animation:tj-fall linear infinite; }
  .tj-heroname span{ display:inline-block; }
  .tj-heroname span:hover{ transform:translateY(-6px); transition:transform 120ms var(--ease-snap); }
  .tj-pressstart{ display:inline-flex; align-items:center; gap:12px; cursor:pointer;
    background:none; border:none; padding:6px 8px; font-family:var(--font-pixel); text-transform:uppercase;
    font-size:18px; color:var(--piece-o); letter-spacing:0.06em; text-shadow:0 3px 0 rgba(0,0,0,0.4); }
  .tj-pressstart .tj-ps-label{ animation:tj-blink2 1.1s steps(1) infinite; }
  .tj-pressstart:hover .tj-ps-label{ animation:none; }
  .tj-pressstart:hover{ color:var(--piece-o-lit); }
  .tj-pressstart:active{ transform:translateY(3px); }
  .tj-pressstart .tj-ps-caret{ color:var(--piece-o); }
  .tj-secondary-link{ font-family:var(--font-mono); font-size:12px; font-weight:700; letter-spacing:0.14em;
    text-transform:uppercase; color:var(--text-muted); background:none; border:none; cursor:pointer;
    border-bottom:2px solid transparent; padding:2px 0; transition:color 140ms, border-color 140ms; }
  .tj-secondary-link:hover{ color:var(--piece-i); border-color:var(--piece-i); }
  `;
  document.head.appendChild(s);
})();

function FallingBg() {
  const pieces = ['i', 'o', 't', 's', 'z', 'j', 'l'];
  const drops = [];
  for (let i = 0; i < 14; i++) {
    const p = pieces[i % 7];
    drops.push({
      p,
      left: (i * 7.3 + 3) % 96,
      size: 16 + (i % 4) * 6,
      dur: 7 + (i % 5) * 2.2,
      delay: -(i * 1.7),
      rot: (i % 2 ? 90 : -90),
    });
  }
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {drops.map((d, i) => (
        <img key={i} src={`../../assets/pieces/${d.p}.svg`} className="tj-fallpiece"
          style={{ left: `${d.left}%`, height: d.size, '--rot': `${d.rot}deg`, animationDuration: `${d.dur}s`, animationDelay: `${d.delay}s` }} />
      ))}
    </div>
  );
}

function HudStat({ label, value, color }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.16em', color: 'var(--text-faint)', textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-pixel)', fontSize: 20, color, marginTop: 8 }}>{value}</div>
    </div>
  );
}

function Hero({ onNav }) {
  const name = 'JULIANN';
  const colors = ['--piece-i', '--piece-o', '--piece-t', '--piece-s', '--piece-z', '--piece-j', '--piece-l'];
  return (
    <section style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 24px' }}>
      <div style={{ position: 'relative', width: '100%', maxWidth: 680, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <Badge piece="s" dot>Now playing · CS @ University</Badge>
        </div>
        <h1 className="tj-heroname" style={{
          fontFamily: 'var(--font-pixel)', fontSize: 'clamp(34px, 7vw, 68px)', lineHeight: 1.1,
          textAlign: 'center', margin: 0, textTransform: 'uppercase', letterSpacing: '0.02em',
        }}>
          {name.split('').map((ch, i) => (
            <span key={i} style={{ color: `var(${colors[i % colors.length]})`, textShadow: '0 4px 0 rgba(0,0,0,0.4)' }}>{ch}</span>
          ))}
        </h1>
        <p style={{
          textAlign: 'center', maxWidth: 560, margin: '24px auto 0',
          fontSize: 18, color: 'var(--text-body)', lineHeight: 1.6,
        }}>
          Computer science major, puzzle-solver, and serial block-stacker. I build clean,
          playful software — and I clear my lines.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 36 }}>
          <button className="tj-pressstart" onClick={() => onNav('projects')}>
            <span className="tj-ps-caret">▶</span>
            <span className="tj-ps-label">Press Start</span>
          </button>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { Hero });
