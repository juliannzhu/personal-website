import { useState, useRef, useEffect } from 'react'
import { Card } from '../components/ds/Card'
import { Tag } from '../components/ds/Tag'
import { Tetromino } from '../components/ds/Tetromino'

type Piece = 'i' | 'o' | 't' | 's' | 'z' | 'j' | 'l'

interface QuestCard {
  id: string
  piece: Piece
  title: string
  sub: string
  tags: string[]
  placeholder: string
  images: string[]
}

// images live in /public/assets/quests/ — replace with your own photos any time
const Q = (id: string) => `/assets/quests/${id}`

const QUESTS: QuestCard[] = [
  {
    id: 'tetris',
    piece: 'j',
    title: 'TETRIS',
    sub: 'Competitive sprint and ultra player. Jstris handle: Jambo722. Always chasing a new PB.',
    tags: ['Jstris', '20L Sprint', 'Ultra', 'Competitive'],
    placeholder: '🎮',
    images: [Q('tetris-1.jpg'), Q('tetris-2.jpg')],
  },
  {
    id: 'gaming',
    piece: 'i',
    title: 'GAMING',
    sub: 'Puzzle games, rhythm games, and anything that rewards pattern recognition and fast thinking.',
    tags: ['Puzzle', 'Rhythm', 'Strategy'],
    placeholder: '🕹️',
    images: [Q('gaming-1.jpg'), Q('gaming-2.jpg')],
  },
  {
    id: 'photography',
    piece: 'o',
    title: 'PHOTOGRAPHY',
    sub: 'Candid shots, travel photos, and life through a lens. Instagram: @juliann.zhu',
    tags: ['Candid', 'Travel', 'Film'],
    placeholder: '📷',
    images: [Q('photography-1.jpg'), Q('photography-2.jpg')],
  },
  {
    id: 'art',
    piece: 's',
    title: 'ART & DESIGN',
    sub: 'UI sketches, pixel art, and visual experiments that sometimes become websites.',
    tags: ['Pixel Art', 'UI/UX', 'Sketching'],
    placeholder: '🎨',
    images: [Q('art-1.jpg'), Q('art-2.jpg')],
  },
  {
    id: 'music',
    piece: 'l',
    title: 'PIANO & MUSIC',
    sub: 'Studied RCM for 13 years, earning Level 10. Weekly 75-minute lessons, 10 hours of practice per week, and 6 recitals annually.',
    tags: ['RCM Level 10', 'Classical', 'Technique', 'Ear Training'],
    placeholder: '🎹',
    images: [Q('music-1.jpg'), Q('music-2.jpg')],
  },
  {
    id: 'anime',
    piece: 't',
    title: 'ANIME & MANGA',
    sub: 'Story-driven series, world-building, and anything with a good plot twist.',
    tags: ['Shonen', 'Seinen', 'Slice of Life'],
    placeholder: '📖',
    images: [Q('anime-1.jpg'), Q('anime-2.jpg')],
  },
  {
    id: 'poker',
    piece: 'z',
    title: 'POKER',
    sub: 'Game theory, probability, and reading patterns under pressure.',
    tags: ['Strategy', 'Game Theory', "Texas Hold'em"],
    placeholder: '♠️',
    images: [Q('poker-1.jpg'), Q('poker-2.jpg')],
  },
  {
    id: 'chess',
    piece: 'j',
    title: 'CHESS',
    sub: 'Opening prep, endgames, and the never-ending quest to stop hanging pieces.',
    tags: ['Openings', 'Tactics', 'Chess.com'],
    placeholder: '♟️',
    images: [Q('chess-1.jpg'), Q('chess-2.jpg')],
  },
  {
    id: 'volleyball',
    piece: 's',
    title: 'VOLLEYBALL',
    sub: 'Team Captain at Merivale HS (2021-2025). Led the team to NCSSAA Tier 1 finals, won 7 regional tournaments, 4 consecutive Marauders Cups, and MVP in 2021 and 2023.',
    tags: ['Team Captain', 'NCSSAA', 'MVP x2', 'Marauders Cup'],
    placeholder: '🏐',
    images: [Q('volleyball-1.jpg'), Q('volleyball-2.jpg')],
  },
  {
    id: 'penspinning',
    piece: 't',
    title: 'PEN SPINNING',
    sub: 'An oddly satisfying skill. Working on combos that look effortless but took way too long to learn.',
    tags: ['Tricks', 'Combos', 'Satisfying'],
    placeholder: '🖊️',
    images: [Q('penspinning-1.jpg'), Q('penspinning-2.jpg')],
  },
  {
    id: 'baking',
    piece: 'l',
    title: 'BAKING',
    sub: 'Stress baking after midterms. Macarons are still the final boss but everything else is going well.',
    tags: ['Macarons', 'Cookies', 'Stress Relief'],
    placeholder: '🧁',
    images: [Q('baking-1.jpg'), Q('baking-2.jpg')],
  },
  {
    id: 'fashion',
    piece: 'o',
    title: 'FASHION',
    sub: 'Putting outfits together is another form of creative expression. Thrifting is an art form.',
    tags: ['Thrifting', 'Outfits', 'Aesthetics'],
    placeholder: '👗',
    images: [Q('fashion-1.jpg'), Q('fashion-2.jpg')],
  },
  {
    id: 'travel',
    piece: 'i',
    title: 'TRAVELLING',
    sub: 'New cities, new food, new perspectives. Every trip comes back with way too many photos.',
    tags: ['Explore', 'Food', 'Photography'],
    placeholder: '✈️',
    images: [Q('travel-1.jpg'), Q('travel-2.jpg')],
  },
  {
    id: 'modelling',
    piece: 'z',
    title: 'MODELLING',
    sub: 'Posing, lighting, angles. Most photos end up in my camera roll but some make it to Instagram.',
    tags: ['Photography', 'Portraits', 'Creative'],
    placeholder: '📸',
    images: [Q('modelling-1.jpg'), Q('modelling-2.jpg')],
  },
  {
    id: 'people',
    piece: 'j',
    title: 'PEOPLE + MY DOG',
    sub: 'Quality time is my love language. My dog is a golden retriever mix named Mochi and she is perfect.',
    tags: ['Friends', 'Golden Retriever', 'Mochi', 'Quality Time'],
    placeholder: '🐾',
    images: [Q('people-1.jpg'), Q('people-2.jpg')],
  },
  {
    id: 'relay',
    piece: 'z',
    title: 'RELAY FOR LIFE',
    sub: 'Team Captain for Relay For Life in Nepean, ON (2023-2025). Raised over $700 for cancer research, contributing to a total of $29,000 raised by our community.',
    tags: ['Team Captain', 'Fundraising', 'Cancer Research', 'Community'],
    placeholder: '🎗️',
    images: [],
  },
  {
    id: 'robotics',
    piece: 'i',
    title: 'FIRST ROBOTICS',
    sub: 'Mechanical Member of Spark Youth FIRST Robotics Club (2024-2025) in Kanata, ON. Built drive components and autonomous systems for the 2023 FIRST Robotics Competition.',
    tags: ['FRC', 'Mechanical', 'Autonomous', 'Kanata'],
    placeholder: '🤖',
    images: [],
  },
  {
    id: 'lego',
    piece: 'o',
    title: 'FIRST LEGO LEAGUE',
    sub: 'Instructor and Logistics Lead (2024-2025) in Kanata, ON. Introduced kids to STEM through robotics, supervised budgeting and construction, and delivered bi-weekly coding lessons using LEGO SPIKE.',
    tags: ['Instructor', 'STEM', 'LEGO SPIKE', 'Logistics Lead'],
    placeholder: '🧱',
    images: [],
  },
]

