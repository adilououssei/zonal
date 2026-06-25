import { useState, useEffect, useRef, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Image as ImageIcon, Loader2 } from 'lucide-react'
import { api } from '../../services/api'
import { galleryService } from '../../services/gallery'

const categories = ['Environnement', 'Éducation', 'Eau', 'Agriculture', 'Social']

const GalleryForm = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = Boolean(id)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(isEditing)
  const [uploading, setUploading] = useState(false)
  const [title, setTitle] = useState('')
  const [src, setSrc] = useState('')
  const [category, setCategory] = useState('')
  const [date, setDate] = useState('')

  useEffect(() => {
    if (!id) return
    const fetchItem = async () => {
      try {
        const item = await galleryService.getById(Number(id))
        setTitle(item.title)
        setSrc(item.src ?? '')
        setCategory(item.category ?? '')
        setDate(item.date ?? '')
      } catch {
        console.error('Erreur lors du chargement')
        navigate('/admin/gallery')
      } finally {
        setFetching(false)
      }
    }
    fetchItem()
  }, [id, navigate])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const result = await api.upload<{ url: string }>('/api/upload', formData)
      setSrc(result.url)
    } catch {
      console.error('Erreur lors de l\'upload')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = { title, src: src || undefined, category: category || undefined, date: date || undefined }

      if (isEditing && id) {
        await galleryService.update(Number(id), payload as { title: string; src?: string; category?: string; date?: string })
      } else {
        await galleryService.create(payload as { title: string; src: string; category?: string; date?: string })
      }
      navigate('/admin/gallery')
    } catch {
      console.error('Erreur lors de l\'enregistrement')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditing ? "Modifier l'image" : 'Ajouter une image'}
        </h1>
        <p className="text-gray-500 text-small mt-1">
          Tableau de bord &gt; Galerie &gt; {isEditing ? 'Modifier' : 'Ajouter'}
        </p>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-small font-medium text-gray-700 mb-2">Image</label>
              {src ? (
                <div className="relative rounded-xl overflow-hidden">
                  <img src={src} alt="Aperçu" className="w-full h-48 object-cover" />
                  <button
                    type="button"
                    onClick={() => { setSrc(''); if (fileInputRef.current) fileInputRef.current.value = '' }}
                    className="absolute top-2 right-2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center text-gray-600 hover:text-red transition-colors text-lg"
                  >
                    &times;
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl py-16 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors overflow-hidden">
                  {uploading ? (
                    <Loader2 size={24} className="animate-spin text-primary" />
                  ) : (
                    <>
                      <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                        <ImageIcon size={20} />
                      </div>
                      <span className="text-gray-500 text-small text-center">
                        Cliquez pour uploader<br />ou glissez-déposez une image
                      </span>
                    </>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={uploading}
                  />
                </label>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-small font-medium text-gray-700 mb-2">Titre</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex : Reboisement Guera"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-small focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                required
              />
            </div>
            <div>
              <label className="block text-small font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-small focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
              />
            </div>
            <div>
              <label className="block text-small font-medium text-gray-700 mb-2">Catégorie</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-small text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition cursor-pointer"
              >
                <option value="">Sélectionnez une catégorie</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={() => navigate('/admin/gallery')}
            className="px-5 py-2.5 rounded-lg text-gray-600 font-medium text-small border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading || uploading || !src}
            className="px-6 py-2.5 rounded-lg bg-primary text-white font-medium text-small hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </motion.form>
    </div>
  )
}

export default GalleryForm
