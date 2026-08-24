import { createContext } from 'react'
import type { User } from '../services/auth'

// Définition du contexte React d'authentification. Le contexte lui-même est
// créé ici (fichier séparé requis par Fast Refresh), mais sa valeur réelle est
// fournie par AuthProvider.tsx et consommée via le hook useAuth().
export interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isAdmin: boolean
  login: (email: string, password: string) => Promise<User>
  logout: () => void
  refreshUser: () => void
}

export const AuthContext = createContext<AuthContextType | null>(null)
