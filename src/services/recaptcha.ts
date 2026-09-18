// reCAPTCHA v3 : protection anti-bot invisible (aucune case à cocher, aucun
// défi visuel) pour les formulaires publics comme l'inscription newsletter.
//
// Si VITE_RECAPTCHA_SITE_KEY n'est pas définie (dev local sans compte
// reCAPTCHA), getRecaptchaToken() renvoie null : le backend ignore alors la
// vérification (voir RecaptchaVerifier côté Symfony).

const SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY as string | undefined

declare global {
  interface Window {
    grecaptcha?: {
      ready: (callback: () => void) => void
      execute: (siteKey: string, options: { action: string }) => Promise<string>
    }
  }
}

let scriptPromise: Promise<void> | null = null

function loadScript(siteKey: string): Promise<void> {
  if (scriptPromise) return scriptPromise

  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Impossible de charger reCAPTCHA'))
    document.head.appendChild(script)
  })

  return scriptPromise
}

// Renvoie un jeton reCAPTCHA pour l'action donnée, ou null si reCAPTCHA
// n'est pas configuré ou n'a pas pu être chargé (ne bloque jamais le
// formulaire : le pire cas est une soumission non vérifiée côté backend).
export async function getRecaptchaToken(action: string): Promise<string | null> {
  if (!SITE_KEY) return null

  try {
    await loadScript(SITE_KEY)
    return await new Promise<string>((resolve, reject) => {
      window.grecaptcha!.ready(() => {
        window.grecaptcha!.execute(SITE_KEY, { action }).then(resolve).catch(reject)
      })
    })
  } catch {
    return null
  }
}
