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

  // Recharge le rôle/les permissions depuis l'API (ex: au montage de l'admin) :
  // contrairement à refreshUser, va chercher l'état réel côté serveur plutôt
  // que de relire le localStorage, pour qu'un changement de permissions fait
  // par un super administrateur s'applique dès le prochain chargement de la
  // page, sans devoir se déconnecter/reconnecter. Échec silencieux (ex: token
  // expiré) : la page se chargera avec les données déjà en cache, et les
  // appels API échoueront normalement avec leur propre message d'erreur.
  const syncUserFromServer = useCallback(async () => {
    try {
      const fresh = await authService.fetchCurrentUser()
      setUser(fresh)
    } catch {
      // ignore : token invalide/expiré, pas authentifié, etc. — géré ailleurs
    }
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
        syncUserFromServer,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
