import { useState, useCallback, type ReactNode } from 'react'
import { authService } from '../services/auth'
import { AuthContext } from './AuthContext'
import type { User } from '../services/auth'

// Fournit l'état d'authentification à toute l'application (voir main.tsx où
// il englobe les routes). Ne fait que déléguer à authService (localStorage) :
// ce composant sert surtout à re-rendre l'UI quand l'utilisateur se
// (dé)connecte, ce que authService seul ne peut pas déclencher.
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => authService.getUser())

  const login = useCallback(async (email: string, password: string) => {
    const userData = await authService.login(email, password)
    setUser(userData)
    return userData
  }, [])

  const logout = useCallback(() => {
    authService.logout()
    setUser(null)
  }, [])

  // Recharge l'utilisateur depuis le localStorage (ex: après modification du profil)
  const refreshUser = useCallback(() => {
    setUser(authService.getUser())
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: authService.isAuthenticated(),
        isAdmin: authService.isAdmin(),
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
