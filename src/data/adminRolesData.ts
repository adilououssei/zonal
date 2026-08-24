// Ancien jeu de données fictif (n'est plus importé nulle part) : les rôles et
// modules de permissions réels viennent désormais de l'API via
// services/admin.ts (adminService.getRoles / getPermissionModules).
export interface PermissionModule {
  key: string
  label: string
  icon: string // nom d'icône lucide-react, résolu dans le composant
}

export interface RoleItem {
  id: number
  name: string
  permissions: Record<string, boolean> // clé = PermissionModule.key
}

export const permissionModules: PermissionModule[] = [
  { key: 'dashboard', label: 'Tableau de bord', icon: 'LayoutDashboard' },
  { key: 'events', label: 'Événements', icon: 'Calendar' },
  { key: 'news', label: 'Actualités', icon: 'Newspaper' },
  { key: 'projects', label: 'Projets', icon: 'FolderOpen' },
  { key: 'users', label: 'Utilisateurs', icon: 'Users' },
  { key: 'settings', label: 'Paramètres', icon: 'Settings' },
]

export const roles: RoleItem[] = [
  {
    id: 1,
    name: 'Super Administrateur',
    permissions: {
      dashboard: true,
      events: true,
      news: true,
      projects: true,
      users: true,
      settings: true,
    },
  },
  {
    id: 2,
    name: 'Administrateur',
    permissions: {
      dashboard: true,
      events: true,
      news: true,
      projects: true,
      users: false,
      settings: false,
    },
  },
  {
    id: 3,
    name: 'Éditeur',
    permissions: {
      dashboard: true,
      events: false,
      news: false,
      projects: false,
      users: false,
      settings: false,
    },
  },
]