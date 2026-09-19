// Newsletter : inscription/désinscription publiques (formulaire du site) et
// gestion admin des abonnés (liste + suppression).
import { api } from './api'

export interface SubscribeResponse {
  message: string
}

export async function subscribeToNewsletter(email: string, name?: string, recaptchaToken?: string | null): Promise<SubscribeResponse> {
  return api.post<SubscribeResponse>('/api/newsletter/subscribe', { email, name, recaptchaToken }, false)
}

// Appelé via le lien "Confirmer mon inscription" reçu par email (double opt-in)
export async function confirmNewsletterSubscription(token: string): Promise<SubscribeResponse> {
  return api.get<SubscribeResponse>(`/api/newsletter/confirm/${token}`, false)
}

// Appelé via le lien "se désinscrire" reçu par email (le jeton fait office d'authentification)
export async function unsubscribeFromNewsletter(token: string): Promise<SubscribeResponse> {
  return api.get<SubscribeResponse>(`/api/newsletter/unsubscribe/${token}`, false)
}

export interface NewsletterSubscriber {
  id: number
  email: string
  name: string | null
  isActive: boolean
  status: 'active' | 'pending' | 'unsubscribed'
  subscribedAt: string | null
}

export const newsletterService = {
  getSubscribers: () => api.get<NewsletterSubscriber[]>('/api/admin/newsletter/subscribers'),
  deleteSubscriber: (id: number) => api.delete<{ message: string }>(`/api/admin/newsletter/subscribers/${id}`),
}
