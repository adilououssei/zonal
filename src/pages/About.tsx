import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useState, useEffect, type ElementType } from 'react'
import {
  CheckCircle2, Eye, Star, Award, Leaf, Users, Handshake, MapPin,
  ChevronRight, ChevronLeft, Quote, ArrowRight
} from 'lucide-react'
import { teamMembers } from '../data/aboutData'
import { publicStatsService, type PublicStats } from '../services/stats'
import { publicTestimonialsService, type PublicTestimonial } from '../services/testimonials'
import Seo from '../components/Seo'

// Page "À propos" : présentation de l'ONG, statistiques, historique, équipe
// et carrousel de témoignages (auto-défilant).

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
}

const statIconMap: Record<string, ElementType> = { Award, Leaf, Users, Handshake, MapPin }

const About = () => {
  const { t, i18n } = useTranslation()
  const [realStats, setRealStats] = useState<PublicStats | null>(null)
  const [testimonials, setTestimonials] = useState<PublicTestimonial[]>([])
  const [activePair, setActivePair] = useState(0)
  const pairCount = Math.ceil(testimonials.length / 2)

  // Carrousel de l'équipe : 3 membres par slide (1 sur mobile), défilement auto
  const [teamPerPage, setTeamPerPage] = useState(() =>
    window.matchMedia('(min-width: 640px)').matches ? 3 : 1
  )
  const [teamPage, setTeamPage] = useState(0)
  const [teamPaused, setTeamPaused] = useState(false)

  useEffect(() => {
    publicStatsService.get().then(setRealStats).catch(() => {})
  }, [i18n.language])

  useEffect(() => {
    publicTestimonialsService.getAll()
      .then(data => {
        setTestimonials(data.filter(t => t.status === 'published'))
      })
      .catch(() => {})
  }, [i18n.language])

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 640px)')
    const update = () => {
      setTeamPerPage(mq.matches ? 3 : 1)
      setTeamPage(0)
    }
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const pages = Math.ceil(teamMembers.length / teamPerPage)
    if (teamPaused || pages < 2) return
    const timer = setInterval(() => setTeamPage((prev) => (prev + 1) % pages), 5000)
    return () => clearInterval(timer)
  }, [teamPerPage, teamPaused])

  // Défilement automatique du carrousel de témoignages toutes les 4s, désactivé
  // s'il y a moins de 3 témoignages (pas besoin de faire défiler 1 seule paire)
  useEffect(() => {
    if (testimonials.length < 3) return
    const timer = setInterval(() => {
      setActivePair((prev) => (prev + 1) % pairCount)
    }, 4000)
    return () => clearInterval(timer)
  }, [testimonials.length, pairCount])

  const dynamicStats = [
    { value: 6, label: t('about.stats.experience'), icon: 'Award' },
    { value: realStats?.completedProjects ?? 0, suffix: '+', label: t('about.stats.projects'), icon: 'Leaf' },
    { value: new Intl.NumberFormat(i18n.language).format(4.6), suffix: t('home.stats.millionSuffix'), label: t('about.stats.beneficiaries'), icon: 'Users' },
    { value: realStats?.partners ?? 0, suffix: '+', label: t('about.stats.partners'), icon: 'Handshake' },
    { value: 9, label: t('about.stats.regions'), icon: 'MapPin' },
  ]

  // teamMembers (data/aboutData.ts) contient photos et cadrage ; noms/rôles
  // sont traduits via i18n à partir de la clé de chaque membre
  const translatedTeam = teamMembers.map((m) => ({
    ...m,
    name: t(`about.teamMembers.${m.key}.name`),
    role: t(`about.teamMembers.${m.key}.role`),
  }))
  const teamPages: typeof translatedTeam[] = []
  for (let i = 0; i < translatedTeam.length; i += teamPerPage) {
    teamPages.push(translatedTeam.slice(i, i + teamPerPage))
  }
  const teamPageCount = teamPages.length
  const currentTeamPage = Math.min(teamPage, teamPageCount - 1)

  return (
    <>
      <Seo
        title="À propos de nous"
        description="Découvrez ZONAL, ONG développement durable au Tchad : notre mission, notre équipe et notre impact à N'Djamena et Moundou."
        keywords="ZONAL, ONG ZONAL, ONG développement durable Tchad, à propos, mission, équipe"
        path="/about"
      />
      {/* Hero */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/news/aboutHero.png"
            alt={t('about.hero.title')}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/40 to-black/20" />
        </div>
        <div className="relative container-custom text-white">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-section font-bold mb-4"
          >
            {t('about.hero.title')}
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex items-center gap-2 text-gray-200 text-body"
          >
            <Link to="/" className="hover:text-primary-light transition-colors">{t('header.nav.home')}</Link>
            <ChevronRight size={16} />
            <span>{t('about.hero.breadcrumb')}</span>
          </motion.div>
        </div>
      </section>

      {/* Qui sommes-nous */}
      <section className="py-20">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              transition={{ duration: 0.6 }}
            >
              <span className="text-red font-semibold text-small tracking-wide">{t('about.who.label')}</span>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-2 mb-5">
                {t('about.who.title')}
              </h2>
              <p className="text-body text-gray-600 leading-relaxed mb-8">
                {t('about.who.desc')}
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <CheckCircle2 size={22} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{t('about.who.missionTitle')}</h3>
                    <p className="text-gray-600 text-body leading-relaxed">
                      {t('about.who.missionDesc')}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Eye size={22} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{t('about.who.visionTitle')}</h3>
                    <p className="text-gray-600 text-body leading-relaxed">
                      {t('about.who.visionDesc')}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Star size={22} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{t('about.who.valuesTitle')}</h3>
                    <p className="text-gray-600 text-body leading-relaxed">
                      {t('about.who.valuesDesc')}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="rounded-card overflow-hidden shadow-xl mb-0">
                <img
                src="images/news/image.png"
                alt={t('about.who.title')}
                  className="w-full h-auto"
                />
              </div>
              <div className="bg-white border border-gray-100 rounded-b-card shadow-xl px-6 py-6">
                <div className="grid grid-cols-2 gap-6">
                  {dynamicStats.slice(0, 4).map((stat, index: number) => {
                    const Icon = statIconMap[stat.icon] || Users
                    return (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-primary shrink-0">
                          <Icon size={22} />
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-red leading-none">{stat.value}{stat.suffix || ''}</div>
                          <p className="text-gray-500 text-small mt-1">{stat.label}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="flex items-center gap-3 mt-6 justify-center">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-primary shrink-0">
                    <MapPin size={22} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red leading-none">{dynamicStats[4].value}</div>
                    <p className="text-gray-500 text-small mt-1">{dynamicStats[4].label}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Notre histoire */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              transition={{ duration: 0.6 }}
            >
              <div className="w-10 h-1 bg-red mb-4" />
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-5">{t('about.history.title')}</h2>
              <p className="text-body text-gray-600 leading-relaxed">
                {t('about.history.desc')}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-card overflow-hidden shadow-xl"
            >
              <img
                src="/images/ban2.jpg"
                alt={t('about.history.title')}
                className="w-full h-auto"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Notre équipe */}
      <section className="py-20">
        <div className="container-custom">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{t('about.team.title')}</h2>
            <p className="text-gray-600 text-body">{t('about.team.subtitle')}</p>
          </motion.div>

          <div
            className="relative"
            onMouseEnter={() => setTeamPaused(true)}
            onMouseLeave={() => setTeamPaused(false)}
          >
            <div className="overflow-hidden">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={`${teamPerPage}-${currentTeamPage}`}
                  initial={{ opacity: 0, x: 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -60 }}
                  transition={{ duration: 0.35 }}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-8"
                >
                  {teamPages[currentTeamPage]?.map((member) => (
                    <div key={member.key} className="flex flex-col items-center text-center">
                      <div className="w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden ring-4 ring-primary/15 shadow-md mb-5">
                        <img
                          src={member.image}
                          alt={member.name}
                          loading="lazy"
                          className="w-full h-full object-cover"
                          style={{ objectPosition: member.focus, transform: `scale(${member.zoom})`, transformOrigin: member.focus }}
                        />
                      </div>
                      <h3 className="font-semibold text-gray-900 text-lg">{member.name}</h3>
                      <p className="text-gray-500 text-small mt-1 max-w-xs">{member.role}</p>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            {teamPageCount > 1 && (
              <div className="flex items-center justify-center gap-4 mt-10">
                <button
                  type="button"
                  onClick={() => setTeamPage((currentTeamPage - 1 + teamPageCount) % teamPageCount)}
                  aria-label={t('carousel.prev')}
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <ChevronLeft size={18} />
                </button>
                <div className="flex gap-2">
                  {teamPages.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setTeamPage(i)}
                      aria-label={t('carousel.slide', { n: i + 1 })}
                      className={`h-2.5 rounded-full transition-all ${i === currentTeamPage ? 'w-8 bg-primary' : 'w-2.5 bg-gray-300'}`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setTeamPage((currentTeamPage + 1) % teamPageCount)}
                  aria-label={t('carousel.next')}
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Témoignages */}
      {testimonials.length > 0 && (
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
              <span className="text-red font-semibold text-small tracking-wide">{t('about.testimonials.label')}</span>
              <h2 className="section-title">{t('about.testimonials.title')}</h2>
              <p className="section-subtitle">{t('about.testimonials.subtitle')}</p>
            </motion.div>

            <div className="relative max-w-5xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePair}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.4 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  {[0, 1].map((offset) => {
                    const idx = activePair * 2 + offset
                    if (idx >= testimonials.length) return null
                    const t = testimonials[idx]
                    return (
                      <div key={t.id} className="bg-white rounded-xl shadow-md p-5 md:p-6 text-center flex flex-col justify-between">
                        <div>
                          <Quote size={24} className="text-primary/20 mx-auto mb-2" />
                          <p className="text-gray-700 text-body leading-relaxed italic line-clamp-4">
                            "{t.content}"
                          </p>
                        </div>
                        <div className="mt-4">
                          <div className="flex items-center justify-center gap-1 mb-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                size={14}
                                className={i < t.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}
                              />
                            ))}
                          </div>
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-100 shrink-0">
                              {t.avatar ? (
                                <img src={t.avatar} alt={t.author} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-primary font-bold text-sm">
                                  {t.author.charAt(0)}
                                </div>
                              )}
                            </div>
                            <div className="text-left">
                              <h4 className="font-semibold text-gray-900 text-xs">{t.author}</h4>
                              {t.role && (
                                <p className="text-gray-500 text-xs">{t.role}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </motion.div>
              </AnimatePresence>

              {testimonials.length > 2 && (
                <>
                  <button
                    onClick={() => setActivePair((prev) => (prev - 1 + pairCount) % pairCount)}
                    aria-label={t('carousel.prev')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 w-10 h-10 rounded-full bg-white shadow-md text-gray-600 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() => setActivePair((prev) => (prev + 1) % pairCount)}
                    aria-label={t('carousel.next')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 w-10 h-10 rounded-full bg-white shadow-md text-gray-600 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <ChevronRight size={20} />
                  </button>

                  <div className="flex items-center justify-center gap-2 mt-8">
                    {Array.from({ length: pairCount }).map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setActivePair(index)}
                        className={`h-2.5 rounded-full transition-all duration-300 ${
                          index === activePair ? 'w-6 bg-red' : 'w-2.5 bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
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
                <h2 className="text-2xl md:text-3xl font-bold mb-1">{t('about.cta.title')}</h2>
                <p className="text-gray-300">{t('about.cta.desc')}</p>
              </div>
            </div>
            <Link
              to="/contact"
              className="bg-white text-primary px-8 py-3.5 rounded-full text-button font-semibold hover:bg-gray-100 transition-all duration-300 hover:shadow-lg inline-flex items-center gap-2 whitespace-nowrap"
            >
              {t('about.cta.button')} <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  )
}

export default About
