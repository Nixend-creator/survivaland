import { Link } from "react-router-dom"
import {
  Copy,
  ArrowRight,
  Play,
  Swords,
  Coins,
  Pickaxe,
  Map,
  Calendar,
  Hammer,
  Users,
  Box,
  Clock,
  MessageCircle,
} from "lucide-react"
import { useI18n } from "@/i18n"
import { pickLocalized } from "@/lib/localized"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getSiteSettings } from "@/services/siteSettings"
import { getServerStatus } from "@/services/minecraftServer"
import { copyToClipboard } from "@/lib/utils"
import { toast } from "sonner"
import { useQuery } from "@tanstack/react-query"
import { listNews } from "@/services/news"
import { cn } from "@/lib/utils"

const featureCards = [
  {
    key: "survival",
    icon: Pickaxe,
    titleKey: "home.card_survival_t",
    descKey: "home.card_survival_d",
    large: true,
    gradient: "from-emerald-900/80 to-slate-900/90",
  },
  {
    key: "pvp",
    icon: Swords,
    titleKey: "home.card_pvp_t",
    descKey: "home.card_pvp_d",
    large: false,
    gradient: "from-slate-800/90 to-slate-900/90",
  },
  {
    key: "economy",
    icon: Coins,
    titleKey: "home.card_economy_t",
    descKey: "home.card_economy_d",
    large: false,
    gradient: "from-amber-900/40 to-slate-900/90",
  },
  {
    key: "quests",
    icon: Map,
    titleKey: "home.card_quests_t",
    descKey: "home.card_quests_d",
    large: false,
    gradient: "from-slate-800/90 to-slate-900/90",
  },
  {
    key: "build",
    icon: Hammer,
    titleKey: "home.card_build_t",
    descKey: "home.card_build_d",
    large: false,
    gradient: "from-slate-800/90 to-slate-900/90",
  },
  {
    key: "events",
    icon: Calendar,
    titleKey: "home.card_events_t",
    descKey: "home.card_events_d",
    large: false,
    gradient: "from-slate-800/90 to-slate-900/90",
  },
] as const

