import { useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Plus, Trash2, X } from "lucide-react"
import { toast } from "sonner"
import {
  listReports,
  createReport,
  updateReportStatus,
  deleteReport,
  type ReportInput,
} from "@/services/reports"
import type { Report, ReportStatus } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const STATUSES: { value: ReportStatus | "all"; label: string }[] = [
  { value: "all", label: "Усі" },
  { value: "open", label: "Відкриті" },
  { value: "reviewing", label: "На розгляді" },
  { value: "resolved", label: "Вирішені" },
  { value: "dismissed", label: "Відхилені" },
]

const statusVariant: Record<ReportStatus, "warning" | "info" | "success" | "secondary"> = {
  open: "warning",
  reviewing: "info",
  resolved: "success",
  dismissed: "secondary",
}

const statusLabel: Record<ReportStatus, string> = {
  open: "Відкрита",
  reviewing: "На розгляді",
  resolved: "Вирішена",
  dismissed: "Відхилена",
}

export function AdminReports() {
  const queryClient = useQueryClient()
  const [filter, setFilter] = useState<ReportStatus | "all">("all")
  const [search, setSearch] = useState("")
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState<ReportInput>({
    reporterUsername: "Admin",
    targetUsername: "",
    reason: "",
  })
  const [saving, setSaving] = useState(false)

  const { data: reports = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["admin-reports"],
    queryFn: listReports,
  })

  const filtered = reports.filter((r) => {
    if (filter !== "all" && r.status !== filter) return false
    const q = search.toLowerCase()
    if (!q) return true
    return (
      r.targetUsername.toLowerCase().includes(q) ||
      r.reporterUsername.toLowerCase().includes(q) ||
      r.reason.toLowerCase().includes(q)
    )
  })

  const counts = {
    open: reports.filter((r) => r.status === "open").length,
    reviewing: reports.filter((r) => r.status === "reviewing").length,
    resolved: reports.filter((r) => r.status === "resolved").length,
  }

  const handleCreate = async () => {
    if (!form.targetUsername.trim() || !form.reason.trim()) {
      toast.error("Заповніть ціль і причину")
      return
    }
    setSaving(true)
    try {
      await createReport(form)
      toast.success("Скаргу додано")
      setCreating(false)
      setForm({ reporterUsername: "Admin", targetUsername: "", reason: "" })
      await queryClient.invalidateQueries({ queryKey: ["admin-reports"] })
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Помилка")
    } finally {
      setSaving(false)
    }
  }

  const handleStatus = async (report: Report, status: ReportStatus) => {
    try {
      await updateReportStatus(report.id, status)
      toast.success(`Статус: ${statusLabel[status]}`)
      await queryClient.invalidateQueries({ queryKey: ["admin-reports"] })
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Помилка")
    }
  }

  const handleDelete = async (report: Report) => {
    if (!confirm("Видалити скаргу?")) return
    try {
      await deleteReport(report.id)
      toast.success("Видалено")
      await queryClient.invalidateQueries({ queryKey: ["admin-reports"] })
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Помилка")
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Скарги</h1>
          <p className="text-sm text-[var(--color-text-muted)]">
            Модерація ·{" "}
            <span className="text-[var(--color-accent-gold)]">{counts.open} відкритих</span>
            {" · "}
            {counts.reviewing} на розгляді · {counts.resolved} вирішених
          </p>
        </div>
        <Button onClick={() => setCreating(true)} className="gap-1.5 shrink-0">
          <Plus className="h-4 w-4" />
          Додати скаргу
        </Button>
      </div>

      {creating && (
        <Card className="mb-6 border-[var(--color-primary)]/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base">Нова скарга (demo)</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setCreating(false)} aria-label="Закрити">
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Від кого">
                <input
                  value={form.reporterUsername}
                  onChange={(e) => setForm((f) => ({ ...f, reporterUsername: e.target.value }))}
                  className={inputClass}
                />
              </Field>
              <Field label="На кого *">
                <input
                  value={form.targetUsername}
                  onChange={(e) => setForm((f) => ({ ...f, targetUsername: e.target.value }))}
                  className={inputClass}
                  placeholder="Username"
                />
              </Field>
            </div>
            <Field label="Причина *">
              <textarea
                value={form.reason}
                onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
                className={cn(inputClass, "min-h-[80px] resize-y")}
                rows={3}
              />
            </Field>
            <div className="flex gap-2">
              <Button onClick={handleCreate} disabled={saving}>
                {saving ? "Збереження..." : "Створити"}
              </Button>
              <Button variant="outline" onClick={() => setCreating(false)}>
                Скасувати
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="mb-4 flex flex-wrap gap-2">
        {STATUSES.map((s) => (
          <button
            key={s.value}
            onClick={() => setFilter(s.value)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
              filter === s.value
                ? "bg-[var(--color-primary)] text-[var(--color-background)]"
                : "bg-[var(--color-surface)] text-[var(--color-text-muted)] border border-[var(--color-border)] hover:bg-[var(--color-surface-elevated)]"
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      <input
        type="search"
        placeholder="Пошук за ніком або причиною..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={cn(inputClass, "mb-4 max-w-md")}
      />

      {isLoading && (
        <p className="text-sm text-[var(--color-text-muted)]">Завантаження...</p>
      )}
      {isError && (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-10">
            <p className="text-[var(--color-text-muted)]">Не вдалося завантажити</p>
            <Button variant="secondary" size="sm" onClick={() => refetch()}>
              Спробувати знову
            </Button>
          </CardContent>
        </Card>
      )}

      {!isLoading && !isError && filtered.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-[var(--color-text-muted)]">
            {search || filter !== "all" ? "Нічого не знайдено" : "Скарг немає"}
          </CardContent>
        </Card>
      )}

      {!isLoading && filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map((report) => (
            <Card key={report.id}>
              <CardContent className="p-4 sm:p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={statusVariant[report.status]}>
                        {statusLabel[report.status]}
                      </Badge>
                      {report.isDemo && (
                        <Badge variant="warning" className="text-[10px]">
                          DEMO
                        </Badge>
                      )}
                      <span className="text-xs text-[var(--color-text-dim)]">
                        {new Date(report.createdAt).toLocaleString("uk-UA")}
                      </span>
                    </div>
                    <p className="text-sm">
                      <span className="text-[var(--color-text-muted)]">На: </span>
                      <span className="font-semibold text-[var(--color-accent-red)]">
                        {report.targetUsername}
                      </span>
                      <span className="text-[var(--color-text-dim)]"> · від </span>
                      <span className="font-medium">{report.reporterUsername}</span>
                    </p>
                    <p className="text-sm text-[var(--color-text-muted)]">{report.reason}</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5 shrink-0">
                    {report.status !== "reviewing" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatus(report, "reviewing")}
                      >
                        На розгляд
                      </Button>
                    )}
                    {report.status !== "resolved" && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleStatus(report, "resolved")}
                      >
                        Вирішити
                      </Button>
                    )}
                    {report.status !== "dismissed" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStatus(report, "dismissed")}
                      >
                        Відхилити
                      </Button>
                    )}
                    {report.status !== "open" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStatus(report, "open")}
                      >
                        Відкрити
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-[var(--color-accent-red)]"
                      onClick={() => handleDelete(report)}
                      aria-label="Видалити"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
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
