# Handoff: TETRIS.JULIANN — Personal Website (Full Front-End)

> **For the developer / Claude Code:** this Markdown file is the implementation spec. The rest of this project is the **design system + website prototype** it documents. Everything you need is in this one project — see the path map below.

## Overview
A retro-arcade, Tetris-themed personal website for **Juliann**, a computer-science major. It showcases her work, about, "now", and contact, with the whole identity built on the seven tetromino piece colors, a dark CRT playfield, pixel display type, beveled blocks, and lots of block-stacking motion. It includes a fully playable **20-line Tetris Sprint** mini-game with a time leaderboard.

## About these files
The files here are **design references created in HTML / React-via-Babel** — prototypes that show the intended look and behavior. They are **not** meant to ship as-is. Recreate these designs in the target codebase's environment (a real **React + Vite/Next** app maps most directly — the prototype is already React) using its established patterns, build tooling, and component conventions. If no environment exists yet, a React + Vite SPA is the recommended target.

Specifically:
- The prototype loads React 18 + Babel from CDN and uses inline `<script type="text/babel">` plus a `window.*` global-attach pattern. In production, use a real bundler, real `.jsx`/`.tsx` modules, and ESM imports.
- The design-system components are standalone React functions styled with **CSS custom properties** (no CSS-in-JS lib), so they port directly: copy `styles.css` + `tokens/` and the component files, and replace the runtime-bundle glue with normal imports.

## Fidelity
**High-fidelity (hifi).** Final colors, typography, spacing, motion, and interactions — recreate pixel-perfectly. All exact values live in `tokens/` and are summarized below.

---

## Path map (this project)

```
styles.css                 # entry point — @imports all token files
readme.md                  # FULL brand/voice/visual design guide — READ THIS
SKILL.md
HANDOFF.md                 # ← this file
tokens/
  colors.css               # piece palette, neutrals, semantic + text
  typography.css           # font families + type scale (Google Fonts @import)
  spacing.css              # 8px-cell spacing, radii, borders, layout
  effects.css              # bevels, glows, shadows, scanlines, keyframes
  base.css                 # light resets + helper classes
components/
  core/                    # Button, IconButton, Badge, Tag, Card, ProgressBar, Avatar, Switch, Tetromino
  forms/                   # Input, Textarea
  navigation/              # Tabs
    (each: <Name>.jsx + <Name>.d.ts types + <Name>.prompt.md usage)
assets/                    # SVG logo mark, favicon, 7 piece sprites, social cover
guidelines/                # foundation specimen cards (visual reference)
_ds_bundle.js              # compiled bundle used by the prototype (rebuild from .jsx in prod)
ui_kits/website/           # THE SITE (the actual product UI kit)
  index.html               # app shell: routing, loader, page transitions, game mount
  Nav.jsx                  # TopNav (NEXT-queue sidebar) + Footer + FallingField background
  Hero.jsx                 # landing
  About.jsx                # bio + skill meters + timeline
  Projects.jsx             # filterable project grid
  Now.jsx                  # current-status board
  Contact.jsx              # contact form + links
  Tetris.jsx               # HOLD box + playable 20-line Sprint game + leaderboard
  Loader.jsx               # block-stacking loading screen (initial load only)
  hero-variations.html     # 3 explored hero directions (reference)
  README.md
```

> **Read `readme.md` (the design guide) first** — it covers voice/tone, the full color/type/motion system, iconography, and content fundamentals in depth. This file focuses on structure, screens, and behavior.

---

## Design Tokens (exact values)

