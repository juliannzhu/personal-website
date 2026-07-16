---
name: juliann-design
description: Use this skill to generate well-branded interfaces and assets for JULIANN's Tetris-themed personal brand, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.
If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.
If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

Quick orientation:
- **Theme:** full retro arcade — dark CRT playfield, the 7 tetromino colors, beveled blocks, pixel display type (Press Start 2P) over clean body (Inter) and mono (JetBrains Mono).
- **Tokens:** link `styles.css` for all CSS custom properties (`--piece-i…l`, `--ink-*`, `--font-pixel/body/mono`, `--space-*`, bevel/glow/scanline effects).
- **Components:** load `_ds_bundle.js`, then `const { Button, Card, Tag, … } = window.TETRISJULIANNDesignSystem_af17e8`.
- **Icons:** Pixelarticons via Iconify CDN (`<iconify-icon icon="pixelarticons:…">`). No emoji — use tetromino blocks instead.
- **Voice:** first person, fun, game metaphors ("clear my lines", "press start"). Pixel text and labels are ALL CAPS; body is sentence case.
- **Examples:** see `ui_kits/website/` for a full interactive site recreation and `guidelines/` for foundation specimen cards.
