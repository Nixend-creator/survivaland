import { Link } from "react-router-dom"
import { useI18n } from "@/i18n"
import { Button } from "@/components/ui/button"

export function NotFoundPage() {
  const { t } = useI18n()
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-6xl font-bold text-[var(--color-primary)]/30">404</p>
      <h1 className="mt-4 text-2xl font-bold">{t("errors.notFound")}</h1>
      <p className="mt-2 text-[var(--color-text-muted)]">{t("errors.notFoundText")}</p>
      <Link to="/" className="mt-8">
        <Button size="lg">{t("common.backHome")}</Button>
      </Link>
    </div>
  )
}
