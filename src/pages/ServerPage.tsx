import { Link } from "react-router-dom"
import { Pickaxe, Swords, Coins, Map, Shield, Users, Trophy, Sparkles, Store } from "lucide-react"
import { useI18n } from "@/i18n"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ServerStatusCard } from "@/components/server/ServerStatusCard"
import { useQuery } from "@tanstack/react-query"
import { getSiteSettings } from "@/services/siteSettings"

const featureDefs = [
  { icon: Pickaxe, title: "Survival", descKey: "server.feat_survival" },
  { icon: Swords, title: "PvP", descKey: "server.feat_pvp" },
  { icon: Coins, title: "Economy", descKey: "server.feat_economy" },
  { icon: Map, title: "Quests", descKey: "server.feat_quests" },
  { icon: Store, title: "Player Shops", descKey: "server.feat_shops" },
  { icon: Sparkles, title: "Events", descKey: "server.feat_events" },
  { icon: Shield, title: "Land Protection", descKey: "server.feat_protection" },
  { icon: Trophy, title: "Ranks", descKey: "server.feat_ranks" },
  { icon: Users, title: "Community", descKey: "server.feat_community" },
] as const

export function ServerPage() {
  const { t } = useI18n()
  const { data: site } = useQuery({ queryKey: ["site-settings"], queryFn: getSiteSettings })
  const serverIp = site?.serverIp ?? "142.132.134.223:25620"
  const versionRange = site?.versionRange ?? "1.17.1–1.21.11"
  const currentVersion = site?.currentVersion ?? "1.21.11"

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{t("nav.server")}</h1>
        <p className="mt-2 text-[var(--color-text-muted)]">{t("server.pageSubtitle")}</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-10">
          <section>
            <h2 className="text-xl font-semibold mb-4">{t("server.overview")}</h2>
            <Card>
              <CardContent className="p-6 space-y-4 text-[var(--color-text-muted)] leading-relaxed">
                <p>
                  <strong className="text-[var(--color-text)]">SurvivaLand</strong>
                  {" — "}
                  {t("server.overviewP1")}
                </p>
                <p>{t("server.overviewP2")}</p>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">{t("server.features")}</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {featureDefs.map((f) => (
                <Card key={f.title}>
                  <CardContent className="flex items-start gap-3 p-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--color-primary-muted)] text-[var(--color-primary)]">
                      <f.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{f.title}</p>
                      <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{t(f.descKey)}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">{t("server.versions")}</h2>
            <Card>
              <CardContent className="p-6">
                <Badge variant="success" className="text-sm px-3 py-1">
                  {versionRange}
                </Badge>
                <p className="mt-3 text-sm text-[var(--color-text-muted)]">
                  {t("server.versionsText").replace("{version}", currentVersion)}
                </p>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">{t("server.connection")}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Java Edition</CardTitle>
                  <CardDescription>{t("server.javaDesc")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <code className="block rounded-lg bg-[var(--color-surface-elevated)] px-4 py-3 font-mono text-[var(--color-primary)]">
                    {serverIp}
                  </code>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Bedrock Edition</CardTitle>
                  <CardDescription>{t("server.bedrockDesc")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-[var(--color-text-dim)]">{t("server.bedrockText")}</p>
                </CardContent>
              </Card>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">{t("nav.rules")}</h2>
            <Card>
              <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <p className="text-sm text-[var(--color-text-muted)]">{t("server.rulesSummary")}</p>
                <Link to="/rules">
                  <Button variant="outline" size="sm">
                    {t("server.rulesCta")}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </section>
        </div>

        <div className="space-y-6">
          <ServerStatusCard />
        </div>
      </div>
    </div>
  )
}
