import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  MapPin, Phone, Mail, MessageCircle,
  Menu, X, Search, ChevronDown
} from 'lucide-react'

const Header = () => {
  const { t, i18n } = useTranslation()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLangOpen, setIsLangOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('#lang-selector')) setIsLangOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const navLinks = [
    { path: '/', label: t('header.nav.home') },
    { path: '/about', label: t('header.nav.about') },
    { path: '/programs', label: t('header.nav.programs') },
    { path: '/projects', label: t('header.nav.projects') },
    { path: '/news', label: t('header.nav.news') },
    { path: '/events', label: t('header.nav.events') },
    { path: '/contact', label: t('header.nav.contact') },
  ]

  const isActive = (path: string) => location.pathname === path

  const languages = [
    { code: 'fr', label: 'FR', flag: 'https://flagcdn.com/w20/fr.png' },
    { code: 'en', label: 'EN', flag: 'https://flagcdn.com/w20/gb.png' },
  ]

  const currentLang = languages.find(l => l.code === i18n.language) || languages[0]

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white'
    }`}>
      {/* Top Bar */}
      <div className="bg-primary-dark text-white text-small py-2 hidden md:block">
        <div className="container-custom flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5">
              <MapPin size={16} />
              <div>
                <span>{t('header.topbar.address')}</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <Mail size={16} />
              <span>{t('header.topbar.email')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Phone size={16} />
              <span>{t('header.topbar.phone')}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div id="lang-selector" className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1.5 text-white text-small cursor-pointer hover:opacity-80 transition-opacity"
              >
                <img src={currentLang.flag} alt={currentLang.label} className="w-5 h-3.5 rounded-sm object-cover" />
                <span>{currentLang.label}</span>
                <ChevronDown size={12} className={`transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
              </button>
              {isLangOpen && (
                <div className="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-xl py-1 min-w-25 z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => { i18n.changeLanguage(lang.code); setIsLangOpen(false) }}
                      className={`flex items-center gap-2 w-full px-3 py-2 text-small text-left hover:bg-gray-100 transition-colors ${
                        i18n.language === lang.code ? 'text-primary font-semibold' : 'text-gray-700'
                      }`}
                    >
                      <img src={lang.flag} alt={lang.label} className="w-5 h-3.5 rounded-sm object-cover" />
                      {lang.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <a href="#" aria-label={t('social.facebook')} className="hover:text-primary-light transition-colors">
                <img src="/images/icons/facebook.png" alt={t('social.facebook')} className="w-4.5 h-4.5" />
              </a>
              <a href="#" aria-label={t('social.linkedin')} className="hover:text-primary-light transition-colors">
                <img src="/images/icons/linkedin.png" alt={t('social.linkedin')} className="w-4.5 h-4.5" />
              </a>
              <a href="#" aria-label={t('social.youtube')} className="hover:text-primary-light transition-colors">
                <img src="/images/icons/youtube.png" alt={t('social.youtube')} className="w-4.5 h-4.5" />
              </a>
              <a href="#" aria-label={t('social.whatsapp')} className="hover:text-primary-light transition-colors">
                <img src="/images/icons/whatsapp.png" alt={t('social.whatsapp')} className="w-4.5 h-4.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="container-custom py-3 md:py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="/images/logo.png" alt={t('header.logo')} className="h-12 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-medium transition-colors hover:text-primary ${
                  isActive(link.path) ? 'text-primary' : 'text-gray-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-5">
            <button aria-label={t('header.topbar.search')} className="text-gray-500 hover:text-primary transition-colors">
              <Search size={20} />
            </button>
            <a
              href="https://wa.me/23566200620"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-red flex items-center gap-2 px-6 py-3"
            >
              {t('header.cta')}
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-gray-900 p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? t('header.topbar.closeMenu') : t('header.topbar.openMenu')}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: isMobileMenuOpen ? 'auto' : 0, opacity: isMobileMenuOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="lg:hidden overflow-hidden bg-white border-t border-gray-100"
      >
        <div className="container-custom py-6 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`block font-medium text-lg transition-colors hover:text-primary ${
                isActive(link.path) ? 'text-primary' : 'text-gray-600'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://wa.me/23566200620"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-red flex items-center justify-center gap-2 w-full"
          >
            <MessageCircle size={20} />
            {t('header.cta')}
          </a>
          <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
            <a href="#" aria-label={t('social.facebook')}>
              <img src="/images/icons/facebook.png" alt={t('social.facebook')} className="w-5.5 h-5.5" />
            </a>
            <a href="#" aria-label={t('social.linkedin')}>
              <img src="/images/icons/linkedin.png" alt={t('social.linkedin')} className="w-5.5 h-5.5" />
            </a>
            <a href="#" aria-label={t('social.youtube')}>
              <img src="/images/icons/youtube.png" alt={t('social.youtube')} className="w-5.5 h-5.5" />
            </a>
            <a href="#" aria-label={t('social.whatsapp')}>
              <img src="/images/icons/whatsapp.png" alt={t('social.whatsapp')} className="w-5.5 h-5.5" />
            </a>
          </div>
        </div>
      </motion.div>
    </header>
  )
}

export default Header
