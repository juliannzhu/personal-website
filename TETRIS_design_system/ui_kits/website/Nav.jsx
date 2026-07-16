/* TopNav + Footer for Juliann's site. Composes bundle primitives. */
const { IconButton, Tetromino } = window.TETRISJULIANNDesignSystem_af17e8;

const NAV_ITEMS = [
  { id: 'home', label: 'Home', piece: 'i' },
  { id: 'about', label: 'About', piece: 'o' },
  { id: 'projects', label: 'Work', piece: 's' },
  { id: 'now', label: 'Now', piece: 'l' },
  { id: 'contact', label: 'Contact', piece: 'z' },
];

function Logo({ onClick }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 12, background: 'none',
      border: 'none', cursor: 'pointer', padding: 0,
    }}>
      <Tetromino piece="t" size={9} />
      <span style={{
        fontFamily: 'var(--font-pixel)', fontSize: 16, color: 'var(--text-strong)',
        textTransform: 'uppercase', letterSpacing: '0.02em',
      }}>JULIANN</span>
    </button>
  );
}

/* A nav item rendered as a vertical slot in the Tetris "NEXT" queue:
   a mini-tetromino in its piece color beside a readable pixel label.
   The current page is the "active" piece — lit up; the rest are queued/dim. */
function NextSlot({ item, active, onNav }) {
  const c = `var(--piece-${item.piece})`;
  return (
    <button
      onClick={() => onNav(item.id)}
      title={item.label}
      aria-current={active ? 'page' : undefined}
      style={{
        display: 'flex', alignItems: 'center', gap: 16, width: '100%',
        padding: '15px 18px', cursor: 'pointer', textAlign: 'left',
        backgroundColor: active ? `color-mix(in srgb, ${c} 20%, var(--bg-well))` : 'var(--bg-well)',
        borderWidth: '2px', borderStyle: 'solid',
        borderColor: active ? c : 'var(--border-strong)',
        borderRadius: 'var(--radius-1)',
        boxShadow: active ? `0 0 14px color-mix(in srgb, ${c} 45%, transparent)` : '0 0 0 transparent',
      }}
      onMouseEnter={(e) => { if (!active) { e.currentTarget.style.borderColor = c; e.currentTarget.querySelector('.tj-slot-lbl').style.color = 'var(--text-strong)'; } }}
      onMouseLeave={(e) => { if (!active) { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.querySelector('.tj-slot-lbl').style.color = 'var(--text-muted)'; } }}
    >
      <span style={{ width: 48, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none',
        filter: active ? 'none' : 'saturate(0.45) brightness(0.85)', opacity: active ? 1 : 0.7,
        transition: 'filter 140ms, opacity 140ms' }}>
        <Tetromino piece={item.piece} size={9} />
      </span>
      <span className="tj-slot-lbl" style={{
        fontFamily: 'var(--font-pixel)', fontSize: 14, letterSpacing: '0.02em',
        textTransform: 'uppercase', color: active ? 'var(--text-strong)' : 'var(--text-muted)',
        transition: 'color 140ms',
      }}>{item.label}</span>
    </button>
  );
}

function TopNav({ current, onNav }) {
  return (
    <React.Fragment>
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'color-mix(in srgb, var(--bg-page) 86%, transparent)',
        backdropFilter: 'blur(8px)',
        borderBottom: '2px solid var(--border-strong)',
      }}>
        <div style={{
          maxWidth: 1080, margin: '0 auto', height: 64, padding: '0 24px',
          display: 'flex', alignItems: 'center',
        }}>
          <Logo onClick={() => onNav('home')} />
        </div>
      </header>
      <nav style={{
        position: 'fixed', top: '50%', right: 22, transform: 'translateY(-50%)', zIndex: 100,
        display: 'flex', flexDirection: 'column', gap: 10, padding: 16, width: 264,
        background: 'color-mix(in srgb, var(--ink-1000) 90%, transparent)',
        backdropFilter: 'blur(8px)',
        border: '2px solid var(--border-strong)', borderRadius: 'var(--radius-1)',
        boxShadow: 'var(--shadow-soft)',
      }}>
        <div style={{
          fontFamily: 'var(--font-pixel)', fontSize: 13, color: 'var(--text-faint)',
          textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'center',
          padding: '4px 0 12px', borderBottom: '2px solid var(--border-hairline)',
        }}>NEXT</div>
        {NAV_ITEMS.map((it) => (
          <NextSlot key={it.id} item={it} active={current === it.id} onNav={onNav} />
        ))}
      </nav>
    </React.Fragment>
  );
}

function Footer({ onNav }) {
  const pieces = ['i', 'o', 't', 's', 'z', 'j', 'l'];
  return (
    <footer style={{ borderTop: '2px solid var(--border-strong)', marginTop: 0 }}>
      <div style={{ display: 'flex', height: 8 }}>
        {pieces.map((p) => <div key={p} style={{ flex: 1, background: `var(--piece-${p})` }} />)}
      </div>
      <div style={{
        maxWidth: 1080, margin: '0 auto', padding: '32px 24px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16,
      }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-faint)' }}>
          © 2026 JULIANN · BUILT ONE BLOCK AT A TIME
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <IconButton label="GitHub" variant="ghost"><iconify-icon icon="pixelarticons:github"></iconify-icon></IconButton>
          <IconButton label="Email" variant="ghost"><iconify-icon icon="pixelarticons:mail"></iconify-icon></IconButton>
          <IconButton label="LinkedIn" variant="ghost"><iconify-icon icon="pixelarticons:briefcase"></iconify-icon></IconButton>
        </div>
      </div>
    </footer>
  );
}

/* Full-screen falling-pieces background, inset from the very top and bottom.
   Sits behind all page content (z-index 0). */
(function injectFallCSS() {
  if (document.getElementById('tj-fallfield-css')) return;
  const s = document.createElement('style');
  s.id = 'tj-fallfield-css';
  s.textContent = `
  @keyframes tj-fallfield { 0%{ transform:translateY(-160px) rotate(0deg); } 100%{ transform:translateY(110vh) rotate(var(--rot,90deg)); } }
  .tj-fallfield-piece{ position:absolute; top:0; opacity:0.15; animation:tj-fallfield linear infinite; will-change:transform; }
  `;
  document.head.appendChild(s);
})();

function FallingField() {
  const pieces = ['i', 'o', 't', 's', 'z', 'j', 'l'];
  const drops = [];
  for (let i = 0; i < 18; i++) {
    drops.push({
      p: pieces[i % 7],
      left: (i * 5.6 + 2) % 97,
      size: 18 + (i % 4) * 8,
      dur: 9 + (i % 6) * 2.3,
      delay: -(i * 1.4),
      rot: i % 2 ? 90 : -90,
    });
  }
  return (
    <div aria-hidden="true" style={{ position: 'fixed', top: 80, bottom: 80, left: 0, right: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {drops.map((d, i) => (
        <img key={i} src={`../../assets/pieces/${d.p}.svg`} className="tj-fallfield-piece"
          style={{ left: `${d.left}%`, height: d.size, '--rot': `${d.rot}deg`, animationDuration: `${d.dur}s`, animationDelay: `${d.delay}s` }} />
      ))}
    </div>
  );
}

Object.assign(window, { TopNav, Footer, NAV_ITEMS, FallingField });
