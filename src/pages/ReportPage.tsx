import { useState } from "react"
import { toast } from "sonner"
import { useI18n } from "@/i18n"
import { createReport } from "@/services/reports"
import { useAuth } from "@/hooks/useAuth"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function ReportPage() {
  const { t } = useI18n()
  const { user } = useAuth()
  const [reporter, setReporter] = useState(user?.username ?? user?.minecraftUsername ?? "")
  const [target, setTarget] = useState("")
  const [reason, setReason] = useState("")
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!target.trim() || !reason.trim()) {
      toast.error(t("common.error"))
      return
    }
    setLoading(true)
    try {
      await createReport({
        reporterUsername: reporter.trim() || "Anonymous",
        targetUsername: target.trim(),
        reason: reason.trim(),
      })
      setDone(true)
      toast.success(t("reports.success"))
      setTarget("")
      setReason("")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("common.error"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight">{t("reports.title")}</h1>
      <p className="mt-2 text-[var(--color-text-muted)]">{t("reports.subtitle")}</p>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-base">{t("reports.title")}</CardTitle>
          <CardDescription>
            <Badge variant="warning" className="mr-2">
              DEMO
            </Badge>
            {t("reports.note")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {done ? (
            <div className="space-y-4 text-sm text-[var(--color-text-muted)]">
              <p className="text-[var(--color-text)] font-medium">{t("reports.success")}</p>
              <p>{t("reports.successText")}</p>
              <Button
                variant="outline"
                onClick={() => setDone(false)}
              >
                {t("reports.another")}
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Field label={t("reports.yourName")}>
                <input
                  value={reporter}
                  onChange={(e) => setReporter(e.target.value)}
                  className={inputClass}
                  autoComplete="username"
                />
              </Field>
              <Field label={t("reports.target")}>
                <input
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  className={inputClass}
                  required
                />
              </Field>
              <Field label={t("reports.reason")}>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className={inputClass + " min-h-[120px] resize-y"}
                  placeholder={t("reports.reasonPlaceholder")}
                  required
                  rows={5}
                />
              </Field>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? t("common.loading") : t("reports.submit")}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
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
