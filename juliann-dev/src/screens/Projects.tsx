import { useState, useEffect, useRef } from 'react'
import { Icon } from '@iconify/react'
import { Card } from '../components/ds/Card'
import { Tag } from '../components/ds/Tag'
import { Button } from '../components/ds/Button'
import { Tetromino } from '../components/ds/Tetromino'
import { IconButton } from '../components/ds/IconButton'
import { ScrollTetromino3D } from '../components/ScrollTetromino3D'
import { unlock } from '../lib/achievements'

type Piece = 'i' | 'o' | 't' | 's' | 'z' | 'j' | 'l'
type Cat = 'all' | 'web' | 'ai' | 'research'

// images live in /public/assets/build-log/<ProjectName>/ — add screenshots and list them in each
// project's `images` array. An entry may be a plain URL or `{ src, caption }` to caption that slide.
type ProjectImage = string | { src: string; caption?: string }
// `wip` marks a project that's still being built: the detail page shows a coming-soon panel
// where the screenshots would go. The card in the grid is left alone deliberately.
// `writeup` is one entry per paragraph, shown under the carousel — the longer version of the
// story for projects worth more than the one-line tagline. Not every project needs one.
type Project = { id: string; title: string; piece: Piece; tagline: string; tags: string[]; cat: Exclude<Cat, 'all'>; year: string; link?: string; github?: string; devpost?: string; images?: ProjectImage[]; wip?: boolean; writeup?: string[] }

// images live in /public/assets/build-log/<folder>/
const P = (folder: string, file: string) => `/assets/build-log/${folder}/${file}`

