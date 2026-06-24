import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  MapPin, Phone, Mail, MessageCircle, Clock,
  ChevronRight, Send, Headset, Handshake, Users
} from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
}

const Contact = () => {
  const { t } = useTranslation()
  const [submitted, setSubmitted] = useState(false)

  const contactCards = [
    {
      icon: MapPin,
      title: t('contact.cards.address.title'),
      lines: [t('contact.cards.address.lines.0'), t('contact.cards.address.lines.1')],
    },
    {
      icon: Phone,
      title: t('contact.cards.phone.title'),
      lines: [t('contact.cards.phone.lines.0')],
    },
    {
      icon: Mail,
      title: t('contact.cards.email.title'),
      lines: [t('contact.cards.email.lines.0')],
      accent: true,
    },
    {
      icon: MessageCircle,
      title: t('contact.cards.whatsapp.title'),
      lines: [t('contact.cards.whatsapp.lines.0'), t('contact.cards.whatsapp.lines.1')],
      button: t('contact.cards.whatsapp.button'),
    },
    {
      icon: Clock,
      title: t('contact.cards.hours.title'),
      lines: [t('contact.cards.hours.lines.0'), t('contact.cards.hours.lines.1'), t('contact.cards.hours.lines.2')],
    },
  ]

  const supportCards = [
    {
      icon: Headset,
      title: t('contact.support.support.title'),
      description: t('contact.support.support.desc'),
    },
    {
      icon: Handshake,
      title: t('contact.support.partnership.title'),
      description: t('contact.support.partnership.desc'),
    },
    {
      icon: Users,
      title: t('contact.support.volunteer.title'),
      description: t('contact.support.volunteer.desc'),
    },
  ]

  const socialLinks = [
    { icon: 'facebook', label: t('social.facebook'), bg: 'bg-[#1877F2]' },
    { icon: 'linkedin', label: t('social.linkedin'), bg: 'bg-[#0A66C2]' },
    { icon: 'youtube', label: t('social.youtube'), bg: 'bg-[#FF0000]' },
    { icon: 'whatsapp', label: t('social.whatsapp'), bg: 'bg-[#25D366]' },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <>
      {/* Hero */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="images/hero.png"
            alt={t('contact.hero.title')}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-r from-black/75 via-black/45 to-black/15" />
        </div>
        <div className="relative container-custom text-white">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-section font-bold mb-4"
          >
            {t('contact.hero.title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-subtitle text-gray-200 max-w-2xl mb-5"
          >
            {t('contact.hero.subtitle')}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="flex items-center gap-2 text-gray-200 text-body"
          >
            <Link to="/" className="hover:text-primary-light transition-colors">{t('header.nav.home')}</Link>
            <ChevronRight size={16} />
            <span className="text-primary-light">{t('contact.hero.title')}</span>
          </motion.div>
        </div>
      </section>

      {/* Restons en contact */}
      <section className="py-20">
        <div className="container-custom">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            transition={{ duration: 0.6 }}
            className="flex items-start gap-4 mb-12"
          >
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white shrink-0">
              <Phone size={22} />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{t('contact.section.title')}</h2>
              <p className="text-gray-600 text-body leading-relaxed max-w-2xl">
                {t('contact.section.desc')}
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr_1.2fr] gap-8">
            {/* Contact Info Cards */}
            <div className="space-y-6">
              {contactCards.map((item, index) => (
                <motion.div
                  key={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-11 h-11 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0">
                    <item.icon size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                    {item.lines.map((line, i) => (
                      <p key={i} className={`text-body ${item.accent ? 'text-red' : 'text-gray-600'}`}>
                        {line}
                      </p>
                    ))}
                    {item.button && (
                      <a
                        href="https://wa.me/23566200620"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-2 bg-primary text-white px-4 py-2 rounded-lg text-small font-medium hover:bg-primary-dark transition-colors"
                      >
                        {item.button}
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Form */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              transition={{ duration: 0.6 }}
              className="card p-6 md:p-8"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-1">{t('contact.form.title')}</h3>
              <div className="w-10 h-1 bg-red mb-6" />
              {submitted ? (
                <div className="bg-primary/10 text-primary rounded-xl p-6 text-center">
                  {t('contact.form.success')}
                </div>
              ) : (
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <input
                    type="text"
                    required
                    placeholder={t('contact.form.name')}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  />
                  <input
                    type="email"
                    required
                    placeholder={t('contact.form.email')}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  />
                  <div>
                    <label className="block text-gray-500 text-small mb-1.5">{t('contact.form.subject')}</label>
                    <select
                      required
                      defaultValue=""
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition text-gray-600"
                    >
                      <option value="" disabled>{t('contact.form.subjectPlaceholder')}</option>
                      <option value="information">{t('contact.form.subjectInfo')}</option>
                      <option value="partnership">{t('contact.form.subjectPartnership')}</option>
                      <option value="volunteer">{t('contact.form.subjectVolunteer')}</option>
                      <option value="donation">{t('contact.form.subjectDonation')}</option>
                      <option value="other">{t('contact.form.subjectOther')}</option>
                    </select>
                  </div>
                  <textarea
                    rows={5}
                    required
                    placeholder={t('contact.form.message')}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition resize-none"
                  />
                  <button type="submit" className="btn-red w-full justify-center flex items-center gap-2">
                    <Send size={18} />
                    {t('contact.form.submit')}
                  </button>
                </form>
              )}
            </motion.div>

            {/* Map */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              transition={{ duration: 0.6 }}
              className="rounded-card overflow-hidden shadow-lg relative min-h-105 lg:min-h-0"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.658738179776!2d15.0447!3d12.1348!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDA4JzA1LjMiTiAxNcKwMDInNDAuOSJF!5e0!3m2!1sfr!2sfr!4v1700000000000"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '420px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={t('contact.section.title')}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Support / Partenariats / Bénévolat */}
      <section className="pb-20">
        <div className="container-custom">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            transition={{ duration: 0.6 }}
            className="bg-primary-dark rounded-card px-8 py-10 grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {supportCards.map((item, index) => (
              <div key={index} className="flex flex-col items-center text-center text-white">
                <div className="w-14 h-14 rounded-full border-2 border-primary-light/40 flex items-center justify-center text-primary-light mb-4">
                  <item.icon size={26} />
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-300 text-body leading-relaxed">{item.description}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Social Networks */}
      <section className="pb-20">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">{t('contact.social')}</h3>
            <div className="flex justify-center gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href="#"
                  aria-label={social.label}
                  className={`w-12 h-12 ${social.bg} rounded-full flex items-center justify-center text-white shadow-md hover:opacity-90 transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
                >
                  <img src={`/images/icons/${social.icon}.png`} alt={social.label} className="w-5 h-5" />
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}

export default Contact
