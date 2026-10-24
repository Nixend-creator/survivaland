import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { config } from "@/config"
import { OAuthButtons } from "@/components/auth/OAuthButtons"

export function LoginPage() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) {
    navigate("/profile")
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error("Заповніть усі поля")
      return
    }
    setLoading(true)
    try {
      await login({ email, password })
      toast.success("Вхід виконано")
      navigate("/profile")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Помилка входу")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Вхід</CardTitle>
          <CardDescription>
            Увійдіть у свій акаунт SurvivaLand
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[var(--color-text-muted)] mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3 py-2.5 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-dim)] focus:border-[var(--color-primary)] focus:outline-none"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[var(--color-text-muted)] mb-1.5">
                Пароль
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3 py-2.5 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-dim)] focus:border-[var(--color-primary)] focus:outline-none"
                placeholder="••••••••"
              />
            </div>
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-primary)]"
              >
                Забули пароль?
              </Link>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Вхід..." : "Увійти"}
            </Button>
          </form>

          <OAuthButtons />

          <p className="mt-6 text-center text-sm text-[var(--color-text-muted)]">
            Немає акаунта?{" "}
            <Link to="/register" className="text-[var(--color-primary)] hover:underline">
              Зареєструватися
            </Link>
          </p>

          {config.demoMode && (
            <div className="mt-6 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-elevated)]/50 p-3 text-xs text-[var(--color-text-dim)]">
              <p className="font-medium text-[var(--color-text-muted)] mb-1">DEMO MODE</p>
              <p>Будь-який email/пароль працює.</p>
              <p>Email з «admin» → роль admin.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
