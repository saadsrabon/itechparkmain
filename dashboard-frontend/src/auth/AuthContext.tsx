import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { authApi } from '../lib/api'

type User = {
  id: string
  name: string
  email: string
  role: 'admin' | 'editor' | 'user'
  isActive: boolean
}

type AuthContextType = {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const bootstrap = useCallback(async () => {
    const token = localStorage.getItem('accessToken')
    if (!token) {
      setLoading(false)
      return
    }
    try {
      const { data } = await authApi.me()
      setUser(data.data.user)
    } catch {
      localStorage.removeItem('accessToken')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    bootstrap()
  }, [bootstrap])

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await authApi.login({ email, password })
    const token: string = data.data.token
    localStorage.setItem('accessToken', token)
    setUser(data.data.user)
  }, [])

  const logout = useCallback(async () => {
    try { await authApi.logout() } catch {}
    localStorage.removeItem('accessToken')
    setUser(null)
  }, [])

  const value = useMemo(() => ({ user, loading, login, logout }), [user, loading, login, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}






