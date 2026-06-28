import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Image as ImageIcon, Plus, Trash2, Eye, Search, ChevronDown, X, ChevronLeft, ChevronRight, Pencil } from 'lucide-react'
import { galleryService } from '../../services/gallery'
import type { GalleryItem } from '../../services/gallery'

const categories = ['Toutes', 'Environnement', 'Éducation', 'Eau', 'Agriculture', 'Social']

const Gallery = () => {
  const { t, i18n } = useTranslation()
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('Toutes')
  const [lightbox, setLightbox] = useState<{ images: string[]; index: number } | null>(null)
  const [cardIndex, setCardIndex] = useState<Record<number, number>>({})

  const goCard = (id: number, dir: number, images: string[] | null) => {
    const all = images ?? []
    if (all.length < 2) return
    setCardIndex((prev) => ({
      ...prev,
      [id]: ((prev[id] ?? 0) + dir + all.length) % all.length,
    }))
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!lightbox) return
      if (e.key === 'ArrowLeft') {
        setLightbox((prev) => prev ? { ...prev, index: (prev.index - 1 + prev.images.length) % prev.images.length } : null)
      } else if (e.key === 'ArrowRight') {
        setLightbox((prev) => prev ? { ...prev, index: (prev.index + 1) % prev.images.length } : null)
      } else if (e.key === 'Escape') {
        setLightbox(null)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightbox])

  useEffect(() => {
    let mounted = true
    const fetchData = async () => {
      try {
        setLoading(true)
        const data = await galleryService.getAll()
        if (mounted) setItems(data)
      } catch {
        if (mounted) console.error('Erreur lors du chargement de la galerie')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetchData()
    return () => { mounted = false }
  }, [i18n.language])

  const handleDelete = async (id: number) => {
    if (!confirm(t('admin.confirm.deleteItem'))) return
    try {
      await galleryService.delete(id)
      setItems((prev) => prev.filter((i) => i.id !== id))
    } catch {
      console.error('Erreur lors de la suppression')
    }
  }

  const filtered = items.filter((img) => {
    const matchesSearch = img.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === 'Toutes' || img.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const formatDate = (d: string | null) => {
    if (!d) return ''
    return new Date(d).toLocaleDateString(i18n.language === 'en' ? 'en-US' : 'fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  return (
    <>
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('admin.sidebar.gallery')}</h1>
            <p className="text-gray-500 text-small mt-1">{t('admin.pages.gallery')}</p>
          </div>
          <Link
            to="/admin/gallery/new"
            className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg font-medium text-small hover:bg-primary-dark transition-colors"
          >
            <Plus size={18} />
            {t('admin.actions.addImage')}
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('admin.placeholders.searchImage')}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-small focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
            />
          </div>
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="appearance-none pl-4 pr-9 py-2.5 rounded-lg border border-gray-200 text-small text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat === 'Toutes' ? `${t('admin.table.category')}: ${t('projects.filter.all')}` : t(`admin.categories.${cat.toLowerCase()}`)}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.length > 0 ? (
                filtered.map((img) => (
                  <div
                    key={img.id}
                    className="group relative bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        const allImages = img.images ?? [img.src]
                        setLightbox({ images: allImages, index: cardIndex[img.id] ?? 0 })
                      }}
                      className="aspect-video overflow-hidden relative w-full text-left cursor-pointer"
                    >
                      <img
                        src={img.images?.[cardIndex[img.id] ?? 0] ?? img.src}
                        alt={img.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {img.imageCount > 1 && (
                        <div className="absolute top-2 right-2 bg-black/60 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                          {cardIndex[img.id] ?? 0} / {img.images?.length ?? 1}
                        </div>
                      )}
                      {img.images && img.images.length > 1 && (
                        <>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); goCard(img.id, -1, img.images) }}
                            className="absolute left-1 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-gray-700 hover:bg-white transition-colors cursor-pointer shadow-sm"
                          >
                            <ChevronLeft size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); goCard(img.id, 1, img.images) }}
                            className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-gray-700 hover:bg-white transition-colors cursor-pointer shadow-sm"
                          >
                            <ChevronRight size={16} />
                          </button>
                        </>
                      )}
                    </button>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={() => {
                          const allImages = img.images ?? [img.src]
                          setLightbox({ images: allImages, index: cardIndex[img.id] ?? 0 })
                        }}
                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-700 hover:text-primary transition-colors cursor-pointer"
                      >
                        <Eye size={18} />
                      </button>
                      <Link
                        to={`/admin/gallery/${img.id}/edit`}
                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-700 hover:text-primary transition-colors"
                      >
                        <Pencil size={18} />
                      </Link>
                      <button
                        onClick={() => handleDelete(img.id)}
                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-700 hover:text-red transition-colors cursor-pointer"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <div className="p-3">
                      <h4 className="text-gray-800 text-small font-medium truncate">{img.title}</h4>
                      <p className="text-gray-400 text-xs mt-0.5">{formatDate(img.date)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-400 text-small">
                  <ImageIcon size={40} className="mb-3 text-gray-300" />
                  {t('admin.empty.noImages')}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors cursor-pointer z-10"
          >
            <X size={22} />
          </button>

          <div className="relative max-w-5xl max-h-[90vh] mx-4" onClick={(e) => e.stopPropagation()}>
            <img
              src={lightbox.images[lightbox.index]}
              alt=""
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
            />

            {lightbox.images.length > 1 && (
              <>
                <button
                  onClick={() => setLightbox((prev) => prev ? { ...prev, index: (prev.index - 1 + prev.images.length) % prev.images.length } : null)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors cursor-pointer"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  onClick={() => setLightbox((prev) => prev ? { ...prev, index: (prev.index + 1) % prev.images.length } : null)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors cursor-pointer"
                >
                  <ChevronRight size={22} />
                </button>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-3 py-1 rounded-full">
                  {lightbox.index + 1} / {lightbox.images.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default Gallery
