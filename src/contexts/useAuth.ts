import { useContext } from 'react'
import { AuthContext } from './AuthContext'
import type { AuthContextType } from './AuthContext'

// Hook d'accès au contexte d'authentification (user courant, login/logout...).
// Doit être appelé depuis un composant situé sous <AuthProvider> (voir main.tsx).
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
