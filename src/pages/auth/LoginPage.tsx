import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { useAuth } from "@/hooks/useAuth"
import { useI18n } from "@/i18n"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { config } from "@/config"
import { OAuthButtons } from "@/components/auth/OAuthButtons"

export function LoginPage() {
  const { t } = useI18n()
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
      toast.error(t("auth.fillAll"))
      return
    }
    setLoading(true)
    try {
      await login({ email, password })
      toast.success(t("auth.loginSuccess"))
      navigate("/profile")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("auth.loginError"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{t("auth.loginTitle")}</CardTitle>
          <CardDescription>{t("auth.loginSubtitle")}</CardDescription>
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
                {t("auth.password")}
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3 py-2.5 text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
              />
              <div className="mt-1.5 text-right">
                <Link to="/forgot-password" className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-primary)]">
                  {t("auth.forgotPassword")}
                </Link>
              </div>
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? t("common.loading") : t("auth.loginBtn")}
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
            {t("auth.noAccount")}{" "}
            <Link to="/register" className="text-[var(--color-primary)] hover:underline">
              {t("auth.registerLink")}
            </Link>
          </p>

          {config.demoMode && (
            <p className="mt-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-elevated)]/50 px-3 py-2 text-center text-[10px] text-[var(--color-text-dim)]">
              {t("auth.demoHint")}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
