import { createContext } from 'react'
import type { User } from '../services/auth'

export interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isAdmin: boolean
  login: (email: string, password: string) => Promise<User>
  logout: () => void
  refreshUser: () => void
}

export const AuthContext = createContext<AuthContextType | null>(null)
