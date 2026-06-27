import { api } from './api'

export interface AdminUser {
  id: number
  email: string
  firstName: string | null
  lastName: string | null
  name: string
  phone: string | null
  avatar: string | null
  roles: string[]
  role: string
  roleEntity: {
    id: number
    name: string
    permissions: Record<string, boolean>
  } | null
  isActive: boolean
  status: 'Actif' | 'Inactif'
  lastLogin: string | null
  createdAt: string | null
  updatedAt: string | null
}

export interface Role {
  id: number
  name: string
  permissions: Record<string, boolean>
  createdAt: string | null
  updatedAt: string | null
}

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
  createdBy: { id: number; name: string } | null
}

export interface PermissionModule {
  key: string
  label: string
  icon: string
}

export interface DashboardStats {
  stats: {
    totalProjects: number
    totalEvents: number
    totalNews: number
    totalUsers: number
    totalPartners: number
    totalGallery: number
    totalTestimonials: number
    totalDocuments: number
    totalSubscribers: number
  }
  recentEvents: {
    id: number
    title: string
    date: string | null
    location: string
    status: string
  }[]
  recentNews: {
    id: number
    title: string
    date: string | null
    category: string
    coverImage: string | null
  }[]
  recentProjects: {
    id: number
    title: string
    location: string
    status: string
    startDate: string | null
  }[]
  monthlyStats: { label: string; value: number }[]
  contentDistribution: { label: string; value: number; color: string }[]
}

export const adminService = {
  // Users
  getUsers: () => api.get<AdminUser[]>('/api/admin/users'),

  getUser: (id: number) => api.get<AdminUser>(`/api/admin/users/${id}`),

  createUser: (data: Partial<AdminUser> & { email: string; password: string; roleId?: number }) =>
    api.post<AdminUser>('/api/admin/users', data),

  updateUser: (id: number, data: Partial<AdminUser> & { password?: string; roleId?: number }) =>
    api.put<AdminUser>(`/api/admin/users/${id}`, data),

  deleteUser: (id: number) => api.delete<{ message: string }>(`/api/admin/users/${id}`),

  toggleUserStatus: (id: number) =>
    api.patch<AdminUser>(`/api/admin/users/${id}/status`),

  // Roles
  getRoles: () => api.get<Role[]>('/api/admin/roles'),

  getRole: (id: number) => api.get<Role>(`/api/admin/roles/${id}`),

  createRole: (data: { name: string; permissions: Record<string, boolean> }) =>
    api.post<Role>('/api/admin/roles', data),

  updateRole: (id: number, data: { name?: string; permissions?: Record<string, boolean> }) =>
    api.put<Role>(`/api/admin/roles/${id}`, data),

  deleteRole: (id: number) => api.delete<{ message: string }>(`/api/admin/roles/${id}`),

  getPermissionModules: () => api.get<PermissionModule[]>('/api/admin/roles/permissions'),

  // Events
  getEvents: () => api.get<AdminEvent[]>('/api/admin/events'),

  getEvent: (id: number) => api.get<AdminEvent>(`/api/admin/events/${id}`),

  createEvent: (data: {
    title: string
    description?: string
    date: string
    time?: string
    location: string
    status?: string
    coverImage?: string
    gallery?: string[]
  }) => api.post<AdminEvent>('/api/admin/events', data),

  updateEvent: (id: number, data: Partial<{
    title: string
    description: string
    date: string
    time: string
    location: string
    status: string
    coverImage: string
    gallery: string[]
  }>) => api.put<AdminEvent>(`/api/admin/events/${id}`, data),

  deleteEvent: (id: number) => api.delete<{ message: string }>(`/api/admin/events/${id}`),

  // Dashboard
  getDashboardStats: () => api.get<DashboardStats>('/api/admin/dashboard/stats'),

  // Profile
  getProfile: () => api.get<AdminUser & { createdAt: string | null }>('/api/admin/profile'),

  updateProfile: (data: { firstName?: string; lastName?: string; email?: string; phone?: string; avatar?: string }) =>
    api.put<AdminUser>('/api/admin/profile', data),

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put<{ message: string }>('/api/admin/profile/password', data),
}
