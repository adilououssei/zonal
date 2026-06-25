import { api } from './api'

export interface SettingsData {
  orgName: string | null
  logo: string | null
  slogan: string | null
  description: string | null
  email: string | null
  phone: string | null

  contactEmail: string | null
  contactPhone: string | null
  contactPhoneSecondary: string | null
  address: string | null
  whatsapp: string | null
  googleMapsIframe: string | null

  facebook: string | null
  linkedin: string | null
  youtube: string | null
  whatsappUrl: string | null

  footerPresentation: string | null
  copyright: string | null
  openingHours: string[] | null
  legalLink: string | null
  privacyLink: string | null

  heroImage: string | null
  aboutImage: string | null
  programsImage: string | null
  eventsImage: string | null
  contactImage: string | null

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
