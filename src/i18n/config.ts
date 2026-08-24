// Configuration i18next : charge les traductions statiques de l'interface
// (menus, libellés, formulaires...) en français et anglais. Ne pas confondre
// avec les traductions de CONTENU (articles, événements...), qui elles sont
// stockées en base et gérées par LocaleHelper côté backend.
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import fr from './locales/fr.json'
import en from './locales/en.json'

i18n.use(initReactI18next).init({
  resources: {
    fr: { translation: fr },
    en: { translation: en },
  },
  lng: 'fr',
  fallbackLng: 'fr',
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
