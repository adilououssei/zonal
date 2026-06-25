import { api } from './api'

export interface AdminDocument {
  id: number
  name: string
  type: string
  size: number | null
  file: string
  category: string | null
  date: string | null
  createdAt: string | null
  updatedAt: string | null
}

export interface PublicDocument {
  id: number
  name: string
  type: string
  size: number | null
  file: string
  category: string | null
  date: string | null
}

export const documentsService = {
  getAll: () => api.get<AdminDocument[]>('/api/admin/documents'),

  getById: (id: number) => api.get<AdminDocument>(`/api/admin/documents/${id}`),

  create: (data: {
    name: string
    type?: string
    size?: number
    file: string
    category?: string
    date?: string
  }) => api.post<AdminDocument>('/api/admin/documents', data),

  update: (id: number, data: Partial<{
    name: string
    type: string
    size: number
    file: string
    category: string
    date: string
  }>) => api.put<AdminDocument>(`/api/admin/documents/${id}`, data),

  delete: (id: number) => api.delete<{ message: string }>(`/api/admin/documents/${id}`),
}

export const publicDocumentsService = {
  getAll: () => api.get<PublicDocument[]>('/api/documents', false),
}

export function formatFileSize(bytes: number | null): string {
  if (bytes === null || bytes === undefined) return '—'
  if (bytes < 1024) return `${bytes} o`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`
}

export function getFileTypeFromMime(mime: string): string {
  if (mime.includes('pdf')) return 'PDF'
  if (mime.includes('wordprocessing') || mime.includes('msword')) return 'DOCX'
  if (mime.includes('spreadsheet') || mime.includes('ms-excel')) return 'XLSX'
  if (mime.includes('presentation') || mime.includes('ms-powerpoint')) return 'PPTX'
  return mime.split('/').pop()?.toUpperCase() ?? 'FILE'
}
