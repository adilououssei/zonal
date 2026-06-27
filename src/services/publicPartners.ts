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
