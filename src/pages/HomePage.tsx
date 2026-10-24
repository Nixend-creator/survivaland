import { Link } from "react-router-dom"
import { Copy, ArrowRight, Shield, Swords, Coins, Users, Pickaxe, Map, Trophy, Sparkles } from "lucide-react"
import { useI18n } from "@/i18n"
import { pickLocalized, pickLocalizedList } from "@/lib/localized"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ServerStatusCard } from "@/components/server/ServerStatusCard"
import { getSiteSettings } from "@/services/siteSettings"
import { copyToClipboard } from "@/lib/utils"
import { toast } from "sonner"
import { useQuery } from "@tanstack/react-query"
import { getRankings } from "@/services/rankings"
import { listNews } from "@/services/news"

const featureDefs = [
  { icon: Pickaxe, title: "Survival", descKey: "home.feat_survival" },
  { icon: Swords, title: "PvP", descKey: "home.feat_pvp" },
  { icon: Coins, title: "Economy", descKey: "home.feat_economy" },
  { icon: Shield, title: "Protection", descKey: "home.feat_protection" },
  { icon: Map, title: "Quests", descKey: "home.feat_quests" },
  { icon: Users, title: "Community", descKey: "home.feat_community" },
  { icon: Trophy, title: "Ranks", descKey: "home.feat_ranks" },
  { icon: Sparkles, title: "Events", descKey: "home.feat_events" },
]

