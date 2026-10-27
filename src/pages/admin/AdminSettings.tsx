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
import { config } from "@/config"

const inputClass =
  "w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"

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
    setSaving(true)
    try {
      await updateSiteSettings(form)
      await queryClient.invalidateQueries({ queryKey: ["site-settings"] })
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

  const set = <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) =>
    setForm((f) => (f ? { ...f, [key]: value } : f))

  return (
    <div>
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Налаштування</h1>
          <p className="text-sm text-[var(--color-text-muted)]">
            Брендинг і сервер ·{" "}
            {config.demoMode ? (
              <Badge variant="warning">DEMO · localStorage</Badge>
            ) : (
              <Badge variant="success">Supabase</Badge>
            )}
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Збереження..." : "Зберегти"}
        </Button>
      </div>

      <div className="grid max-w-2xl gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Брендинг сайту</CardTitle>
            <CardDescription>
              Домен, назва, SEO-заголовок, логотип. DNS для домену налаштовується в Vercel.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Field label="Публічний домен (hostname)">
              <input
                value={form.siteDomain}
                onChange={(e) => set("siteDomain", e.target.value)}
                className={inputClass}
                placeholder="142.132.134.223:25620"
              />
              <p className="mt-1 text-[10px] text-[var(--color-text-dim)]">
                Лише відображення / SEO. Прив’язка DNS: Vercel → Domains → survivaland.pp.ua
              </p>
            </Field>
            <Field label="Назва бренду (header)">
              <input
                value={form.siteName}
                onChange={(e) => set("siteName", e.target.value)}
                className={inputClass}
                placeholder="SurvivaLand"
              />
            </Field>
            <Field label="SEO title (вкладка браузера)">
              <input
                value={form.siteTitle}
                onChange={(e) => set("siteTitle", e.target.value)}
                className={inputClass}
                placeholder="SurvivaLand — Minecraft Server"
              />
            </Field>
            <Field label="SEO description">
              <textarea
                value={form.siteDescription}
                onChange={(e) => set("siteDescription", e.target.value)}
                className={inputClass + " min-h-[72px] resize-y"}
                rows={3}
              />
            </Field>
            <Field label="URL логотипу">
              <input
                value={form.logoUrl}
                onChange={(e) => set("logoUrl", e.target.value)}
                className={inputClass}
                placeholder="https://.../logo.png"
              />
              {form.logoUrl ? (
                <img
                  src={form.logoUrl}
                  alt="Logo preview"
                  className="mt-2 h-10 w-auto rounded border border-[var(--color-border)] bg-[var(--color-surface)] object-contain p-1"
                />
              ) : null}
            </Field>
            <Field label="Слоган">
              <input
                value={form.slogan}
                onChange={(e) => set("slogan", e.target.value)}
                className={inputClass}
                placeholder="Survival • Building • Community"
              />
            </Field>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Minecraft-сервер</CardTitle>
            <CardDescription>Адреса підключення та версії</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Field label="IP / хост для гри">
              <input
                value={form.serverIp}
                onChange={(e) => set("serverIp", e.target.value)}
                className={inputClass}
                placeholder="142.132.134.223:25620"
              />
            </Field>
            <Field label="Діапазон версій">
              <input
                value={form.versionRange}
                onChange={(e) => set("versionRange", e.target.value)}
                className={inputClass}
                placeholder="1.17.1–1.21.11"
              />
            </Field>
            <Field label="Поточна версія">
              <input
                value={form.currentVersion}
                onChange={(e) => set("currentVersion", e.target.value)}
                className={inputClass}
                placeholder="1.21.11"
              />
            </Field>
            <Field label="Discord invite URL">
              <input
                value={form.discordInvite}
                onChange={(e) => set("discordInvite", e.target.value)}
                className={inputClass}
                placeholder="https://discord.gg/..."
              />
            </Field>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Режим робіт</CardTitle>
          </CardHeader>
          <CardContent>
            <label className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={form.maintenanceMode}
                onChange={(e) => set("maintenanceMode", e.target.checked)}
                className="h-4 w-4 rounded border-[var(--color-border)]"
              />
              Увімкнути сторінку «Технічні роботи» для відвідувачів
            </label>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-[var(--color-text-muted)]">{label}</label>
      {children}
    </div>
  )
}
