import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  Calendar, MapPin, Clock, ArrowLeft, ArrowRight, ChevronRight,
} from 'lucide-react'
import { publicEventsService } from '../services/events'
import type { PublicEvent } from '../services/events'
import { sanitizeHtml } from '../lib/sanitize'

const statusStyles: Record<string, string> = {
  'À venir': 'bg-emerald-100 text-emerald-700',
  'En cours': 'bg-blue-100 text-blue-700',
  'Terminé': 'bg-gray-100 text-gray-500',
}

const EventDetail = () => {
  const { t, i18n } = useTranslation()
  const { id } = useParams()
  const [event, setEvent] = useState<PublicEvent | null>(null)
  const [loading, setLoading] = useState(true)
  const [relatedEvents, setRelatedEvents] = useState<PublicEvent[]>([])

  useEffect(() => {
    if (!id) return
    const fetchEvent = async () => {
      try {
        const data = await publicEventsService.getById(Number(id))
        setEvent(data)
        const all = await publicEventsService.getAll()
        const related = all.filter((e) => e.id !== data.id && e.category === data.category)
        setRelatedEvents(related.slice(0, 3))
      } catch {
        console.error('Erreur lors du chargement de l\'événement')
      } finally {
        setLoading(false)
      }
    }
    fetchEvent()
  }, [id, i18n.language])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!event) {
    return (
      <div className="container-custom py-20 text-center">
        <p className="text-gray-500 text-lg">{t('events.notFound')}</p>
        <Link to="/events" className="text-primary font-medium mt-4 inline-block">&larr; {t('events.backToEvents')}</Link>
      </div>
    )
  }

  const eventDate = new Date(event.date + 'T00:00:00')

  return (
    <>
      {/* Hero */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={event.image ?? '/images/hero-event.png'}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-r from-black/75 via-black/50 to-black/25" />
        </div>
        <div className="relative container-custom text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link to="/events" className="inline-flex items-center gap-1.5 text-gray-200 hover:text-primary-light transition-colors mb-4 text-body">
              <ArrowLeft size={16} />
              {t('events.backToEvents')}
            </Link>
            <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide mb-4 ${statusStyles[event.status] ?? 'bg-gray-100 text-gray-500'}`}>
              {event.status}
            </span>
            <h1 className="text-3xl md:text-section font-bold mb-4">{event.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-gray-200 text-body">
              <span className="flex items-center gap-1.5">
                <Calendar size={16} />
                {eventDate.getDate()} {t('months.' + ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'][eventDate.getMonth()])} {eventDate.getFullYear()}
              </span>
              {event.time && (
                <span className="flex items-center gap-1.5">
                  <Clock size={16} />
                  {event.time}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <MapPin size={16} />
                {event.location}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-14">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="prose prose-lg max-w-none"
            >
              {event.description ? (
                <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: sanitizeHtml(event.description) }} />
              ) : (
                <p className="text-gray-400 italic">{t('events.noDescription')}</p>
              )}
            </motion.div>

            {/* Gallery */}
            {event.gallery && event.gallery.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-12"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-6">{t('events.galleryTitle')}</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {event.gallery.map((src, i) => (
                    <div key={i} className="aspect-video rounded-xl overflow-hidden">
                      <img src={src} alt={t('admin.labels.photoN', { n: i + 1 })} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Related events */}
            {relatedEvents.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="mt-16"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-6">{t('events.relatedTitle')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedEvents.map((related) => {
                    const d = new Date(related.date + 'T00:00:00')
                    return (
                      <Link key={related.id} to={`/events/${related.id}`} className="card group overflow-hidden">
                        <div className="relative aspect-4/3 overflow-hidden">
                          <img src={related.image ?? ''} alt={related.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                          <div className="absolute top-3 left-3 bg-white rounded-lg px-2.5 py-1.5 text-center shadow-md leading-none">
                            <div className="text-red font-bold text-lg">{d.getDate()}</div>
                            <div className="text-gray-500 text-[10px] font-semibold tracking-wide">{t('months.' + ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'][d.getMonth()])}</div>
                          </div>
                        </div>
                        <div className="p-4">
                          <span className="inline-block bg-primary text-white text-[10px] font-semibold tracking-wide px-2.5 py-0.5 rounded-full mb-2">{related.status}</span>
                          <h3 className="text-sm font-semibold text-gray-900 leading-snug mb-2 line-clamp-2">{related.title}</h3>
                          <span className="text-primary text-small font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                            {t('events.details')} <ArrowRight size={14} />
                          </span>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {/* Back link */}
            <div className="mt-12 text-center">
              <Link
                to="/events"
                className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
              >
                <ArrowLeft size={16} />
                {t('events.backToAll')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <section className="pb-10">
        <div className="container-custom">
          <div className="flex items-center gap-2 text-gray-500 text-small">
            <Link to="/" className="hover:text-primary transition-colors">{t('header.nav.home')}</Link>
            <ChevronRight size={14} />
            <Link to="/events" className="hover:text-primary transition-colors">{t('header.nav.events')}</Link>
            <ChevronRight size={14} />
            <span className="text-gray-800">{event.title}</span>
          </div>
        </div>
      </section>
    </>
  )
}

export default EventDetail