const PROJECTS: Project[] = [
  {
    id: 'caneos',
    title: 'CANEOS',
    piece: 'i',
    tagline: 'Clip-on white cane module that detects overhead hazards for visually impaired users, pairing ToF sensors and YOLOv6 camera detection with companion iPhone and Apple Watch apps for voice narration, emergency SOS alerts, and live location sharing.',
    tags: ['Swift', 'SwiftUI', 'Python', 'C++', 'Gemini API', 'Auth0'],
    cat: 'ai',
    year: 'Jul 2026',
    github: 'https://github.com/Emily3226/CaneOS',
    devpost: 'https://devpost.com/software/caneos',
    writeup: [
      'A white cane only knows what it physically touches, missing overhead obstacles like open cabinets and hanging branches. CaneOS clips onto the cane someone already carries instead of asking them to buy another gadget. It runs at two speeds. Three time-of-flight sensors scan around fifteen times per second and trigger haptic buzzes on an Apple Watch the moment something gets close, while a camera and Gemini detect the obstacle and narrate through AirPods. There is also an SOS button that pulls your location and alerts your emergency contacts.',
      'The hardware sat on an Arduino with an OAK-1-AF camera doing detection on-device, and a Swift app tied everything together over WebSockets. We split the work by piece. Some of us were on the sensors and the camera, some on the app and the watch, and some on the flows moving between them.',
      'The time-of-flight sensors fire continuously to detect movement, causing the watch to buzz according to the direction. The first flow wakes up when something reads as urgent: the camera captures a frame, Gemini sends back a hazard type and one short spoken sentence, the app passes that to ElevenLabs, and you hear it in your headphones. The second flow covers the camera dropping out and lets you ask the app about your surroundings, answering back on the watch.',
    ],
    images: [
      { src: P('CaneOS', 'app-screens.webp'), caption: 'the companion app: home, settings, emergency SOS, and hazard history' },
      { src: P('CaneOS', 'device-test.webp'), caption: 'blindfolded test run of the clip-on cane' },
      { src: P('CaneOS', 'architecture.webp'), caption: 'system architecture: sensors to Gemini vision to speech' },
      { src: P('CaneOS', 'hackathons-10.webp'), caption: 'the team at Hack the 6ix' },
      { src: P('CaneOS', 'hackathons-9.webp'), caption: 'the ToF sensor electronics and hardware' },
      { src: P('CaneOS', 'hackathons-8.webp'), caption: 'late-night team selfie at our workstation' },
      { src: P('CaneOS', 'IMG_7749.webp'), caption: 'Hack the 6ix, where we built it' },
      { src: P('CaneOS', 'hackathons-6.webp'), caption: 'QNX hardware workshop' },
      { src: P('CaneOS', 'hackathons-5.webp'), caption: 'hackathon swag and stickers' },
    ],
  },
  {
    id: 'trulyher',
    title: 'TRULYHER',
    piece: 'o',
    tagline: 'AI-powered web app that helps women in computer science manage imposter syndrome through speech and text journaling paired with real-time mood detection.',
    tags: ['React', 'JavaScript', 'HTML', 'CSS', 'Base44', 'UI/UX'],
    cat: 'ai',
    year: 'Sep 2025',
    github: 'https://github.com/ErinGu0/TrulyHer',
    devpost: 'https://devpost.com/software/trulyher',
    writeup: [
      'When you\'re surrounded by talented people, it\'s hard not to compare yourself. For a lot of women in tech, that comparison settles into imposter syndrome, which our team has experienced firsthand. TrulyHer lets you vent by voice or text, reads the mood behind what you said, tracks how it shifts over time, and suggests strategies that follow your own patterns instead of generic advice. It also creates a mood tracking dashboard to show their ups and downs over time, offering encouragement and guidance along the way.',
      'None of us had built an app before, so most of the weekend went into learning as we went. We picked up how to lay out an interface someone would actually want to open, and how much work colour and spacing do to set the mood of a page.',
    ],
    images: [
      { src: P('TrulyHer', 'app-screens-1.webp'), caption: 'voice journaling: reflect, save, and get support' },
      { src: P('TrulyHer', 'app-screens-2.webp'), caption: 'affirmation tasks, the emotion cloud, and mood journey' },
      { src: P('TrulyHer', 'app-screens-3.webp'), caption: 'history, badges, and personal insights' },
      { src: P('TrulyHer', 'app-screens-4.webp'), caption: 'AI-generated insights: strengths, patterns, and growth areas' },
      { src: P('TrulyHer', 'hackathons-11.webp'), caption: 'our photo strip from TechNova 2025' },
      { src: P('TrulyHer', 'hackathons-12.webp'), caption: 'TechNova swag and stickers' },
    ],
  },
  {
    id: 'llm-security-research',
    title: 'LLM SECURITY RESEARCH',
    piece: 't',
    tagline: 'Co-authoring a Symposium on Usable Privacy and Security (SOUPS) research paper on how users seek security and privacy advice from large language models, evaluating the accuracy of that advice against expert guidance.',
    tags: ['Research', 'LLMs', 'Security', 'Privacy', 'SOUPS'],
    cat: 'research',
    year: '2026',
    writeup: [
      'Large language models (LLMs) have become common advisors for the security and privacy questions people once brought to forums, documentation, or a knowledgeable friend. This work examines the quality and accuracy of LLM-generated responses and evaluates them against expert judgement.',
      'Building the dataset was the bulk of the work, inputting 78 usable security and privacy prompts drawn from 54 online sources through two models. I am currently writing the results section, which centres on where ChatGPT and Claude converge and diverge when compared to a golden dataset. We are finalizing everything for submission, with findings also going to CAN-CWiC and IEEE S&P.',
    ],
    images: [
      { src: P('LLM-Security-Research', 'paper-fade.webp'), caption: 'paper preview' },
      { src: P('LLM-Security-Research', 'usenix-flat.webp'), caption: 'aiming for the USENIX SOUPS symposium' },
      { src: P('LLM-Security-Research', 'cancwic-crop.webp'), caption: 'presenting at CAN-CWiC 2026, University of Waterloo' },
    ],
  },
  {
    id: 'tetris-juliann',
    title: 'PERSONAL WEBSITE',
    piece: 's',
    tagline: 'This website: a fully playable Tetris portfolio complete with a leaderboard and achievements, wrapped around my projects, side quests, and resume. You\'re looking at it.',
    tags: ['React', 'TypeScript', 'Vite', 'CSS'],
    cat: 'web',
    year: '2026',
    github: 'https://github.com/juliannzhu/personal-website',
    writeup: [
      'A few years ago I was obsessed with Tetris, to the point where I would close my eyes and still see pieces falling. Somewhere in those hundreds of hours it started shaping how I think, like staying calm when things stacked up. So when I built this website, I knew I did not want a flat digital business card. I wanted to include Tetris in the layout, the palette, the animations, and the way everything moves.',
      'The side nav bar is a NEXT queue, the play button lives in the HOLD box, and the footer stripe is the seven piece colours in order. The hardest part was capturing the feeling that made me love Tetris in the first place. Every iteration came out slightly off, and I lost hours to small details nobody will ever consciously notice. It is still unfinished, and it is a project I keep coming back to. I am very proud of this website and its authenticity.',
    ],
    images: [
      { src: P('tetris-website', 'architecture.svg'), caption: 'system architecture: how the site is built and deployed' },
      { src: P('tetris-website', 'ideation-01.webp'), caption: 'layout explorations for the quote block' },
      { src: P('tetris-website', 'ideation-02.webp'), caption: 'quote section layout options' },
      { src: P('tetris-website', 'ideation-03.webp'), caption: 'hero and block-animation options' },
      { src: P('tetris-website', 'ideation-04.webp'), caption: 'an early build of the Side Quests section' },
      { src: P('tetris-website', 'ideation-05.webp'), caption: 'end-tile options for the Side Quests carousel' },
      { src: P('tetris-website', 'old-radar-chart.webp'), caption: 'old radar chart design' },
    ],
  },
  {
    id: 'neuralearn',
    title: 'NEURALEARN',
    piece: 'z',
    tagline: 'AI-driven study tool that generates adaptive quizzes and instant Q&A responses based on your own notes, powered by Gemini AI to make studying more efficient.',
    tags: ['Python', 'Gemini AI', 'NLP', 'HTML', 'CSS', 'API'],
    cat: 'ai',
    year: 'Sep 2024',
    github: 'https://github.com/girish316/HackTheHill',
    devpost: 'https://devpost.com/software/neuralearn',
    writeup: [
      'It started with hours of note-taking that still left us unprepared for the quiz. NeuraLearn takes your notes, generates quizzes that adapt to whatever you keep getting wrong, and answers follow-up questions on the material through Gemini.',
      'Choosing the model took a while, and Gemini was where we landed between performance and being accessible enough to build on. The quizzes took longer, and making them adaptive meant several rounds of tuning the algorithm so it focused on improving your weaknesses.',
    ],
    images: [
      { src: P('NeuraLearn', 'app-screenshot-01.webp'), caption: 'the sign-up screen' },
      { src: P('NeuraLearn', 'app-screenshot-02.webp'), caption: 'writing a note, then generating a quiz from it' },
      { src: P('NeuraLearn', 'app-screenshot-03.webp'), caption: 'the saved notes dashboard' },
      { src: P('NeuraLearn', 'hackathons-1.webp'), caption: 'opening ceremony at Hack the Hill II' },
      { src: P('NeuraLearn', 'hackathons-2.webp'), caption: 'Hack the Hill swag' },
      { src: P('NeuraLearn', 'hackathons-3.webp'), caption: 'the hardware lab at the hackathon' },
      { src: P('NeuraLearn', 'hackathons-4.webp'), caption: 'Hack the Hill photo strip' },
    ],
  },
  {
    id: 'geomap',
    title: 'GEOMAP',
    piece: 'j',
    tagline: 'Interactive digital map website built for the IB Geography curriculum, integrating OOP and case-study databases into a browser-compatible visualization tool shaped by iterative client feedback.',
    tags: ['JavaScript', 'HTML', 'CSS', 'Python', 'Window.js'],
    cat: 'web',
    year: 'Jun 2024',
    link: '/geomap/map.html',
    writeup: [
      'GeoMap was a client project for an IB Geography teacher at my high school, who wanted his students to revise case studies somewhere more engaging than a textbook. You get a world map you can click into. Each country opens a draggable window with its case study, and a legend filters the map down to whichever unit you are studying, so ticking Global Climate lights up only the countries that matter for it. Working to a real client meant the requirements moved: we added a whole unit partway through because he asked for it, and cut features that turned out to matter less than they sounded.',
      'I was primary on UI design, so the logo, the legend, and the title screen were mine. The problem that took longest was hovering. Countries made of many separate regions, like Canada and Indonesia, only changed colour under the cursor, which made the map look broken. Each region was its own SVG path, so I wrote a Python script that read the map source and merged every country down to a single path element. After that, hovering lit the whole country at once. It was the first time I wrote a program whose only job was to fix another program\'s data.',
    ],
    images: [
      { src: P('Geomap', 'geomap-01.webp'), caption: 'the Geomap landing screen' },
      { src: P('Geomap', 'geomap-02.webp'), caption: 'case studies mapped by IB Geography topic' },
      { src: P('Geomap', 'geomap-03.webp'), caption: 'a case-study page with data and sources' },
      { src: P('Geomap', 'geomap-04.webp'), caption: 'a presentation slide reflecting on the build' },
    ],
  },
  {
    id: 'charg-e-design-team',
    title: 'CHARG-E',
    piece: 'l',
    tagline: 'Research and prototype design at the University of Lethbridge. Developed an electromagnetic vibrational energy harvester prototype, exploring how vibrations from car suspension systems could be converted into usable power. Earned the Application of Theme Award from a panel of engineers and industry judges.',
    tags: ['Research', 'Prototyping', 'Green Energy', 'STEAM'],
    cat: 'research',
    year: 'Jul 2024',
    writeup: [
      'The challenge that year was working green energy into the everyday lives of Canadians, which is broad enough that deciding what to build took far longer than building it. We wanted something nobody would have to change their habits for. Cars already throw energy away constantly: every bump in the road moves the suspension, and that motion turns into heat and disappears. Charg-E is an electromagnetic vibrational energy harvester that sits in that system and converts the movement into usable power instead.',
      'We drafted the whole design ourselves and 3D printed the prototype, a block that mounts onto the shock absorbers in the suspension. Ideation was easily the longest stretch, since we kept discarding ideas for not being different enough from what already existed.',
    ],
    images: [
      { src: P('Charg-E', '209BF43A-1FE5-4546-B40B-D4043B7CA15E.webp'), caption: 'our SHAD design team' },
      { src: P('Charg-E', '3684E1A4-2A4F-4FB0-8EDF-CD23A309169D.webp'), caption: 'presenting Charg-E: Driving the Future' },
      { src: P('Charg-E', '46BE028A-E739-4648-82B2-907358B43BC2.webp'), caption: 'Team Red after the final pitch' },
      { src: P('Charg-E', '5CAF3E2E-E9EB-4463-AB94-39CE17B5715D.webp'), caption: 'award day with the cohort' },
      { src: P('Charg-E', 'IMG_9164.webp'), caption: 'prototyping the circuit on an Arduino breadboard' },
      { src: P('Charg-E', 'IMG_9595.webp'), caption: 'building the amplifier circuit in the lab' },
      { src: P('Charg-E', 'IMG_9852.webp'), caption: 'the team at the SHAD program' },
      { src: P('Charg-E', 'IMG_9850.webp'), caption: 'trade offer mode' },
    ],
  },
  {
    id: 'project-tech-careers',
    title: 'PROJECT TECH CAREERS',
    piece: 'i',
    tagline: 'Four-stage mentorship platform supporting women at different stages of their computer science education, connecting them with mentors and resources along the way. Won the Gender Equality Track Award.',
    tags: ['JavaScript', 'HTML', 'CSS', 'UI/UX'],
    cat: 'web',
    year: 'May 2024',
    writeup: [
      'The number we kept coming back to was that women went from 37% of computer science majors in 1984 to 17% in 2023. That drop-off does not happen at one moment, it happens at every stage, so we built the site in four of them: beginner coding classes for middle schoolers, a calendar of women-in-STEM events and hackathons for high schoolers, a networking guide, and interview prep and job matching for people finishing a degree.',
      'None of us had built much of anything before this. What stayed with me is that we were making the thing we had wanted ourselves a few years earlier, back when we did not know what a hackathon was or that most of these paths existed. Being brand new at it and still ending up with something we would genuinely have used felt like the whole point.',
    ],
    images: [
      { src: P('PTC', 'ptc-1.webp'), caption: 'winning the Gender Equality track as Team Jinlira' },
      { src: P('PTC', 'ptc-7.webp'), caption: 'the problem: women majoring in CS fell from 37% in 1984 to 17% in 2023' },
      { src: P('PTC', 'ptc-8.webp'), caption: 'our solution: a four-stage site of resources, jobs, events, and mentors' },
      { src: P('PTC', 'ptc-5.webp'), caption: 'beginner coding class picks for middle schoolers' },
      { src: P('PTC', 'ptc-6.webp'), caption: 'the networking guide: what it is, why it matters, and how to start' },
      { src: P('PTC', 'ptc-4.webp'), caption: 'the high school events calendar, full of women-in-STEM hackathons and classes' },
      { src: P('PTC', 'ptc-2.webp'), caption: 'the post-graduate interview prep page, with curated video guides' },
      { src: P('PTC', 'ptc-3.webp'), caption: 'the job-matching form: filter by education, field, location, and salary' },
    ],
  },
  {
    id: 'grafana-dashboards',
    title: 'GRAFANA DASHBOARDS',
    piece: 't',
    tagline: 'Satellite system monitoring dashboards built with Grafana and MySQL data sources, reduced dashboard load time by 86% through SQL query optimization.',
    tags: ['MySQL', 'SQLAlchemy', 'FastAPI', 'APScheduler', 'MariaDB'],
    cat: 'ai',
    year: '2026',
    wip: true,
  },
]

