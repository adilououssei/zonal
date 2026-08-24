import { useState, useEffect, useRef, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Image as ImageIcon, Loader2, Star } from 'lucide-react'
import { api } from '../../services/api'
import { galleryService } from '../../services/gallery'
import CategorySelect from '../../components/ui/CategorySelect'

// Formulaire de création/édition d'un élément de galerie. Accepte plusieurs
// images (album) : la première sert de couverture/miniature (voir Gallery
// entity ↔ src côté backend).
const GalleryForm = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = Boolean(id)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(isEditing)
  const [uploading, setUploading] = useState(false)
  const [title, setTitle] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [category, setCategory] = useState('')
  const [date, setDate] = useState('')

  useEffect(() => {
    if (!id) return
    const fetchItem = async () => {
      try {
        const item = await galleryService.getById(Number(id))
        setTitle(item.title)
        setImages(item.images ?? (item.src ? [item.src] : []))
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

  const handleFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    const uploaded: string[] = []
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData()
        formData.append('file', file)
        const result = await api.upload<{ url: string }>('/api/upload', formData)
        uploaded.push(result.url)
      }
      setImages((prev) => [...prev, ...uploaded])
    } catch {
      console.error('Erreur lors de l\'upload')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const src = images[0] || ''
      const payload = { title, src, images, category: category || undefined, date: date || undefined }

      if (isEditing && id) {
        await galleryService.update(Number(id), payload as Parameters<typeof galleryService.update>[1])
      } else {
        await galleryService.create(payload as Parameters<typeof galleryService.create>[0])
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
          {isEditing ? t('admin.form.editAlbum') : t('admin.form.addAlbum')}
        </h1>
        <p className="text-gray-500 text-small mt-1">
          {t('admin.sidebar.dashboard')} &gt; {t('admin.sidebar.gallery')} &gt; {isEditing ? t('admin.actions.edit') : t('admin.form.add')}
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
              <label className="block text-small font-medium text-gray-700 mb-2">{t('admin.labels.images', { count: images.length })}</label>
              {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
                  {images.map((url, i) => (
                    <div key={i} className="relative rounded-lg overflow-hidden group aspect-4/3">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      {i === 0 && (
                        <div className="absolute top-1 left-1 bg-yellow-400 text-white rounded-full w-5 h-5 flex items-center justify-center" title={t('admin.labels.mainImage')}>
                          <Star size={10} className="fill-white" />
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-red transition-colors text-sm opacity-0 group-hover:opacity-100"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl py-8 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors overflow-hidden">
                {uploading ? (
                  <Loader2 size={22} className="animate-spin text-primary" />
                ) : (
                  <>
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                      <ImageIcon size={18} />
                    </div>
                    <span className="text-gray-500 text-xs text-center">
                      {t('admin.actions.addImage')}
                    </span>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleFilesChange}
                  disabled={uploading}
                />
              </label>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-small font-medium text-gray-700 mb-2">{t('admin.labels.albumTitle')}</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t('admin.placeholders.albumTitleEx')}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-small focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                required
              />
            </div>
            <div>
              <label className="block text-small font-medium text-gray-700 mb-2">{t('admin.table.date')}</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-small focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
              />
            </div>
            <CategorySelect
              value={category}
              onChange={setCategory}
              options={['Environnement', 'Éducation', 'Eau', 'Agriculture', 'Social']}
              optionKey={(cat) => `admin.categories.${cat.toLowerCase()}`}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={() => navigate('/admin/gallery')}
            className="px-5 py-2.5 rounded-lg text-gray-600 font-medium text-small border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            {t('admin.actions.cancel')}
          </button>
          <button
            type="submit"
            disabled={loading || uploading || images.length === 0}
            className="px-6 py-2.5 rounded-lg bg-primary text-white font-medium text-small hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {loading ? t('admin.actions.saving') : t('admin.actions.save')}
          </button>
        </div>
      </motion.form>
    </div>
  )
}

export default GalleryForm
