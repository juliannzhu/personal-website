// Generates public/sitemap.xml from the routes in src/lib/router.ts and the project/quest ids
// in the screens that own them.
//
// Worth generating rather than hand-writing: the site navigates with buttons and scroll-spy,
// not <a href> links, so a crawler has nothing to follow and no way to discover a project page
// on its own. The sitemap is the only thing telling search engines these URLs exist — which
// makes it exactly the file you don't want going stale the next time a project is added.
//
// Runs automatically before `npm run build`; run `npm run sitemap` to refresh it by hand.

import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const ORIGIN = 'https://juliannzhu.vercel.app'

// Mirrors the section and overlay routes in src/lib/router.ts.
const SECTIONS = ['/', '/about', '/projects', '/quests', '/now', '/contact', '/resume', '/play']

// The ids are scraped out of .tsx rather than imported, because this runs in plain Node with no
// transpiler. That makes it sensitive to formatting, so a scrape that finds nothing is treated
// as a broken script rather than an empty site — better a failed build than a sitemap that
// silently drops half the pages.
function ids(file) {
  const src = readFileSync(join(root, 'src', 'screens', file), 'utf8')
  const found = [...src.matchAll(/^\s+id: '([a-z0-9-]+)',$/gm)].map((m) => m[1])
  if (found.length === 0) throw new Error(`build-sitemap: no ids matched in ${file} — has the formatting changed?`)
  return found
}

const urls = [
  ...SECTIONS,
  ...ids('Projects.tsx').map((id) => `/projects/${id}`),
  ...ids('SideQuests.tsx').map((id) => `/quests/${id}`),
]

// No <lastmod>: there's no honest per-page date to use, and search engines discount a lastmod
// they can tell is rubber-stamped. <changefreq> and <priority> are omitted because Google
// ignores both.
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${ORIGIN}${u}</loc></url>`).join('\n')}
</urlset>
`

writeFileSync(join(root, 'public', 'sitemap.xml'), xml)
console.log(`build-sitemap: ${urls.length} urls (${SECTIONS.length} sections, ${urls.length - SECTIONS.length} detail pages)`)
