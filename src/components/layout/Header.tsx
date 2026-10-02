import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, LayoutGroup, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  MapPin, Phone, Mail, MessageCircle,
  Menu, X, Search, LayoutDashboard, ChevronDown, Newspaper, Calendar, Images
} from 'lucide-react'
import LanguageSwitcher from '../ui/LanguageSwitcher'
import { useAuth } from '../../contexts/useAuth'

// En-tête du site public : barre du haut (coordonnées + réseaux sociaux),
// navigation principale et menu mobile. Devient opaque au scroll (isScrolled)
// pour rester lisible au-dessus du contenu de la page.
//
// Actualités, Événements et Galerie sont regroupés sous l'entrée « Médias »
// (menu déroulant sur ordinateur, accordéon dans le menu mobile).
type NavItem =
  | { path: string; label: string }
  | { label: string; children: { path: string; label: string; description: string; icon: typeof Newspaper }[] }

const Header = () => {
  const { t } = useTranslation()
  const { isAuthenticated } = useAuth()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMediaOpen, setIsMediaOpen] = useState(false)
  const [isMobileMediaOpen, setIsMobileMediaOpen] = useState(false)
  const mediaCloseTimer = useRef<number | undefined>(undefined)
  const mediaRef = useRef<HTMLDivElement>(null)
  const location = useLocation()

  // Bascule le fond du header (transparent -> opaque) au-delà de 50px de scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Clic à l'extérieur ou Échap : fermeture du menu « Médias »
  useEffect(() => {
    if (!isMediaOpen) return
    const onPointerDown = (e: PointerEvent) => {
      if (!mediaRef.current?.contains(e.target as Node)) setIsMediaOpen(false)
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsMediaOpen(false) }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [isMediaOpen])

  useEffect(() => () => window.clearTimeout(mediaCloseTimer.current), [])

  // Survol : ouverture immédiate, fermeture légèrement retardée pour laisser
  // le temps de descendre la souris jusqu'au menu
  const openMedia = () => {
    window.clearTimeout(mediaCloseTimer.current)
    setIsMediaOpen(true)
  }
  const closeMediaSoon = () => {
    window.clearTimeout(mediaCloseTimer.current)
    mediaCloseTimer.current = window.setTimeout(() => setIsMediaOpen(false), 150)
  }

  const navLinks: NavItem[] = [
    { path: '/', label: t('header.nav.home') },
    { path: '/about', label: t('header.nav.about') },
    { path: '/programs', label: t('header.nav.programs') },
    { path: '/projects', label: t('header.nav.projects') },
    {
      label: t('header.nav.media'),
      children: [
        { path: '/news', label: t('header.nav.news'), description: t('header.media.newsDesc'), icon: Newspaper },
        { path: '/events', label: t('header.nav.events'), description: t('header.media.eventsDesc'), icon: Calendar },
        { path: '/gallery', label: t('header.nav.gallery'), description: t('header.media.galleryDesc'), icon: Images },
      ],
    },
    { path: '/contact', label: t('header.nav.contact') },
  ]

  const isActive = (path: string) => location.pathname === path
  // Une rubrique est active sur sa page et sur ses pages de détail (/news/12...)
  const isSectionActive = (path: string) => location.pathname === path || location.pathname.startsWith(`${path}/`)

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled
        ? 'bg-white/95 backdrop-blur-md shadow-lg'
        : 'bg-white/60 backdrop-blur-sm'
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
            <LanguageSwitcher variant="dark" />
            <div className="flex items-center gap-3">
              <a href="https://www.facebook.com/61580087226895/" target="_blank" rel="noopener noreferrer" aria-label={t('social.facebook')} className="hover:text-primary-light transition-colors">
                <img src="/images/icons/facebook.png" alt={t('social.facebook')} className="w-5.5 h-5.5" />
              </a>
              <a href="https://www.linkedin.com/groups/12922267" target="_blank" rel="noopener noreferrer" aria-label={t('social.linkedin')} className="hover:text-primary-light transition-colors">
                <img src="/images/icons/linkedin.png" alt={t('social.linkedin')} className="w-5.5 h-5.5" />
              </a>
              <a href="https://www.instagram.com/organisationzonal?igsi=MW12bDl0aDJybWV5cg==" target="_blank" rel="noopener noreferrer" aria-label={t('social.instagram')} className="hover:text-primary-light transition-colors">
                <img src="/images/icons/instagram.png" alt={t('social.instagram')} className="w-5.5 h-5.5" />
              </a>
              <a href="https://www.youtube.com/@zonal-tchadutube" target="_blank" rel="noopener noreferrer" aria-label={t('social.youtube')} className="hover:text-primary-light transition-colors">
                <img src="/images/icons/youtube.png" alt={t('social.youtube')} className="w-5.5 h-5.5" />
              </a>
              <a href="https://wa.me/23566200620" target="_blank" rel="noopener noreferrer" aria-label={t('social.whatsapp')} className="hover:text-primary-light transition-colors">
                <img src="/images/icons/whatsapp.png" alt={t('social.whatsapp')} className="w-5.5 h-5.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="container-custom py-1 md:py-1">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="/images/news/logoNoFont.png" alt={t('header.logo')} className="h-16 md:h-20 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <LayoutGroup>
              {navLinks.map((link) => 'children' in link ? (
                <div
                  key={link.label}
                  ref={mediaRef}
                  className="relative"
                  onMouseEnter={openMedia}
                  onMouseLeave={closeMediaSoon}
                >
                  <button
                    type="button"
                    onClick={() => setIsMediaOpen((o) => !o)}
                    aria-haspopup="true"
                    aria-expanded={isMediaOpen}
                    className={`relative inline-flex items-center gap-1 font-medium transition-colors hover:text-primary px-3 py-2 ${
                      link.children.some((c) => isSectionActive(c.path)) || isMediaOpen ? 'text-primary' : 'text-gray-600'
                    }`}
                  >
                    {link.label}
                    <ChevronDown size={16} className={`transition-transform duration-200 ${isMediaOpen ? 'rotate-180' : ''}`} />
                    {link.children.some((c) => isSectionActive(c.path)) && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute -bottom-0.5 left-2 right-2 h-0.5 bg-primary rounded-full"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </button>
                  <AnimatePresence>
                    {isMediaOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-1/2 -translate-x-1/2 top-full pt-3 w-80"
                      >
                        <div className="bg-white rounded-2xl shadow-xl ring-1 ring-black/5 p-2">
                          {link.children.map((child) => {
                            const Icon = child.icon
                            const active = isSectionActive(child.path)
                            return (
                              <Link
                                key={child.path}
                                to={child.path}
                                onClick={() => setIsMediaOpen(false)}
                                className={`flex items-start gap-3 rounded-xl p-3 transition-colors ${active ? 'bg-primary/5' : 'hover:bg-gray-50'}`}
                              >
                                <span className={`w-10 h-10 shrink-0 rounded-lg flex items-center justify-center ${active ? 'bg-primary text-white' : 'bg-primary/10 text-primary'}`}>
                                  <Icon size={18} />
                                </span>
                                <span>
                                  <span className={`block font-semibold ${active ? 'text-primary' : 'text-gray-900'}`}>{child.label}</span>
                                  <span className="block text-small text-gray-500 leading-snug">{child.description}</span>
                                </span>
                              </Link>
                            )
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative font-medium transition-colors hover:text-primary px-3 py-2 ${
                    isActive(link.path) ? 'text-primary' : 'text-gray-600'
                  }`}
                >
                  {link.label}
                  {isActive(link.path) && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute -bottom-0.5 left-2 right-2 h-0.5 bg-primary rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              ))}
            </LayoutGroup>
          </nav>

          <div className="hidden lg:flex items-center gap-5">
            {isAuthenticated && (
              <Link
                to="/admin"
                className="inline-flex items-center gap-1.5 text-gray-500 hover:text-primary transition-colors text-small font-medium"
              >
                <LayoutDashboard size={16} />
                Dashboard
              </Link>
            )}
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
          {navLinks.map((link) => 'children' in link ? (
            <div key={link.label}>
              <button
                type="button"
                onClick={() => setIsMobileMediaOpen((o) => !o)}
                aria-expanded={isMobileMediaOpen}
                className={`w-full flex items-center justify-between font-medium text-lg transition-colors hover:text-primary border-l-4 py-1.5 pl-3 ${
                  link.children.some((c) => isSectionActive(c.path)) ? 'text-primary border-primary' : 'text-gray-600 border-transparent'
                }`}
              >
                {link.label}
                <ChevronDown size={20} className={`transition-transform duration-200 ${isMobileMediaOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence initial={false}>
                {isMobileMediaOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-2 ml-4 space-y-1 border-l border-gray-100 pl-3">
                      {link.children.map((child) => {
                        const Icon = child.icon
                        return (
                          <Link
                            key={child.path}
                            to={child.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`flex items-center gap-3 py-2 font-medium transition-colors hover:text-primary ${
                              isSectionActive(child.path) ? 'text-primary' : 'text-gray-600'
                            }`}
                          >
                            <Icon size={18} />
                            {child.label}
                          </Link>
                        )
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              key={link.path}
              to={link.path}
              className={`block font-medium text-lg transition-colors hover:text-primary border-l-4 py-1.5 pl-3 ${
                isActive(link.path)
                  ? 'text-primary border-primary'
                  : 'text-gray-600 border-transparent'
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
            <a href="https://www.facebook.com/61580087226895/" target="_blank" rel="noopener noreferrer" aria-label={t('social.facebook')}>
              <img src="/images/icons/facebook.png" alt={t('social.facebook')} className="w-6.5 h-6.5" />
            </a>
            <a href="https://www.linkedin.com/groups/12922267" target="_blank" rel="noopener noreferrer" aria-label={t('social.linkedin')}>
              <img src="/images/icons/linkedin.png" alt={t('social.linkedin')} className="w-6.5 h-6.5" />
            </a>
            <a href="https://www.instagram.com/organisationzonal?igsi=MW12bDl0aDJybWV5cg==" target="_blank" rel="noopener noreferrer" aria-label={t('social.instagram')}>
              <img src="/images/icons/instagram.png" alt={t('social.instagram')} className="w-6.5 h-6.5" />
            </a>
            <a href="https://www.youtube.com/@zonal-tchadutube" target="_blank" rel="noopener noreferrer" aria-label={t('social.youtube')}>
              <img src="/images/icons/youtube.png" alt={t('social.youtube')} className="w-6.5 h-6.5" />
            </a>
            <a href="https://wa.me/23566200620" target="_blank" rel="noopener noreferrer" aria-label={t('social.whatsapp')}>
              <img src="/images/icons/whatsapp.png" alt={t('social.whatsapp')} className="w-6.5 h-6.5" />
            </a>
          </div>
        </div>
      </motion.div>
    </header>
  )
}

export default Header
