// Réglages globaux du site (page "Paramètres" de l'admin, réservée au super
// administrateur). Une seule ligne de données existe côté backend : get()
// et update() opèrent toujours sur ce même enregistrement singleton.
import { api } from './api'

export interface SettingsData {
  // Général
  orgName: string | null
  logo: string | null
  slogan: string | null
  description: string | null
  email: string | null
  phone: string | null

  // Contact
  contactEmail: string | null
  contactPhone: string | null
  contactPhoneSecondary: string | null
  address: string | null
  whatsapp: string | null
  googleMapsIframe: string | null

  // Réseaux sociaux
  facebook: string | null
  linkedin: string | null
  youtube: string | null
  whatsappUrl: string | null

  // Pied de page
  footerPresentation: string | null
  copyright: string | null
  openingHours: string[] | null
  legalLink: string | null
  privacyLink: string | null

  // Images des différentes pages
  heroImage: string | null
  aboutImage: string | null
  programsImage: string | null
  eventsImage: string | null
  contactImage: string | null

  // SEO
  metaTitle: string | null
  metaDescription: string | null
  metaKeywords: string | null
  ogImage: string | null
  googleAnalyticsId: string | null
}

export const settingsService = {
  get: () => api.get<SettingsData>('/api/admin/settings'),

  update: (data: Partial<SettingsData>) => api.put<SettingsData>('/api/admin/settings', data),
}