// Used by App to title the tab on a /projects/<id> deep link.
export const projectTitle = (id: string) => PROJECTS.find((p) => p.id === id)?.title

const FILTERS: { id: Cat; label: string; piece: Piece }[] = [
  { id: 'all',      label: 'All',      piece: 's' },
  { id: 'web',      label: 'Web',      piece: 'i' },
  { id: 'ai',       label: 'AI',       piece: 't' },
  { id: 'research', label: 'Research', piece: 'j' },
]

// ---- CSS ----
const CSS = `
@keyframes tj-project-slide-in {
  from { transform: translateX(-24px); opacity: 0; }
  to   { transform: translateX(0);     opacity: 1; }
}
.tj-project-detail { animation: tj-project-slide-in 240ms var(--ease-snap) both; }
`

let cssInjected = false
function ensureCSS() {
  if (!cssInjected && typeof document !== 'undefined') {
    const s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s); cssInjected = true
  }
}

function ProjectCard({ p, onOpen }: { p: Project; onOpen: (id: string) => void }) {
  return (
    <Card accent={p.piece} interactive accentBar onClick={() => onOpen(p.id)} style={{ display: 'flex', flexDirection: 'column', height: '100%', cursor: 'pointer' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Tetromino piece={p.piece} size={14} />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-faint)' }}>{p.year}</span>
      </div>
      <h3 style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.8125rem', color: 'var(--text-strong)', margin: '20px 0 0', textTransform: 'uppercase', lineHeight: 1.4 }}>{p.title}</h3>
      <p style={{
        fontSize: '0.875rem', color: 'var(--text-muted)', margin: '12px 0 0', lineHeight: 1.55, flex: 1,
        display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
      }}>{p.tagline}</p>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 18 }}>
        {p.tags.map((t) => <Tag key={t} piece={p.piece}>{t}</Tag>)}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 14, fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: `var(--piece-${p.piece})`, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        View details <Icon icon="pixelarticons:arrow-right" style={{ fontSize: '0.8125rem' }} />
      </div>
    </Card>
  )
}

