import { useEffect, useRef } from 'react'
import { renderCheckbox, V2_SITE_KEY } from '../services/recaptcha'

// Case "Je ne suis pas un robot" (reCAPTCHA v2). onToken reçoit le jeton une
// fois la case validée, ou null s'il expire / en cas d'erreur. Un jeton n'est
// utilisable qu'une fois : pour réafficher une case neuve après un envoi
// refusé, le parent change la `key` de ce composant.
const RecaptchaCheckbox = ({ onToken }: { onToken: (token: string | null) => void }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  // Évite un second render() sur le même élément (double exécution des effets en StrictMode)
  const renderedRef = useRef(false)

  useEffect(() => {
    if (renderedRef.current || !containerRef.current) return
    renderedRef.current = true
    renderCheckbox(containerRef.current, onToken).catch(() => onToken(null))
  }, [onToken])

  if (!V2_SITE_KEY) return null
  return <div ref={containerRef} />
}

export default RecaptchaCheckbox
