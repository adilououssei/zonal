import { api } from './api'

export interface AdminPartner {
  id: number
  name: string
  domain: string | null
  email: string | null
  phone: string | null
  logo: string | null
  status: string
  createdAt: string | null
  updatedAt: string | null
}

export const partnersService = {
  getAll: () => api.get<AdminPartner[]>('/api/admin/partners'),

  getById: (id: number) => api.get<AdminPartner>(`/api/admin/partners/${id}`),

  create: (data: {
    name: string
    domain?: string
    email?: string
    phone?: string
    logo?: string
    status?: string
  }) => api.post<AdminPartner>('/api/admin/partners', data),

  update: (id: number, data: Partial<{
    name: string
    domain: string
    email: string
    phone: string
    logo: string
    status: string
  }>) => api.put<AdminPartner>(`/api/admin/partners/${id}`, data),

  toggleStatus: (id: number) => api.patch<AdminPartner>(`/api/admin/partners/${id}/toggle-status`),

  delete: (id: number) => api.delete<{ message: string }>(`/api/admin/partners/${id}`),
}
