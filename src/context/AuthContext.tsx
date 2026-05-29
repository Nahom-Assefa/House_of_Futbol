import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

// DEV-ONLY: remove before production and replace with Supabase auth
const DEV_CREDENTIALS = { username: 'Trane', password: 'asdfASDF1!' }

const SESSION_KEY = 'hof_admin_auth'

interface AuthContextValue {
  isAuthenticated: boolean
  login: (username: string, password: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem(SESSION_KEY) === 'true'
  )

  function login(username: string, password: string): boolean {
    if (username === DEV_CREDENTIALS.username && password === DEV_CREDENTIALS.password) {
      setIsAuthenticated(true)
      sessionStorage.setItem(SESSION_KEY, 'true')
      return true
    }
    return false
  }

  function logout() {
    setIsAuthenticated(false)
    sessionStorage.removeItem(SESSION_KEY)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
