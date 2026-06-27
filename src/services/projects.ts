import { api } from './api'

export interface AdminProject {
  id: number
  title: string
  description: string | null
  image: string | null
  location: string
  budget: string | null
  startDate: string | null
  endDate: string | null
  status: string
  createdAt: string | null
  updatedAt: string | null
  createdBy: { id: number; name: string } | null
}

export const projectsService = {
  getAll: () => api.get<AdminProject[]>('/api/admin/projects'),

  getById: (id: number) => api.get<AdminProject>(`/api/admin/projects/${id}`),

  create: (data: {
    title: string
    description?: string
    image?: string
    location: string
    budget?: string
    startDate?: string
    endDate?: string
    status?: string
  }) => api.post<AdminProject>('/api/admin/projects', data),

  update: (id: number, data: Partial<{
    title: string
    description: string
    image: string
    location: string
    budget: string
    startDate: string
    endDate: string
    status: string
  }>) => api.put<AdminProject>(`/api/admin/projects/${id}`, data),

  delete: (id: number) => api.delete<{ message: string }>(`/api/admin/projects/${id}`),
}

export interface PublicProject {
  id: number
  title: string
  description: string | null
  image: string | null
  location: string
  startDate: string | null
  endDate: string | null
  status: string
}

export const publicProjectsService = {
  getAll: () => api.get<PublicProject[]>('/api/projects', false),

  getCompleted: () => api.get<PublicProject[]>('/api/projects/completed', false),

  getById: (id: number) => api.get<PublicProject>(`/api/projects/${id}`, false),
}
