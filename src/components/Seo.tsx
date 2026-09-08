import { Helmet } from 'react-helmet-async'

// Balises SEO par page (title, meta description, canonical, Open Graph,
// Twitter Card, JSON-LD) — sans ce composant, react-helmet-async était
// installé mais jamais utilisé, et toutes les pages du site partageaient les
// mêmes balises statiques d'index.html dans les résultats Google.
//
// Limite connue : ces balises ne sont mises à jour qu'après exécution du
// JavaScript React (le site est une SPA sans rendu serveur). Googlebot les
// lit correctement, mais les robots qui ne lisent que le HTML brut (aperçus
// de lien WhatsApp/Facebook/LinkedIn...) ne verront que les balises statiques
// d'index.html, pas celles spécifiques à la page partagée.

export const SITE_URL = 'https://zonalchd.org'
export const SITE_NAME = 'ZONAL ONG'
const DEFAULT_IMAGE = `${SITE_URL}/images/logoOrigin.png`

interface SeoProps {
  title: string
  description: string
  path: string
  image?: string | null
  type?: 'website' | 'article'
  keywords?: string
  jsonLd?: Record<string, unknown> | Record<string, unknown>[]
}

const Seo = ({ title, description, path, image, type = 'website', keywords, jsonLd }: SeoProps) => {
  const url = `${SITE_URL}${path}`
  const fullTitle = `${title} | ${SITE_NAME}`
  const resolvedImage = image || DEFAULT_IMAGE
  const jsonLdList = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : []

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={url} />

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={resolvedImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={resolvedImage} />

      {jsonLdList.map((data, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(data)}</script>
      ))}
    </Helmet>
  )
}

export default Seo
