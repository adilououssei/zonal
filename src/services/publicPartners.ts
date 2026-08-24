// Lecture publique des partenaires actifs (page "Partenaires" du site). Séparé
// de partners.ts qui gère le CRUD admin, car les formes de données diffèrent
// légèrement (pas de champs *En/createdBy exposés côté public).
import { api } from './api'

export interface PublicPartner {
  id: number
  name: string
  domain: string | null
  email: string | null
  phone: string | null
  logo: string | null
  status: string
}

export const publicPartnersService = {
  getAll: () => api.get<PublicPartner[]>('/api/partners', false),
}