function BackButton({ c, onBack }: { c: string; onBack: () => void }) {
  return (
    <button onClick={onBack}
      onMouseEnter={(e) => { e.currentTarget.style.color = c }}
      onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)' }}
      style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', padding: 0, marginBottom: 32, transition: 'color 140ms' }}>
      <Icon icon="pixelarticons:arrow-left" style={{ fontSize: '0.875rem' }} />
      Back to Build Log
    </button>
  )
}

function MediaSlot({ src, index }: { src?: string; index: number }) {
  return (
    <div style={{
      aspectRatio: index === 0 ? '16/9' : '4/3',
      gridColumn: index === 0 ? 'span 2' : undefined,
      borderRadius: 'var(--radius-1)', overflow: 'hidden',
      background: src ? 'transparent' : 'var(--bg-well)',
      border: src ? 'none' : '2px dashed var(--border-hairline)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10,
    }}>
      {src ? (
        <img src={src} alt="Project screenshot" loading="lazy" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <>
          <span style={{ fontSize: '1.75rem', opacity: 0.35 }}>+</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            {index === 0 ? 'Add featured screenshot' : 'Add screenshot'}
          </span>
        </>
      )}
    </div>
  )
}

// The longer story, under the carousel. Runs the full column width so it lines up with the
// tagline above the gallery rather than sitting in a narrower block of its own.
function Writeup({ paragraphs, c }: { paragraphs: string[]; c: string }) {
  return (
    <div style={{ marginTop: 44 }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: c, marginBottom: 16 }}>// Notes</div>
      {paragraphs.map((text, i) => (
        // Same size, colour and leading as the tagline above the gallery, so the two read as
        // one voice rather than as body copy in two different registers.
        <p key={i} style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.7, margin: i === 0 ? 0 : '18px 0 0' }}>{text}</p>
      ))}
    </div>
  )
}

