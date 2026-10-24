import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import {
  login as authLogin,
  register as authRegister,
  logout as authLogout,
  getStoredSession,
  updateProfile as authUpdateProfile,
  type AuthSession,
  type LoginCredentials,
  type RegisterData,
} from "@/services/auth"
import type { UserProfile } from "@/types"

interface AuthContextValue {
  user: UserProfile | null
  session: AuthSession | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (updates: Partial<Pick<UserProfile, "username" | "minecraftUsername" | "language" | "notifications">>) => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const stored = getStoredSession()
    setSession(stored)
    setIsLoading(false)
  }, [])

  const login = useCallback(async (credentials: LoginCredentials) => {
    const s = await authLogin(credentials)
    setSession(s)
  }, [])

  const register = useCallback(async (data: RegisterData) => {
    const s = await authRegister(data)
    setSession(s)
  }, [])

  const logout = useCallback(async () => {
    await authLogout()
    setSession(null)
  }, [])

  const updateProfile = useCallback(async (updates: Parameters<typeof authUpdateProfile>[0]) => {
    const user = await authUpdateProfile(updates)
    setSession((prev) => (prev ? { ...prev, user } : null))
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user: session?.user ?? null,
        session,
        isLoading,
        isAuthenticated: Boolean(session),
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
