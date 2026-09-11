import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Calendar, Hourglass, CalendarCheck, MapPin, Clock, ArrowRight,
  ChevronRight, ChevronLeft, Mail, Send
} from 'lucide-react'
import { publicEventsService } from '../services/events'
import type { PublicEvent } from '../services/events'
import { subscribeToNewsletter } from '../services/newsletter'
import Seo from '../components/Seo'

// Page "Événements" : liste filtrable par statut, bande d'événements passés
// défilable horizontalement, et formulaire d'inscription à la newsletter.
type EventStatus = 'Tous' | 'À venir' | 'En cours' | 'Passé'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
}

// Retire les balises HTML de la description et la tronque pour l'aperçu en carte
const getExcerpt = (html: string | null, maxLength = 150): string => {
  if (!html) return ''
  const text = html.replace(/<[^>]*>/g, '')
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trimEnd() + '...'
}

const statusKey = (s: string): string => {
  const map: Record<string, string> = {
    Tous: 'events.filters.all',
    'À venir': 'events.filters.upcoming',
    'En cours': 'events.filters.ongoing',
    Passé: 'events.filters.past',
    Terminé: 'events.filters.past',
  }
  return map[s] ?? 'events.filters.all'
}

const monthKey = (m: string): string => {
  const map: Record<string, string> = {
    juin: 'months.june',
    'avr.': 'months.april',
    mars: 'months.march',
    'fév.': 'months.february',
  }
  return map[m.toLowerCase().trim()] || m
}

const filters: { value: EventStatus; icon: typeof Calendar }[] = [
  { value: 'Tous', icon: Calendar },
  { value: 'À venir', icon: Calendar },
  { value: 'En cours', icon: Hourglass },
  { value: 'Passé', icon: CalendarCheck },
]

