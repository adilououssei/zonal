import { useState, useCallback, type ReactNode } from 'react'
import { authService } from '../services/auth'
import { AuthContext } from './AuthContext'
import type { User } from '../services/auth'

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
