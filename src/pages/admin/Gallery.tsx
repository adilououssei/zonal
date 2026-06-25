import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Image as ImageIcon, Plus, Trash2, Eye, Search, ChevronDown } from 'lucide-react'
import { galleryService } from '../../services/gallery'
import type { GalleryItem } from '../../services/gallery'

const categories = ['Toutes', 'Environnement', 'Éducation', 'Eau', 'Agriculture', 'Social']

const Gallery = () => {
  const { t } = useTranslation()
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('Toutes')

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true)
      const data = await galleryService.getAll()
      setItems(data)
    } catch {
      console.error('Erreur lors du chargement de la galerie')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchItems() }, [fetchItems])

  const handleDelete = async (id: number) => {
    if (!confirm('Confirmer la suppression ?')) return
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
    return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('admin.sidebar.gallery')}</h1>
          <p className="text-gray-500 text-small mt-1">Gérez les photos et médias de l'organisation.</p>
        </div>
        <Link
          to="/admin/gallery/new"
          className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg font-medium text-small hover:bg-primary-dark transition-colors"
        >
          <Plus size={18} />
          Ajouter des images
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher une image..."
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
              <option key={cat} value={cat}>{cat === 'Toutes' ? 'Catégorie: Toutes' : cat}</option>
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
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={img.src}
                      alt={img.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <Link
                      to={`/admin/gallery/${img.id}/edit`}
                      className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-700 hover:text-primary transition-colors"
                    >
                      <Eye size={18} />
                    </Link>
                    <button
                      onClick={() => handleDelete(img.id)}
                      className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-700 hover:text-red transition-colors"
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
                Aucune image trouvée.
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default Gallery
