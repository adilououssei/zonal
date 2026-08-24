// Appels API pour les articles d'actualité : CRUD admin (newsService) et lecture publique (publicNewsService)
import { api } from './api'

export interface AdminNews {
  id: number
  title: string
  excerpt: string | null
  content: string | null
  date: string
  category: string
  author: string | null
  coverImage: string | null
  gallery: string[] | null
  views: number
  createdAt: string | null
  updatedAt: string | null
  createdBy: { id: number; name: string } | null
}

export const newsService = {
  getAll: () => api.get<AdminNews[]>('/api/admin/news'),

  getById: (id: number) => api.get<AdminNews>(`/api/admin/news/${id}`),

  create: (data: {
    title: string
    excerpt?: string
    content?: string
    date: string
    category: string
    author?: string
    coverImage?: string
    gallery?: string[]
  }) => api.post<AdminNews>('/api/admin/news', data),

  update: (id: number, data: Partial<{
    title: string
    excerpt: string
    content: string
    date: string
    category: string
    author: string
    coverImage: string
    gallery: string[]
    views: number
  }>) => api.put<AdminNews>(`/api/admin/news/${id}`, data),

  delete: (id: number) => api.delete<{ message: string }>(`/api/admin/news/${id}`),
}

export interface PublicNews {
  id: number
  title: string
  excerpt: string | null
  content: string | null
  date: string
  category: string
  author: string | null
  image: string | null
  gallery: string[] | null
  views: number
}

export const publicNewsService = {
  getAll: () => api.get<PublicNews[]>('/api/news', false),

  getById: (id: number) => api.get<PublicNews>(`/api/news/${id}`, false),
}
