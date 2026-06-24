import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { type ElementType } from 'react'
import {
  CheckCircle2, Eye, Star, Award, Leaf, Users, Handshake, MapPin,
  ChevronRight, Mail, ArrowRight
} from 'lucide-react'
import { aboutStats, teamMembers } from '../data/aboutData'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
}

const statIconMap: Record<string, ElementType> = { Award, Leaf, Users, Handshake, MapPin }

const About = () => {
  const { t } = useTranslation()

  const translatedStats = aboutStats.map((s) => ({
    ...s,
    label: (() => {
      const map: Record<string, string> = {
        "Années d'expérience": t('about.stats.experience'),
        'Projets réalisés': t('about.stats.projects'),
        'Bénéficiaires': t('about.stats.beneficiaries'),
        'Partenaires': t('about.stats.partners'),
        'Régions couvertes': t('about.stats.regions'),
      }
      return map[s.label] || s.label
    })(),
  }))

  const teamMemberKeys = ['mahamat', 'fatime', 'abakar', 'aissatou']
  const translatedTeam = teamMembers.map((m, i) => ({
    ...m,
    name: t(`about.teamMembers.${teamMemberKeys[i]}.name`),
    role: t(`about.teamMembers.${teamMemberKeys[i]}.role`),
  }))

  return (
    <>
      {/* Hero */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/hero-about.png"
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
                src="images/photo-plante.jpeg"
                alt={t('about.who.title')}
                  className="w-full h-auto"
                />
              </div>
              <div className="bg-white border border-gray-100 rounded-b-card shadow-xl px-6 py-6">
                <div className="grid grid-cols-2 gap-6">
                  {translatedStats.slice(0, 4).map((stat: (typeof translatedStats)[number], index: number) => {
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
                    <div className="text-2xl font-bold text-red leading-none">{translatedStats[4].value}</div>
                    <p className="text-gray-500 text-small mt-1">{translatedStats[4].label}</p>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {translatedTeam.map((member, index: number) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                variants={fadeUp}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card overflow-hidden text-center"
              >
                <div className="aspect-4/5 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
            className="w-full h-full object-scale-down"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-gray-900">{member.name}</h3>
                  <p className="text-gray-500 text-small mb-3">{member.role}</p>
                  <div className="flex items-center justify-center gap-2">
                    <a href="#" aria-label={t('social.facebook')} className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                      <img src="/images/icons/facebook.png" alt={t('social.facebook')} className="w-4 h-4" />
                    </a>
                    <a href="#" aria-label={t('social.linkedin')} className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                      <img src="/images/icons/linkedin.png" alt={t('social.linkedin')} className="w-4 h-4" />
                    </a>
                    <a href="#" aria-label={t('social.email')} className="w-8 h-8 rounded-full bg-red/10 text-red flex items-center justify-center hover:bg-red hover:text-white transition-colors">
                      <Mail size={15} />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

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
