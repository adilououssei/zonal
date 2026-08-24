import { useState, useEffect, useRef, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Star, Upload, X } from 'lucide-react'
import { testimonialsService } from '../../services/testimonials'
import { api } from '../../services/api'

// Formulaire de création/édition d'un témoignage (note de 1 à 5, avatar optionnel).
const TestimonialsForm = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = Boolean(id)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(isEditing)
  const [uploading, setUploading] = useState(false)
  const [author, setAuthor] = useState('')
  const [role, setRole] = useState('')
  const [content, setContent] = useState('')
  const [rating, setRating] = useState(5)
  const [avatar, setAvatar] = useState('')
  const [status, setStatus] = useState('published')
  useEffect(() => {
    if (!id) return
    const fetchTestimonial = async () => {
      try {
        const item = await testimonialsService.getById(Number(id))
        setAuthor(item.author)
        setRole(item.role ?? '')
        setContent(item.content)
        setRating(item.rating)
        setAvatar(item.avatar ?? '')
        setStatus(item.status)
      } catch {
        console.error('Erreur lors du chargement')
        navigate('/admin/testimonials')
      } finally {
        setFetching(false)
      }
    }
    fetchTestimonial()
  }, [id, navigate])

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const result = await api.upload<{ url: string }>('/api/upload', fd)
      setAvatar(result.url)
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
      const payload = {
        author,
        role: role || undefined,
        content,
        rating,
        avatar: avatar || undefined,
        status,
      }

      if (isEditing && id) {
        await testimonialsService.update(Number(id), payload)
      } else {
        await testimonialsService.create(payload)
      }
      navigate('/admin/testimonials')
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
          {isEditing ? t('admin.form.editTestimonial') : t('admin.form.addTestimonial')}
        </h1>
        <p className="text-gray-500 text-small mt-1">
          {t('admin.sidebar.dashboard')} &gt; {t('admin.sidebar.testimonials')} &gt; {isEditing ? t('admin.breadcrumb.edit') : t('admin.breadcrumb.add')}
        </p>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-3xl"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-small font-medium text-gray-700 mb-2">{t('admin.labels.authorName')}</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder={t('admin.placeholders.authorNameEx')}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-small focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                required
              />
            </div>
            <div>
              <label className="block text-small font-medium text-gray-700 mb-2">{t('admin.labels.functionRole')}</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder={t('admin.placeholders.roleEx')}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-small focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-small font-medium text-gray-700 mb-2">{t('admin.labels.testimonial')}</label>
            <textarea
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={t('admin.placeholders.writeTestimonial')}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-small focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition resize-none"
              required
            />
          </div>
          <div>
            <label className="block text-small font-medium text-gray-700 mb-2">{t('admin.labels.photo')}</label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative flex items-center gap-3 px-4 py-3 rounded-lg border border-dashed border-gray-300 cursor-pointer hover:border-primary transition-colors"
            >
              {avatar ? (
                <>
                  <img src={avatar} alt="Avatar" className="w-10 h-10 rounded-full object-cover" />
                  <span className="text-small text-gray-600 truncate flex-1">{avatar.split('/').pop()}</span>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setAvatar('') }}
                    className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-red transition-colors"
                  >
                    <X size={16} />
                  </button>
                </>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                    <Upload size={16} />
                  </div>
                  <span className="text-small text-gray-500">{uploading ? t('admin.actions.uploading') : t('admin.placeholders.clickToAddPhoto')}</span>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-small font-medium text-gray-700 mb-2">{t('admin.table.rating')}</label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1"
                  >
                    <Star
                      size={22}
                      className={star <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-small font-medium text-gray-700 mb-2">{t('admin.table.status')}</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-small text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition cursor-pointer"
              >
                <option value="published">{t('admin.status.published')}</option>
                <option value="draft">{t('admin.status.draft')}</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={() => navigate('/admin/testimonials')}
            className="px-5 py-2.5 rounded-lg text-gray-600 font-medium text-small border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            {t('admin.actions.cancel')}
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-lg bg-primary text-white font-medium text-small hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {loading ? t('admin.actions.saving') : t('admin.actions.save')}
          </button>
        </div>
      </motion.form>
    </div>
  )
}

export default TestimonialsForm
