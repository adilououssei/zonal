import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft, Send } from 'lucide-react'
import { api } from '../services/api'

// Formulaire "mot de passe oublié" : envoie un email de réinitialisation.
// Le message de succès est volontairement identique que l'email existe ou non
// en base (voir ForgotPasswordController côté backend), pour ne pas révéler
// quels emails sont enregistrés.
const ForgotPassword = () => {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    setMessage('')
    try {
      const res = await api.post<{ message: string }>('/api/forgot-password', { email }, false)
      setMessage(res.message)
      setStatus('success')
    } catch (err) {
      setMessage(err instanceof Error ? err.message : t('errors.sendMessage'))
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen relative">
      <img
        src="https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=1920&h=1080&fit=crop"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-linear-to-r from-primary-dark/95 via-primary-dark/70 to-primary-dark/40" />
      <div className="relative z-10 min-h-screen flex items-center justify-center py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl p-8"
        >
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Mail size={28} className="text-primary" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-1">
              {t('forgotPassword.title')}
            </h1>
            <p className="text-gray-500 text-sm">
              {t('forgotPassword.subtitle')}
            </p>
          </div>

          {status === 'success' ? (
            <div className="bg-green-50 text-green-700 rounded-xl p-4 text-sm text-center">
              {message}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('forgotPassword.emailPlaceholder')}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-60 text-sm"
              >
                {status === 'loading' ? (
                  t('forgotPassword.sending')
                ) : (
                  <><Send size={16} /> {t('forgotPassword.submit')}</>
                )}
              </button>
              {message && status === 'error' && (
                <p className="text-red text-sm text-center">{message}</p>
              )}
            </form>
          )}

          <div className="mt-6 text-center">
            <Link to="/login" className="text-primary text-sm hover:text-primary-dark transition-colors inline-flex items-center gap-1">
              <ArrowLeft size={14} /> {t('forgotPassword.backToLogin')}
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ForgotPassword
