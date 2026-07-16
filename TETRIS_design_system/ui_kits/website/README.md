# Website UI Kit — juliann.dev

An interactive, click-through recreation of Juliann's Tetris-themed personal site. Full retro-arcade aesthetic: dark playfield background, CRT scanlines, the 7 tetromino colors, pixel display type over clean Inter body.

## Run it
Open `index.html`. It loads `../../styles.css` (tokens), the compiled `_ds_bundle.js` (components), and each screen as a Babel JSX module.

## Screens
- **Hero** (`Hero.jsx`) — landing with animated falling pieces, color-per-letter pixel name, HUD stat bar.
- **About** (`About.jsx`) — bio, skill "stack meters", timeline.
- **Projects** (`Projects.jsx`) — filterable grid of project cards.
- **Contact** (`Contact.jsx`) — message form (with a "line cleared!" success state) + link rows.
- **Now** (`Now.jsx`) — current-status board + weekly stat meters.
- **Nav** (`Nav.jsx`) — sticky top nav + footer with the 7-color stripe.

## Interactions
Top nav switches screens. The hero CTAs jump to Work / Contact. Project cards are clickable. The contact form submits to a fake success state.

## Composition
Every screen composes the design-system primitives (`Button`, `Card`, `Tag`, `Badge`, `ProgressBar`, `Avatar`, `Tetromino`, `Input`, `Textarea`) from `window.TETRISJULIANNDesignSystem_af17e8`. Screen modules attach to `window` (no `export`) so they are NOT bundled as components.

## Content note
All copy and projects are realistic placeholders written in Juliann's voice — swap in real work, links, and posts.
