import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { type ElementType, useState, useEffect } from 'react'
import {
  Users, Leaf, TreePine, ShieldCheck, GraduationCap, Droplets,
  CheckCircle2, ChevronRight, ArrowRight, Handshake, Calendar
} from 'lucide-react'
import { publicStatsService } from '../services/stats'
import type { PublicStats } from '../services/stats'
import { publicPartnersService } from '../services/publicPartners'
import type { PublicPartner } from '../services/publicPartners'

// Page "Programmes" : domaines d'intervention, statistiques et bandeau de
// logos partenaires en défilement continu (CSS, pause au survol).

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
}

const iconMap: Record<string, ElementType> = {
  Users, Leaf, TreePine, ShieldCheck, GraduationCap, Droplets
}

const Programs = () => {
  const { t } = useTranslation()
  const [stats, setStats] = useState<PublicStats | null>(null)
  const [partners, setPartners] = useState<PublicPartner[]>([])
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    publicStatsService.get().then(setStats).catch(() => {})
    publicPartnersService.getAll().then(setPartners).catch(() => {})
  }, [])

  // Chiffres réels si l'API a répondu, sinon valeurs éditoriales de repli
  // (évite d'afficher des zéros pendant le chargement ou en cas d'erreur réseau)
  const statsData = stats
    ? [
        { value: stats.completedProjects, suffix: '+', label: t('home.stats.projects') },
        { value: stats.partners, suffix: '+', label: t('home.stats.partners') },
        { value: stats.testimonials, suffix: '+', label: t('admin.sidebar.testimonials') },
        { value: stats.events, suffix: '+', label: t('admin.sidebar.events') },
        { value: 18, label: t('home.stats.regions') },
      ]
    : [
        { value: 15, suffix: '+', label: t('home.stats.experience') },
        { value: 120, suffix: '+', label: t('home.stats.projects') },
        { value: 350, suffix: '+', label: t('home.stats.beneficiaries') },
        { value: 45, suffix: '+', label: t('home.stats.partners') },
        { value: 18, label: t('home.stats.regions') },
      ]

  const statIcons = [Users, ShieldCheck, Handshake, Calendar, Users]

  const domains = [
    {
      icon: 'Users',
      title: t('home.domains.governance.title'),
      description: t('home.domains.governance.desc'),
      points: [
        t('home.domains.governance.points.0'),
        t('home.domains.governance.points.1'),
        t('home.domains.governance.points.2'),
      ],
    },
    {
      icon: 'Leaf',
      title: t('home.domains.environment.title'),
      description: t('home.domains.environment.desc'),
      points: [
        t('home.domains.environment.points.0'),
        t('home.domains.environment.points.1'),
        t('home.domains.environment.points.2'),
      ],
    },
    {
      icon: 'TreePine',
      title: t('home.domains.rural.title'),
      description: t('home.domains.rural.desc'),
      points: [
        t('home.domains.rural.points.0'),
        t('home.domains.rural.points.1'),
        t('home.domains.rural.points.2'),
      ],
    },
    {
      icon: 'ShieldCheck',
      title: t('home.domains.disaster.title'),
      description: t('home.domains.disaster.desc'),
      points: [
        t('home.domains.disaster.points.0'),
        t('home.domains.disaster.points.1'),
        t('home.domains.disaster.points.2'),
      ],
    },
    {
      icon: 'GraduationCap',
      title: t('home.domains.education.title'),
      description: t('home.domains.education.desc'),
      points: [
        t('home.domains.education.points.0'),
        t('home.domains.education.points.1'),
        t('home.domains.education.points.2'),
      ],
    },
    {
      icon: 'Droplets',
      title: t('home.domains.water.title'),
      description: t('home.domains.water.desc'),
      points: [
        t('home.domains.water.points.0'),
        t('home.domains.water.points.1'),
        t('home.domains.water.points.2'),
      ],
    },
  ]

  return (
    <>
      {/* Hero */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/news/programsHero.png"
            alt={t('programs.hero.title')}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/45 to-black/20" />
        </div>
        <div className="relative container-custom text-white">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-section font-bold mb-4"
          >
            {t('programs.hero.title')}
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex items-center gap-2 text-gray-200 text-body mb-5"
          >
            <Link to="/" className="hover:text-primary-light transition-colors">{t('header.nav.home')}</Link>
            <ChevronRight size={16} />
            <span>{t('programs.hero.title')}</span>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-subtitle text-gray-200 max-w-2xl"
          >
            {t('programs.hero.subtitle')}
          </motion.p>
        </div>
      </section>

      {/* Domaines d'intervention */}
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
            <h2 className="section-title">{t('programs.domains.title')}</h2>
            <p className="section-subtitle">
              {t('programs.domains.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {domains.map((domain, index) => {
              const Icon = iconMap[domain.icon] || Users
              return (
                <motion.div
                  key={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                  variants={fadeUp}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="card p-8 group hover:shadow-2xl"
                >
                  <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center text-white mb-5">
                    <Icon size={26} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{domain.title}</h3>
                  <p className="text-body text-gray-600 leading-relaxed mb-5">{domain.description}</p>
                  <ul className="space-y-2.5 mb-6">
                    {domain.points.map((point, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-gray-600 text-body">
                        <CheckCircle2 size={18} className="text-primary shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/contact" className="text-primary font-semibold hover:text-primary-dark transition-colors inline-flex items-center gap-1.5">
                    {t('programs.domains.learnMore')} <ArrowRight size={16} />
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Statistiques */}
      <section className="pb-20">
        <div className="container-custom">
          <div className="bg-gray-50 rounded-card px-6 md:px-10 py-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {statsData.map((stat, index) => {
              const StatIcon = statIcons[index] || Users
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-3">
                    <StatIcon size={22} />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-gray-900">{stat.value}{stat.suffix || ''}</div>
                  <p className="text-gray-500 text-small">{stat.label}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Partenaires */}
      {partners.length > 0 && (
        <section className="pb-20">
          <div className="container-custom">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUp}
              transition={{ duration: 0.6 }}
              className="text-center mb-10"
            >
              <h2 className="section-title">{t('programs.partners.title')}</h2>
              <p className="section-subtitle">{t('programs.partners.subtitle')}</p>
            </motion.div>
            <div
              className="overflow-hidden"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {/* Liste dupliquée (partners + partners) pour créer une boucle infinie
                  visuellement continue avec l'animation CSS "partners-track" */}
              <div className={`flex gap-10 partners-track ${isPaused ? 'paused' : ''}`}>
                {[...partners, ...partners].map((partner, index) => (
                  <div
                    key={`${partner.id}-${index}`}
                    className="flex-none w-36 h-20 flex items-center justify-center bg-white rounded-xl border border-gray-100 p-3 hover:shadow-md transition-shadow"
                    title={partner.name}
                  >
                    {partner.logo ? (
                      <img
                        src={partner.logo}
                        alt={partner.name}
                        className="max-w-full max-h-full object-contain"
                      />
                    ) : (
                      <span className="text-gray-400 text-small font-medium text-center leading-tight">{partner.name}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Citation / CTA */}
      <section className="pb-20">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-card overflow-hidden bg-primary"
          >
            <div className="grid grid-cols-1 md:grid-cols-[40%_60%]">
              <div className="aspect-4/3 md:aspect-auto">
                <img
                  src="images/enfance.png"
                  alt={t('programs.cta.quote')}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="relative p-8 md:p-10 flex flex-col justify-center text-white">
                <Leaf size={64} className="absolute right-6 bottom-4 text-white/10 hidden md:block" />
                <span className="text-4xl text-primary-light font-serif mb-2">&ldquo;</span>
                <p className="text-xl md:text-2xl font-semibold leading-snug mb-6 max-w-md">
                  {t('programs.cta.quote')}
                </p>
                <Link
                  to="/contact"
                  className="bg-white text-primary px-7 py-3 rounded-full text-button font-semibold hover:bg-gray-100 transition-all duration-300 hover:shadow-lg inline-flex items-center gap-2 self-start"
                >
                  {t('programs.cta.button')} <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}

export default Programs
