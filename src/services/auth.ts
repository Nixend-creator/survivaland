/**
 * Auth service: DEMO localStorage OR real Supabase Auth.
 * Admin role must also be enforced by RLS / server — never trust client alone.
 */

import { config } from "@/config"
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase"
import type { UserProfile, UserRole } from "@/types"

const STORAGE_KEY = "sl-auth-session"

export interface AuthSession {
  user: UserProfile
  accessToken: string
  expiresAt: number
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  username: string
}

const DEMO_USER: UserProfile = {
  id: "demo-user-001",
  email: "demo@survivaland.top",
  username: "DemoPlayer",
  minecraftUsername: "DemoPlayer",
  language: "uk",
  role: "user",
  notifications: true,
  createdAt: "2025-01-15T10:00:00Z",
}

const DEMO_ADMIN: UserProfile = {
  id: "demo-admin-001",
  email: "admin@survivaland.top",
  username: "Admin",
  minecraftUsername: "AdminSL",
  language: "uk",
  role: "admin",
  notifications: true,
  createdAt: "2024-01-01T00:00:00Z",
}

function useDemo(): boolean {
  return config.demoMode || !isSupabaseConfigured()
}

function saveSession(session: AuthSession | null) {
  if (session) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
  } else {
    localStorage.removeItem(STORAGE_KEY)
  }
}

export function getStoredSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const session = JSON.parse(raw) as AuthSession
    if (session.expiresAt < Date.now()) {
      saveSession(null)
      return null
    }
    return session
  } catch {
    return null
  }
}

async function fetchProfile(userId: string): Promise<UserProfile | null> {
  const supabase = getSupabase()
  if (!supabase) return null
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle()
  if (error || !data) return null
  return {
    id: data.id,
    email: data.email ?? "",
    username: data.username,
    minecraftUsername: data.minecraft_username ?? undefined,
    language: data.language ?? "uk",
    role: data.role ?? "user",
    notifications: data.notifications ?? true,
    createdAt: data.created_at ?? new Date().toISOString(),
  }
}

export async function login(credentials: LoginCredentials): Promise<AuthSession> {
  if (useDemo()) {
    await new Promise((r) => setTimeout(r, 600))
    const isAdmin = credentials.email.toLowerCase().startsWith("admin")
    const user = isAdmin
      ? DEMO_ADMIN
      : {
          ...DEMO_USER,
          email: credentials.email,
          username: credentials.email.split("@")[0] || "Player",
        }
    const session: AuthSession = {
      user,
      accessToken: "demo-token-" + Date.now(),
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    }
    saveSession(session)
    return session
  }

  const supabase = getSupabase()!
  const { data, error } = await supabase.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password,
  })
  if (error) throw new Error(error.message)
  if (!data.session || !data.user) throw new Error("Немає сесії")

  let profile = await fetchProfile(data.user.id)
  if (!profile) {
    profile = {
      id: data.user.id,
      email: data.user.email ?? credentials.email,
      username: data.user.email?.split("@")[0] ?? "Player",
      language: "uk",
      role: "user",
      notifications: true,
      createdAt: new Date().toISOString(),
    }
  }

  const session: AuthSession = {
    user: profile,
    accessToken: data.session.access_token,
    expiresAt: (data.session.expires_at ?? 0) * 1000 || Date.now() + 3600_000,
  }
  saveSession(session)
  return session
}

export async function register(data: RegisterData): Promise<AuthSession> {
  if (useDemo()) {
    await new Promise((r) => setTimeout(r, 800))
    const user: UserProfile = {
      id: "demo-" + Date.now(),
      email: data.email,
      username: data.username,
      language: "uk",
      role: "user",
      notifications: true,
      createdAt: new Date().toISOString(),
    }
    const session: AuthSession = {
      user,
      accessToken: "demo-token-" + Date.now(),
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    }
    saveSession(session)
    return session
  }

  const supabase = getSupabase()!
  const { data: authData, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: { username: data.username },
    },
  })
  if (error) throw new Error(error.message)
  if (!authData.user) throw new Error("Реєстрація не вдалася")

  // Email confirmation may be required — session can be null
  if (!authData.session) {
    throw new Error(
      "Перевірте email для підтвердження акаунта, потім увійдіть."
    )
  }

  let profile = await fetchProfile(authData.user.id)
  if (!profile) {
    profile = {
      id: authData.user.id,
      email: data.email,
      username: data.username,
      language: "uk",
      role: "user",
      notifications: true,
      createdAt: new Date().toISOString(),
    }
  }

  const session: AuthSession = {
    user: profile,
    accessToken: authData.session.access_token,
    expiresAt: (authData.session.expires_at ?? 0) * 1000 || Date.now() + 3600_000,
  }
  saveSession(session)
  return session
}