// Stands in for the media carousel on a project that's still in progress. Borrows the
// accent-bar treatment from the "Coming soon" list on the Now page so the two read as the
// same idea in two places.
function ComingSoon({ piece }: { piece: Piece }) {
  const c = `var(--piece-${piece})`
  return (
    <div style={{
      display: 'flex', gap: 16, alignItems: 'flex-start',
      padding: '28px 24px',
      background: `color-mix(in srgb, ${c} 7%, var(--bg-well))`,
      border: '2px solid var(--border-hairline)',
      borderLeft: `4px solid ${c}`,
      borderRadius: 'var(--radius-1)',
    }}>
      <div style={{ paddingTop: 3, flexShrink: 0 }}><Tetromino piece={piece} size={12} /></div>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.75rem', color: c, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Coming soon</span>
          <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.4375rem', background: c, color: 'var(--ink-900)', padding: '3px 5px', letterSpacing: '0.04em' }}>WIP</span>
        </div>
        <p style={{ margin: 0, fontSize: '0.9375rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
          Still building this one. Screenshots and a proper writeup are on the way.
        </p>
      </div>
    </div>
  )
}

// Same slide duration/easing and arrow/dot styling as the Side Quests carousel.
const CAROUSEL_TRANSITION_MS = 600
const CAROUSEL_EASING = 'cubic-bezier(0.65, 0, 0.35, 1)'

function ProjectCarousel({ images, c }: { images: { src: string; caption?: string }[]; c: string }) {
  const [index, setIndex] = useState(0)
  const goPrev = () => setIndex((i) => Math.max(0, i - 1))
  const goNext = () => setIndex((i) => Math.min(images.length - 1, i + 1))

  return (
    <div>
      <div style={{ position: 'relative', width: '100%', height: 'clamp(420px, 60vh, 720px)', overflow: 'hidden', borderRadius: 'var(--radius-1)', background: 'var(--bg-well)' }}>
        <div style={{
          display: 'flex', width: '100%', height: '100%',
          transform: `translateX(-${index * 100}%)`,
          transition: `transform ${CAROUSEL_TRANSITION_MS}ms ${CAROUSEL_EASING}`,
        }}>
          {images.map((im, i) => (
            // Only the first slide is worth blocking on; the rest sit off-screen in the
            // translated track and fetch as the visitor pages through.
            <img key={i} src={im.src} alt={im.caption ?? ''} loading={i === 0 ? 'eager' : 'lazy'} decoding="async" style={{ width: '100%', height: '100%', flexShrink: 0, objectFit: 'contain' }} />
          ))}
        </div>

        {index > 0 && (
          <IconButton size="md" variant="ghost" label="Previous photo" onClick={goPrev}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--text-strong)'; e.currentTarget.style.background = 'rgba(5,5,9,0.85)' }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.background = 'rgba(5,5,9,0.6)' }}
            style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', zIndex: 1, background: 'rgba(5,5,9,0.6)', border: '2px solid var(--border-strong)', color: 'var(--text-strong)', backdropFilter: 'blur(4px)' }}>
            <Icon icon="pixelarticons:chevron-left" />
          </IconButton>
        )}
        {index < images.length - 1 && (
          <IconButton size="md" variant="ghost" label="Next photo" onClick={goNext}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--text-strong)'; e.currentTarget.style.background = 'rgba(5,5,9,0.85)' }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.background = 'rgba(5,5,9,0.6)' }}
            style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', zIndex: 1, background: 'rgba(5,5,9,0.6)', border: '2px solid var(--border-strong)', color: 'var(--text-strong)', backdropFilter: 'blur(4px)' }}>
            <Icon icon="pixelarticons:chevron-right" />
          </IconButton>
        )}
      </div>

      {/* Caption row below the image: centered, mono, muted. */}
      {images[index]?.caption && (
        <div style={{ marginTop: 10, fontFamily: 'var(--font-mono)', fontSize: '0.875rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.5 }}>
          {images[index].caption}
        </div>
      )}

      {images.length > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 14 }}>
          {images.map((_, i) => (
            <button key={i} onClick={() => setIndex(i)} aria-label={`Go to photo ${i + 1}`}
              style={{
                width: i === index ? 20 : 7, height: 7, borderRadius: 4, padding: 0, border: 'none', cursor: 'pointer',
                background: i === index ? c : 'var(--border-strong)',
                transition: 'width 200ms, background 200ms',
              }} />
          ))}
        </div>
      )}
    </div>
  )
}

