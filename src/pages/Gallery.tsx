import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ChevronRight, ImageOff } from 'lucide-react'
import { publicGalleryService, albumPhotos, type PublicGalleryItem } from '../services/gallery'
import Seo from '../components/Seo'
import AlbumCard from '../components/AlbumCard'

// Page « Galerie » (/gallery) : albums photo gérés dans l'admin (Galerie),
// filtrables par catégorie. Chaque album ouvre sa page (/gallery/:id) où les
// photos se consultent en plein écran.

const ALL = '__all__'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}

const Gallery = () => {
  const { t, i18n } = useTranslation()
  const [albums, setAlbums] = useState<PublicGalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState(ALL)

  useEffect(() => {
    publicGalleryService.getAll()
      .then(setAlbums)
      .catch(() => console.error('Erreur lors du chargement de la galerie'))
      .finally(() => setLoading(false))
  }, [i18n.language])

  const categories = Array.from(new Set(albums.map((a) => a.category).filter(Boolean)))
  const visibleAlbums = category === ALL ? albums : albums.filter((a) => a.category === category)
  const totalPhotos = albums.reduce((sum, a) => sum + albumPhotos(a).length, 0)

  return (
    <>
      <Seo
        title={t('gallery.hero.title')}
        description="Les actions de ZONAL, ONG de développement durable au Tchad, en images : albums photo de nos projets, formations et événements."
        keywords="ZONAL, ONG Tchad, galerie photo, albums, projets, événements"
        path="/gallery"
      />

      {/* Hero */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/slide5.png" alt="" className="w-full h-full object-cover object-[center_30%]" />
          <div className="absolute inset-0 bg-linear-to-r from-black/75 via-black/50 to-black/25" />
        </div>
        <div className="relative container-custom text-white">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-section font-bold mb-4"
          >
            {t('gallery.hero.title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-subtitle text-gray-200 max-w-2xl mb-5"
          >
            {t('gallery.hero.subtitle')}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="flex flex-wrap items-center gap-2 text-gray-200 text-body"
          >
            <Link to="/" className="hover:text-primary-light transition-colors">{t('header.nav.home')}</Link>
            <ChevronRight size={16} />
            <span>{t('header.nav.media')}</span>
            <ChevronRight size={16} />
            <span className="text-primary-light">{t('gallery.hero.title')}</span>
          </motion.div>
        </div>
      </section>

      <section className="py-14">
        <div className="container-custom">
          {/* Chiffres + filtres par catégorie */}
          {!loading && albums.length > 0 && (
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-10">
              <p className="text-gray-500 text-body">
                {t('gallery.albumCount', { count: albums.length })} · {t('gallery.photoCount', { count: totalPhotos })}
              </p>
              {categories.length > 1 && (
                <div className="flex flex-wrap gap-2">
                  {[ALL, ...categories].map((c) => (
                    <button
                      key={c}
                      onClick={() => setCategory(c)}
                      className={`px-4 py-2 rounded-full text-small font-medium border transition-all duration-300 ${
                        category === c
                          ? 'bg-primary text-white border-primary shadow-md'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary'
                      }`}
                    >
                      {c === ALL ? t('gallery.filters.all') : c}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-4/3 rounded-2xl bg-gray-100 animate-pulse" />
              ))}
            </div>
          ) : visibleAlbums.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-20 text-gray-400">
              <ImageOff size={48} className="mb-4" />
              <p className="text-body">{t('gallery.empty')}</p>
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
              <AnimatePresence mode="popLayout">
                {visibleAlbums.map((album, index) => (
                    <motion.div
                      key={album.id}
                      layout
                      initial="hidden"
                      animate="visible"
                      exit={{ opacity: 0, scale: 0.95 }}
                      variants={fadeUp}
                      transition={{ duration: 0.5, delay: Math.min(index, 6) * 0.06 }}
                    >
                      <AlbumCard album={album} />
                    </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>
    </>
  )
}

export default Gallery
