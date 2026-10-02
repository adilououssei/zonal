import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { publicGalleryService, type PublicGalleryItem } from '../services/gallery'
import AlbumCard from './AlbumCard'
import PagedCarousel from './ui/PagedCarousel'

// Section « En images » de l'accueil : les albums les plus récents de la
// galerie, 3 par page en carrousel, et un bouton vers la page Galerie pour
// tout voir. Masquée tant que la galerie est vide.

const MAX_ALBUMS = 9

const GalleryTeaser = () => {
  const { t, i18n } = useTranslation()
  const [albums, setAlbums] = useState<PublicGalleryItem[]>([])

  useEffect(() => {
    publicGalleryService.getAll()
      .then((data) => setAlbums(data.slice(0, MAX_ALBUMS)))
      .catch(() => console.error('Erreur chargement galerie'))
  }, [i18n.language])

  if (albums.length === 0) return null

  return (
    <section className="py-20">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="section-title">{t('home.gallery.title')}</h2>
          <p className="section-subtitle">{t('home.gallery.subtitle')}</p>
        </motion.div>

        <PagedCarousel items={albums} getKey={(album) => album.id} renderItem={(album) => <AlbumCard album={album} />} />

        <div className="text-center mt-10">
          <Link
            to="/gallery"
            className="inline-flex items-center gap-2 bg-red text-white rounded-full px-6 py-2.5 text-small font-semibold hover:bg-red-hover hover:gap-3 transition-all"
          >
            {t('home.gallery.cta')}
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default GalleryTeaser
