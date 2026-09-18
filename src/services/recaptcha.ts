// reCAPTCHA côté frontend :
// - v3 (invisible, aucune interaction) pour l'inscription newsletter ;
// - v2 (case "Je ne suis pas un robot") pour le formulaire de contact.
// Les deux types ont chacun leur paire de clés chez Google. Un seul script
// api.js est chargé pour les deux (Google déconseille de le charger deux fois).
//
// Sans clé configurée (dev local sans compte reCAPTCHA), rien n'est chargé et
// aucun jeton n'est envoyé : le backend ignore alors la vérification (voir
// RecaptchaVerifier côté Symfony).

const V3_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY as string | undefined
export const V2_SITE_KEY = import.meta.env.VITE_RECAPTCHA_V2_SITE_KEY as string | undefined

interface GRecaptcha {
  ready: (callback: () => void) => void
  execute: (siteKey: string, options: { action: string }) => Promise<string>
  render: (
    container: HTMLElement,
    options: {
      sitekey: string
      callback: (token: string) => void
      'expired-callback': () => void
      'error-callback': () => void
    },
  ) => number
  reset: (widgetId?: number) => void
}

declare global {
  interface Window {
    grecaptcha?: GRecaptcha
  }
}

let scriptPromise: Promise<void> | null = null

function loadScript(): Promise<void> {
  if (scriptPromise) return scriptPromise

  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    // "render=<clé v3>" active aussi l'API v3 ; "explicit" suffit si seule la case v2 est utilisée
    script.src = `https://www.google.com/recaptcha/api.js?render=${V3_SITE_KEY ?? 'explicit'}`
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => {
      scriptPromise = null
      reject(new Error('Impossible de charger reCAPTCHA'))
    }
    document.head.appendChild(script)
  })

  return scriptPromise
}

function whenReady(): Promise<GRecaptcha> {
  return loadScript().then(
    () => new Promise<GRecaptcha>(resolve => window.grecaptcha!.ready(() => resolve(window.grecaptcha!))),
  )
}

// Renvoie un jeton reCAPTCHA v3 pour l'action donnée, ou null si reCAPTCHA
// n'est pas configuré ou n'a pas pu être chargé (ne bloque jamais le
// formulaire : le pire cas est une soumission non vérifiée côté backend).
export async function getRecaptchaToken(action: string): Promise<string | null> {
  if (!V3_SITE_KEY) return null

  try {
    const grecaptcha = await whenReady()
    return await grecaptcha.execute(V3_SITE_KEY, { action })
  } catch {
    return null
  }
}

// Affiche la case "Je ne suis pas un robot" (v2) dans le conteneur donné.
export async function renderCheckbox(
  container: HTMLElement,
  onToken: (token: string | null) => void,
): Promise<void> {
  if (!V2_SITE_KEY) return

  const grecaptcha = await whenReady()
  grecaptcha.render(container, {
    sitekey: V2_SITE_KEY,
    callback: token => onToken(token),
    'expired-callback': () => onToken(null),
    'error-callback': () => onToken(null),
  })
}
