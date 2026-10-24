import { useEffect, useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  getSiteSettings,
  updateSiteSettings,
  type SiteSettings,
} from "@/services/siteSettings"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function AdminSettings() {
  const queryClient = useQueryClient()
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["site-settings"],
    queryFn: getSiteSettings,
  })

  const [form, setForm] = useState<SiteSettings | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (data) setForm(data)
  }, [data])

  const handleSave = async () => {
    if (!form) return
    if (!form.serverIp.trim()) {
      toast.error("IP сервера обов'язковий")
      return
    }
    setSaving(true)
    try {
      const saved = await updateSiteSettings(form)
      setForm(saved)
      await queryClient.invalidateQueries({ queryKey: ["site-settings"] })
      // also refresh server status which may show IP
      await queryClient.invalidateQueries({ queryKey: ["serverStatus"] })
      toast.success("Налаштування збережено")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Помилка збереження")
    } finally {
      setSaving(false)
    }
  }

  if (isLoading || !form) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Налаштування</h1>
        <p className="text-sm text-[var(--color-text-muted)]">Завантаження...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Налаштування</h1>
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-10">
            <p className="text-[var(--color-text-muted)]">Не вдалося завантажити</p>
            <Button variant="secondary" size="sm" onClick={() => refetch()}>
              Спробувати знову
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Налаштування</h1>
          <p className="text-sm text-[var(--color-text-muted)]">
            Параметри сайту · <Badge variant="warning">DEMO · localStorage</Badge>
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Збереження..." : "Зберегти"}
        </Button>
      </div>

      <div className="grid gap-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Сервер</CardTitle>
            <CardDescription>Адреса та версії Minecraft</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Field label="IP / домен">
              <input
                value={form.serverIp}
                onChange={(e) => setForm((f) => f && { ...f, serverIp: e.target.value })}
                className={inputClass}
                placeholder="survivaland.top"
              />
            </Field>
            <Field label="Діапазон версій">
              <input
                value={form.versionRange}
                onChange={(e) => setForm((f) => f && { ...f, versionRange: e.target.value })}
                className={inputClass}
                placeholder="1.17.1–1.21.11"
              />
            </Field>
            <Field label="Поточна версія">
              <input
                value={form.currentVersion}
                onChange={(e) =>
                  setForm((f) => f && { ...f, currentVersion: e.target.value })
                }
                className={inputClass}
                placeholder="1.21.11"
              />
            </Field>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Бренд і спільнота</CardTitle>
            <CardDescription>Слоган і Discord</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Field label="Слоган">
              <input
                value={form.slogan}
                onChange={(e) => setForm((f) => f && { ...f, slogan: e.target.value })}
                className={inputClass}
                placeholder="Survival • Building • Community"
              />
            </Field>
            <Field label="Discord invite URL">
              <input
                value={form.discordInvite}
                onChange={(e) =>
                  setForm((f) => f && { ...f, discordInvite: e.target.value })
                }
                className={inputClass}
                placeholder="https://discord.gg/..."
              />
            </Field>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Режим</CardTitle>
            <CardDescription>Технічні перемикачі</CardDescription>
          </CardHeader>
          <CardContent>
            <label className="flex items-center gap-3 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={form.maintenanceMode}
                onChange={(e) =>
                  setForm((f) => f && { ...f, maintenanceMode: e.target.checked })
                }
                className="h-4 w-4 rounded border-[var(--color-border)]"
              />
              <span>
                Режим техробіт
                <span className="block text-xs text-[var(--color-text-dim)]">
                  Відвідувачі бачать заглушку; admin може увійти та вимкнути режим
                </span>
              </span>
            </label>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

const inputClass =
  "w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-dim)] focus:border-[var(--color-primary)] focus:outline-none"

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-[var(--color-text-muted)]">{label}</label>
      {children}
    </div>
  )
}