// ---- CSS ----
const CSS = `
.tj-quest-card {
  cursor: pointer;
  transition: transform 180ms var(--ease-snap), box-shadow 180ms;
}
.tj-quest-card:hover {
  transform: translateY(-4px);
}

/* image container */
.tj-quest-media {
  width: 100%; aspect-ratio: 16/9;
  background: var(--bg-well); border: 2px dashed var(--border-hairline);
  border-radius: var(--radius-1); margin-bottom: 16px;
  position: relative; overflow: hidden;
  display: flex; align-items: center; justify-content: center; font-size: 48px;
}
/* Ken Burns zoom on hover */
.tj-quest-img {
  position: absolute; inset: 0; width: 100%; height: 100%;
  object-fit: cover; object-position: center;
  transition: transform 700ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.tj-quest-card:hover .tj-quest-img { transform: scale(1.06); }

/* click hint overlay */
.tj-quest-hint {
  position: absolute; inset: 0;
  background: rgba(10,10,18,0.52);
  display: flex; align-items: center; justify-content: center;
  opacity: 0; transition: opacity 160ms;
  font-family: var(--font-pixel); font-size: 9px; color: var(--text-muted);
  text-transform: uppercase; letter-spacing: 0.1em;
}
.tj-quest-card:hover .tj-quest-hint { opacity: 1; }

/* detail page slide-in */
@keyframes tj-slide-in-left {
  from { transform: translateX(-24px); opacity: 0; }
  to   { transform: translateX(0);     opacity: 1; }
}
.tj-quest-detail { animation: tj-slide-in-left 240ms var(--ease-snap) both; }
`

