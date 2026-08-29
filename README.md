# juliann.dev

My Tetris-themed personal website, including my projects, resume, and a few other side quests.

Live at [juliannzhu.vercel.app](https://juliannzhu.vercel.app/).

A few years ago I was obsessed with Tetris, to the point where I would close my eyes and still see pieces falling. Somewhere in those hundreds of hours it started shaping how I think, like staying calm under pressure when things stack up. So when I built this site, I knew I didn't want a generic, flat digital business card. I wanted people to get a sense of my personality, so I designed the whole thing around Tetris and hid references in the layout, the colour palette, the animations, and the interactions.

The hardest part was capturing the feeling that made me love Tetris in the first place. Every version came out slightly off, and I lost hours to small details nobody will ever notice. To me, this project represents more than a portfolio. It's a reflection of my personal journey as someone who loves building, enjoys the process, and won't stop until I create exactly what I was picturing.

## Project structure

```
juliann-dev/            the React app, deployed to Vercel
```

## Built with

- React 19
- Vite
- TypeScript
- Iconify (pixelarticons)
- Plain CSS with custom properties
- Self-hosted fonts via `@fontsource`: Press Start 2P, Inter, JetBrains Mono, latin subset only
- Vercel serverless functions for the contact form (Resend) and the Tetris leaderboard (Upstash Redis)

## Running it locally

Everything runs from `juliann-dev/`, not the repo root.

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
`juliann-dev/public/robots.txt` points at it.

`npm run dev` only serves the front end. The functions in `juliann-dev/api/` don't run under Vite, so the contact form won't send and the leaderboard falls back to local scores stored in the browser. If needed, use `vercel dev` or a deploy preview.

## Routes

Every view has its own URL, so any of these can be linked to directly:

```
/                    /about  /projects  /quests  /now  /contact
/projects/<id>       a single project from the Project Portfolio
/quests/<id>         a single side quest
/resume  /play       the resume and the Tetris game
```

`juliann-dev/vercel.json` rewrites unknown paths to `index.html`. Static files and `/api/*` are matched first and unaffected.

## Environment variables

Set on Vercel, needed by the functions in `juliann-dev/api/`:

| Variable | Used for |
|---|---|
| `RESEND_API_KEY` | sending contact form messages |
| `CONTACT_TO` | where those messages go (optional, has a default) |
| `KV_REST_API_URL` / `KV_REST_API_TOKEN` | leaderboard storage and contact form rate limiting, if set up through Vercel's Upstash integration |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | same, if set up through Upstash directly |

Either Redis pair works, since the handlers accept whichever one is present. Without them the leaderboard falls back to scores stored in the browser, and the contact form still sends but isn't rate limited.
