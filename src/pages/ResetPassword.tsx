import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Lock, Eye, EyeOff, ArrowLeft, Check } from 'lucide-react'
import { api } from '../services/api'

// Formulaire de changement de mot de passe, accessible via le lien reçu par
// email (/reset-password/:token). Redirige automatiquement vers /login 3s
// après un succès.
const ResetPassword = () => {
  const { t } = useTranslation()
  const { token } = useParams()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password || password.length < 6) {
      setMessage(t('resetPassword.errorLength'))
      setStatus('error')
      return
    }
    setStatus('loading')
    setMessage('')
    try {
      const res = await api.post<{ message: string }>('/api/reset-password', { token, password }, false)
      setMessage(res.message)
      setStatus('success')
      setTimeout(() => navigate('/login'), 3000)
    } catch (err) {
      setMessage(err instanceof Error ? err.message : t('errors.resetPassword'))
      setStatus('error')
    }
  }

  if (!token) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-600">{t('resetPassword.invalidLink')}</p>
      </div>
    )
  }

  return (
    <div className="h-screen relative overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=1920&h=1080&fit=crop"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-linear-to-r from-primary-dark/95 via-primary-dark/70 to-primary-dark/40" />
      <div className="relative z-10 h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl p-8"
        >
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Lock size={28} className="text-primary" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-1">
              {t('resetPassword.title')}
            </h1>
            <p className="text-gray-500 text-sm">
              {t('resetPassword.subtitle')}
            </p>
          </div>

          {status === 'success' ? (
            <div className="bg-green-50 text-green-700 rounded-xl p-4 text-sm text-center">
              <Check size={20} className="mx-auto mb-2" />
              {message}
              <p className="mt-2 text-xs">{t('resetPassword.redirecting')}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('resetPassword.passwordPlaceholder')}
                  className="w-full px-4 pr-10 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-60 text-sm"
              >
                {status === 'loading' ? t('resetPassword.resetting') : t('resetPassword.submit')}
              </button>
              {message && status === 'error' && (
                <p className="text-red text-sm text-center">{message}</p>
              )}
            </form>
          )}

          <div className="mt-6 text-center">
            <Link to="/login" className="text-primary text-sm hover:text-primary-dark transition-colors inline-flex items-center gap-1">
              <ArrowLeft size={14} /> {t('resetPassword.backToLogin')}
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ResetPassword
