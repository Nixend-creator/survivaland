import { Users, UserCheck, Newspaper, ShoppingBag, Activity, Server } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useQuery } from "@tanstack/react-query"
import { getServerStatus } from "@/services/minecraftServer"
import { DEMO_NEWS, DEMO_SHOP, DEMO_PLAYERS } from "@/data/demo"
import { listReports } from "@/services/reports"

export function AdminDashboard() {
  const { data: status } = useQuery({
    queryKey: ["serverStatus"],
    queryFn: getServerStatus,
    refetchInterval: 30000,
  })
  const { data: reports = [] } = useQuery({
    queryKey: ["admin-reports"],
    queryFn: listReports,
  })
  const openReports = reports.filter((r) => r.status === "open").length

  const stats = [
    { label: "Всього гравців", value: DEMO_PLAYERS.length, icon: Users, note: "demo" },
    { label: "Онлайн", value: status?.players.online ?? "—", icon: UserCheck, note: status?.online ? "online" : "offline" },
    { label: "Новини", value: DEMO_NEWS.length, icon: Newspaper },
    { label: "Товари", value: DEMO_SHOP.length, icon: ShoppingBag },
    { label: "Відкриті скарги", value: openReports, icon: Activity },
  ]

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-[var(--color-text-muted)]">Огляд системи SurvivaLand</p>
        </div>
        <Badge variant={status?.online ? "success" : "danger"}>
          {status?.online ? "Server ONLINE" : "Server OFFLINE"}
        </Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="flex items-center gap-4 p-5">
              <div className="rounded-lg bg-[var(--color-primary-muted)] p-2.5 text-[var(--color-primary)]">
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-[var(--color-text-muted)]">{s.label}</p>
                <p className="text-2xl font-bold tabular-nums">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Server className="h-4 w-4" />
              Статус сервера
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[var(--color-text-muted)]">Гравці</span>
              <span className="tabular-nums">{status?.players.online ?? 0} / {status?.players.max ?? 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-text-muted)]">Версія</span>
              <span>{status?.version ?? "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-text-muted)]">Latency</span>
              <span>{status?.latency != null ? `${status.latency} ms` : "—"}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Система
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[var(--color-text-muted)]">Режим</span>
              <Badge variant="warning">DEMO</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-text-muted)]">Auth</span>
              <span className="text-[var(--color-text-dim)]">Local mock</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-text-muted)]">DB</span>
              <span className="text-[var(--color-text-dim)]">Not connected</span>
            </div>
            <p className="pt-2 text-xs text-[var(--color-text-dim)]">
              Авторизація admin перевіряється на клієнті лише для demo.
              У production — тільки server-side (RLS / edge functions).
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
