// Authentification côté front : connexion, déconnexion, et persistance du
// jeton JWT + des infos utilisateur dans le localStorage (pas de session
// serveur, l'API est stateless — voir security.yaml côté backend).
import { api } from './api'

export interface User {
  id: number
  email: string
  roles: string[]
  firstName: string | null
  lastName: string | null
  phone: string | null
  avatar: string | null
  roleEntity: {
    id: number
    name: string
    permissions: Record<string, boolean>
  } | null
}

interface LoginResponse {
  token: string
  user: User
}

class AuthService {
  private readonly TOKEN_KEY = 'zonal_token'
  private readonly USER_KEY = 'zonal_user'

  async login(email: string, password: string): Promise<User> {
    const data = await api.post<LoginResponse>('/api/login', { email, password }, false)
    this.setToken(data.token)
    this.setUser(data.user)
    return data.user
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY)
    localStorage.removeItem(this.USER_KEY)
    localStorage.removeItem('zonal_admin')
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY)
  }

  getUser(): User | null {
    const raw = localStorage.getItem(this.USER_KEY)
    if (!raw) return null
    try {
      return JSON.parse(raw) as User
    } catch {
      return null
    }
  }

  isAuthenticated(): boolean {
    return !!this.getToken()
  }

  hasRole(role: string): boolean {
    const user = this.getUser()
    return user ? user.roles.includes(role) : false
  }

  isAdmin(): boolean {
    return this.hasRole('ROLE_ADMIN') || this.hasRole('ROLE_SUPER_ADMIN')
  }

  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token)
  }

  private setUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user))
  }

  // Utilisé après une modification du profil pour rafraîchir les infos affichées
  // (nom, avatar...) sans repasser par un login complet
  updateUser(user: User): void {
    this.setUser(user)
  }

  refreshUser(): void {
    // no-op: user data is fetched from storage
  }
}

export const authService = new AuthService()
