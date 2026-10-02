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

// Photos d'un album : la liste complète (la couverture en premier, voir
// GalleryForm), ou la seule image de couverture pour les anciens éléments sans album.
export const albumPhotos = (item: Pick<PublicGalleryItem, 'src' | 'images'>): string[] =>
  item.images && item.images.length > 0 ? item.images : item.src ? [item.src] : []

// Date d'un album en toutes lettres (« juin 2026 »)
export const formatAlbumDate = (date: string | null, language: string): string | null =>
  date ? new Date(`${date}T00:00:00`).toLocaleDateString(language, { month: 'long', year: 'numeric' }) : null
