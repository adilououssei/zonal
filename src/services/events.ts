import { api } from './api'

export interface AdminEvent {
  id: number
  title: string
  description: string | null
  date: string
  day: string
  month: string
  year: string
  time: string | null
  location: string
  status: string
  coverImage: string | null
  gallery: string[] | null
  createdAt: string | null
  updatedAt: string | null
}

export const eventsService = {
  getAll: () => api.get<AdminEvent[]>('/api/admin/events'),

  getById: (id: number) => api.get<AdminEvent>(`/api/admin/events/${id}`),

  create: (data: {
    title: string
    description?: string
    date: string
    time?: string
    location: string
    status?: string
    coverImage?: string
    gallery?: string[]
  }) => api.post<AdminEvent>('/api/admin/events', data),

  update: (id: number, data: Partial<{
    title: string
    description: string
    date: string
    time: string
    location: string
    status: string
    coverImage: string
    gallery: string[]
  }>) => api.put<AdminEvent>(`/api/admin/events/${id}`, data),

  delete: (id: number) => api.delete<{ message: string }>(`/api/admin/events/${id}`),
}

export interface PublicEvent {
  id: number
  title: string
  description: string | null
  date: string
  day: string
  month: string
  year: string
  time: string | null
  location: string
  status: string
  image: string | null
  gallery: string[] | null
}

export const publicEventsService = {
  getAll: () => api.get<PublicEvent[]>('/api/events', false),

  getUpcoming: () => api.get<PublicEvent[]>('/api/events/upcoming', false),

  getPast: () => api.get<PublicEvent[]>('/api/events/past', false),

  getById: (id: number) => api.get<PublicEvent>(`/api/events/${id}`, false),
}
