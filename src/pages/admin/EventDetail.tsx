import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import {
  Calendar, MapPin, Clock, ArrowLeft, Edit, Trash2,
} from 'lucide-react'
import { eventsService } from '../../services/events'
import type { AdminEvent } from '../../services/events'
import { sanitizeHtml } from '../../lib/sanitize'

const statusStyles: Record<string, string> = {
  'À venir': 'bg-emerald-100 text-emerald-700',
  'En cours': 'bg-blue-100 text-blue-700',
  'Terminé': 'bg-gray-100 text-gray-500',
}

const EventDetail = () => {
  const { t } = useTranslation()
  const monthNames = [
    t('months.january'), t('months.february'), t('months.march'), t('months.april'), t('months.may'), t('months.june'),
    t('months.july'), t('months.august'), t('months.september'), t('months.october'), t('months.november'), t('months.december'),
  ]
  const { id } = useParams()
  const navigate = useNavigate()
  const [event, setEvent] = useState<AdminEvent | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    const fetchEvent = async () => {
      try {
        const data = await eventsService.getById(Number(id))
        setEvent(data)
      } catch {
        console.error(t('admin.errors.loadEvent'))
        navigate('/admin/events')
      } finally {
        setLoading(false)
      }
    }
    fetchEvent()
  }, [id, navigate, t])

  const handleDelete = async () => {
    if (!confirm(t('admin.confirm.deleteEvent'))) return
    try {
      await eventsService.delete(Number(id))
      navigate('/admin/events')
    } catch {
      console.error(t('admin.errors.deleteEvent'))
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!event) {
    return (
      <div className="text-center py-20 text-gray-500">{t('admin.detail.notFound')}</div>
    )
  }

  const eventDate = new Date(event.date + 'T00:00:00')

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link to="/admin/events" className="inline-flex items-center gap-1.5 text-gray-500 hover:text-primary transition-colors text-small mb-2">
            <ArrowLeft size={16} />
            {t('admin.detail.backToEvents')}
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{event.title}</h1>
          <p className="text-gray-500 text-small mt-1">{t('admin.dashboard.title')} &gt; {t('admin.sidebar.events')} &gt; {t('admin.pages.eventsDetails')}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to={`/admin/events/${event.id}/edit`}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-white font-medium text-small hover:bg-primary-dark transition-colors"
          >
            <Edit size={16} />
            {t('admin.actions.edit')}
          </Link>
          <button
            onClick={handleDelete}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-red text-red font-medium text-small hover:bg-red/10 transition-colors"
          >
            <Trash2 size={16} />
            {t('admin.actions.delete')}
          </button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
      >
        {/* Cover */}
        {event.coverImage && (
          <div className="aspect-video w-full overflow-hidden">
            <img src={event.coverImage} alt={event.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main info */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">{t('admin.settings.description')}</h2>
                  {event.description ? (
                  <div className="text-gray-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: sanitizeHtml(event.description) }} />
                ) : (
                  <p className="text-gray-400 italic">{t('admin.detail.noDescription')}</p>
                )}
              </div>

              {event.gallery && event.gallery.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">{t('admin.labels.gallery')}</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {event.gallery.map((src, i) => (
                      <div key={i} className="aspect-video rounded-lg overflow-hidden">
                        <img src={src} alt={t('admin.detail.photo', { n: i + 1 })} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{t('admin.table.status')}</label>
                  <div className="mt-1">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold ${statusStyles[event.status] ?? 'bg-gray-100 text-gray-500'}`}>
                      {event.status}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{t('admin.table.date')}</label>
                  <p className="flex items-center gap-1.5 text-gray-800 text-small mt-1">
                    <Calendar size={14} className="text-primary" />
                    {eventDate.getDate()} {monthNames[eventDate.getMonth()]} {eventDate.getFullYear()}
                  </p>
                </div>
                {event.time && (
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{t('admin.labels.time')}</label>
                    <p className="flex items-center gap-1.5 text-gray-800 text-small mt-1">
                      <Clock size={14} className="text-primary" />
                      {event.time}
                    </p>
                  </div>
                )}
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{t('admin.table.location')}</label>
                  <p className="flex items-center gap-1.5 text-gray-800 text-small mt-1">
                    <MapPin size={14} className="text-primary" />
                    {event.location}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default EventDetail
