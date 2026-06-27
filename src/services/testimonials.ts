import { api } from './api'

export interface AdminTestimonial {
  id: number
  author: string
  role: string | null
  content: string
  rating: number
  avatar: string | null
  date: string | null
  status: string
  createdAt: string | null
  updatedAt: string | null
  createdBy: { id: number; name: string } | null
}

export interface PublicTestimonial {
  id: number
  author: string
  role: string | null
  content: string
  rating: number
  avatar: string | null
  date: string | null
  status: string
}

export const testimonialsService = {
  getAll: () => api.get<AdminTestimonial[]>('/api/admin/testimonials'),

  getById: (id: number) => api.get<AdminTestimonial>(`/api/admin/testimonials/${id}`),

  create: (data: {
    author: string
    role?: string
    content: string
    rating?: number
    avatar?: string
    date?: string
    status?: string
  }) => api.post<AdminTestimonial>('/api/admin/testimonials', data),

  update: (id: number, data: Partial<{
    author: string
    role: string
    content: string
    rating: number
    avatar: string
    date: string
    status: string
  }>) => api.put<AdminTestimonial>(`/api/admin/testimonials/${id}`, data),

  delete: (id: number) => api.delete<{ message: string }>(`/api/admin/testimonials/${id}`),
}

export const publicTestimonialsService = {
  getAll: () => api.get<PublicTestimonial[]>('/api/testimonials', false),
}
