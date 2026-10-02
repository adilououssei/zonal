// Génère public/sitemap.xml avant chaque build (voir "prebuild" dans
// package.json), en listant les pages statiques + le contenu dynamique
// (événements, actualités, projets) récupéré depuis l'API. Le site étant une
// SPA sans rendu serveur, c'est le seul moyen de donner à Google la liste
// complète des URLs à indexer (il ne peut pas les découvrir en "cliquant"
// sur les liens comme un humain, il se fie au sitemap).
//
// Si l'API n'est pas joignable au moment du build (ex: build fait sur une
// machine locale sans accès au VPS), le script se contente des pages
// statiques plutôt que d'échouer le build.
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const SITE_URL = 'https://zonalchd.org'
const API_URL = process.env.VITE_API_URL || 'https://api.zonalchd.org'
const __dirname = dirname(fileURLToPath(import.meta.url))

const staticRoutes = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/about', changefreq: 'monthly', priority: '0.7' },
  { path: '/programs', changefreq: 'monthly', priority: '0.8' },
  { path: '/projects', changefreq: 'weekly', priority: '0.8' },
  { path: '/events', changefreq: 'daily', priority: '0.8' },
  { path: '/news', changefreq: 'daily', priority: '0.8' },
  { path: '/gallery', changefreq: 'weekly', priority: '0.7' },
  { path: '/contact', changefreq: 'yearly', priority: '0.5' },
]

async function fetchJson(path) {
  try {
    const res = await fetch(`${API_URL}${path}`, { signal: AbortSignal.timeout(10_000) })
    if (!res.ok) return []
    return await res.json()
  } catch (err) {
    console.warn(`[sitemap] Impossible de charger ${path} (${err.message}) — ignoré.`)
    return []
  }
}

function urlEntry(path, changefreq, priority) {
  return `  <url>\n    <loc>${SITE_URL}${path}</loc>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`
}

const [events, news, projects, albums] = await Promise.all([
  fetchJson('/api/events'),
  fetchJson('/api/news'),
  fetchJson('/api/projects'),
  fetchJson('/api/gallery'),
])

const entries = [
  ...staticRoutes.map((r) => urlEntry(r.path, r.changefreq, r.priority)),
  ...events.map((e) => urlEntry(`/events/${e.id}`, 'monthly', '0.6')),
  ...news.map((n) => urlEntry(`/news/${n.id}`, 'monthly', '0.6')),
  ...projects.map((p) => urlEntry(`/projects/${p.id}`, 'monthly', '0.6')),
  ...albums.map((a) => urlEntry(`/gallery/${a.id}`, 'monthly', '0.5')),
]

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>\n`

writeFileSync(join(__dirname, '..', 'public', 'sitemap.xml'), xml)
console.log(`[sitemap] public/sitemap.xml généré (${entries.length} URLs : ${staticRoutes.length} pages, ${events.length} événements, ${news.length} actualités, ${projects.length} projets, ${albums.length} albums).`)
