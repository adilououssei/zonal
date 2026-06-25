// src/data/adminUsersData.ts
export type UserStatus = 'Actif' | 'Inactif'

export interface AdminUserItem {
  id: number
  name: string
  email: string
  phone: string
  role: string
  status: UserStatus
  lastLogin: string
}

export const adminUsers: AdminUserItem[] = [
  {
    id: 1,
    name: 'Admin Principal',
    email: 'admin@zonalong.org',
    phone: '+235 66 00 00 00',
    role: 'Super Admin',
    status: 'Actif',
    lastLogin: '02/06/2024 08:30',
  },
  {
    id: 2,
    name: 'Jean Martin',
    email: 'jean@zonalong.org',
    phone: '+235 66 11 23 33',
    role: 'Administrateur',
    status: 'Actif',
    lastLogin: '01/06/2024 14:20',
  },
  {
    id: 3,
    name: 'Aïssata Brahim',
    email: 'aissata@zonalong.org',
    phone: '+235 66 22 33 44',
    role: 'Éditeur',
    status: 'Actif',
    lastLogin: '31/05/2024 10:15',
  },
  {
    id: 4,
    name: 'Pierre D.',
    email: 'pierre@zonalong.org',
    phone: '+235 66 33 44 55',
    role: 'Éditeur',
    status: 'Actif',
    lastLogin: '25/05/2024 17:45',
  },
]

export const userStatusColorMap: Record<UserStatus, string> = {
  Actif: 'bg-emerald-100 text-emerald-700',
  Inactif: 'bg-gray-100 text-gray-500',
}