let cssInjected = false
function ensureCSS() {
  if (!cssInjected && typeof document !== 'undefined') {
    const s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s); cssInjected = true
  }
}

// ---- Photography: reverse-scrolling columns ----
const PHOTO_ITEMS = [
  Q('photography-1.jpg'), Q('photography-2.jpg'),
  Q('travel-1.jpg'), Q('modelling-1.jpg'),
  Q('people-1.jpg'), Q('art-1.jpg'),
  Q('fashion-1.jpg'), Q('travel-2.jpg'),
]

function PhotoColumn({ items, direction }: { items: string[]; direction: 'up' | 'down' }) {
  const colRef = useRef<HTMLDivElement>(null)
  const offset = useRef(direction === 'down' ? -50 : 0)
  const raf = useRef<number>(0)

  useEffect(() => {
    let last = 0
    const tick = (ts: number) => {
      const delta = ts - last; last = ts
      if (colRef.current) {
        offset.current += (direction === 'up' ? -1 : 1) * delta * 0.022
        const h = colRef.current.scrollHeight / 2
        if (offset.current <= -h) offset.current += h
        if (offset.current >= 0) offset.current -= h
        colRef.current.style.transform = `translateY(${offset.current}px)`
      }
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [direction])

  const doubled = [...items, ...items]
  return (
    <div style={{ overflow: 'hidden', flex: 1, borderRadius: 'var(--radius-1)' }}>
      <div ref={colRef} style={{ display: 'flex', flexDirection: 'column', gap: 10, willChange: 'transform' }}>
        {doubled.map((src, i) => (
          <div key={i} style={{ aspectRatio: '3/4', borderRadius: 'var(--radius-1)', overflow: 'hidden', flexShrink: 0 }}>
            <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        ))}
      </div>
    </div>
  )
}

function PhotographyDetail({ quest, onBack }: { quest: QuestCard; onBack: () => void }) {
  const c = `var(--piece-${quest.piece})`
  const col1 = PHOTO_ITEMS.filter((_, i) => i % 3 === 0)
  const col2 = PHOTO_ITEMS.filter((_, i) => i % 3 === 1)
  const col3 = PHOTO_ITEMS.filter((_, i) => i % 3 === 2)

  return (
    <section className="tj-quest-detail" style={{ maxWidth: 1080, margin: '0 auto', padding: '48px 24px 72px' }}>
      <button onClick={onBack}
        onMouseEnter={(e) => { e.currentTarget.style.color = c }}
        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)' }}
        style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 32, padding: 0, transition: 'color 140ms' }}>
        Back to Side Quests
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 28 }}>
        <Tetromino piece={quest.piece} size={18} />
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: c, marginBottom: 6 }}>{'// Side Quest'}</div>
          <h2 style={{ fontFamily: 'var(--font-pixel)', fontSize: 22, color: 'var(--text-strong)', margin: 0, textTransform: 'uppercase' }}>{quest.title}</h2>
        </div>
      </div>

      <p style={{ fontSize: 16, color: 'var(--text-muted)', maxWidth: 560, lineHeight: 1.7, marginBottom: 24 }}>{quest.sub}</p>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 40 }}>
        {quest.tags.map((t) => <Tag key={t} piece={quest.piece}>{t}</Tag>)}
      </div>

      <div style={{ height: 480, display: 'flex', gap: 12 }}>
        <PhotoColumn items={col1.length ? col1 : PHOTO_ITEMS.slice(0, 3)} direction="down" />
        <PhotoColumn items={col2.length ? col2 : PHOTO_ITEMS.slice(2, 5)} direction="up" />
        <PhotoColumn items={col3.length ? col3 : PHOTO_ITEMS.slice(4, 7)} direction="down" />
      </div>

      <div style={{ marginTop: 24, padding: '16px 20px', background: 'var(--bg-well)', border: '2px solid var(--border-hairline)', borderRadius: 'var(--radius-1)' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-faint)' }}>
          {'// Add your own photos to public/assets/quests/ and update the image paths in SideQuests.tsx'}
        </span>
      </div>
    </section>
  )
}