export async function logout(): Promise<void> {
  saveSession(null)
  if (!useDemo()) {
    const supabase = getSupabase()
    if (supabase) await supabase.auth.signOut()
  }
}

export async function updateProfile(
  updates: Partial<
    Pick<UserProfile, "username" | "minecraftUsername" | "language" | "notifications">
  >
): Promise<UserProfile> {
  const session = getStoredSession()
  if (!session) throw new Error("Not authenticated")

  if (useDemo()) {
    await new Promise((r) => setTimeout(r, 400))
    const updated = { ...session.user, ...updates }
    saveSession({ ...session, user: updated })
    return updated
  }

  const supabase = getSupabase()!
  const { data, error } = await supabase
    .from("profiles")
    .update({
      username: updates.username,
      minecraft_username: updates.minecraftUsername,
      language: updates.language,
      notifications: updates.notifications,
      updated_at: new Date().toISOString(),
    })
    .eq("id", session.user.id)
    .select()
    .single()

  if (error) throw new Error(error.message)

  const updated: UserProfile = {
    ...session.user,
    username: data.username,
    minecraftUsername: data.minecraft_username ?? undefined,
    language: data.language ?? "uk",
    notifications: data.notifications ?? true,
  }
  saveSession({ ...session, user: updated })
  return updated
}



export type OAuthProvider = "discord" | "google"

/**
 * Start OAuth via Supabase. Requires provider enabled in Supabase Dashboard
 * and VITE_OAUTH_DISCORD / VITE_OAUTH_GOOGLE = true.
 */
export async function signInWithOAuthProvider(provider: OAuthProvider): Promise<void> {
  if (useDemo()) {
    throw new Error(
      "OAuth недоступний у DEMO_MODE. Вимкніть demo і налаштуйте Supabase Auth providers."
    )
  }
  if (provider === "discord" && !config.oauthDiscord) {
    throw new Error("Discord OAuth вимкнено (VITE_OAUTH_DISCORD)")
  }
  if (provider === "google" && !config.oauthGoogle) {
    throw new Error("Google OAuth вимкнено (VITE_OAUTH_GOOGLE)")
  }
  const supabase = getSupabase()
  if (!supabase) throw new Error("Supabase не налаштовано")

  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/profile`,
    },
  })
  if (error) throw new Error(error.message)
}

export async function requestPasswordReset(email: string): Promise<void> {
  if (!email.trim()) throw new Error("Вкажіть email")
  if (useDemo()) {
    await new Promise((r) => setTimeout(r, 500))
    // Demo: pretend email was sent
    return
  }
  const supabase = getSupabase()!
  const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
    redirectTo: `${window.location.origin}/reset-password`,
  })
  if (error) throw new Error(error.message)
}

export async function updatePassword(newPassword: string): Promise<void> {
  if (newPassword.length < 6) throw new Error("Пароль має бути не коротшим за 6 символів")
  if (useDemo()) {
    await new Promise((r) => setTimeout(r, 400))
    return
  }
  const supabase = getSupabase()!
  const { error } = await supabase.auth.updateUser({ password: newPassword })
  if (error) throw new Error(error.message)
}

export function hasRole(user: UserProfile | null, roles: UserRole[]): boolean {
  if (!user) return false
  return roles.includes(user.role)
}

export function isAdmin(user: UserProfile | null): boolean {
  return hasRole(user, ["admin", "moderator"])
}
