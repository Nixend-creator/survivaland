import { APP_VERSION_LABEL } from "@/config/version"
import { Link } from "react-router-dom"
import { MessageCircle } from "lucide-react"
import { useI18n } from "@/i18n"
import { useQuery } from "@tanstack/react-query"
import { getSiteSettings } from "@/services/siteSettings"
import { config } from "@/config"

export function Footer() {
  const { t } = useI18n()
  const { data: site } = useQuery({ queryKey: ["site-settings"], queryFn: getSiteSettings })
  const discordInvite = (site?.discordInvite || config.discordInvite || "").trim()
  const slogan = site?.slogan ?? "Survival • Building • Community"
  const brandName = site?.siteName || "SurvivaLand"
  const logoUrl = site?.logoUrl || ""
  const domain = site?.siteDomain || "survivaland.pp.ua"

  return (
    <footer role="contentinfo" className="border-t border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div className="space-y-3">
            <Link to="/" className="inline-flex items-center gap-2">
              {logoUrl ? (
                <img src={logoUrl} alt={brandName} className="h-8 w-auto max-w-[120px] object-contain" />
              ) : (
                <span className="text-xl font-bold tracking-tight">
                  {brandName.length > 12 ? (
                    brandName
                  ) : (
                    <>
                      {brandName.slice(0, Math.max(1, brandName.length - 4))}
                      <span className="text-[var(--color-primary)]">{brandName.slice(-4)}</span>
                    </>
                  )}
                </span>
              )}
            </Link>
            <p className="text-sm text-[var(--color-text-muted)]">{slogan}</p>
            <p className="font-mono text-xs text-[var(--color-primary)]">{domain}</p>
            <p className="text-xs text-[var(--color-text-dim)]">{t("footer.disclaimer")}</p>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold">{t("footer.navigation")}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/server" className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)]">
                  {t("nav.server")}
                </Link>
              </li>
              <li>
                <Link to="/wiki" className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)]">
                  {t("nav.wiki")}
                </Link>
              </li>
              <li>
                <Link to="/rules" className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)]">
                  {t("nav.rules")}
                </Link>
              </li>
              <li>
                <Link to="/news" className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)]">
                  {t("nav.news")}
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)]">
                  {t("nav.shop")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold">{t("footer.community")}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                {discordInvite ? (
                  <a
                    href={discordInvite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[var(--color-text-muted)] hover:text-[#5865F2]"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Discord
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-[var(--color-text-dim)]">
                    <MessageCircle className="h-4 w-4" />
                    Discord
                  </span>
                )}
              </li>
              <li>
                <Link to="/rankings" className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)]">
                  {t("nav.rankings")}
                </Link>
              </li>
              <li>
                <Link to="/report" className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)]">
                  {t("nav.reports")}
                </Link>
              </li>
              <li>
                <Link to="/economy" className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)]">
                  {t("nav.economy")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold">{t("footer.legal")}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/privacy" className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)]">
                  {t("footer.privacy")}
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)]">
                  {t("footer.terms")}
                </Link>
              </li>
              <li>
                <Link to="/rules" className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)]">
                  {t("nav.rules")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-[var(--color-border)] pt-6 text-center text-xs text-[var(--color-text-dim)] sm:flex-row sm:text-left">
          <span>
            {t("footer.copyright")} · {APP_VERSION_LABEL}
            {config.demoMode ? " · Preview" : ""}
          </span>
          <span>Not affiliated with Mojang or Microsoft.</span>
        </div>
      </div>
    </footer>
  )
}