function ProjectDetail({ p, onBack }: { p: Project; onBack: () => void }) {
  const c = `var(--piece-${p.piece})`
  // Normalize plain-URL and { src, caption } entries into one shape for the carousel.
  const images = (p.images ?? []).map((im) => (typeof im === 'string' ? { src: im } : im))
  const topRef = useRef<HTMLDivElement>(null)
  // Opening a project from partway down the grid would otherwise land on its detail
  // page still scrolled to that position — snap the scroll stack back to the top of it.
  useEffect(() => { topRef.current?.scrollIntoView({ block: 'start' }) }, [])
  return (
    <section ref={topRef} className="tj-project-detail" style={{ maxWidth: 1080, margin: '0 auto', padding: '48px 24px 72px' }}>
      <BackButton c={c} onBack={onBack} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 28 }}>
        <Tetromino piece={p.piece} size={18} />
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: c, marginBottom: 6 }}>{`// ${p.year}`}</div>
          <h2 style={{ fontFamily: 'var(--font-pixel)', fontSize: '1.375rem', color: 'var(--text-strong)', margin: 0, textTransform: 'uppercase' }}>{p.title}</h2>
        </div>
      </div>

      <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 24 }}>{p.tagline}</p>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 32 }}>
        {p.tags.map((t) => <Tag key={t} piece={p.piece}>{t}</Tag>)}
      </div>

      {p.wip ? (
        <ComingSoon piece={p.piece} />
      ) : images.length > 0 ? (
        <ProjectCarousel images={images} c={c} />
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <MediaSlot key={i} src={images[i]?.src} index={i} />
            ))}
          </div>

          <div style={{ marginTop: 24, padding: '16px 20px', background: 'var(--bg-well)', border: '2px solid var(--border-hairline)', borderRadius: 'var(--radius-1)' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-faint)' }}>
              {'// Add screenshots to public/assets/build log/<ProjectName>/ and list them in the images array in Projects.tsx'}
            </span>
          </div>
        </>
      )}

      {p.writeup && <Writeup paragraphs={p.writeup} c={c} />}

      {(p.link || p.github || p.devpost) && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 40 }}>
          {p.github && (
            <a href={p.github} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
              <Button variant="secondary" leftIcon={<Icon icon="pixelarticons:github" />}>GitHub</Button>
            </a>
          )}
          {p.devpost && (
            <a href={p.devpost} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
              <Button variant="secondary" leftIcon={<Icon icon="pixelarticons:external-link" />}>Devpost</Button>
            </a>
          )}
          {p.link && p.link !== '#' && (
            <a href={p.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
              <Button variant="secondary" leftIcon={<Icon icon="pixelarticons:external-link" />}>Live</Button>
            </a>
          )}
        </div>
      )}

      <div style={{ marginTop: 40 }}>
        <BackButton c={c} onBack={onBack} />
      </div>
    </section>
  )
}

