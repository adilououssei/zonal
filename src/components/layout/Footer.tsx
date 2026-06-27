import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import {
  MapPin, Phone, Mail, MessageCircle, Clock, LayoutDashboard
} from 'lucide-react'

const Footer = () => {
  const { t } = useTranslation()
  const isAdmin = localStorage.getItem('zonal_admin') === 'true'

  return (
    <footer className="bg-primary-dark text-white pt-16 pb-6">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Logo & Description */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/images/logoOrigin.png" alt={t('header.logo')} className="h-20 w-auto" />
            </div>
            <p className="text-gray-400 text-body leading-relaxed">
              {t('footer.description')}
            </p>
            <div className="flex items-center gap-3 mt-5">
              <a href="#" aria-label={t('social.facebook')} className="w-11 h-11 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/20 transition-colors">
                <img src="/images/icons/facebook.png" alt={t('social.facebook')} className="w-6.5 h-6.5" />
              </a>
              <a href="#" aria-label={t('social.linkedin')} className="w-11 h-11 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/20 transition-colors">
                <img src="/images/icons/linkedin.png" alt={t('social.linkedin')} className="w-6.5 h-6.5" />
              </a>
              <a href="#" aria-label={t('social.youtube')} className="w-11 h-11 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/20 transition-colors">
                <img src="/images/icons/youtube.png" alt={t('social.youtube')} className="w-6.5 h-6.5" />
              </a>
              <a href="https://wa.me/23566200620" target="_blank" rel="noopener noreferrer" aria-label={t('social.whatsapp')} className="w-11 h-11 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/20 transition-colors">
                <img src="/images/icons/whatsapp.png" alt={t('social.whatsapp')} className="w-6.5 h-6.5" />
              </a>
            </div>
          </div>

          {/* Liens utiles */}
          <div>
            <h4 className="font-semibold text-lg mb-4">{t('footer.links')}</h4>
            <ul className="space-y-3">
              <li><Link to="/" className="text-gray-400 hover:text-primary-light transition-colors">{t('header.nav.home')}</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-primary-light transition-colors">{t('header.nav.about')}</Link></li>
              <li><Link to="/programs" className="text-gray-400 hover:text-primary-light transition-colors">{t('header.nav.programs')}</Link></li>
              <li><Link to="/projects" className="text-gray-400 hover:text-primary-light transition-colors">{t('header.nav.projects')}</Link></li>
              <li><Link to="/news" className="text-gray-400 hover:text-primary-light transition-colors">{t('header.nav.news')}</Link></li>
              <li><Link to="/events" className="text-gray-400 hover:text-primary-light transition-colors">{t('header.nav.events')}</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-primary-light transition-colors">{t('header.nav.contact')}</Link></li>
            </ul>
          </div>

          {/* Heures d'ouverture */}
          <div>
            <h4 className="font-semibold text-lg mb-4">{t('footer.hours')}</h4>
            <ul className="space-y-4 text-gray-400">
              <li className="flex items-start gap-3">
                <Clock size={20} className="text-primary-light shrink-0 mt-0.5" />
                <div>
                  <p>{t('footer.schedule.monThu')}</p>
                  <p className="text-white">{t('footer.schedule.monThuTime')}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock size={20} className="text-primary-light shrink-0 mt-0.5" />
                <div>
                  <p>{t('footer.schedule.fri')}</p>
                  <p className="text-white">{t('footer.schedule.friTime')}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock size={20} className="text-primary-light shrink-0 mt-0.5" />
                <div>
                  <p>{t('footer.schedule.sat')}</p>
                  <p className="text-white">{t('footer.schedule.satStatus')}</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-4">{t('footer.contact')}</h4>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin size={20} className="text-primary-light shrink-0 mt-0.5" />
                <div>
                  <span>{t('footer.address')}</span>
                  <span className="block text-small text-gray-400">{t('footer.address2')}</span>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={20} className="text-primary-light shrink-0" />
                <span>{t('footer.phone')}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={20} className="text-primary-light shrink-0" />
                <span>{t('footer.email')}</span>
              </li>
            </ul>
            <a
              href="https://wa.me/23566200620"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 bg-green-600 hover:bg-green-700 transition-colors text-white px-5 py-2.5 rounded-lg inline-flex items-center gap-2 font-medium text-body"
            >
              <MessageCircle size={18} />
              {t('footer.whatsapp')}
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-gray-400 text-small">
          <div className="flex items-center gap-2">
            <p>{t('footer.copyright', { year: new Date().getFullYear() })}</p>
            <span className="text-white/5 hover:text-white/20 text-[10px] transition-colors hidden sm:inline">
              — {t('footer.credit')}
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="#" className="hover:text-primary-light transition-colors">{t('footer.privacy')}</Link>
            <Link to={isAdmin ? '/admin' : '/login'} className="text-white/10 hover:text-white/40 transition-colors text-xs flex items-center gap-1" aria-label={t('footer.adminAria')}>
              {isAdmin ? <LayoutDashboard size={10} /> : null}
              {isAdmin ? t('footer.dashboardLink') : t('footer.adminLink')}
            </Link>
          </div>
        </div>
        <p className="text-center text-white/5 hover:text-white/20 text-[10px] transition-colors mt-2 sm:hidden">
          {t('footer.credit')}
        </p>
      </div>
    </footer>
  )
}

export default Footer