// ---- Generic detail sub-page ----
function MediaSlot({ src, index }: { src?: string; index: number }) {
  return (
    <div style={{
      aspectRatio: index === 0 ? '16/9' : '4/3',
      gridColumn: index === 0 ? 'span 2' : undefined,
      borderRadius: 'var(--radius-1)', overflow: 'hidden',
      background: src ? 'transparent' : 'var(--bg-well)',
      border: src ? 'none' : '2px dashed var(--border-hairline)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10,
      cursor: src ? 'default' : 'pointer',
    }}
    onMouseEnter={(e) => { if (!src) e.currentTarget.style.borderColor = 'var(--border-strong)' }}
    onMouseLeave={(e) => { if (!src) e.currentTarget.style.borderColor = 'var(--border-hairline)' }}>
      {src ? (
        <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <>
          <span style={{ fontSize: 28, opacity: 0.35 }}>+</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            {index === 0 ? 'Add featured media' : 'Add photo or video'}
          </span>
        </>
      )}
    </div>
  )
}

function QuestDetail({ quest, onBack }: { quest: QuestCard; onBack: () => void }) {
  if (quest.id === 'photography') return <PhotographyDetail quest={quest} onBack={onBack} />
  const c = `var(--piece-${quest.piece})`
  return (
    <section className="tj-quest-detail" style={{ maxWidth: 1080, margin: '0 auto', padding: '48px 24px 72px' }}>
      <button onClick={onBack}
        onMouseEnter={(e) => { e.currentTarget.style.color = c }}
        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)' }}
        style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 32, padding: 0, transition: 'color 140ms' }}>
        Back to Side Quests
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 28 }}>
        <Tetromino piece={quest.piece} size={18} />
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: c, marginBottom: 6 }}>{'// Side Quest'}</div>
          <h2 style={{ fontFamily: 'var(--font-pixel)', fontSize: 22, color: 'var(--text-strong)', margin: 0, textTransform: 'uppercase' }}>{quest.title}</h2>
        </div>
      </div>

      <p style={{ fontSize: 16, color: 'var(--text-muted)', maxWidth: 560, lineHeight: 1.7, marginBottom: 32 }}>{quest.sub}</p>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 40 }}>
        {quest.tags.map((t) => <Tag key={t} piece={quest.piece}>{t}</Tag>)}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <MediaSlot key={i} src={quest.images[i]} index={i} />
        ))}
      </div>

      <div style={{ marginTop: 24, padding: '16px 20px', background: 'var(--bg-well)', border: '2px solid var(--border-hairline)', borderRadius: 'var(--radius-1)' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-faint)' }}>
          {'// Add your own photos to public/assets/quests/ to populate this page'}
        </span>
      </div>
    </section>
  )
}

// ---- Grid tile ----
function QuestTile({ q, onClick }: { q: QuestCard; onClick: () => void }) {
  return (
    <div className="tj-quest-card" onClick={onClick}>
      <Card accent={q.piece} accentBar style={{ display: 'flex', flexDirection: 'column', height: '100%', userSelect: 'none' }}>
        <div className="tj-quest-media">
          {q.images[0] && <img src={q.images[0]} alt={q.title} className="tj-quest-img" />}
          {!q.images[0] && <span style={{ fontSize: 48 }}>{q.placeholder}</span>}
          <div className="tj-quest-hint">Click to explore</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
          <Tetromino piece={q.piece} size={11} />
          <h3 style={{ fontFamily: 'var(--font-pixel)', fontSize: 13, color: 'var(--text-strong)', margin: 0, textTransform: 'uppercase' }}>{q.title}</h3>
        </div>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: '0 0 14px', lineHeight: 1.55, flex: 1 }}>{q.sub}</p>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {q.tags.map((t) => <Tag key={t} piece={q.piece}>{t}</Tag>)}
        </div>
      </Card>
    </div>
  )
}

// ---- Grid view ----
export function SideQuests() {
  ensureCSS()
  const [openId, setOpenId] = useState<string | null>(null)

  if (openId) {
    const quest = QUESTS.find(q => q.id === openId)!
    return <QuestDetail quest={quest} onBack={() => setOpenId(null)} />
  }

  return (
    <section style={{ maxWidth: 1080, margin: '0 auto', padding: '56px 24px 72px' }}>
      <div style={{ marginBottom: 36 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--piece-j)' }}>{'// Beyond the code'}</div>
        <h2 style={{ fontFamily: 'var(--font-pixel)', fontSize: 26, color: 'var(--text-strong)', margin: '14px 0 0', textTransform: 'uppercase' }}>Side Quests</h2>
        <p style={{ fontSize: 16, color: 'var(--text-muted)', maxWidth: 520, lineHeight: 1.6, marginTop: 16 }}>
          Life outside the terminal. Click a tile to explore.
        </p>
      </div>

      <div className="tj-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
        {QUESTS.map((q) => (
          <QuestTile key={q.id} q={q} onClick={() => setOpenId(q.id)} />
        ))}
      </div>
    </section>
  )
}
