# TETRIS.JULIANN — Design System

The personal-brand design system for **Juliann**, a computer science major. The whole identity is a love letter to **Tetris**: a dark arcade screen, the seven signature tetromino colors, beveled blocks that lock into place, and pixel type over clean body text. It's loud, playful, and unapologetically fun — built to highlight Juliann's projects, writing, and achievements while feeling like a game you want to keep playing.

> **Sources:** This system was designed from scratch (no external codebase or Figma). The brief: a Tetris-themed personal website for a CS major — full retro arcade, dark mode, pixel display font + clean body, classic 7-piece colors, lots of motion, fun tone.

---

## Content Fundamentals — how Juliann writes

**Voice:** First person, warm, playful, confident-but-not-arrogant. Juliann talks like a person who genuinely loves what she does and isn't afraid to be a little goofy about it.

**Tone:** Fun first. Game and Tetris metaphors are the throughline — "clear my lines," "high score," "rotate the problem until it fits," "one block at a time," "insert coin," "press start." Use them naturally, not forced into every sentence.

**Person:** "I" for Juliann, "you" for the visitor. Direct and conversational ("Hi! I'm Juliann…", "What are we building?").

**Casing:**
- **Pixel display + labels:** ALL CAPS (it's a bitmap font; lowercase reads poorly). Headings, nav, buttons, eyebrows.
- **Body copy:** Sentence case, normal punctuation.
- **Mono eyebrows / HUD:** UPPERCASE with wide letter-spacing, often prefixed `//` like a code comment (`// HIGH SCORES`, `// CURRENT STATE`).

**Emoji:** No emoji. The "emoji" of this brand is the **tetromino** — use a colored block or piece glyph where you'd be tempted to reach for an emoji.

**Examples (the house voice):**
- Hero: *"Computer science major, puzzle-solver, and serial block-stacker. I build clean, playful software — and I clear my lines."*
- About: *"I treat every problem like a falling tetromino: rotate it, find where it fits, clear the line."*
- Contact success: *"LINE CLEARED! Thanks — I'll get back to you soon."*
- Footer: *"BUILT ONE BLOCK AT A TIME"*

**Numbers & stats** are framed as arcade HUD readouts — LINES, LEVEL, SCORE, high scores. Keep them playful (Level: "Senior", Lines/Day: "∞"); don't manufacture fake-precise metrics.

---

## Visual Foundations

**Overall vibe:** A CRT arcade cabinet at night. Near-black playfield, faint grid mesh, scanline overlay, neon piece colors that glow.

**Color:**
- The brand is the **7 tetromino colors**: I-cyan `#00f0f0`, O-yellow `#f5d800`, T-purple `#b14cff`, S-green `#3cf000`, Z-red `#ff3b3b`, J-blue `#3d6bff` (brightened from the canonical `#0000f0` for dark-mode legibility), L-orange `#ff9f1c`. Each has a `-lit` (top bevel) and `-dim` (bottom bevel) shade.
- **Cyan is the primary accent** (links, primary buttons, focus rings). Other pieces are used semantically: green = success, red = danger, orange = warning, blue = info, purple = "magic"/special, yellow = highlight.
- **Neutrals** are a near-black ramp with a faint blue cast: `--ink-1000` (the well) → `--ink-900` (page) → `--ink-700` (cards) → `--ink-400` (borders).
- Use **one or two piece colors per surface** as accents — don't rainbow everything except in deliberate full-spectrum moments (the hero name, the footer stripe, the palette).

**Type:**
- **Press Start 2P** (bitmap/pixel) for display, headings, nav, buttons — always uppercase, generous line-height (1.5), used sparingly and big.
- **Inter** for all running text — the legibility workhorse against the dark.
- **JetBrains Mono** for eyebrows, labels, code, timestamps, HUD readouts.

**Spacing & layout:** Everything snaps to an **8px cell** (one block). Content max-width ~1080px. Sticky top nav (64px) with blur. Generous vertical rhythm between sections (~56px).

**Backgrounds:** A faint **grid mesh** (`--grid-bg`, 32px cells) on the page — the playfield. The deepest surfaces (`.ds-well`) get a stronger border and grid. A fixed **CRT scanline** overlay + subtle vignette sit above everything in the live site. No photographic imagery by default; decoration is **falling tetromino pieces** and beveled blocks.

**The block bevel:** The signature texture. Every solid block (buttons, badges, avatars, swatches, progress cells) carries `inset 2px 2px 0 <lit>, inset -2px -2px 0 <dim>` to read as a 3D pixel block.

**Corners & borders:** **Sharp by default** (`--radius-0`). Blocks have crisp corners. Inputs/chips soften to 2–4px max. Pills are reserved for round avatars and status dots. Borders are 2px (`--border-strong`), often a piece color on hover.

**Shadows:** Hard-offset **block shadows** (`0 4px 0 rgba(0,0,0,.45)` — no blur) make elements look stacked on the board. Softer `--shadow-soft` for lifted cards. **Neon glows** (`--glow-cyan`, etc.) for emphasis.

**Motion (lots of it — and tasteful):**
- **Drop:** pieces fall in from above with a slight overshoot/bounce on landing (`ds-drop`, `--ease-snap` cubic-bezier with overshoot = "lock").
- **Line clear:** a quick white flash sweeps across cells (`ds-line-clear`).
- **Blink:** "PRESS START"-style blinking (`ds-blink`) for attract-mode prompts.
- **Falling background:** slow, low-opacity pieces drift down behind the hero.
- Default transition is **snappy** (90–160ms), not floaty.

**Hover states:** Buttons brighten (`filter: brightness(1.12)`); cards lift up 4px and gain an accent-color border; nav items brighten text; link rows nudge sideways and borders light up in a piece color.

**Press states:** Buttons **translate down 4px and drop their shadow** — the block "locks" into the board. Snappy, physical.

**Focus:** Thick (3px) outline in white or the accent piece color, offset — readable on the dark screen.

**Transparency & blur:** Sparingly. The sticky nav uses a translucent page color + `backdrop-filter: blur(8px)`. Soft color tints use `color-mix(... in srgb ...)` against the dark base. The scanline overlay uses `mix-blend-mode: multiply`.

**Cards:** Beveled surface (`--surface-card`), 2px strong border, hard drop shadow, optional colored top accent bar. Interactive cards lift and adopt the accent border on hover.

---

## Iconography

- **Icon set:** [**Pixelarticons**](https://pixelarticons.com/) — an 8-bit / pixel-grid icon family that matches the bitmap display font perfectly. Loaded via the **Iconify** web component from CDN:
  ```html
  <script src="https://code.iconify.design/iconify-icon/2.1.0/iconify-icon.min.js"></script>
  <iconify-icon icon="pixelarticons:github"></iconify-icon>
  ```
  > **Substitution flag:** Pixelarticons is the closest CDN-available pixel icon set to the arcade theme; it was chosen as the system default rather than authored from scratch. If you have a preferred icon family, swap the `icon=` prefix.
- **Emoji:** Not used. The **tetromino piece** (see `assets/pieces/*.svg` or the `<Tetromino>` component) is the brand's expressive glyph — use it as a bullet, accent, loader, or "emoji" stand-in.
- **Unicode:** Occasional functional glyphs are fine in mono/pixel contexts (`▶` for press-start, `∞`, `·`, `//`). Keep them sparse.
- **Brand marks:** `assets/mark.svg` (block-built "J" emblem), `assets/favicon.svg` (T-piece), `assets/social-cover.svg` (1200×630 share image), and the 7 beveled piece sprites in `assets/pieces/`.

---

## Fonts — substitution note

The three families are loaded from **Google Fonts** via `@import` in `tokens/typography.css` (Press Start 2P, Inter, JetBrains Mono — all are official Google Fonts). No font binaries are vendored into the project, so the compiler reports **0 `@font-face` rules**; consumers pick up the fonts over the network. If you need fully offline/self-hosted fonts, download the `.woff2` files and add local `@font-face` rules — **flag for the user if self-hosting is required.**

---

## Index / Manifest

**Root**
- `styles.css` — global entry point (imports only). Consumers link this one file.
- `readme.md` — this guide.
- `SKILL.md` — Agent-Skill wrapper.

**`tokens/`** — `colors.css`, `typography.css`, `spacing.css`, `effects.css`, `base.css` (all `@import`ed by `styles.css`).

**`assets/`** — `mark.svg`, `favicon.svg`, `social-cover.svg`, `pieces/{i,o,t,s,z,j,l}.svg`.

**`guidelines/`** — foundation specimen cards (Colors, Type, Spacing, Brand) for the Design System tab.

**`components/`** (namespace `window.TETRISJULIANNDesignSystem_af17e8`)
- `core/` — Button, IconButton, Badge, Tag, Card, ProgressBar, Avatar, Switch, Tetromino
- `forms/` — Input, Textarea
- `navigation/` — Tabs

**`ui_kits/website/`** — the interactive personal-site recreation (`index.html`) + screen modules (Nav, Hero, About, Projects, Blog, Contact, Now) + `hero-variations.html` (three landing directions to choose from).
