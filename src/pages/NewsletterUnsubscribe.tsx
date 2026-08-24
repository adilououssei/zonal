import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { CheckCircle2, XCircle } from 'lucide-react'
import { unsubscribeFromNewsletter } from '../services/newsletter'

// Page atteinte via le lien "se désinscrire" des emails de newsletter
// (/newsletter/unsubscribe/:token) : déclenche la désinscription au montage
// et affiche le résultat.
const NewsletterUnsubscribe = () => {
  const { t } = useTranslation()
  const { token } = useParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      return
    }
    unsubscribeFromNewsletter(token)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'))
  }, [token])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        {status === 'loading' && (
          <>
            <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-500">{t('newsletter.unsubscribe.loading')}</p>
          </>
        )}
        {status === 'success' && (
          <>
            <CheckCircle2 size={48} className="text-emerald-500 mx-auto mb-4" />
            <p className="text-gray-700 leading-relaxed">{t('newsletter.unsubscribe.success')}</p>
          </>
        )}
        {status === 'error' && (
          <>
            <XCircle size={48} className="text-red mx-auto mb-4" />
            <p className="text-gray-700 leading-relaxed">{t('newsletter.unsubscribe.error')}</p>
          </>
        )}
        <Link to="/" className="inline-block mt-6 text-primary font-medium hover:underline">
          {t('newsletter.unsubscribe.backToSite')}
        </Link>
      </div>
    </div>
  )
}

export default NewsletterUnsubscribe