export function HomePage() {
  const { t, language } = useI18n()
  const { data: newsList = [] } = useQuery({ queryKey: ["admin-news"], queryFn: listNews })
  const { data: site } = useQuery({ queryKey: ["site-settings"], queryFn: getSiteSettings })
  const { data: status } = useQuery({
    queryKey: ["serverStatus"],
    queryFn: getServerStatus,
    refetchInterval: 30000,
  })
  const serverIp = site?.serverIp ?? "survivaland.top"
  const discordInvite = site?.discordInvite ?? ""

  const handleCopy = async () => {
    const ok = await copyToClipboard(serverIp)
    if (ok) toast.success(t("hero.copyIp"))
  }

  const online = status?.players.online ?? 0
  const max = status?.players.max ?? 100
  const pct = max > 0 ? Math.round((online / max) * 100) : 0

  return (
    <div className="relative">
      {/* ─── HERO ─── */}
      <section className="relative min-h-[min(92vh,820px)] overflow-hidden">
        {/* Background layers */}
        <div
          className="absolute inset-0 scale-105 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1627856014093-9710916970ca?auto=format&fit=crop&w=1920&q=80)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-background)] via-[var(--color-background)]/85 to-[var(--color-background)]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-background)] via-transparent to-[var(--color-background)]/50" />

        <div className="relative mx-auto flex min-h-[min(92vh,820px)] max-w-7xl flex-col justify-center px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_320px]">
            <div className="max-w-2xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)]/80 px-3 py-1 text-xs font-medium text-[var(--color-text-muted)] backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-primary)]" />
                MINECRAFT SERVER
              </div>

              <h1 className="text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl">
                SURVIVA
                <span className="text-[var(--color-primary)]">LAND</span>
              </h1>
              <p className="mt-3 text-lg font-medium text-[var(--color-text-muted)] sm:text-xl">
                {t("hero.slogan")}
              </p>
              <p className="mt-4 max-w-md text-[var(--color-text-muted)] leading-relaxed">
                {t("hero.subtitle")}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button size="lg" className="gap-2 px-6 text-base" onClick={handleCopy}>
                  <Play className="h-4 w-4 fill-current" />
                  {t("hero.ctaPlay")}
                </Button>
                <Link to="/server">
                  <Button size="lg" variant="outline" className="px-6 text-base">
                    {t("hero.ctaServer")}
                  </Button>
                </Link>
              </div>

              <button
                type="button"
                onClick={handleCopy}
                className="mt-5 inline-flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]/70 px-3 py-2 font-mono text-sm text-[var(--color-primary)] backdrop-blur transition hover:border-[var(--color-primary)]/50"
              >
                {serverIp}
                <Copy className="h-3.5 w-3.5 opacity-70" />
              </button>
            </div>

            {/* Live status card — like mockup */}
            <Card className="border-[var(--color-primary)]/20 bg-[var(--color-surface)]/90 shadow-2xl shadow-black/40 backdrop-blur-md">
              <CardContent className="space-y-4 p-5">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "h-2.5 w-2.5 rounded-full",
                      status?.online !== false ? "bg-[var(--color-primary)] animate-pulse" : "bg-[var(--color-accent-red)]"
                    )}
                  />
                  <span className="text-sm font-semibold tracking-wide text-[var(--color-primary)]">
                    {status?.online === false ? "OFFLINE" : "ONLINE"}
                  </span>
                </div>

                <StatusRow icon={<Users className="h-3.5 w-3.5" />} label={t("status.players")} value={`${online} / ${max}`} />
                <StatusRow icon={<Box className="h-3.5 w-3.5" />} label={t("status.version")} value={status?.version ?? "1.21.11"} />
                <StatusRow icon={<Copy className="h-3.5 w-3.5" />} label="IP" value={serverIp} mono />
                <StatusRow
                  icon={<Clock className="h-3.5 w-3.5" />}
                  label={t("status.latency")}
                  value={status?.latency != null ? `${status.latency} ms` : "—"}
                />

                <div className="pt-1">
                  <div className="mb-1 flex justify-between text-[10px] text-[var(--color-text-dim)]">
                    <span>{pct}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-[var(--color-surface-elevated)]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[var(--color-primary)] to-emerald-300 transition-all"
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
              {t("home.featuresEyebrow")}
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{t("home.featuresTitle")}</h2>
          </div>
          <p className="max-w-md text-sm text-[var(--color-text-muted)] leading-relaxed">{t("home.featuresLead")}</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {featureCards.map((f) => (
            <Link
              key={f.key}
              to="/server"
              className={cn(
                "group relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-gradient-to-br p-5 transition hover:border-[var(--color-primary)]/40",
                f.gradient,
                f.large === true && "sm:row-span-2 min-h-[280px] flex flex-col justify-end"
              )}
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-primary)]/15 text-[var(--color-primary)]">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold">{t(f.titleKey)}</h3>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">{t(f.descKey)}</p>
              <ArrowRight className="absolute bottom-5 right-5 h-4 w-4 text-[var(--color-text-dim)] opacity-0 transition group-hover:opacity-100 group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section className="border-y border-[var(--color-border)] bg-[var(--color-surface)]/40 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
            {t("home.statsEyebrow")}
          </p>
          <h2 className="mt-2 text-2xl font-bold sm:text-3xl">{t("home.statsTitle")}</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Users, label: t("home.stat_online"), value: String(online) },
              { icon: Users, label: t("home.stat_registered"), value: "12 842" },
              { icon: Box, label: t("home.stat_blocks"), value: "2.4M" },
              { icon: Clock, label: t("home.stat_hours"), value: "184K h" },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)]/60 p-5"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                  <s.icon className="h-5 w-5" />
                </div>
                <p className="text-2xl font-bold tabular-nums">{s.value}</p>
                <p className="mt-1 text-xs text-[var(--color-text-muted)]">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── NEWS ─── */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
              {t("home.newsEyebrow")}
            </p>
            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">{t("home.newsTitle")}</h2>
          </div>
          <Link
            to="/news"
            className="flex items-center gap-1 text-sm text-[var(--color-primary)] hover:underline"
          >
            {t("home.newsAll")} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {newsList.slice(0, 3).map((article, i) => (
            <Link key={article.id} to={`/news/${article.slug}`} className="group">
              <Card
                className={cn(
                  "h-full overflow-hidden transition hover:border-[var(--color-primary)]/40",
                  i === 1 && "border-[var(--color-accent-red)]/30",
                  i === 2 && "border-[var(--color-accent-cyan)]/20"
                )}
              >
                <div className="aspect-[16/10] bg-gradient-to-br from-[var(--color-primary)]/20 via-slate-800 to-slate-900" />
                <CardContent className="p-4">
                  <Badge variant="secondary" className="mb-2 text-[10px]">
                    {pickLocalized(article.category, language)}
                  </Badge>
                  <h3 className="font-semibold leading-snug group-hover:text-[var(--color-primary)] transition-colors">
                    {pickLocalized(article.title, language)}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-[var(--color-text-muted)]">
                    {pickLocalized(article.excerpt, language)}
                  </p>
                  <p className="mt-3 text-xs text-[var(--color-text-dim)]">{article.publishedAt}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── DISCORD ─── */}
      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-gradient-to-r from-indigo-950/80 via-[var(--color-surface)] to-[var(--color-surface)] px-6 py-8 sm:px-10">
          <div className="relative z-10 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#5865F2]/20 text-[#5865F2]">
                <MessageCircle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-lg font-semibold">{t("home.discordTitle")}</p>
                <p className="mt-1 text-sm text-[var(--color-text-muted)]">{t("home.discordText")}</p>
              </div>
            </div>
            {discordInvite ? (
              <a href={discordInvite} target="_blank" rel="noreferrer">
                <Button className="bg-[#5865F2] hover:bg-[#4752C4] text-white">{t("home.discordCta")}</Button>
              </a>
            ) : (
              <Button disabled variant="secondary">
                {t("home.discordCta")}
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="relative overflow-hidden py-24">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1920&q=80)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-background)] via-[var(--color-background)]/80 to-[var(--color-background)]/60" />
        <div className="relative mx-auto max-w-3xl px-4 text-center">
          <Badge variant="secondary" className="mb-4">
            {t("home.ctaBadge")}
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t("home.ctaTitle")}</h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button size="lg" className="gap-2" onClick={handleCopy}>
              <Play className="h-4 w-4 fill-current" />
              {t("hero.ctaPlay")}
            </Button>
            <Link to="/server">
              <Button size="lg" variant="outline">
                {t("hero.ctaServer")}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

function StatusRow({
  icon,
  label,
  value,
  mono,
}: {
  icon: React.ReactNode
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="flex items-center gap-2 text-[var(--color-text-muted)]">
        {icon}
        {label}
      </span>
      <span className={cn("font-medium tabular-nums", mono && "font-mono text-[var(--color-primary)] text-xs")}>
        {value}
      </span>
    </div>
  )
}
