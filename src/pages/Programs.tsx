import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { type ElementType } from 'react'
import {
  Users, Leaf, TreePine, ShieldCheck, GraduationCap, Droplets,
  CheckCircle2, ChevronRight, ArrowRight
} from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
}

const iconMap: Record<string, ElementType> = {
  Users, Leaf, TreePine, ShieldCheck, GraduationCap, Droplets
}

const Programs = () => {
  const { t } = useTranslation()

  const translatedStats = [
    { value: 15, suffix: '+', label: t('home.stats.experience') },
    { value: 120, suffix: '+', label: t('home.stats.projects') },
    { value: 350, suffix: '+', label: t('home.stats.beneficiaries') },
    { value: 45, suffix: '+', label: t('home.stats.partners') },
    { value: 18, label: t('home.stats.regions') },
  ]

  const domains = [
    {
      icon: 'Users',
      title: t('programs.domains.governance.title'),
      description: t('programs.domains.governance.description'),
      points: [
        t('programs.domains.governance.points.0'),
        t('programs.domains.governance.points.1'),
        t('programs.domains.governance.points.2'),
      ],
    },
    {
      icon: 'Leaf',
      title: t('programs.domains.environment.title'),
      description: t('programs.domains.environment.description'),
      points: [
        t('programs.domains.environment.points.0'),
        t('programs.domains.environment.points.1'),
        t('programs.domains.environment.points.2'),
      ],
    },
    {
      icon: 'TreePine',
      title: t('programs.domains.rural.title'),
      description: t('programs.domains.rural.description'),
      points: [
        t('programs.domains.rural.points.0'),
        t('programs.domains.rural.points.1'),
        t('programs.domains.rural.points.2'),
      ],
    },
    {
      icon: 'ShieldCheck',
      title: t('programs.domains.disaster.title'),
      description: t('programs.domains.disaster.description'),
      points: [
        t('programs.domains.disaster.points.0'),
        t('programs.domains.disaster.points.1'),
        t('programs.domains.disaster.points.2'),
      ],
    },
    {
      icon: 'GraduationCap',
      title: t('programs.domains.education.title'),
      description: t('programs.domains.education.description'),
      points: [
        t('programs.domains.education.points.0'),
        t('programs.domains.education.points.1'),
        t('programs.domains.education.points.2'),
      ],
    },
    {
      icon: 'Droplets',
      title: t('programs.domains.water.title'),
      description: t('programs.domains.water.description'),
      points: [
        t('programs.domains.water.points.0'),
        t('programs.domains.water.points.1'),
        t('programs.domains.water.points.2'),
      ],
    },
  ]

  return (
    <>
      {/* Hero */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1920&h=600&fit=crop"
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
            {translatedStats.map((stat, index) => {
              const StatIcon = [Users, Leaf, ShieldCheck, Users, Users][index] || Users
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

      {/* Citation / CTA */}
      <section className="pb-20">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-card overflow-hidden bg-primary-dark"
          >
            <div className="grid grid-cols-1 md:grid-cols-[40%_60%]">
              <div className="aspect-4/3 md:aspect-auto">
                <img
                  src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=700&h=600&fit=crop"
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
