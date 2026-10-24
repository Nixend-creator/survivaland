import { useState } from "react"
import { Link } from "react-router-dom"
import { useI18n } from "@/i18n"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn, formatNumber, formatPlaytime } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"
import { getRankings } from "@/services/rankings"
import { RankingSkeleton } from "@/components/skeletons"
import type { RankingType } from "@/types"

const tabs: { key: RankingType; labelKey: string }[] = [
  { key: "playtime", labelKey: "rankings.playtime" },
  { key: "wealth", labelKey: "rankings.wealth" },
  { key: "kills", labelKey: "rankings.kills" },
  { key: "deaths", labelKey: "rankings.deaths" },
  { key: "achievements", labelKey: "rankings.achievements" },
]

function formatValue(type: RankingType, value: number) {
  if (type === "playtime") return formatPlaytime(value)
  if (type === "wealth") return formatNumber(value) + " ₡"
  return formatNumber(value)
}

export function RankingsPage() {
  const { t } = useI18n()
  const [active, setActive] = useState<RankingType>("playtime")
  const { data: rankings = [], isLoading } = useQuery({
    queryKey: ["rankings", active],
    queryFn: () => getRankings(active),
  })

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{t("rankings.title")}</h1>
        <p className="mt-2 text-[var(--color-text-muted)]">
          {t("rankings.subtitle")} · <Badge variant="warning">Демо-дані</Badge>
        </p>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              active === tab.key
                ? "bg-[var(--color-primary)] text-[var(--color-background)]"
                : "bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-elevated)] border border-[var(--color-border)]"
            )}
          >
            {t(tab.labelKey)}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="mb-8">
          <RankingSkeleton />
        </div>
      )}

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {!isLoading && rankings.slice(0, 3).map((entry, i) => (
          <Card
            key={entry.player.id}
            className={cn(
              "relative overflow-hidden",
              i === 0 && "border-[var(--color-accent-gold)]/50"
            )}
          >
            <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
              <div
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-full text-xl font-bold",
                  i === 0 && "bg-[var(--color-accent-gold)]/20 text-[var(--color-accent-gold)]",
                  i === 1 && "bg-[var(--color-text-muted)]/20 text-[var(--color-text-muted)]",
                  i === 2 && "bg-[rgba(205,127,50,0.2)] text-[#CD7F32]"
                )}
              >
                #{entry.rank}
              </div>
              <Link to={`/player/${entry.player.username}`} className="font-semibold hover:text-[var(--color-primary)]">
                {entry.player.username}
              </Link>
              <Badge variant="secondary">{entry.player.rank}</Badge>
              <p className="text-lg font-bold tabular-nums text-[var(--color-primary)]">
                {formatValue(active, entry.value)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mb-8">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{t("rankings.chartTitle")}</CardTitle>
        </CardHeader>
        <CardContent className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={rankings.slice(0, 5).map((e) => ({
                name: e.player.username,
                value: e.value,
              }))}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
              <XAxis
                dataKey="name"
                tick={{ fill: "#8B95A8", fontSize: 11 }}
                axisLine={{ stroke: "#1E2533" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#5A6578", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#161B24",
                  border: "1px solid #1E2533",
                  borderRadius: 8,
                  color: "#E8ECF4",
                  fontSize: 12,
                }}
                cursor={{ fill: "rgba(61,220,132,0.06)" }}
                formatter={(value: number) => [formatValue(active, value), ""]}
              />
              <Bar dataKey="value" fill="#3DDC84" radius={[6, 6, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] text-left text-[var(--color-text-muted)]">
                <th className="px-4 py-3 font-medium">#</th>
                <th className="px-4 py-3 font-medium">{t("rankings.colPlayer")}</th>
                <th className="px-4 py-3 font-medium hidden sm:table-cell">{t("rankings.colRank")}</th>
                <th className="px-4 py-3 font-medium text-right">{t("rankings.colValue")}</th>
                <th className="px-4 py-3 font-medium text-right hidden md:table-cell">{t("rankings.colChange")}</th>
              </tr>
            </thead>
            <tbody>
              {rankings.map((entry) => (
                <tr key={entry.player.id} className="border-b border-[var(--color-border)]/50 hover:bg-[var(--color-surface-elevated)]/50">
                  <td className="px-4 py-3 tabular-nums text-[var(--color-text-dim)]">{entry.rank}</td>
                  <td className="px-4 py-3">
                    <Link to={`/player/${entry.player.username}`} className="font-medium hover:text-[var(--color-primary)]">
                      {entry.player.username}
                    </Link>
                    {entry.isDemo && <span className="ml-2 text-[10px] text-[var(--color-text-dim)]">DEMO</span>}
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell text-[var(--color-text-muted)]">{entry.player.rank}</td>
                  <td className="px-4 py-3 text-right font-medium tabular-nums">{formatValue(active, entry.value)}</td>
                  <td className="px-4 py-3 text-right hidden md:table-cell">
                    <span className={cn("tabular-nums text-xs", entry.change > 0 && "text-[var(--color-primary)]", entry.change < 0 && "text-[var(--color-accent-red)]", entry.change === 0 && "text-[var(--color-text-dim)]")}>
                      {entry.change > 0 ? `↑${entry.change}` : entry.change < 0 ? `↓${Math.abs(entry.change)}` : "—"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
