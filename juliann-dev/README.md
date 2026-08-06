# juliann.dev

My personal website, built from scratch with a Tetris-inspired look and feel. It's where I put my projects, my resume, and a few of the other things I spend my time on outside of code.

Live at [juliannzhu.vercel.app](https://juliannzhu.vercel.app/).

## Built with

- **React 19** + **Vite**
- **TypeScript** (strict mode)
- **Iconify** (pixelarticons, inlined at build time rather than fetched from their CDN)
- Plain CSS with custom properties (no Tailwind, no CSS-in-JS library)
- Self-hosted fonts via `@fontsource` — Press Start 2P, Inter, JetBrains Mono, latin subset only
- Vercel serverless functions for the contact form (Resend) and the Tetris leaderboard (Upstash Redis)

## Running it locally

Node 22.

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173).

Other commands:

```bash
npm run build     # type-checks and builds for production
npm run preview   # preview the production build locally
npm run icons     # regenerate src/lib/icons.ts (also runs automatically before a build)
```

One thing to know: `npm run dev` only serves the front end. The functions in `api/` don't run under Vite, so the contact form won't send and the leaderboard falls back to local scores stored in the browser. Use `vercel dev` or a deploy preview if you need to work on those.

## Routes

Every view has its own URL, so any of these can be linked to directly:

```
/                    /about  /projects  /quests  /now  /contact
/projects/<id>       a single project from the Build Log
/quests/<id>         a single side quest
/resume  /play       the resume and the Tetris game
```

`vercel.json` rewrites unknown paths to `index.html` so deep links survive a hard refresh. Static files and `/api/*` are matched first, so they're unaffected.

## Environment variables

Set on Vercel, needed by the functions in `api/`:

| Variable | Used for |
|---|---|
| `RESEND_API_KEY` | sending contact form messages |
| `CONTACT_TO` | where those messages go (optional, has a default) |
| `KV_REST_API_URL` / `KV_REST_API_TOKEN` | leaderboard storage, if set up through Vercel's Upstash integration |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | same, if set up through Upstash directly |

Either Redis pair works — the handler accepts whichever one is present.

## Status

Still actively building this. The contact form and leaderboard are both wired up and working. Next on my list is writing up some of the projects properly instead of just showing screenshots.
