import { useI18n } from "@/i18n"
import { useParams, Link } from "react-router-dom"
import { Clock, Coins, Swords, Skull, Trophy, Calendar, Eye } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  Cell,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatNumber, formatPlaytime } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"
import { getPlayerByUsername } from "@/services/players"
import { PlayerProfileSkeleton } from "@/components/skeletons"

const tooltipStyle = {
  backgroundColor: "#161B24",
  border: "1px solid #1E2533",
  borderRadius: 8,
  color: "#E8ECF4",
  fontSize: 12,
}

export function PlayerPage() {
  const { t, language } = useI18n()
  const { username } = useParams()
  const { data: player, isLoading } = useQuery({
    queryKey: ["player", username],
    queryFn: () => getPlayerByUsername(username!),
    enabled: Boolean(username),
  })

  if (isLoading) {
    return <PlayerProfileSkeleton />
  }

  if (!player) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">{t("player.notFound")}</h1>
        <p className="mt-2 text-[var(--color-text-muted)]">
          {t("player.notFoundHint").replace("{username}", username || "")}
        </p>
        <Link to="/rankings" className="mt-6 inline-block">
          <Button variant="outline">{t("player.backRankings")}</Button>
        </Link>
      </div>
    )
  }

  const kd =
    player.deaths > 0
      ? (player.kills / player.deaths).toFixed(2)
      : player.kills.toFixed(2)

  const stats = [
    { icon: Clock, label: t("player.playtime"), value: formatPlaytime(player.playtimeMinutes) },
    { icon: Coins, label: t("player.balance"), value: formatNumber(player.balance) + " ₡" },
    { icon: Swords, label: t("player.kills"), value: formatNumber(player.kills) },
    { icon: Skull, label: t("player.deaths"), value: formatNumber(player.deaths) },
    { icon: Trophy, label: t("player.achievements"), value: String(player.achievements) },
    { icon: Swords, label: "K/D", value: kd },
  ]

  const combatData = [
    { name: "Вбивства", value: player.kills, fill: "#3DDC84" },
    { name: "Смерті", value: player.deaths, fill: "#E85A5A" },
    { name: "Досягнення", value: player.achievements, fill: "#E8B84A" },
  ]

  // Synthetic weekly activity for demo visualization
  const activityData = [
    { day: "Пн", hours: Math.max(1, Math.round((player.playtimeMinutes / 60) * 0.12) % 14) },
    { day: "Вт", hours: Math.max(1, Math.round((player.playtimeMinutes / 60) * 0.15) % 16) },
    { day: "Ср", hours: Math.max(0, Math.round((player.playtimeMinutes / 60) * 0.08) % 10) },
    { day: "Чт", hours: Math.max(1, Math.round((player.playtimeMinutes / 60) * 0.14) % 15) },
    { day: "Пт", hours: Math.max(2, Math.round((player.playtimeMinutes / 60) * 0.18) % 18) },
    { day: "Сб", hours: Math.max(2, Math.round((player.playtimeMinutes / 60) * 0.2) % 20) },
    { day: "Нд", hours: Math.max(1, Math.round((player.playtimeMinutes / 60) * 0.13) % 12) },
  ]

  const maxCombat = Math.max(player.kills, player.deaths, player.achievements, 1)
  const radialData = [
    {
      name: "K/D score",
      value: Math.min(100, Math.round((Number(kd) / 5) * 100)),
      fill: "#3DDC84",
    },
  ]

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <Card className="mb-8 overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-[var(--color-primary)]/20 via-[var(--color-accent-cyan)]/10 to-transparent" />
        <CardContent className="relative -mt-10 flex flex-col sm:flex-row items-center sm:items-end gap-4 pb-6">
          <div className="h-20 w-20 rounded-xl border-4 border-[var(--color-surface)] bg-[var(--color-surface-elevated)] flex items-center justify-center text-3xl font-bold text-[var(--color-primary)] shadow-lg">
            {player.username.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-bold">{player.username}</h1>
              <Badge variant="success">{player.rank}</Badge>
              {player.isDemo && <Badge variant="warning">DEMO</Badge>}
            </div>
            <div className="mt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm text-[var(--color-text-muted)]">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />З {player.firstJoined}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" />
                Останній вхід: {player.lastSeen}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="flex items-center gap-4 p-5">
              <div className="rounded-lg bg-[var(--color-primary-muted)] p-2.5 text-[var(--color-primary)]">
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-[var(--color-text-muted)]">{s.label}</p>
                <p className="text-lg font-semibold tabular-nums">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Бойова статистика</CardTitle>
          </CardHeader>
          <CardContent className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={combatData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#8B95A8", fontSize: 12 }}
                  axisLine={{ stroke: "#1E2533" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#5A6578", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  domain={[0, Math.ceil(maxCombat * 1.1)]}
                />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(61,220,132,0.06)" }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={48}>
                  {combatData.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Активність за тиждень
              <span className="ml-2 text-xs font-normal text-[var(--color-text-dim)]">
                (demo-оцінка)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <XAxis
                  dataKey="day"
                  tick={{ fill: "#8B95A8", fontSize: 12 }}
                  axisLine={{ stroke: "#1E2533" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#5A6578", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  unit="г"
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  cursor={{ fill: "rgba(61,220,132,0.06)" }}
                  formatter={(value: number) => [`${value} год`, "Гра"]}
                />
                <Bar dataKey="hours" fill="#4ECDC4" radius={[6, 6, 0, 0]} maxBarSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 mb-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">K/D індекс</CardTitle>
          </CardHeader>
          <CardContent className="h-44 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                innerRadius="60%"
                outerRadius="100%"
                data={radialData}
                startAngle={90}
                endAngle={-270}
              >
                <RadialBar dataKey="value" background={{ fill: "#1E2533" }} cornerRadius={8} />
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-[var(--color-text)] text-2xl font-bold"
                  style={{ fill: "#E8ECF4", fontSize: 22, fontWeight: 700 }}
                >
                  {kd}
                </text>
              </RadialBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Досягнення</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: Math.min(player.achievements, 12) }).map((_, i) => (
                <div
                  key={i}
                  className="h-12 w-12 rounded-lg bg-[var(--color-surface-elevated)] border border-[var(--color-border)] flex items-center justify-center text-lg opacity-60"
                  title={`Досягнення #${i + 1}`}
                >
                  🏆
                </div>
              ))}
              {player.achievements === 0 && (
                <p className="text-sm text-[var(--color-text-muted)]">Ще немає досягнень</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
