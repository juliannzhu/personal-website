import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Vercel Web Analytics: page views and visitor counts, no cookies. The `/react` entry point is
// the one for a plain Vite SPA; `/next` is for Next.js and won't resolve here.
import { Analytics } from '@vercel/analytics/react'
// Registers the pixelarticons used on the site up front. Without this, @iconify/react
// fetches each one from api.iconify.design at render time — a third-party round trip on
// every visit, with the icons popping in after the rest of the page has painted.
import './lib/icons'
// Self-hosted fonts (latin subset only) — replaces the Google Fonts CDN link.
import '@fontsource/press-start-2p/latin-400.css'
import '@fontsource/inter/latin-400.css'
import '@fontsource/inter/latin-500.css'
import '@fontsource/inter/latin-600.css'
import '@fontsource/inter/latin-700.css'
import '@fontsource/inter/latin-800.css'
import '@fontsource/jetbrains-mono/latin-400.css'
import '@fontsource/jetbrains-mono/latin-500.css'
import '@fontsource/jetbrains-mono/latin-700.css'
import './styles/index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <Analytics />
  </StrictMode>,
)
