import { Link, Outlet, useLocation, Navigate } from "react-router-dom"
import {
  LayoutDashboard, Users, Newspaper, BookOpen, ShoppingBag,
  Flag, Settings, ArrowLeft
} from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { isAdmin } from "@/services/auth"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const nav = [
  { path: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { path: "/admin/players", label: "Гравці", icon: Users },
  { path: "/admin/news", label: "Новини", icon: Newspaper },
  { path: "/admin/wiki", label: "Wiki", icon: BookOpen },
  { path: "/admin/shop", label: "Магазин", icon: ShoppingBag },
  { path: "/admin/reports", label: "Скарги", icon: Flag },
  { path: "/admin/settings", label: "Налаштування", icon: Settings },
]

export function AdminLayout() {
  const { user, isLoading, isAuthenticated } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center text-[var(--color-text-muted)]">Завантаження...</div>
  }

  if (!isAuthenticated || !isAdmin(user)) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="flex min-h-screen">
      <a href="#admin-main" className="skip-link">До вмісту адмінки</a>
      <aside className="hidden w-56 shrink-0 border-r border-[var(--color-border)] bg-[var(--color-surface)] lg:block">
        <div className="flex h-16 items-center border-b border-[var(--color-border)] px-4">
          <Link to="/admin" className="font-bold text-sm">
            SL <span className="text-[var(--color-primary)]">Admin</span>
          </Link>
        </div>
        <nav className="space-y-1 p-3">
          {nav.map((item) => {
            const active = item.end
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path)
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-[var(--color-primary-muted)] text-[var(--color-primary)] font-medium"
                    : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-text)]"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="absolute bottom-4 left-4">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-1.5">
              <ArrowLeft className="h-3.5 w-3.5" />
              На сайт
            </Button>
          </Link>
        </div>
      </aside>

      <div className="flex-1 overflow-auto">
        {/* Mobile nav */}
        <div className="flex gap-1 overflow-x-auto border-b border-[var(--color-border)] p-2 lg:hidden">
          {nav.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "shrink-0 rounded-md px-3 py-1.5 text-xs font-medium",
                location.pathname.startsWith(item.path)
                  ? "bg-[var(--color-primary-muted)] text-[var(--color-primary)]"
                  : "text-[var(--color-text-muted)]"
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div className="p-4 sm:p-6 lg:p-8">
          <div id="admin-main" tabIndex={-1}>
            <div id="admin-main" tabIndex={-1}><Outlet /></div>
          </div>
        </div>
      </div>
    </div>
  )
}
