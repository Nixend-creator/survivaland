import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Language } from "@/types"

export function ProfilePage() {
  const { user, isAuthenticated, isLoading, updateProfile, logout } = useAuth()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [username, setUsername] = useState("")
  const [minecraftUsername, setMinecraftUsername] = useState("")
  const [language, setLanguage] = useState<Language>("uk")
  const [notifications, setNotifications] = useState(true)
  const [saving, setSaving] = useState(false)

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center text-[var(--color-text-muted)]">
        Завантаження...
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    navigate("/login")
    return null
  }

  const startEdit = () => {
    setUsername(user.username)
    setMinecraftUsername(user.minecraftUsername || "")
    setLanguage(user.language)
    setNotifications(user.notifications)
    setEditing(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateProfile({ username, minecraftUsername: minecraftUsername || undefined, language, notifications })
      toast.success("Профіль оновлено")
      setEditing(false)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Помилка збереження")
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    toast.success("Вихід виконано")
    navigate("/")
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold sm:text-3xl">Профіль</h1>
        <div className="flex gap-2">
          {user.role === "admin" || user.role === "moderator" ? (
            <Link to="/admin">
              <Button variant="secondary" size="sm">Адмін-панель</Button>
            </Link>
          ) : null}
          <Button variant="outline" size="sm" onClick={handleLogout}>Вийти</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-xl bg-[var(--color-primary-muted)] flex items-center justify-center text-2xl font-bold text-[var(--color-primary)]">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                {user.username}
                <Badge variant={user.role === "admin" ? "danger" : "secondary"}>{user.role}</Badge>
              </CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {!editing ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2 text-sm">
                <div>
                  <p className="text-[var(--color-text-dim)]">Minecraft нік</p>
                  <p className="font-medium">{user.minecraftUsername || "—"}</p>
                </div>
                <div>
                  <p className="text-[var(--color-text-dim)]">Мова</p>
                  <p className="font-medium uppercase">{user.language}</p>
                </div>
                <div>
                  <p className="text-[var(--color-text-dim)]">Сповіщення</p>
                  <p className="font-medium">{user.notifications ? "Увімкнено" : "Вимкнено"}</p>
                </div>
                <div>
                  <p className="text-[var(--color-text-dim)]">Дата реєстрації</p>
                  <p className="font-medium">{new Date(user.createdAt).toLocaleDateString("uk-UA")}</p>
                </div>
              </div>
              <Button onClick={startEdit} variant="secondary">Редагувати</Button>
            </>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-[var(--color-text-muted)] mb-1">Нікнейм</label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3 py-2 text-sm focus:border-[var(--color-primary)] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-[var(--color-text-muted)] mb-1">Minecraft нік</label>
                <input
                  value={minecraftUsername}
                  onChange={(e) => setMinecraftUsername(e.target.value)}
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3 py-2 text-sm focus:border-[var(--color-primary)] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-[var(--color-text-muted)] mb-1">Мова</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as Language)}
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3 py-2 text-sm focus:border-[var(--color-primary)] focus:outline-none"
                >
                  <option value="uk">Українська</option>
                  <option value="ru">Русский</option>
                  <option value="en">English</option>
                </select>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                  className="rounded border-[var(--color-border)]"
                />
                Отримувати сповіщення
              </label>
              <div className="flex gap-2">
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? "Збереження..." : "Зберегти"}
                </Button>
                <Button variant="outline" onClick={() => setEditing(false)}>Скасувати</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
