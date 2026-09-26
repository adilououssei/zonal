import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Link, useParams } from 'react-router-dom'
import { ChevronRight, ArrowLeft, Calendar, Images, Maximize2, Tag, ImageOff } from 'lucide-react'
import { publicGalleryService, albumPhotos, formatAlbumDate, type PublicGalleryItem } from '../services/gallery'
import Lightbox from '../components/ui/Lightbox'
import Seo from '../components/Seo'

// Page d'un album photo (/gallery/:id) : mosaïque des photos (hauteurs
// libres, sans recadrage), visionneuse plein écran au clic, puis d'autres
// albums à découvrir.
const GalleryAlbum = () => {
  const { id } = useParams()
  const { t, i18n } = useTranslation()
  const [album, setAlbum] = useState<PublicGalleryItem | null>(null)
  const [others, setOthers] = useState<PublicGalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  useEffect(() => {
    let mounted = true
    const albumId = Number(id)
    publicGalleryService.getById(albumId)
      .then((current) => {
        if (!mounted) return
        setAlbum(current)
        setNotFound(false)
      })
      .catch(() => { if (mounted) setNotFound(true) })
      .finally(() => { if (mounted) setLoading(false) })
    // « Autres albums » : facultatif, un échec ne doit pas masquer l'album affiché
    publicGalleryService.getAll()
      .then((all) => { if (mounted) setOthers(all.filter((a) => a.id !== albumId).slice(0, 3)) })
      .catch(() => {})
    window.scrollTo(0, 0)
    return () => { mounted = false }
  }, [id, i18n.language])

  if (loading) {
    return (
      <div className="container-custom py-32">
        <div className="h-10 w-2/3 max-w-lg rounded-lg bg-gray-100 animate-pulse mb-10" />
        <div className="columns-2 md:columns-3 gap-4">
          {[200, 280, 240, 300, 220, 260].map((h, i) => (
            <div key={i} className="mb-4 rounded-xl bg-gray-100 animate-pulse break-inside-avoid" style={{ height: h }} />
          ))}
        </div>
      </div>
    )
  }

  if (notFound || !album) {
    return (
      <div className="container-custom py-40 text-center text-gray-500">
        <ImageOff size={48} className="mx-auto mb-4 text-gray-300" />
        <p className="text-body mb-6">{t('gallery.notFound')}</p>
        <Link to="/gallery" className="btn-primary inline-flex items-center gap-2">
          <ArrowLeft size={16} />
          {t('gallery.backToAll')}
        </Link>
      </div>
    )
  }

  const photos = albumPhotos(album)
  const date = formatAlbumDate(album.date, i18n.language)

  return (
    <>
      <Seo
        title={album.title}
        description={t('gallery.seoDescription', { title: album.title, count: photos.length })}
        path={`/gallery/${album.id}`}
        image={album.src}
      />

      {/* En-tête de l'album, sur fond de la couverture floutée */}
      <section className="relative pt-36 md:pt-44 pb-14 overflow-hidden bg-gray-900">
        <div className="absolute inset-0">
          <img src={album.src} alt="" className="w-full h-full object-cover scale-110 blur-xl opacity-50" />
          <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/50 to-black/80" />
        </div>
        <div className="relative container-custom text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap items-center gap-2 text-gray-300 text-small mb-5"
          >
            <Link to="/" className="hover:text-primary-light transition-colors">{t('header.nav.home')}</Link>
            <ChevronRight size={14} />
            <Link to="/gallery" className="hover:text-primary-light transition-colors">{t('gallery.hero.title')}</Link>
            <ChevronRight size={14} />
            <span className="text-primary-light line-clamp-1">{album.title}</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold leading-tight max-w-4xl mb-5"
          >
            {album.title}
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap items-center gap-x-6 gap-y-2 text-gray-200 text-body"
          >
            <span className="inline-flex items-center gap-2"><Images size={18} />{t('gallery.photoCount', { count: photos.length })}</span>
            {date && <span className="inline-flex items-center gap-2 capitalize"><Calendar size={18} />{date}</span>}
            {album.category && <span className="inline-flex items-center gap-2"><Tag size={18} />{album.category}</span>}
          </motion.div>
        </div>
      </section>

      {/* Mosaïque */}
      <section className="py-12 md:py-16">
        <div className="container-custom">
          <div className="columns-2 md:columns-3 xl:columns-4 gap-3 md:gap-4">
            {photos.map((src, i) => (
              <motion.button
                key={`${src}-${i}`}
                type="button"
                onClick={() => setLightboxIndex(i)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.5, delay: (i % 4) * 0.06 }}
                className="group relative block w-full mb-3 md:mb-4 rounded-xl overflow-hidden break-inside-avoid bg-gray-100 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/40"
                aria-label={t('gallery.openPhoto', { n: i + 1 })}
              >
                <img src={src} alt={`${album.title} — ${i + 1}`} loading="lazy" className="w-full h-auto transition-transform duration-700 group-hover:scale-105" />
                <span className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors duration-300">
                  <span className="w-12 h-12 rounded-full bg-white/90 text-gray-900 flex items-center justify-center opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300">
                    <Maximize2 size={20} />
                  </span>
                </span>
              </motion.button>
            ))}
          </div>

          {/* Autres albums */}
          {others.length > 0 && (
            <div className="mt-20">
              <div className="flex items-end justify-between gap-4 mb-8">
                <h2 className="text-2xl font-bold text-gray-900">{t('gallery.otherAlbums')}</h2>
                <Link to="/gallery" className="shrink-0 text-primary font-semibold inline-flex items-center gap-1 hover:gap-2 transition-all">
                  {t('gallery.seeAll')} <ChevronRight size={16} />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {others.map((other) => (
                  <Link key={other.id} to={`/gallery/${other.id}`} className="group relative block aspect-4/3 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                    <img src={other.src} alt={other.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />
                    <span className="absolute top-3 right-3 inline-flex items-center gap-1.5 bg-black/55 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                      <Images size={13} />
                      {albumPhotos(other).length}
                    </span>
                    <h3 className="absolute inset-x-0 bottom-0 p-4 text-white font-semibold leading-snug line-clamp-2">{other.title}</h3>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mt-14 text-center">
            <Link to="/gallery" className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all">
              <ArrowLeft size={16} />
              {t('gallery.backToAll')}
            </Link>
          </div>
        </div>
      </section>

      <Lightbox images={photos} index={lightboxIndex} onIndexChange={setLightboxIndex} title={album.title} />
    </>
  )
}

export default GalleryAlbum