const Events = () => {
  const { t, i18n } = useTranslation()
  const [activeFilter, setActiveFilter] = useState<EventStatus>('Tous')
  const [allEvents, setAllEvents] = useState<PublicEvent[]>([])
  const [pastEvents, setPastEvents] = useState<PublicEvent[]>([])
  const [loading, setLoading] = useState(true)
  const pastScrollRef = useRef<HTMLDivElement>(null)
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [newsletterMessage, setNewsletterMessage] = useState('')

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const [allData, pastData] = await Promise.all([
          publicEventsService.getAll(),
          publicEventsService.getPast(),
        ])
        setAllEvents(allData)
        setPastEvents(pastData)
      } catch {
        console.error('Erreur lors du chargement des événements')
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [i18n.language])

  const visibleEvents = allEvents.filter((e) => {
    if (activeFilter === 'Tous') return true
    if (activeFilter === 'À venir') return e.status === 'À venir'
    if (activeFilter === 'En cours') return e.status === 'En cours'
    if (activeFilter === 'Passé') return e.status === 'Terminé'
    return true
  })

  // Fait défiler la bande d'événements passés d'une "carte" à la fois (largeur ~340px)
  const scrollPast = (dir: 'left' | 'right') => {
    const el = pastScrollRef.current
    if (!el) return
    el.scrollBy({ left: dir === 'left' ? -340 : 340, behavior: 'smooth' })
  }

  return (
    <>
      <Seo
        title="Événements"
        description="Retrouvez les événements organisés par ZONAL, ONG développement durable au Tchad : formations, ateliers et conférences à N'Djamena et Moundou."
        keywords="ZONAL, ONG développement durable Tchad, événements, formation, atelier"
        path="/events"
      />
      {/* Hero */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/news/eventHero.png"
            alt={t('events.hero.title')}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-r from-black/75 via-black/50 to-black/25" />
        </div>
        <div className="relative container-custom text-white">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-section font-bold mb-4"
          >
            {t('events.hero.title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-subtitle text-gray-200 max-w-2xl mb-5"
          >
            {t('events.hero.subtitle')}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="flex items-center gap-2 text-gray-200 text-body"
          >
            <Link to="/" className="hover:text-primary-light transition-colors">{t('header.nav.home')}</Link>
            <ChevronRight size={16} />
            <span className="text-primary-light">{t('events.hero.title')}</span>
          </motion.div>
        </div>
      </section>

      {/* Filtres */}
      <section className="pt-14">
        <div className="container-custom">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {filters.map(({ value, icon: Icon }) => (
              <button
                key={value}
                onClick={() => setActiveFilter(value)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium text-body border transition-all duration-300 ${
                  activeFilter === value
                    ? 'bg-primary text-white border-primary shadow-md'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary'
                }`}
              >
                <Icon size={18} />
                {t(statusKey(value))}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-14">
        <div className="container-custom">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {loading ? (
                <div className="col-span-3 flex items-center justify-center py-20">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
                </div>
              ) : visibleEvents.length > 0 ? (
                visibleEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    variants={fadeUp}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="card overflow-hidden group"
                  >
                    <div className="relative aspect-4/3 overflow-hidden">
                      <img
                        src={event.image ?? ''}
                        alt={event.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-4 left-4 bg-white rounded-lg px-3 py-2 text-center shadow-md leading-none">
                        <div className="text-red font-bold text-xl">{event.day}</div>
                        <div className="text-gray-500 text-[11px] font-semibold tracking-wide">{t(monthKey(event.month ?? ''))}</div>
                        <div className="text-gray-400 text-[10px]">{event.year}</div>
                      </div>
                    </div>
                    <div className="p-6">
                      <span className="inline-block bg-primary text-white text-[11px] font-semibold tracking-wide px-3 py-1 rounded-full mb-3">
                        {t(statusKey(event.status)).toUpperCase()}
                      </span>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 leading-snug">{event.title}</h3>
                      <div className="flex items-center gap-2 text-gray-500 text-small mb-1.5">
                        <MapPin size={16} className="text-primary shrink-0" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500 text-small mb-3">
                        <Clock size={16} className="text-primary shrink-0" />
                        <span>{event.time}</span>
                      </div>
                      <p className="text-gray-600 text-body mb-4">{getExcerpt(event.description)}</p>
                      <Link to={`/events/${event.id}`} className="text-primary font-semibold text-body inline-flex items-center gap-1.5 hover:gap-2.5 transition-all">
                        {t('events.details')} <ArrowRight size={16} />
                      </Link>
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="col-span-3 text-center text-gray-500 py-10">
                  {t('events.empty')}
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Événements passés */}
      <section className="pb-20">
        <div className="container-custom">
          <div className="bg-gray-50 rounded-card p-6 md:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-[28%_72%] gap-8 items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">{t('events.pastSection.title')}</h2>
                <p className="text-gray-600 text-body mb-5 leading-relaxed">
                  {t('events.pastSection.desc')}
                </p>
                <Link
                  to="/events"
                  className="border border-primary text-primary px-5 py-2.5 rounded-lg text-body font-medium hover:bg-primary hover:text-white transition-all duration-300 inline-flex items-center gap-2"
                >
                  {t('events.allPast')} <ArrowRight size={16} />
                </Link>
              </div>

              <div className="relative">
                <div
                  ref={pastScrollRef}
                  className="flex gap-5 overflow-x-auto scroll-smooth scrollbar-hide pb-1"
                  style={{ scrollbarWidth: 'none' }}
                >
                  {pastEvents.map((event) => (
                    <div key={event.id} className="shrink-0 w-64">
                      <div className="relative aspect-4/3 rounded-xl overflow-hidden mb-3">
                        <img src={event.image ?? ''} alt={event.title} className="w-full h-full object-cover" />
                        <div className="absolute top-3 left-3 bg-white rounded-md px-2.5 py-1.5 text-center shadow-md leading-none">
                          <div className="text-red font-bold text-base">{event.day}</div>
                          <div className="text-gray-500 text-[10px] font-semibold tracking-wide">{t(monthKey(event.month ?? ''))}</div>
                          <div className="text-gray-400 text-[9px]">{event.year}</div>
                        </div>
                      </div>
                      <h3 className="font-semibold text-gray-900 text-body leading-snug mb-1">{event.title}</h3>
                      <p className="text-gray-500 text-small">{event.location}</p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => scrollPast('left')}
                  aria-label={t('carousel.prev')}
                  className="hidden md:flex absolute left-0 top-1/3 -translate-y-1/2 -translate-x-5 w-10 h-10 rounded-full bg-primary text-white items-center justify-center shadow-lg hover:bg-primary-dark transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => scrollPast('right')}
                  aria-label={t('carousel.next')}
                  className="hidden md:flex absolute right-0 top-1/3 -translate-y-1/2 translate-x-5 w-10 h-10 rounded-full bg-primary text-white items-center justify-center shadow-lg hover:bg-primary-dark transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="pb-20">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white border border-gray-100 rounded-card shadow-sm p-6 md:p-8 flex flex-col md:flex-row items-center gap-6"
          >
            <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-white shrink-0">
              <Mail size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1">{t('events.newsletter.title')}</h3>
              <p className="text-gray-600 text-body">
                {t('events.newsletter.desc')}
              </p>
            </div>
            <form className="flex flex-wrap w-full md:w-auto gap-3" onSubmit={async (e) => {
              e.preventDefault()
              if (!newsletterEmail) return
              setNewsletterStatus('loading')
              try {
                const res = await subscribeToNewsletter(newsletterEmail)
                setNewsletterMessage(res.message)
                setNewsletterStatus('success')
                setNewsletterEmail('')
              } catch (err) {
                    setNewsletterMessage(err instanceof Error ? err.message : t('errors.subscription'))
                setNewsletterStatus('error')
              }
            }}>
              <input
                type="email"
                placeholder={t('events.newsletter.placeholder')}
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="flex-1 md:w-64 px-5 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-body"
              />
              <button
                type="submit"
                disabled={newsletterStatus === 'loading'}
                className="btn-primary flex items-center gap-2 whitespace-nowrap disabled:opacity-60"
              >
                {newsletterStatus === 'loading' ? (
                  <>{t('common.loading')}...</>
                ) : (
                  <>{t('events.newsletter.button')} <Send size={16} /></>
                )}
              </button>
              {newsletterMessage && (
                <p className={`text-sm w-full md:w-auto ${newsletterStatus === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                  {newsletterMessage}
                </p>
              )}
            </form>
          </motion.div>
        </div>
      </section>
    </>
  )
}

export default Events