// Which project is open comes from the URL (/projects/<id>), so App owns it and passes it
// down — that's what makes a detail page linkable and the browser's back button work.
export function Projects({ openId, onOpen, onBack }: { openId: string | null; onOpen: (id: string) => void; onBack: () => void }) {
  ensureCSS()
  const [filter, setFilter] = useState<Cat>('all')
  const shown = PROJECTS.filter((p) => filter === 'all' || p.cat === filter)

  // An id from the URL is untrusted — a stale or mistyped link falls through to the grid
  // instead of blowing up on a missing project.
  const open = openId ? PROJECTS.find((p) => p.id === openId) : undefined
  if (open) return <ProjectDetail p={open} onBack={onBack} />

  return (
    <section style={{ maxWidth: 1080, margin: '0 auto', padding: '56px 24px 72px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, marginBottom: 28 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--piece-i)' }}>// Completed lines</div>
          <h2 style={{ fontFamily: 'var(--font-pixel)', fontSize: '1.625rem', color: 'var(--text-strong)', margin: '14px 0 0', textTransform: 'uppercase' }}>Build Log</h2>
        </div>
        <ScrollTetromino3D
          className="tj-float-projects-s"
          piece="s"
          size={60}
          baseRotateY={180}
          tiltDeg={18}
          rotZPerPx={0.14}
          rotXPerPx={0.08}
          rotYPerPx={0.18}
          mouseFollow
          style={{ opacity: 0.72, marginRight: 110 }}
        />
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
        {FILTERS.map((f) => (
          <Tag key={f.id} piece={f.piece} interactive active={filter === f.id} onClick={() => setFilter(f.id)}>{f.label}</Tag>
        ))}
      </div>
      <div className="tj-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
        {shown.map((p) => <ProjectCard key={p.id} p={p} onOpen={(id) => { unlock('inspector'); onOpen(id) }} />)}
      </div>
    </section>
  )
}