export function HomePage() {
  const { t, language } = useI18n()
  const { data: topRankings = [] } = useQuery({
    queryKey: ["rankings", "playtime"],
    queryFn: () => getRankings("playtime"),
  })
  const topPlayers = topRankings.slice(0, 3)
  const { data: newsList = [] } = useQuery({ queryKey: ["admin-news"], queryFn: listNews })
  const { data: site } = useQuery({ queryKey: ["site-settings"], queryFn: getSiteSettings })
  const serverIp = site?.serverIp ?? "survivaland.top"
  const discordInvite = site?.discordInvite ?? ""

  const handleCopy = async () => {
    const ok = await copyToClipboard(serverIp)
    if (ok) toast.success(t("hero.copyIp"))
  }

  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--color-background)]" />
        {/* Decorative blocks */}
        <div className="pointer-events-none absolute -right-20 top-20 h-64 w-64 rounded-3xl border border-[var(--color-primary)]/10 bg-[var(--color-primary)]/5 rotate-12" />
        <div className="pointer-events-none absolute -left-16 bottom-10 h-48 w-48 rounded-2xl border border-[var(--color-accent-cyan)]/10 bg-[var(--color-accent-cyan)]/5 -rotate-6" />

        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 sm:pt-24 lg:px-8 lg:pt-32">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="text-[var(--color-text)]">SURVIVA</span>
              <span className="text-[var(--color-primary)]">LAND</span>
            </h1>
            <p className="mt-4 text-lg text-[var(--color-text-muted)] sm:text-xl">
              {t("hero.slogan")}
            </p>
            <p className="mt-3 text-base text-[var(--color-text-dim)] sm:text-lg">
              {t("hero.subtitle")}
            </p>

            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" className="w-full sm:w-auto glow-primary" onClick={handleCopy}>
                {t("hero.ctaPlay")}
              </Button>
              <Link to="/server">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  {t("hero.ctaServer")}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)]/80 px-5 py-2.5 backdrop-blur-sm">
              <code className="font-mono text-sm text-[var(--color-primary)] sm:text-base">
                {serverIp}
              </code>
              <button
                onClick={handleCopy}
                className="rounded-md p-1.5 text-[var(--color-text-muted)] hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-primary)] transition-colors"
                aria-label="Copy IP"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Live Status + Why */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <ServerStatusCard />
          </div>
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{t("home.whyTitle")}</h2>
              <p className="mt-2 text-[var(--color-text-muted)]">
                Преміум survival-сервер з фокусом на виживання, будівництво, економіку та спільноту.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { title: "Стабільність", text: "Оптимізований сервер, мінімум лагів" },
                { title: "Справедливість", text: "Античит, балансована економіка" },
                { title: "Спільнота", text: "Активні гравці та модерація" },
                { title: "Оновлення", text: "Постійний розвиток і контент" },
              ].map((item) => (
                <div key={t(item.titleKey)} className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
                  <h3 className="font-semibold text-[var(--color-primary)]">{t(item.titleKey)}</h3>
                  <p className="mt-1 text-sm text-[var(--color-text-muted)]">{t(item.textKey)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-y border-[var(--color-border)] bg-[var(--color-surface)]/50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold tracking-tight sm:text-3xl">{t("home.featuresTitle")}</h2>
          <p className="mx-auto mt-2 max-w-2xl text-center text-[var(--color-text-muted)]">
            Все, що потрібно для насиченої гри
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featureDefs.map((f) => (
              <Card key={f.title} className="group hover:border-[var(--color-primary)]/40 transition-colors">
                <CardContent className="flex flex-col items-start gap-3 p-5">
                  <div className="rounded-lg bg-[var(--color-primary-muted)] p-2.5 text-[var(--color-primary)] group-hover:glow-primary transition-shadow">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{f.title}</h3>
                    <p className="mt-1 text-sm text-[var(--color-text-muted)]">{t(f.descKey)}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Rankings preview */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{t("rankings.title")}</h2>
            <p className="mt-1 text-[var(--color-text-muted)]">{t("home.rankingsSub")}</p>
          </div>
          <Link to="/rankings">
            <Button variant="outline" size="sm">
              {t("home.rankingsAll")} <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {topPlayers.map((entry, i) => (
            <Card key={entry.player.id} className={i === 0 ? "border-[var(--color-accent-gold)]/40 glow-primary" : ""}>
              <CardContent className="flex items-center gap-4 p-5">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold ${
                  i === 0 ? "bg-[var(--color-accent-gold)]/20 text-[var(--color-accent-gold)]" :
                  i === 1 ? "bg-[var(--color-text-muted)]/20 text-[var(--color-text-muted)]" :
                  "bg-[var(--color-accent-red)]/20 text-[var(--color-accent-red)]"
                }`}>
                  {entry.rank}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold truncate">{entry.player.username}</p>
                  <p className="text-sm text-[var(--color-text-muted)]">{entry.player.rank}</p>
                </div>
                {entry.isDemo && <span className="text-xs text-[var(--color-text-dim)]">DEMO</span>}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Latest news */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-surface)]/30 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{t("nav.news")}</h2>
            <Link to="/news">
              <Button variant="outline" size="sm">
                Всі новини <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {newsList.slice(0, 3).map((article) => (
              <Link key={article.id} to={`/news/${article.slug}`}>
                <Card className="h-full transition-colors hover:border-[var(--color-primary)]/40">
                  <CardHeader>
                    <div className="flex items-center gap-2 text-xs text-[var(--color-text-dim)]">
                      <span className="rounded bg-[var(--color-primary-muted)] px-2 py-0.5 text-[var(--color-primary)]">
                        {pickLocalized(article.category, language)}
                      </span>
                      <span>{article.publishedAt}</span>
                    </div>
                    <CardTitle className="text-base">{pickLocalized(article.title, language)}</CardTitle>
                    <CardDescription>{pickLocalized(article.excerpt, language)}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Discord CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Card className="overflow-hidden border-[var(--color-secondary)]/20">
          <div className="flex flex-col items-center gap-6 bg-gradient-to-r from-[var(--color-secondary)]/10 to-transparent p-8 text-center sm:p-12">
            <h2 className="text-2xl font-bold sm:text-3xl">{t("home.discordTitle")}</h2>
            <p className="max-w-md text-[var(--color-text-muted)]">
              {t("home.discordText")}
            </p>
            {discordInvite ? (
              <a href={discordInvite} target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="secondary">
                  Приєднатися до Discord
                </Button>
              </a>
            ) : (
              <Button size="lg" variant="secondary" disabled>
                Приєднатися до Discord
              </Button>
            )}
          </div>
        </Card>
      </section>

      {/* Final CTA */}
      <section className="border-t border-[var(--color-border)] py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-2xl font-bold sm:text-3xl">{t("home.ctaTitle")}</h2>
          <p className="mt-2 text-[var(--color-text-muted)]">
            Додай сервер і створюй свою історію
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button size="lg" onClick={handleCopy} className="glow-primary">
              {serverIp}
              <Copy className="h-4 w-4" />
            </Button>
            <Link to="/wiki">
              <Button variant="outline" size="lg">
                Читати Wiki
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
