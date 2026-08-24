import { useRef, useState, useEffect, type ElementType } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Users, Leaf, TreePine, ShieldCheck, GraduationCap, Droplets,
  ArrowRight, ArrowDown, TrendingUp, MapPin, ChevronLeft, ChevronRight
} from 'lucide-react'
import { publicStatsService } from '../services/stats'
import type { PublicStats } from '../services/stats'
import { publicProjectsService } from '../services/projects'
import type { PublicProject } from '../services/projects'
import { publicEventsService } from '../services/events'
import type { PublicEvent } from '../services/events'

// Page d'accueil du site public : hero, domaines clés, statistiques animées,
// carrousel des dernières réalisations et prochains événements. La plupart
// des données (stats, projets, événements) sont chargées depuis l'API au montage.

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
}

const iconMap: Record<string, ElementType> = {
  Users, Leaf, TreePine, ShieldCheck, GraduationCap, Droplets
}

const statIconMap: ElementType[] = [ArrowDown, TrendingUp, Users, MapPin, Users]

// Anime un chiffre de 0 jusqu'à `end` dès que le composant devient visible à
// l'écran (IntersectionObserver), une seule fois grâce à `counted`.
function CountUp({ end, duration, suffix }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const counted = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el || counted.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect()
          counted.current = true
          const dur = (duration ?? 2) * 1000
          const start = performance.now()
          const tick = (now: number) => {
            const t = Math.min((now - start) / dur, 1)
            setCount(Math.floor(t * end))
            if (t < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [end, duration])

  return <span ref={ref}>{count}{suffix ?? ''}</span>
}

// Convertit le nom de mois en français renvoyé par l'API (ex: "juin") en clé
// de traduction i18n, pour afficher le mois dans la langue courante du site
const monthKey = (m: string): string => {
  const map: Record<string, string> = {
    janvier: 'months.january', février: 'months.february', mars: 'months.march',
    avril: 'months.april', mai: 'months.may', juin: 'months.june',
    juillet: 'months.july', août: 'months.august', septembre: 'months.september',
    octobre: 'months.october', novembre: 'months.november', décembre: 'months.december',
  }
  return map[m.toLowerCase()] || m
}

const statusTranslation: Record<string, string> = {
  'À venir': 'events.filters.upcoming',
  'En cours': 'events.filters.ongoing',
  'Passé': 'events.filters.past',
}

const Home = () => {
  const { t, i18n } = useTranslation()
  const statsRef = useRef<HTMLDivElement | null>(null)
  const [statsInView, setStatsInView] = useState(false)
  const [activeSlide, setActiveSlide] = useState(0)
  const [realStats, setRealStats] = useState<PublicStats | null>(null)
  const [allProjects, setAllProjects] = useState<PublicProject[]>([])
  const [upcomingEvents, setUpcomingEvents] = useState<PublicEvent[]>([])
  const [loadingRealisations, setLoadingRealisations] = useState(true)
  const [loadingEvents, setLoadingEvents] = useState(true)

  useEffect(() => {
    publicStatsService.get()
      .then(setRealStats)
      .catch(() => console.error('Erreur chargement stats'))
  }, [i18n.language])

  // La section "Réalisations" mélange les projets terminés et en cours (sans
  // doublons), pour ne pas afficher une section vide tant qu'aucun projet
  // n'est encore marqué "completed"
  useEffect(() => {
    Promise.all([
      publicProjectsService.getCompleted(),
      publicProjectsService.getAll(),
    ])
      .then(([completed, all]) => {
        const ongoing = all.filter(p => p.status === 'ongoing' || p.status === 'en cours')
        const merged = [...completed]
        for (const p of ongoing) {
          if (!merged.some(m => m.id === p.id)) {
            merged.push(p)
          }
        }
        setAllProjects(merged)
        setLoadingRealisations(false)
      })
      .catch(() => { setLoadingRealisations(false); console.error('Erreur chargement réalisations') })
  }, [i18n.language])

  useEffect(() => {
    publicEventsService.getUpcoming()
      .then(data => { setUpcomingEvents(data); setLoadingEvents(false) })
      .catch(() => { setLoadingEvents(false); console.error('Erreur chargement événements') })
  }, [i18n.language])

  const projectsCount = realStats?.completedProjects ?? 0
  const partnersCount = realStats?.partners ?? 0
  const displayProjects = allProjects.slice(0, 6)

  // Certains chiffres viennent de l'API (projets/partenaires réels), d'autres
  // sont éditoriaux et codés en dur (années d'expérience, régions, bénéficiaires)
  const translatedStats = [
    { value: 15, suffix: '+', label: t('home.stats.experience') },
    { value: projectsCount, suffix: '+', label: t('home.stats.projects') },
    { value: partnersCount, suffix: '+', label: t('home.stats.partners') },
    { value: 18, label: t('home.stats.regions') },
    { value: 350, suffix: '+', label: t('home.stats.beneficiaries') },
  ]

  const featuredDomains = [
    { icon: 'Users', title: t('home.domains.governance.title'), description: t('home.domains.governance.desc') },
    { icon: 'Leaf', title: t('home.domains.environment.title'), description: t('home.domains.environment.desc') },
    { icon: 'ShieldCheck', title: t('home.domains.disaster.title'), description: t('home.domains.disaster.desc') },
  ]

  useEffect(() => {
    const el = statsRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setStatsInView(true)
            observer.disconnect()
          }
        })
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Navigation du carrousel de réalisations (Math.max évite une division par zéro si la liste est vide)
  const nextSlide = () => setActiveSlide((prev) => (prev + 1) % Math.max(displayProjects.length, 1))
  const prevSlide = () => setActiveSlide((prev) => (prev - 1 + Math.max(displayProjects.length, 1)) % Math.max(displayProjects.length, 1))

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-end overflow-hidden pb-28 md:pb-32">
        <div className="absolute inset-0">
          <img
            src="/images/hero1.png"
            alt={t('home.hero.tagline')}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/50 to-black/30" />
        </div>
        <div className="relative text-white px-4 sm:px-6 lg:px-8 max-w-6xl ml-0 lg:ml-12">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <p className="uppercase tracking-wider text-small md:text-body font-semibold text-gray-200 mb-4">
              {t('home.hero.tagline')}
            </p>
            <h1 className="text-4xl md:text-hero font-bold leading-tight mb-6">
              {t('home.hero.line1')} <br />
              {t('home.hero.line2')} <span className="text-primary-light">{t('home.hero.line3')}</span>
            </h1>
            <p className="text-subtitle md:text-2xl text-gray-200 mb-8 max-w-2xl">
              {t('home.hero.subtitle')}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/programs" className="btn-primary flex items-center gap-2">
                {t('home.hero.ctaPrimary')} <ArrowRight size={18} />
              </Link>
              <Link to="/contact" className="btn-outline">
                {t('home.hero.ctaSecondary')}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Carte flottante des domaines clés (chevauche le hero) */}
      <section className="relative z-10 -mt-16 md:-mt-20 px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          transition={{ duration: 0.6 }}
          className="container-custom"
        >
          <div className="bg-white rounded-2xl shadow-xl px-6 md:px-10 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredDomains.map((domain, index) => {
              const Icon = iconMap[domain.icon] || Users
              return (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Icon size={28} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{domain.title}</h3>
                    <p className="text-body text-gray-600 leading-relaxed">{domain.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>
      </section>

      {/* Statistiques */}
      <section className="pt-20 pb-16 bg-gray-50">
        <div className="container-custom">
          <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {translatedStats.map((stat, index) => {
              const StatIcon = statIconMap[index] || Users
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={statsInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-3">
                    <StatIcon size={22} />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">
                    {statsInView && (
                      <CountUp end={stat.value} duration={2.5} suffix={stat.suffix || ''} />
                    )}
                  </div>
                  <p className="text-gray-600 text-body">{stat.label}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Nos réalisations - Carrousel */}
      <section className="py-20">
        <div className="container-custom">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <h2 className="section-title">{t('home.realisations.title')}</h2>
            <p className="section-subtitle">{t('home.realisations.subtitle')}</p>
          </motion.div>

          {loadingRealisations ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          ) : displayProjects.length > 0 ? (
            <div className="relative">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                  {displayProjects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.1 }}
                      variants={fadeUp}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="card overflow-hidden group"
                    >
                      <div className="aspect-4/3 overflow-hidden">
                        <img
                          src={project.image ?? '/images/hero-event.png'}
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{project.title}</h3>
                        <p className="text-gray-600 text-body mb-3 line-clamp-3">{project.description}</p>
                        <div className="flex items-center gap-1.5 text-gray-500 text-small">
                          <MapPin size={14} />
                          <span>{project.location}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <button
                onClick={prevSlide}
                aria-label={t('carousel.prev')}
                className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 w-11 h-11 rounded-full bg-primary text-white items-center justify-center shadow-lg hover:bg-primary-dark transition-colors"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                onClick={nextSlide}
                aria-label={t('carousel.next')}
                className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 w-11 h-11 rounded-full bg-primary text-white items-center justify-center shadow-lg hover:bg-primary-dark transition-colors"
              >
                <ChevronRight size={22} />
              </button>
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">{t('home.realisations.empty')}</p>
          )}

          {displayProjects.length > 0 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              {displayProjects.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveSlide(index)}
                  aria-label={t('carousel.slide', { n: index + 1 })}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    index === activeSlide ? 'w-6 bg-red' : 'w-2.5 bg-gray-300'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Prochains événements */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <h2 className="section-title">{t('home.events.title')}</h2>
          </motion.div>

          {loadingEvents ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          ) : upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
              {upcomingEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                  variants={fadeUp}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="card overflow-hidden group flex flex-row"
                >
                  <div className="relative w-2/5 shrink-0 overflow-hidden">
                    <img
                      src={event.image ?? '/images/hero-event.png'}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-2 left-2 bg-white rounded-lg px-2 py-1.5 text-center shadow-md leading-none">
                      <div className="text-red font-bold text-sm">{event.day}</div>
                      <div className="text-gray-500 text-[9px] font-semibold tracking-wide">{t(monthKey(event.month ?? ''))}</div>
                    </div>
                  </div>
                  <div className="p-4 w-3/5 flex flex-col justify-center">
                    <span className="text-red text-xs font-semibold">{t(statusTranslation[event.status] ?? event.status)}</span>
                    <h3 className="text-sm font-semibold text-gray-900 mt-0.5 mb-1.5 leading-snug">{event.title}</h3>
                    <div className="flex items-center gap-1 text-gray-500 text-xs mb-2">
                      <MapPin size={12} className="text-primary-light shrink-0" />
                      <span>{event.location}</span>
                    </div>
                    <Link to={`/events/${event.id}`} className="text-primary font-semibold text-xs inline-flex items-center gap-1 hover:gap-2 transition-all">
                      {t('home.events.details')} <ArrowRight size={13} />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">{t('home.events.empty')}</p>
          )}

          <div className="text-center">
            <Link to="/events" className="btn-red inline-flex items-center gap-2">
              {t('home.events.all')}
            </Link>
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="py-16 bg-primary text-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-full border-2 border-primary-light/40 flex items-center justify-center shrink-0">
                <Leaf size={28} className="text-primary-light" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-1">{t('home.cta.title')}</h2>
                <p className="text-gray-300">{t('home.cta.text')}</p>
              </div>
            </div>
            <Link
              to="/contact"
              className="btn-primary flex items-center gap-2 whitespace-nowrap"
            >
              {t('home.cta.button')} <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  )
}

export default Home
