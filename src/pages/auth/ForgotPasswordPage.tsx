import { useState } from "react"
import { Link } from "react-router-dom"
import { toast } from "sonner"
import { requestPasswordReset } from "@/services/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await requestPasswordReset(email)
      setSent(true)
      toast.success("Якщо акаунт існує, лист надіслано")
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
          <CardTitle>Скидання пароля</CardTitle>
          <CardDescription>
            Вкажіть email — надішлемо посилання для нового пароля
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sent ? (
            <div className="space-y-4 text-sm text-[var(--color-text-muted)]">
              <p>
                Перевірте пошту <strong className="text-[var(--color-text)]">{email}</strong>.
                У demo-режимі лист не надсилається — просто увійдіть знову.
              </p>
              <Link to="/login">
                <Button variant="outline" className="w-full">
                  До входу
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-[var(--color-text-muted)]">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3 py-2 text-sm focus:border-[var(--color-primary)] focus:outline-none"
                  placeholder="you@email.com"
                  autoComplete="email"
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Надсилання..." : "Надіслати посилання"}
              </Button>
              <p className="text-center text-sm text-[var(--color-text-muted)]">
                <Link to="/login" className="text-[var(--color-primary)] hover:underline">
                  Назад до входу
                </Link>
              </p>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
