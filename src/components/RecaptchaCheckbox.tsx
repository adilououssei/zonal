import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { renderCheckbox, V2_SITE_KEY } from '../services/recaptcha'

const LOAD_TIMEOUT_MS = 10000

// Case "Je ne suis pas un robot" (reCAPTCHA v2). onToken reçoit le jeton une
// fois la case validée, ou null s'il expire / en cas d'erreur. Un jeton n'est
// utilisable qu'une fois : pour réafficher une case neuve après un envoi
// refusé, le parent change la `key` de ce composant.
// Si le script Google ne se charge pas (bloqueur de publicité, réseau), un
// message avec un bouton "Réessayer" remplace la case, au lieu de ne rien afficher.
const RecaptchaCheckbox = ({ onToken }: { onToken: (token: string | null) => void }) => {
  const { t } = useTranslation()
  const containerRef = useRef<HTMLDivElement>(null)
  // Évite un second render() sur le même élément (double exécution des effets en StrictMode)
  const renderedRef = useRef(false)
  const [failed, setFailed] = useState(false)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (renderedRef.current || !containerRef.current) return
    renderedRef.current = true

    // Sans réponse de Google après ce délai (script bloqué en silence), on l'indique
    const timer = setTimeout(() => setFailed(true), LOAD_TIMEOUT_MS)
    renderCheckbox(containerRef.current, onToken)
      .then(() => clearTimeout(timer))
      .catch(() => {
        clearTimeout(timer)
        setFailed(true)
      })
  }, [onToken, attempt])

  if (!V2_SITE_KEY) return null

  if (failed) {
    return (
      <div className="text-sm text-red">
        <p>{t('contact.form.captchaLoadError')}</p>
        <button
          type="button"
          className="underline mt-1"
          onClick={() => {
            renderedRef.current = false
            setFailed(false)
            setAttempt(a => a + 1)
          }}
        >
          {t('contact.form.captchaRetry')}
        </button>
      </div>
    )
  }

  return <div ref={containerRef} />
}

export default RecaptchaCheckbox
