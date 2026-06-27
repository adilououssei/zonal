import { api } from './api'

export interface PublicStats {
  projects: number
  completedProjects: number
  events: number
  news: number
  partners: number
  testimonials: number
  gallery: number
  documents: number
}

export const publicStatsService = {
  get: () => api.get<PublicStats>('/api/stats', false),
}
