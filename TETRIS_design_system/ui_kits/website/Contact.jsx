/* Contact screen — message form + links. */
const { Input, Textarea, Button, Card, IconButton, Tetromino } = window.TETRISJULIANNDesignSystem_af17e8;

const LINKS = [
  { label: 'GitHub', handle: '@juliann', icon: 'pixelarticons:github', piece: 'i' },
  { label: 'Email', handle: 'hi@juliann.dev', icon: 'pixelarticons:mail', piece: 'o' },
  { label: 'LinkedIn', handle: 'in/juliann', icon: 'pixelarticons:briefcase', piece: 's' },
  { label: 'Resume', handle: 'juliann.pdf', icon: 'pixelarticons:file', piece: 't' },
];

function Contact() {
  const [sent, setSent] = React.useState(false);
  return (
    <section style={{ maxWidth: 1080, margin: '0 auto', padding: '56px 24px' }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--piece-i)' }}>// Insert coin</div>
        <h2 style={{ fontFamily: 'var(--font-pixel)', fontSize: 26, color: 'var(--text-strong)', margin: '14px 0 0', textTransform: 'uppercase' }}>Let's Connect</h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 32, alignItems: 'start' }}>
        <Card accent="i" accentBar>
          {sent ? (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <Tetromino piece="s" size={22} />
              <div style={{ fontFamily: 'var(--font-pixel)', fontSize: 16, color: 'var(--piece-s)', margin: '20px 0 8px', textTransform: 'uppercase' }}>Line Cleared!</div>
              <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>Thanks — I'll get back to you soon.</p>
              <div style={{ marginTop: 20 }}><Button variant="ghost" size="sm" onClick={() => setSent(false)}>Send Another</Button></div>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <Input label="Name" placeholder="Your name" required />
                <Input label="Email" type="email" placeholder="you@email.com" required />
              </div>
              <div style={{ marginBottom: 20 }}>
                <Textarea label="Message" placeholder="What are we building?" required />
              </div>
              <Button variant="success" type="submit" block>Send Message</Button>
            </form>
          )}
        </Card>
        <div>
          <h3 style={{ fontFamily: 'var(--font-pixel)', fontSize: 12, color: 'var(--text-strong)', margin: '0 0 18px', textTransform: 'uppercase' }}>Find me</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {LINKS.map((l) => (
              <a key={l.label} href="#" onClick={(e) => e.preventDefault()} style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px', textDecoration: 'none',
                background: 'var(--surface-card)', border: '2px solid var(--border-strong)', borderRadius: 'var(--radius-1)',
                transition: 'border-color 140ms, transform 140ms',
              }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = `var(--piece-${l.piece})`; e.currentTarget.style.transform = 'translateX(4px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.transform = 'translateX(0)'; }}
              >
                <span style={{ color: `var(--piece-${l.piece})`, fontSize: 20, display: 'flex' }}><iconify-icon icon={l.icon}></iconify-icon></span>
                <span style={{ flex: 1 }}>
                  <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>{l.label}</span>
                  <span style={{ display: 'block', color: 'var(--text-strong)', fontSize: 15, fontWeight: 600 }}>{l.handle}</span>
                </span>
                <iconify-icon icon="pixelarticons:chevron-right" style={{ color: 'var(--text-faint)' }}></iconify-icon>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { Contact });
