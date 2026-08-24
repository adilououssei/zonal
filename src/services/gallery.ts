// Appels API pour la galerie photo : CRUD admin (galleryService) et lecture publique (publicGalleryService)
import { api } from './api'

export interface GalleryItem {
  id: number
  title: string
  src: string
  category: string
  date: string | null
  images: string[] | null
  imageCount: number
  createdAt: string | null
  updatedAt: string | null
  createdBy: { id: number; name: string } | null
}

export interface PublicGalleryItem {
  id: number
  title: string
  src: string
  category: string
  date: string | null
  images: string[] | null
  imageCount: number
}

export const galleryService = {
  getAll: () => api.get<GalleryItem[]>('/api/admin/gallery'),

  getById: (id: number) => api.get<GalleryItem>(`/api/admin/gallery/${id}`),

  create: (data: {
    title: string
    src: string
    images?: string[]
    category?: string
    date?: string
  }) => api.post<GalleryItem>('/api/admin/gallery', data),

  update: (id: number, data: Partial<{
    title: string
    src: string
    images: string[]
    category: string
    date: string
  }>) => api.put<GalleryItem>(`/api/admin/gallery/${id}`, data),

  delete: (id: number) => api.delete<{ message: string }>(`/api/admin/gallery/${id}`),
}

export const publicGalleryService = {
  getAll: () => api.get<PublicGalleryItem[]>('/api/gallery', false),

  getById: (id: number) => api.get<PublicGalleryItem>(`/api/gallery/${id}`, false),
}
