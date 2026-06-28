import { useState, useEffect, useRef, type Dispatch, type FormEvent, type SetStateAction } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import {
  Image as ImageIcon, Bold, Italic, Underline, Link2, List, ListOrdered,
  AlignLeft, Quote, Plus, MapPin, X, Loader2
} from 'lucide-react'
import CategorySelect from '../../components/ui/CategorySelect'
import { api } from '../../services/api'
import { eventsService } from '../../services/events'

const eventCategories = ['Environnement', 'Éducation', 'Eau & Assainissement', 'Gestion des catastrophes', 'Développement rural', 'Gouvernance locale']

interface FormatAction {
  icon: React.ElementType
  prefix?: string
  suffix?: string
  fallbackKey?: string
}

const catKey = (cat: string) => {
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

const formatDescription = (
  descRef: { current: HTMLTextAreaElement | null },
  description: string,
  setDescription: Dispatch<SetStateAction<string>>,
  prefix: string,
  suffix: string,
  fallback: string,
) => {
  const ta = descRef.current
  if (!ta) return

  const start = ta.selectionStart
  const end = ta.selectionEnd
  const selected = description.substring(start, end)
  const before = description.substring(0, start)
  const after = description.substring(end)
  const wrapped = selected || fallback
  const newText = before + prefix + wrapped + suffix + after
  setDescription(newText)
  requestAnimationFrame(() => {
    ta.focus()
    const pos = start + prefix.length + wrapped.length + suffix.length
    ta.setSelectionRange(pos, pos)
  })
}

const EventForm = () => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = Boolean(id)

  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(isEditing)
  const computeStatusFromDate = (dateStr: string): string => {
    if (!dateStr) return 'À venir'
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const eventDate = new Date(dateStr + 'T00:00:00')
    if (eventDate < today) return 'Terminé'
    if (eventDate.getTime() === today.getTime()) return 'En cours'
    return 'À venir'
  }

  const coverInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [uploadingCover, setUploadingCover] = useState(false)
  const [uploadingGallery, setUploadingGallery] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [time, setTime] = useState('')
  const [location, setLocation] = useState('')
  const [status, setStatus] = useState('À venir')
  const [gallery, setGallery] = useState<string[]>([])
  const [category, setCategory] = useState('')

  useEffect(() => {
    if (!id) return
    const fetchEvent = async () => {
      try {
        const event = await eventsService.getById(Number(id))
        setTitle(event.title)
        setDescription(event.description ?? '')
        setDate(event.date)
        setTime(event.time ?? '')
        setLocation(event.location)
        setCoverPreview(event.coverImage)
        setGallery(event.gallery ?? [])
        setCategory(event.category ?? '')
        // Use the backend status, but also recompute from date
        setStatus(computeStatusFromDate(event.date))
      } catch {
        console.error(t('admin.errors.loadEvent'))
        navigate('/admin/events')
      } finally {
        setFetching(false)
      }
    }
    fetchEvent()
  }, [id, navigate, i18n.language, t])

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
      console.error(t('admin.errors.uploadCover'))
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
      console.error(t('admin.errors.uploadGallery'))
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
        description: description || undefined,
        date,
        time: time || undefined,
        location,
        status,
        coverImage: coverPreview || undefined,
        gallery: gallery.length > 0 ? gallery : undefined,
        category: category || undefined,
      }

      if (isEditing && id) {
        await eventsService.update(Number(id), payload)
      } else {
        await eventsService.create(payload as {
          title: string
          description?: string
          date: string
          time?: string
          location: string
          status?: string
          coverImage?: string
          gallery?: string[]
        })
      }
      navigate('/admin/events')
    } catch {
      console.error(t('admin.errors.saveEvent'))
    } finally {
      setLoading(false)
    }
  }

  const descRef = useRef<HTMLTextAreaElement>(null)

  const formatActions: FormatAction[] = [
    { icon: Bold, prefix: '<b>', suffix: '</b>', fallbackKey: 'admin.format.bold' },
    { icon: Italic, prefix: '<i>', suffix: '</i>', fallbackKey: 'admin.format.italic' },
    { icon: Underline, prefix: '<u>', suffix: '</u>', fallbackKey: 'admin.format.underline' },
    { icon: Link2, prefix: '<a href="', suffix: '">', fallbackKey: 'admin.format.link' },
    { icon: List, prefix: '<ul>\n<li>', suffix: '</li>\n</ul>', fallbackKey: 'admin.format.list' },
    { icon: ListOrdered, prefix: '<ol>\n<li>', suffix: '</li>\n</ol>', fallbackKey: 'admin.format.orderedList' },
    { icon: AlignLeft },
    { icon: Quote, prefix: '<blockquote>', suffix: '</blockquote>', fallbackKey: 'admin.format.quote' },
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
          {isEditing ? t('admin.form.editEvent') : t('admin.actions.addEvent')}
        </h1>
        <p className="text-gray-500 text-small mt-1">
          {t('admin.dashboard.title')} &gt; {t('admin.sidebar.events')} &gt; {isEditing ? t('admin.breadcrumb.edit') : t('admin.breadcrumb.add')}
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
                  <img src={coverPreview} alt={t('admin.alt.preview')} className="w-full h-40 object-cover" />
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
              <label className="block text-small font-medium text-gray-700 mb-2">{t('admin.labels.eventTitle')}</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t('admin.placeholders.eventTitle')}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-small focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                required
              />
            </div>
            <div>
              <label className="block text-small font-medium text-gray-700 mb-2">{t('admin.settings.description')}</label>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="flex items-center gap-1 px-2 py-1.5 border-b border-gray-100 bg-gray-50/60">
                  {formatActions.map(({ icon: Icon, prefix, suffix, fallbackKey }, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        if (!prefix || !suffix || !fallbackKey) return
                        formatDescription(descRef, description, setDescription, prefix, suffix, t(fallbackKey))
                      }}
                      className="w-7 h-7 flex items-center justify-center rounded text-gray-500 hover:bg-gray-200 transition-colors"
                    >
                      <Icon size={14} />
                    </button>
                  ))}
                </div>
                <textarea
                  ref={descRef}
                  rows={6}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t('admin.placeholders.eventDescription')}
                  className="w-full px-4 py-3 text-small focus:outline-none resize-none"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-small font-medium text-gray-700 mb-2">{t('admin.table.date')}</label>
              <div className="relative">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => { setDate(e.target.value); setStatus(computeStatusFromDate(e.target.value)) }}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-small focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-small font-medium text-gray-700 mb-2">{t('admin.labels.time')}</label>
              <div className="relative">
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-small focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-small font-medium text-gray-700 mb-2">{t('admin.table.location')}</label>
              <div className="relative">
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder={t('admin.placeholders.location')}
                  className="w-full px-4 py-2.5 pr-10 rounded-lg border border-gray-200 text-small focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                  required
                />
                <MapPin size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <CategorySelect
              value={category}
              onChange={setCategory}
              options={eventCategories}
              optionKey={catKey}
            />

            <div>
              <label className="block text-small font-medium text-gray-700 mb-2">{t('admin.table.status')}</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-small text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition cursor-pointer"
              >
                <option value="À venir">{t('admin.status.upcoming')}</option>
                <option value="En cours">{t('admin.status.ongoing')}</option>
                <option value="Terminé">{t('admin.status.completed')}</option>
              </select>
            </div>

            <div>
              <label className="block text-small font-medium text-gray-700 mb-2">{t('admin.labels.gallery')}</label>
              <label className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl py-6 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors text-primary font-medium text-small">
                {uploadingGallery ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Plus size={16} />
                )}
                {uploadingGallery ? t('admin.actions.uploading') : t('admin.actions.addImage')}
                <input ref={galleryInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleGalleryChange} disabled={uploadingGallery} />
              </label>
              {gallery.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-3">
                  {gallery.map((src, i) => (
                    <div key={i} className="relative group">
                      <img src={src} alt={t('admin.alt.gallery', { n: i + 1 })} className="w-full aspect-square object-cover rounded-lg" />
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
            onClick={() => navigate('/admin/events')}
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

export default EventForm