### Colors — the 7 tetromino pieces (the brand)
| Token | Hex | Piece |
|---|---|---|
| `--piece-i` | `#00f0f0` | I — cyan (primary accent) |
| `--piece-o` | `#f5d800` | O — yellow |
| `--piece-t` | `#b14cff` | T — purple |
| `--piece-s` | `#3cf000` | S — green (success) |
| `--piece-z` | `#ff3b3b` | Z — red (danger) |
| `--piece-j` | `#3d6bff` | J — blue (info; brightened from canonical #0000f0) |
| `--piece-l` | `#ff9f1c` | L — orange (warning) |

Each piece also has a `-lit` (top-bevel highlight) and `-dim` (bottom-bevel shadow) variant — see `tokens/colors.css`. The 3D block face = `box-shadow: inset 2px 2px 0 <lit>, inset -2px -2px 0 <dim>` (token `--bevel-block`).

### Neutrals (dark arcade-screen ramp)
`--ink-1000 #050509` (the well) · `--ink-900 #0a0a12` (page bg) · `--ink-800 #11111d` · `--ink-700 #18182a` (card) · `--ink-600 #202034` · `--ink-500 #2b2b45` (hairline) · `--ink-400 #3b3b5c` (border) · `--ink-300 #565678` (disabled).

### Text
`--text-strong #ffffff` · `--text-body #c9c9dc` · `--text-muted #8a8aa6` · `--text-faint #5c5c78` · `--text-on-piece #0a0a12` (dark text on bright pieces).

### Typography
- **Display / pixel:** `Press Start 2P` (`--font-pixel`) — ALWAYS uppercase, used sparingly & big. Sizes: 48/32/22/14/10px.
- **Body:** `Inter` (`--font-body`) — all running text. Scale: 40/30/22/18/16(base)/14/12px.
- **Mono:** `JetBrains Mono` (`--font-mono`) — eyebrows, code, HUD, scores, timestamps. 14/12/11px.
- All three load from Google Fonts (`@import` in `typography.css`, plus a `<link>` in `index.html`). **Substitution note:** these are real Google Fonts; no binaries are vendored. Self-host the `.woff2` for production/offline.

### Spacing — the 8px "cell"
Everything snaps to an 8px block (`--cell`). Scale: 4/8/12/16/24/32/48/64/96/128px (`--space-1`…`--space-10`).

### Radii & borders — sharp by default
`--radius-0: 0` (default — blocks have crisp corners), `--radius-1: 2px`, `--radius-2: 4px` (inputs/chips), `--radius-pill: 999px` (avatars/dots). Default border `2px` (`--border`), strong border color `--ink-400`.

### Shadows & effects
- `--shadow-block: 0 4px 0 rgba(0,0,0,.45)` (hard offset, no blur — "stacked on the board").
- `--shadow-soft: 0 8px 24px rgba(0,0,0,.5)` (lifted card).
- `--glow-cyan/-purple/-yellow/-red` neon bleeds.
- `--grid-bg` = the faint 32px playfield mesh (page background).
- `--scanlines` = CRT scanline overlay (applied fixed over the whole site in `index.html`).
- Easing: `--ease-snap: cubic-bezier(0.2,0.9,0.3,1.2)` (overshoot = piece "lock"), `--ease-out`. Durations 90/160/320ms.
- Keyframes shipped: `ds-drop`, `ds-line-clear`, `ds-blink`, `ds-shimmer`, `ds-bob`.

---

## Components (design system)

All are PascalCase React function components styled purely via the CSS custom properties above. Each folder has `<Name>.jsx` (impl), `<Name>.d.ts` (props/types), and `<Name>.prompt.md` (usage + examples). **Use the `.d.ts` as the props contract.**

| Component | Purpose | Key props |
|---|---|---|
| `Button` | Primary action; beveled block that locks down on press | `variant` (primary/secondary/ghost/danger/success/warning/magic), `size` (sm/md/lg), `block`, `leftIcon`, `rightIcon` |
| `IconButton` | Square block button with one icon | `size`, `variant` (default/accent/ghost), `label` (a11y) |
| `Badge` | Uppercase mono status pill | `piece` (i…l), `variant` (solid/outline/soft), `dot` |
| `Tag` | Keyword/skill chip with colored block marker | `piece`, `interactive`, `active` |
| `Card` | Beveled surface panel, hard drop shadow | `accent` (i…l), `interactive` (hover lift+border), `accentBar`, `pad` |
| `ProgressBar` | Segmented "stacked block" meter | `value` 0–100, `cells`, `piece`, `label`, `cellHeight` |
| `Avatar` | Square/round block avatar (image or pixel initials) | `src`, `initials`, `size` (sm/md/lg/xl/number), `piece`, `round` |
| `Switch` | Toggle as a sliding block (green when on) | `checked`, `onChange(checked,e)`, `label`, `disabled` |
| `Tetromino` | Decorative beveled piece from divs | `piece`, `size`, `bob` |
| `Input` | Text field w/ label, hint, error | `label`, `hint`, `error`, + native input props |
| `Textarea` | Multi-line field matching Input | `label`, `hint` |
| `Tabs` | Pixel-label tab strip (active fills w/ piece color) | `items[{value,label}]`, `value`, `onChange`, `piece` |

---

## Screens / Views (`ui_kits/website/`)

Single-page app. `index.html` holds the App shell: routing state (`screen`), the initial loader, fixed background, the two side rails, page-transition animation, and the game overlay. Below-the-fold pages scroll; **home is locked to one non-scrolling viewport**.

### Global chrome (`Nav.jsx`)
- **TopNav header** (sticky, 64px, translucent + blur, 2px bottom border): logo lockup on the left — a `Tetromino piece="t"` + pixel wordmark "JULIANN".
- **NEXT queue sidebar** (the nav): a **fixed vertical rail on the RIGHT**, vertically centered, 264px wide, bordered panel with a pixel "NEXT" header. Each nav item is a **slot**: a mini-tetromino in its piece color beside a pixel label. The **current page** is the lit "active" piece (colored border + glow + tinted bg); the rest are dim/desaturated. Items & colors: Home (i/cyan), About (o/yellow), Work (s/green), Now (l/orange), Contact (z/red).
  - **Important interaction detail:** the active-state border/background/glow must apply **instantly** — do NOT CSS-transition the `var()`-based color properties (transitioning a `var()`-resolved color through the `border` shorthand freezes the computed value one step behind). Set `borderColor`/`backgroundColor`/`boxShadow` as longhands with no transition on them.
- **Footer**: a 7-color tetromino stripe (8px) above a row with "© 2026 JULIANN · BUILT ONE BLOCK AT A TIME" and three ghost IconButtons (GitHub, Email, LinkedIn).
- **FallingField**: a `position:fixed` decorative layer (inset 80px from top & bottom) of slow, low-opacity tetromino SVGs drifting downward behind all content. `z-index:0`; page content is `z-index:1`.

### HOLD box (`Tetris.jsx` → `HoldBox`) — home only
A **fixed panel on the LEFT** mirroring the NEXT rail (224px, vertically centered). Pixel "HOLD" header, then a glowing purple (T) slot button: a bobbing `Tetromino` + pixel "PLAY", and a mono caption. **Only rendered on the home screen** — it disappears on every other page. Clicking opens the game overlay.

### 1. Landing / Hero (`Hero.jsx`)
- Vertically + horizontally centered in the viewport (home fills exactly one screen, no scroll).
- A `Badge piece="s" dot` "Now playing · CS @ University".
- The name **JULIANN** in `Press Start 2P`, **each letter a different piece color** in sequence (i,o,t,s,z,j,l), with `0 4px 0 rgba(0,0,0,.4)` block shadow; letters nudge up on hover.
- A one-paragraph intro (Inter, 18px, `--text-body`, max 560px).
- A centered **▶ PRESS START** button — a blinking pixel CTA (`tj-pressstart`) that navigates to Work.

### 2. About (`About.jsx`)
- Eyebrow `// Player 1` (mono, cyan) + pixel "ABOUT".
- Two columns: left = `Avatar` + name + two intro paragraphs + interest `Tag`s + a "Timeline" list (each a small `Tetromino` + mono date + role + detail). Right = a `Card accent="i" accentBar` "Skill Meter" with six `ProgressBar`s (Python/o, C-C++/z, JS-React/i, Algorithms/t, Rust/l, Systems/s).

### 3. Projects / Work (`Projects.jsx`)
- Eyebrow `// High scores` + pixel "SELECTED WORK".
- A row of filter `Tag`s (All/Web/Games/Systems/Apps) — clicking filters the grid.
- 3-column grid of project `Card`s (`accent` per project, `interactive`, `accentBar`): each has a `Tetromino`, year, pixel title, description, tech `Tag`s. A "More on GitHub" `Button` below.

### 4. Now (`Now.jsx`)
- Eyebrow `// Current state` + pixel "NOW" + a `Badge piece="s" dot` "live".
- 2-column grid of `Card`s (Building/i, Learning/o, Reading/s, Playing/t) each with a `Tetromino` + label + text.
- A `Card accent="o" accentBar` "This week's stats" with three `ProgressBar`s (Commits/i, Sleep/t, Coffee/o).

### 5. Contact (`Contact.jsx`)
- Eyebrow `// Insert coin` + pixel "LET'S CONNECT".
- Left: a `Card accent="i" accentBar` with the message form (`Input` name/email, `Textarea` message, `Button variant="success"` "Send Message"). On submit it shows a **"LINE CLEARED!"** success state (green `Tetromino` + message + "Send Another").
- Right: a "Find me" list of link rows (GitHub/i, Email/o, LinkedIn/s, Resume/t) — each row nudges sideways and lights its border in the piece color on hover.

---

## The Tetris Mini-Game (`Tetris.jsx` → `TetrisGame`) — **20-Line Sprint**

A fully playable, self-contained Tetris opened from the HOLD box. Modal overlay (`z-index:9500`, dark blur backdrop; click backdrop or Esc to close).

**Goal:** clear 20 lines as fast as possible. Layout (left→right):
- **HOLD box** (top-left): holds one piece; click it or press **Shift**. Dims while hold is unavailable (one hold per piece until it locks). Lit purple border when holding.
- **Board**: 10×20 well, 20px cells, beveled locked blocks, a faint **ghost piece** outline at the landing position, grid mesh background.
  - **START overlay** (status `ready`): centered "20-LINE SPRINT" title **in yellow** (`--piece-o`), a one-line description, and a **yellow START button** (the `Button` with `--b/--b-lit/--b-dim` overridden to the O-piece yellow + dark text).
  - **FINISH overlay** (status `won`): "FINISH!" + final time big in yellow + "Play Again".
  - **TOP OUT overlay** (status `topout`): "TOP OUT" + "Retry".
- **Beneath the board**: two stat panels — **LINES LEFT** (counts 20 → 0; green at 0) and **TIME** (`m:ss.cc`, updates ~every 50ms while playing).
- **Right rail**: a **NEXT** panel previewing the **next 5 pieces** (first slightly larger), then a controls legend.
- **Leaderboard** (far right): "FASTEST SPRINTS", **sorted ascending by time** (fastest at rank 01). Player runs are saved to `localStorage` (key `tj-tetris-sprint`) as `{name:'YOU', ms}` and highlighted.

**Controls:** ← → move · ↑ rotate (simple wall-kick offsets −1/+1/−2/+2) · ↓ soft drop · Space hard drop · **Shift hold** · Esc quit · Enter/Space to start or restart.

**Engine notes for reimplementation:**
- 7 pieces defined as cell lists in a bounding box; rotation via `(x,y) → (size-1-y, x)`.
- 7-bag randomizer (`shuffled()` concatenated, refilled to keep ≥8 queued so the 5-preview always has pieces).
- Gravity = constant `setInterval` at 800ms (sprint = fixed speed, no level ramp).
- Status state machine: `ready → playing → won | topout`. Timer = `Date.now() - startTime`, frozen at `finishMs` on win.
- Line clear: filter full rows, unshift empties; `lines += cleared`; win when `lines >= 20`.

---

## Interactions & Behavior

### Initial load — block-stacking Loader (`Loader.jsx`)
On **first load only**: real interlocking tetromino pieces drop and **stack from the bottom up** in a well (a deterministic gravity simulation), filling as a ~3.5s progress bar with a live %, then at 100% the rows **flash white and clear bottom-up**, fading (~320ms) to reveal the page. Timer-driven (not rAF) so it always completes even backgrounded. Total ≈ 4s.

### Page transitions — per-element fall/drop
Navigating between pages animates **individual content blocks**, not the whole page:
- The current page's blocks **fall straight down** one-by-one (staggered, **bottom-most first**), then the new page's blocks **drop in from above** in the same bottom-first order, each landing with a small squash-and-settle.
- Multi-item grid/flex rows are expanded so each card/chip falls as its own block.
- Tunables: `STEP` 60ms between blocks (capped so total stagger ≤ ~680ms), `OUT_MS` 220, `IN_MS` 340. Bottom-first ordering = `delay = (count-1-i) * step`.
- **Critical correctness note:** the drop-in is applied imperatively then the inline `animation` is **cleared** after it finishes (via a timeout), so blocks rest at their natural `opacity:1`. Do **not** rely on `animation-fill-mode: both` to hold the visible end state — if the effect re-runs, blocks freeze at the hidden 0% frame and the page goes blank. Gate the drop-in to **once per navigation** (a counter / transition id, not `[screen]` deps that can re-fire). In a real framework, prefer a transition library (Framer Motion / Vue `<transition-group>` with staggered children).

### Other
- **Hover:** buttons brighten; cards lift 4px + accent border; nav slots & link rows light up in a piece color.
- **Press:** buttons translate down 4px and drop their shadow (the block "locks").
- **Focus:** 3px outline (white or accent), offset.
- **CRT overlay + vignette:** fixed full-screen scanline layer (`mix-blend-mode:multiply`) and a radial vignette sit above content site-wide.

## State Management
- `screen` (`home|about|projects|now|contact`), `loading` (initial only), `gameOpen`, `transId` (per-nav transition counter).
- Game state is a single mutable ref object (board, queue, cur, hold, canHold, lines, status, startTime, finishMs) with a force-render tick — reimplement as proper state/reducer in production.
- Leaderboard persists to `localStorage`. No backend / data-fetching anywhere; all content is hardcoded placeholder copy in Juliann's voice — **swap in real projects, links, and copy.**

## Assets
All in `assets/` (SVG, generated — safe to use or replace):
- `mark.svg` — block-built "J" emblem (logo).
- `favicon.svg` — single T-piece.
- `pieces/{i,o,t,s,z,j,l}.svg` — the 7 beveled tetromino sprites (falling background & decoration).
- `social-cover.svg` — 1200×630 share image.
- **Icons:** [Pixelarticons](https://pixelarticons.com/) via the Iconify CDN web component (`<iconify-icon icon="pixelarticons:…">`). In production, install an icon package (e.g. `@iconify/react` with the `pixelarticons` set) instead of the CDN script. **No emoji** — the tetromino block is the brand's expressive glyph.

## Running the prototype as-is
Serve the project root over http and open `ui_kits/website/index.html`. It references `../../styles.css`, `../../_ds_bundle.js`, and `../../assets/` relative to that folder, so it must be served from the project root (not opened as a bare file). When porting into your app, replace those relative references and the CDN React/Babel with your bundler's imports.
