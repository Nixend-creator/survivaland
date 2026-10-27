import { Link } from "react-router-dom"
import { useI18n } from "@/i18n"
import { Button } from "@/components/ui/button"

export function ForbiddenPage() {
  const { t } = useI18n()
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-6xl font-bold text-[var(--color-accent-red)]/30">403</p>
      <h1 className="mt-4 text-2xl font-bold">{t("errors.forbidden")}</h1>
      <p className="mt-2 text-[var(--color-text-muted)]">{t("errors.forbiddenText")}</p>
      <Link to="/" className="mt-8">
        <Button size="lg">{t("common.backHome")}</Button>
      </Link>
    </div>
  )
}

export function ServerErrorPage() {
  const { t } = useI18n()
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-6xl font-bold text-[var(--color-accent-gold)]/30">500</p>
      <h1 className="mt-4 text-2xl font-bold">{t("errors.serverError")}</h1>
      <p className="mt-2 text-[var(--color-text-muted)]">{t("errors.serverErrorText")}</p>
      <Link to="/" className="mt-8">
        <Button size="lg">{t("common.backHome")}</Button>
      </Link>
    </div>
  )
}

export function MaintenancePage() {
  const { t } = useI18n()
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-background)] px-4 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] text-3xl">
        🔧
      </div>
      <h1 className="text-2xl font-bold sm:text-3xl">{t("errors.maintenance")}</h1>
      <p className="mt-3 max-w-md text-[var(--color-text-muted)] leading-relaxed">
        {t("errors.maintenanceText")}
      </p>
      <p className="mt-8 font-mono text-sm text-[var(--color-primary)]">142.132.134.223:25620</p>
    </div>
  )
}
