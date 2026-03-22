'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { MOCK_COORDINATOR_USERS, MOCK_DONOR_USERS } from './mockData'

/* ─── Types ─── */

export interface AuthUser {
  id: number
  name: string
  email: string
  organization: string
  role: 'donor' | 'coordinator'
}

interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (email: string, password: string) => { ok: boolean; error?: string }
  register: (name: string, email: string, password: string, role?: 'donor' | 'coordinator') => { ok: boolean; error?: string }
  logout: () => void
}

const STORAGE_KEY = 'handlend_auth'

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

/* ─── In-memory user registry (seeded from mock data) ─── */

interface StoredUser extends AuthUser {
  password: string
}

let userRegistry: StoredUser[] = [
  ...MOCK_COORDINATOR_USERS.map((u) => ({ ...u, role: 'coordinator' as const })),
  ...MOCK_DONOR_USERS.map((u) => ({ ...u, role: 'donor' as const })),
]

/* ─── Provider ─── */

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed: AuthUser = JSON.parse(raw)
        if (parsed?.email) setUser(parsed)
      }
    } catch {
      // ignore corrupt storage
    }
  }, [])

  const persist = useCallback((u: AuthUser | null) => {
    if (u) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(u))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
    setUser(u)
  }, [])

  const login = useCallback(
    (email: string, password: string): { ok: boolean; error?: string } => {
      const found = userRegistry.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
      )
      if (!found) return { ok: false, error: 'Invalid email or password' }
      const { password: _, ...safe } = found
      persist(safe)
      return { ok: true }
    },
    [persist],
  )

  const register = useCallback(
    (
      name: string,
      email: string,
      password: string,
      role: 'donor' | 'coordinator' = 'donor',
    ): { ok: boolean; error?: string } => {
      if (userRegistry.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
        return { ok: false, error: 'An account with this email already exists' }
      }
      const newUser: StoredUser = {
        id: Date.now(),
        name,
        email,
        organization: '',
        role,
        password,
      }
      userRegistry = [...userRegistry, newUser]
      const { password: _, ...safe } = newUser
      persist(safe)
      return { ok: true }
    },
    [persist],
  )

  const logout = useCallback(() => persist(null), [persist])

  const value = useMemo<AuthContextValue>(
    () => ({ user, isAuthenticated: !!user, login, register, logout }),
    [user, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/* ─── Hook ─── */

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
