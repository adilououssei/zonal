import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Images, Calendar } from 'lucide-react'
import { albumPhotos, formatAlbumDate, type PublicGalleryItem } from '../services/gallery'

// Carte d'un album photo, commune à la page Galerie et à la section « En
// images » de l'accueil : couverture, catégorie, nombre de photos, titre et
// date, avec deux feuillets en retrait qui évoquent un album.
const AlbumCard = ({ album }: { album: PublicGalleryItem }) => {
  const { t, i18n } = useTranslation()
  const count = albumPhotos(album).length
  const date = formatAlbumDate(album.date, i18n.language)

  return (
    <Link to={`/gallery/${album.id}`} className="group block">
      <div className="relative pt-3">
        {count > 1 && (
          <>
            <div className="absolute inset-x-6 top-0 bottom-6 rounded-2xl bg-gray-200 transition-transform duration-500 group-hover:-translate-y-1" />
            <div className="absolute inset-x-3 top-1.5 bottom-3 rounded-2xl bg-gray-300 transition-transform duration-500 group-hover:-translate-y-0.5" />
          </>
        )}
        <div className="relative aspect-4/3 rounded-2xl overflow-hidden shadow-md group-hover:shadow-xl transition-shadow duration-500">
          <img
            src={album.src}
            alt={album.title}
            loading="lazy"
            draggable={false}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />
          <span className="absolute top-3 right-3 inline-flex items-center gap-1.5 bg-black/55 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            <Images size={13} />
            {t('gallery.photoCount', { count })}
          </span>
          {album.category && (
            <span className="absolute top-3 left-3 bg-primary text-white text-[11px] font-semibold tracking-wide px-2.5 py-1 rounded-full">
              {album.category}
            </span>
          )}
          <div className="absolute inset-x-0 bottom-0 p-5 text-white">
            <h3 className="text-lg font-bold leading-snug line-clamp-2">{album.title}</h3>
            {date && (
              <p className="mt-1 inline-flex items-center gap-1.5 text-small text-white/80 capitalize">
                <Calendar size={14} />
                {date}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default AlbumCard
