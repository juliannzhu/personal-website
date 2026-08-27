# juliann.dev

My personal website, built from scratch with a Tetris-inspired look and feel. It's where I put my projects, my resume, and a few of the other things I spend my time on outside of code.

Live at [juliannzhu.vercel.app](https://juliannzhu.vercel.app/).

## What's in here

```
juliann-dev/            the site itself, and the only thing that gets deployed
TETRIS_design_system/   the design system I wrote first: voice, tokens, components
```

I designed the system before building anything, so the colours, type scale, and spacing in
the site all trace back to `TETRIS_design_system/`. It's here because the reasoning is half
the project.

## Built with

- **React 19** + **Vite**
- **TypeScript** (strict mode)
- **Iconify** (pixelarticons, inlined at build time rather than fetched from their CDN)
- Plain CSS with custom properties (no Tailwind, no CSS-in-JS library)
- Self-hosted fonts via `@fontsource` — Press Start 2P, Inter, JetBrains Mono, latin subset only
- Vercel serverless functions for the contact form (Resend) and the Tetris leaderboard (Upstash Redis)

## Running it locally

Node 22. Everything runs from `juliann-dev/`, not the repo root.

```bash
cd juliann-dev
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173).

Other commands:

```bash
npm run build     # type-checks and builds for production
npm run preview   # preview the production build locally
npm run icons     # regenerate src/lib/icons.ts (also runs automatically before a build)
npm run sitemap   # regenerate public/sitemap.xml (also runs automatically before a build)
```

`juliann-dev/public/sitemap.xml` is generated from the routes and the project/quest ids in the
source, so adding a project puts it in the sitemap on the next build.
`juliann-dev/public/robots.txt` is hand-written and points at it.

One thing to know: `npm run dev` only serves the front end. The functions in `juliann-dev/api/` don't run under Vite, so the contact form won't send and the leaderboard falls back to local scores stored in the browser. Use `vercel dev` or a deploy preview if you need to work on those.

## Routes

Every view has its own URL, so any of these can be linked to directly:

```
/                    /about  /projects  /quests  /now  /contact
/projects/<id>       a single project from the Build Log
/quests/<id>         a single side quest
/resume  /play       the resume and the Tetris game
```

`juliann-dev/vercel.json` rewrites unknown paths to `index.html` so deep links survive a hard refresh. Static files and `/api/*` are matched first, so they're unaffected.

## Environment variables

Set on Vercel, needed by the functions in `juliann-dev/api/`:

| Variable | Used for |
|---|---|
| `RESEND_API_KEY` | sending contact form messages |
| `CONTACT_TO` | where those messages go (optional, has a default) |
| `KV_REST_API_URL` / `KV_REST_API_TOKEN` | leaderboard storage and contact form rate limiting, if set up through Vercel's Upstash integration |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | same, if set up through Upstash directly |

Either Redis pair works — the handlers accept whichever one is present. Without them the leaderboard falls back to scores stored in the browser, and the contact form still sends but isn't rate limited.

## Status

Still actively building this. The contact form and leaderboard are both wired up and working. Next on my list is writing up some of the projects properly instead of just showing screenshots.
