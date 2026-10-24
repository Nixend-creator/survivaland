import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { Menu, X, MessageCircle, ChevronDown, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { useI18n } from "@/i18n"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { useQuery } from "@tanstack/react-query"
import { getSiteSettings } from "@/services/siteSettings"
import type { Language } from "@/types"

const navItems = [
  { key: "home", path: "/" },
  { key: "server", path: "/server" },
  { key: "wiki", path: "/wiki" },
  { key: "news", path: "/news" },
  { key: "rules", path: "/rules" },
  { key: "rankings", path: "/rankings" },
  { key: "shop", path: "/shop" },
  { key: "reports", path: "/report" },
] as const

const languages: { code: Language; label: string }[] = [
  { code: "uk", label: "UA" },
  { code: "ru", label: "RU" },
  { code: "en", label: "EN" },
]

export function Header() {
  const { t, language, setLanguage } = useI18n()
  const { user, isAuthenticated } = useAuth()
  const { data: site } = useQuery({ queryKey: ["site-settings"], queryFn: getSiteSettings })
  const discordInvite = site?.discordInvite ?? ""
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "bg-[var(--color-background)]/90 backdrop-blur-md border-b border-[var(--color-border)] shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" aria-label="SurvivaLand — на головну" className="flex items-center gap-2 group">
          <div className="flex flex-col leading-none">
            <span className="text-lg font-bold tracking-tight text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors">
              SURVIVA
              <span className="text-[var(--color-primary)]">LAND</span>
            </span>
            <span className="text-[10px] text-[var(--color-text-dim)] tracking-widest uppercase">
              Minecraft
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="Основна навігація">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                location.pathname === item.path
                  ? "text-[var(--color-primary)] bg-[var(--color-primary-muted)]"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)]"
              )}
            >
              {t(`nav.${item.key}`)}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Language */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLangOpen(!langOpen)}
              className="gap-1"
              aria-label="Change language"
            >
              {languages.find((l) => l.code === language)?.label}
              <ChevronDown className="h-3.5 w-3.5" />
            </Button>
            {langOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
                <div className="absolute right-0 top-full z-50 mt-1 min-w-[80px] rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] py-1 shadow-lg">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLanguage(l.code)
                        setLangOpen(false)
                      }}
                      className={cn(
                        "block w-full px-3 py-1.5 text-left text-sm transition-colors",
                        language === l.code
                          ? "text-[var(--color-primary)] bg-[var(--color-primary-muted)]"
                          : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface-elevated)]"
                      )}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Discord */}
          {discordInvite ? (
            <a
              href={discordInvite}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex"
            >
              <Button variant="secondary" size="sm" className="gap-1.5">
                <MessageCircle className="h-4 w-4" />
                Discord
              </Button>
            </a>
          ) : (
            <Button variant="secondary" size="sm" className="gap-1.5 hidden sm:inline-flex" disabled title="Configure VITE_DISCORD_INVITE_URL">
              <MessageCircle className="h-4 w-4" />
              Discord
            </Button>
          )}

          {/* Auth */}
          {isAuthenticated && user ? (
            <Link to="/profile" className="hidden sm:block">
              <Button variant="secondary" size="sm" className="gap-1.5">
                <User className="h-4 w-4" />
                {user.username}
              </Button>
            </Link>
          ) : (
            <Link to="/login" className="hidden sm:block">
              <Button size="sm">{t("nav.login")}</Button>
            </Link>
          )}

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-[var(--color-border)] bg-[var(--color-background)]/95 backdrop-blur-md">
          <nav className="flex flex-col px-4 py-4 gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "px-4 py-3 text-base font-medium rounded-lg transition-colors",
                  location.pathname === item.path
                    ? "text-[var(--color-primary)] bg-[var(--color-primary-muted)]"
                    : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface)]"
                )}
              >
                {t(`nav.${item.key}`)}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-2 border-t border-[var(--color-border)] pt-3">
              {isAuthenticated && user ? (
                <Link to="/profile">
                  <Button variant="secondary" className="w-full gap-1.5">
                    <User className="h-4 w-4" />
                    {user.username}
                  </Button>
                </Link>
              ) : (
                <Link to="/login">
                  <Button className="w-full">{t("nav.login")}</Button>
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
