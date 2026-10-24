import { useQuery } from "@tanstack/react-query"
import { useLocation } from "react-router-dom"
import { getSiteSettings } from "@/services/siteSettings"
import { useAuth } from "@/hooks/useAuth"
import { isAdmin } from "@/services/auth"
import { MaintenancePage } from "@/pages/ErrorPages"
import { Link } from "react-router-dom"

const ALLOW_DURING_MAINTENANCE = ["/login", "/register", "/forgot-password", "/reset-password", "/admin"]

/**
 * Blocks public UI when maintenanceMode is on.
 * Login/register and staff remain available.
 */
export function MaintenanceGate({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const { user, isLoading: authLoading } = useAuth()
  const { data: site, isLoading } = useQuery({
    queryKey: ["site-settings"],
    queryFn: getSiteSettings,
  })

  const maintenance = Boolean(site?.maintenanceMode)
  const staff = isAdmin(user)
  const pathAllowed = ALLOW_DURING_MAINTENANCE.some(
    (p) => location.pathname === p || location.pathname.startsWith(p + "/")
  )

  if (isLoading || authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-[var(--color-text-muted)]">
        Завантаження...
      </div>
    )
  }

  if (maintenance && !staff && !pathAllowed) {
    return <MaintenancePage />
  }

  return (
    <>
      {maintenance && staff && (
        <div className="sticky top-0 z-[60] border-b border-[var(--color-accent-gold)]/40 bg-[rgba(232,184,74,0.12)] px-4 py-2 text-center text-sm text-[var(--color-accent-gold)]">
          Режим техробіт увімкнено — звичайні відвідувачі бачать заглушку.{" "}
          <Link to="/admin/settings" className="underline hover:text-[var(--color-text)]">
            Налаштування
          </Link>
        </div>
      )}
      {children}
    </>
  )
}
