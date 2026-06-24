import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { LogIn, Lock, Mail, Eye, EyeOff, Zap } from 'lucide-react'

const Login = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError(t('login.card.errorRequired'))
      return
    }

    if (email === 'admin@zonalong.org' && password === 'admin123') {
      navigate('/admin')
    } else {
      setError(t('login.card.errorInvalid'))
    }
  }

  const quickLogin = () => {
    setEmail('admin@zonalong.org')
    setPassword('admin123')
    setError('')
    setTimeout(() => navigate('/admin'), 300)
  }

  return (
    <div className="h-screen relative overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=1920&h=1080&fit=crop"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-linear-to-r from-primary-dark/95 via-primary-dark/70 to-primary-dark/40" />

      <div className="relative z-10 h-screen flex items-center overflow-y-auto py-6">
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-16">
            {/* Left: Text */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-white text-center max-w-xs lg:max-w-sm shrink-0"
            >
              <div className="mb-6">
                <img src="/images/logoOrigin.png" alt="ZONAL" className="h-24 w-auto mx-auto" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold leading-tight mb-3">
                {t('login.hero.title').split('\n').map((line, i) => (
                  <span key={i}>{i > 0 && <br />}{line}</span>
                ))}
              </h2>
              <p className="text-white/70 text-body leading-relaxed">
                {t('login.hero.subtitle')}
              </p>
            </motion.div>

            {/* Right: Form card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6"
            >
              <div className="text-center mb-4">
                <img src="/images/logoOrigin.png" alt="ZONAL" className="h-20 w-auto mx-auto" />
              </div>

              <h1 className="text-center text-lg font-bold text-gray-900 mb-4">{t('login.card.title')}</h1>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-small font-medium text-gray-700 mb-1.5">{t('login.card.email')}</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('login.card.emailPlaceholder')}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-small font-medium text-gray-700 mb-1.5">{t('login.card.password')}</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t('login.card.passwordPlaceholder')}
                      className="w-full px-3.5 pr-10 py-2.5 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/30"
                    />
                    <span className="text-gray-600 text-xs">{t('login.card.rememberMe')}</span>
                  </label>
                  <a href="#" className="text-xs text-primary hover:text-primary-dark transition-colors">
                    {t('login.card.forgotPassword')}
                  </a>
                </div>

                {error && (
                  <p className="text-red text-small font-medium">{error}</p>
                )}

                <button
                  type="submit"
                  className="w-full bg-primary text-white py-2.5 rounded-lg font-semibold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
                >
                  <LogIn size={18} />
                  {t('login.card.loginButton')}
                </button>

                <button
                  type="button"
                  onClick={quickLogin}
                  className="w-full border-2 border-dashed border-primary/30 text-primary py-2.5 rounded-lg font-medium hover:bg-primary/5 transition-colors flex items-center justify-center gap-2 text-xs"
                >
                  <Zap size={16} />
                  {t('login.card.quickLogin')}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="absolute bottom-0 left-0 right-0 z-20 text-center py-4">
        <p className="text-white/40 text-xs">
          {t('login.footer', { year: new Date().getFullYear() })}
        </p>
      </div>
    </div>
  )
}

export default Login
