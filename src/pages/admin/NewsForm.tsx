import { useState, useEffect, useRef, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../contexts/useAuth'
import {
  Image as ImageIcon, Bold, Italic, Underline, Link2, List, ListOrdered,
  AlignLeft, Quote, Plus, X, Loader2
} from 'lucide-react'
import { api } from '../../services/api'
import { newsService } from '../../services/news'
import CategorySelect from '../../components/ui/CategorySelect'

const newsCatKey = (cat: string) => {
  const map: Record<string, string> = {
    'Environnement': 'environment',
    'Éducation': 'education',
    'Eau & Assainissement': 'water',
    'Gestion des catastrophes': 'disaster',
    'Développement rural': 'rural',
    'Gouvernance locale': 'governance',
  }
  return `admin.categories.${map[cat] || cat}`
}

const NewsForm = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { id } = useParams()
  const { user } = useAuth()
  const isEditing = Boolean(id)

  const coverInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(isEditing)
  const [uploadingCover, setUploadingCover] = useState(false)
  const [uploadingGallery, setUploadingGallery] = useState(false)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [author, setAuthor] = useState(user ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() : '')
  const [gallery, setGallery] = useState<string[]>([])
  useEffect(() => {
    if (!id) return
    const fetchNews = async () => {
      try {
        const article = await newsService.getById(Number(id))
        setTitle(article.title)
        setExcerpt(article.excerpt ?? '')
        setContent(article.content ?? '')
        setCategory(article.category)
        setDate(article.date)
        setAuthor(article.author ?? '')
        setCoverPreview(article.coverImage)
        setGallery(article.gallery ?? [])
      } catch {
        console.error(t('admin.errors.loadError'))
        navigate('/admin/news')
      } finally {
        setFetching(false)
      }
    }
    fetchNews()
  }, [id, navigate])

  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingCover(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const result = await api.upload<{ url: string }>('/api/upload', formData)
      setCoverPreview(result.url)
    } catch {
      console.error(t('admin.errors.uploadError'))
    } finally {
      setUploadingCover(false)
    }
  }

  const handleGalleryChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    setUploadingGallery(true)
    try {
      const urls: string[] = []
      for (const file of Array.from(files)) {
        const formData = new FormData()
        formData.append('file', file)
        const result = await api.upload<{ url: string }>('/api/upload', formData)
        urls.push(result.url)
      }
      setGallery((prev) => [...prev, ...urls])
    } catch {
      console.error(t('admin.errors.uploadError'))
    } finally {
      setUploadingGallery(false)
      if (galleryInputRef.current) galleryInputRef.current.value = ''
    }
  }

  const removeFromGallery = (index: number) => {
    setGallery((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        title,
        excerpt: excerpt || undefined,
        content: content || undefined,
        category,
        date,
        author: author || undefined,
        coverImage: coverPreview || undefined,
        gallery: gallery.length > 0 ? gallery : undefined,
      }

      if (isEditing && id) {
        await newsService.update(Number(id), payload)
      } else {
        await newsService.create(payload as {
          title: string
          excerpt?: string
          content?: string
          date: string
          category: string
          author?: string
          coverImage?: string
          gallery?: string[]
        })
      }
      navigate('/admin/news')
    } catch {
      console.error(t('admin.errors.saveError'))
    } finally {
      setLoading(false)
    }
  }

  const contentRef = useRef<HTMLTextAreaElement>(null)

  const applyFormat = (prefix: string, suffix: string, fallback: string) => {
    const ta = contentRef.current
    if (!ta) return
    const start = ta.selectionStart
    const end = ta.selectionEnd
    const selected = content.substring(start, end)
    const before = content.substring(0, start)
    const after = content.substring(end)
    const wrapped = selected || fallback
    const newText = before + prefix + wrapped + suffix + after
    setContent(newText)
    requestAnimationFrame(() => {
      ta.focus()
      const pos = start + prefix.length + wrapped.length + suffix.length
      ta.setSelectionRange(pos, pos)
    })
  }

  const formatActions: { icon: typeof Bold; action: () => void }[] = [
    { icon: Bold, action: () => applyFormat('<b>', '</b>', t('admin.format.bold')) },
    { icon: Italic, action: () => applyFormat('<i>', '</i>', t('admin.format.italic')) },
    { icon: Underline, action: () => applyFormat('<u>', '</u>', t('admin.format.underline')) },
    { icon: Link2, action: () => applyFormat('<a href="', '">', t('admin.format.link')) },
    { icon: List, action: () => applyFormat('<ul>\n<li>', '</li>\n</ul>', t('admin.format.list')) },
    { icon: ListOrdered, action: () => applyFormat('<ol>\n<li>', '</ol>\n</li>', t('admin.format.orderedList')) },
    { icon: Quote, action: () => applyFormat('<blockquote>', '</blockquote>', t('admin.format.quote')) },
  ]

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
          {isEditing ? t('admin.pages.news.edit') : t('admin.actions.addArticle')}
        </h1>
        <p className="text-gray-500 text-small mt-1">
          {t('admin.dashboard.title')} &gt; {t('admin.sidebar.news')} &gt; {isEditing ? t('admin.actions.edit') : t('admin.actions.addArticle')}
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
              <label className="block text-small font-medium text-gray-700 mb-2">{t('admin.labels.coverImage')}</label>
              {coverPreview ? (
                <div className="relative rounded-xl overflow-hidden mb-2">
                  <img src={coverPreview} alt={t('admin.labels.preview')} className="w-full h-40 object-cover" />
                  <button
                    type="button"
                    onClick={() => { setCoverPreview(null); if (coverInputRef.current) coverInputRef.current.value = '' }}
                    className="absolute top-2 right-2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center text-gray-600 hover:text-red transition-colors text-lg"
                  >
                    &times;
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl py-10 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors overflow-hidden">
                  {uploadingCover ? (
                    <Loader2 size={24} className="animate-spin text-primary" />
                  ) : (
                    <>
                      <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                        <ImageIcon size={20} />
                      </div>
                      <span className="text-gray-500 text-small text-center">
                        {t('admin.placeholders.clickToUpload')}<br />{t('admin.placeholders.dragDropImage')}
                      </span>
                    </>
                  )}
                  <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverChange} disabled={uploadingCover} />
                </label>
              )}
            </div>

            <div>
              <label className="block text-small font-medium text-gray-700 mb-2">{t('admin.labels.articleTitle')}</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t('admin.placeholders.articleTitleExample')}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-small focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                required
              />
            </div>
            <div>
              <label className="block text-small font-medium text-gray-700 mb-2">{t('admin.labels.excerpt')}</label>
              <textarea
                rows={3}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder={t('admin.placeholders.excerpt')}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-small focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition resize-none"
              />
            </div>
            <div>
              <label className="block text-small font-medium text-gray-700 mb-2">{t('admin.labels.content')}</label>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="flex items-center gap-1 px-2 py-1.5 border-b border-gray-100 bg-gray-50/60">
                  {formatActions.map(({ icon: Icon, action }, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={action}
                      className="w-7 h-7 flex items-center justify-center rounded text-gray-500 hover:bg-gray-200 transition-colors"
                    >
                      <Icon size={14} />
                    </button>
                  ))}
                </div>
                <textarea
                  ref={contentRef}
                  rows={8}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={t('admin.placeholders.content')}
                  className="w-full px-4 py-3 text-small focus:outline-none resize-none"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <CategorySelect
              value={category}
              onChange={setCategory}
              options={['Environnement', 'Éducation', 'Eau & Assainissement', 'Gestion des catastrophes', 'Développement rural', 'Gouvernance locale']}
              optionKey={newsCatKey}
              required
            />

            <div>
              <label className="block text-small font-medium text-gray-700 mb-2">{t('admin.labels.publishDate')}</label>
              <div className="relative">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-small focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-small font-medium text-gray-700 mb-2">{t('admin.labels.author')}</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder={t('admin.placeholders.authorName')}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-small focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
              />
            </div>
            <div>
              <label className="block text-small font-medium text-gray-700 mb-2">{t('admin.labels.photoGallery')}</label>
              <label className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl py-6 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors text-primary font-medium text-small">
                {uploadingGallery ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Plus size={16} />
                )}
                {uploadingGallery ? t('admin.status.uploading') : t('admin.actions.addImage')}
                <input ref={galleryInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleGalleryChange} disabled={uploadingGallery} />
              </label>
              {gallery.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-3">
                  {gallery.map((src, i) => (
                    <div key={i} className="relative group">
                      <img src={src} alt={t('admin.labels.galleryImage', { index: i + 1 })} className="w-full aspect-square object-cover rounded-lg" />
                      <button
                        type="button"
                        onClick={() => removeFromGallery(i)}
                        className="absolute top-1 right-1 w-6 h-6 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={() => navigate('/admin/news')}
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

export default NewsForm
