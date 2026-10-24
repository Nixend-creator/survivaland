import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { OAuthButtons } from "@/components/auth/OAuthButtons"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export function RegisterPage() {
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
      toast.error("Заповніть усі поля")
      return
    }
    if (password.length < 6) {
      toast.error("Пароль має бути мінімум 6 символів")
      return
    }
    setLoading(true)
    try {
      await register({ email, username, password })
      toast.success("Реєстрацію завершено")
      navigate("/profile")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Помилка реєстрації")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Реєстрація</CardTitle>
          <CardDescription>Створіть акаунт SurvivaLand</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-[var(--color-text-muted)] mb-1.5">
                Нікнейм
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
                Пароль
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3 py-2.5 text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                placeholder="Мінімум 6 символів"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Реєстрація..." : "Зареєструватися"}
            </Button>
          </form>

          <OAuthButtons />

          <p className="mt-6 text-center text-sm text-[var(--color-text-muted)]">
            Вже є акаунт?{" "}
            <Link to="/login" className="text-[var(--color-primary)] hover:underline">
              Увійти
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
