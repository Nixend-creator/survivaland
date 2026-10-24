import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { updatePassword } from "@/services/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export function ResetPasswordPage() {
  const navigate = useNavigate()
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) {
      toast.error("Паролі не збігаються")
      return
    }
    setLoading(true)
    try {
      await updatePassword(password)
      toast.success("Пароль оновлено")
      navigate("/login")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Помилка")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col justify-center px-4 py-16">
      <Card>
        <CardHeader>
          <CardTitle>Новий пароль</CardTitle>
          <CardDescription>
            Встановіть новий пароль після переходу з листа (Supabase)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--color-text-muted)]">
                Новий пароль
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3 py-2 text-sm focus:border-[var(--color-primary)] focus:outline-none"
                autoComplete="new-password"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--color-text-muted)]">
                Підтвердження
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3 py-2 text-sm focus:border-[var(--color-primary)] focus:outline-none"
                autoComplete="new-password"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Збереження..." : "Зберегти пароль"}
            </Button>
            <p className="text-center text-sm text-[var(--color-text-muted)]">
              <Link to="/login" className="text-[var(--color-primary)] hover:underline">
                До входу
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
