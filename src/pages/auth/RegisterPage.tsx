import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { useAuth } from "@/hooks/useAuth"
import { useI18n } from "@/i18n"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { OAuthButtons } from "@/components/auth/OAuthButtons"

export function RegisterPage() {
  const { t } = useI18n()
  const { register, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) {
    navigate("/profile")
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !username || !password) {
      toast.error(t("auth.fillAll"))
      return
    }
    if (password.length < 6) {
      toast.error(t("auth.passwordMin"))
      return
    }
    setLoading(true)
    try {
      await register({ email, username, password })
      toast.success(t("auth.registerSuccess"))
      navigate("/profile")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("auth.registerError"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{t("auth.registerTitle")}</CardTitle>
          <CardDescription>{t("auth.registerSubtitle")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-[var(--color-text-muted)] mb-1.5">
                {t("auth.username")}
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3 py-2.5 text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                placeholder="Steve"
              />
            </div>
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
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3 py-2.5 text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[var(--color-text-muted)] mb-1.5">
                {t("auth.password")}
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3 py-2.5 text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
              />
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? t("common.loading") : t("auth.registerBtn")}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--color-border)]" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[var(--color-surface)] px-2 text-[var(--color-text-dim)]">{t("auth.or")}</span>
            </div>
          </div>

          <OAuthButtons />

          <p className="mt-6 text-center text-sm text-[var(--color-text-muted)]">
            {t("auth.hasAccount")}{" "}
            <Link to="/login" className="text-[var(--color-primary)] hover:underline">
              {t("auth.loginLink")}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
