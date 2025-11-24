'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react'
import { AuthUser, loginRequest, LoginResponse } from '@/lib/api'

type AuthState = {
  user: AuthUser | null
  token: string | null
  isLoading: boolean
  login: (
    cpf: string,
    password: string
  ) => Promise<{ ok: boolean; error?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthState | undefined>(undefined)

const STORAGE_KEY = 'aspec-auth'

type StoredAuth = {
  user: AuthUser
  token: string
  expiresAt: string
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const raw =
        typeof window !== 'undefined'
          ? window.localStorage.getItem(STORAGE_KEY)
          : null

      if (raw) {
        const parsed = JSON.parse(raw) as StoredAuth

        setUser(parsed.user)
        setToken(parsed.token)
      }
    } catch (err) {
      console.warn('Erro ao ler auth do localStorage', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const login = async (cpf: string, password: string) => {
    try {
      const data: LoginResponse = await loginRequest(cpf, password)

      if (!data.success) {
        return {
          ok: false as const,
          error: data.message || 'Falha ao autenticar',
        }
      }

      const { user, token, expiresAt } = data

      const stored: StoredAuth = { user, token, expiresAt }
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stored))

      setUser(user)
      setToken(token)

      return { ok: true as const }
    } catch (err: unknown) {
      console.error('Erro no login:', err)
      return {
        ok: false as const,
        error: err instanceof Error ? err.message : 'Erro ao autenticar',
      }
    }
  }

  const logout = () => {
    window.localStorage.removeItem(STORAGE_KEY)
    
    setUser(null)
    setToken(null)
  }

  const value: AuthState = { user, token, isLoading, login, logout }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
