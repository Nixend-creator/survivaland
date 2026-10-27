import { useQuery } from "@tanstack/react-query"
import { Copy, RefreshCw, Wifi, Users, Clock } from "lucide-react"
import { getServerStatus } from "@/services/minecraftServer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusIndicator } from "@/components/ui/status-indicator"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn, copyToClipboard } from "@/lib/utils"
import { config } from "@/config"
import { getSiteSettings } from "@/services/siteSettings"
import { toast } from "sonner"
import { useI18n } from "@/i18n"

function ServerStatusSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="h-5 w-32 animate-pulse rounded bg-[var(--color-surface-elevated)]" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-8 w-24 animate-pulse rounded bg-[var(--color-surface-elevated)]" />
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 animate-pulse rounded-lg bg-[var(--color-surface-elevated)]" />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function ServerStatusCard({ className }: { className?: string }) {
  const { t } = useI18n()
  const { data: site } = useQuery({ queryKey: ["site-settings"], queryFn: getSiteSettings })
  const displayIp = site?.serverIp || config.serverIp
  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["serverStatus"],
    queryFn: getServerStatus,
    refetchInterval: 30000,
    staleTime: 15000,
  })

  const handleCopy = async () => {
    const ok = await copyToClipboard(displayIp)
    if (ok) toast.success(t("status.copyIp"))
    else toast.error(t("status.copyFail"))
  }

  if (isLoading) return <ServerStatusSkeleton />

  if (isError || !data) {
    return (
      <Card className={cn("border-[var(--color-accent-red)]/30", className)}>
        <CardContent className="flex flex-col items-center justify-center gap-3 py-10">
          <p className="text-[var(--color-text-muted)]">{t("status.loadError")}</p>
          <Button variant="secondary" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4" />
            {t("common.retry")}
          </Button>
        </CardContent>
      </Card>
    )
  }

  const secondsAgo = Math.floor((Date.now() - data.lastUpdated.getTime()) / 1000)

  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/5 to-transparent pointer-events-none" />
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-sm font-medium text-[var(--color-text-muted)]">
          {t("status.title")}
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => refetch()}
          disabled={isFetching}
          aria-label={t("status.refresh")}
        >
          <RefreshCw className={cn("h-4 w-4", isFetching && "animate-spin")} />
        </Button>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex items-center justify-between">
          <StatusIndicator online={data.online} size="lg" />
          <Badge variant="outline" className="font-mono text-xs">
            {data.version}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-elevated)]/50 p-3">
            <div className="flex items-center gap-2 text-[var(--color-text-muted)] text-xs mb-1">
              <Users className="h-3.5 w-3.5" />
              {t("status.players")}
            </div>
            <p className="text-xl font-semibold tabular-nums">
              {data.players.online}
              <span className="text-sm text-[var(--color-text-dim)] font-normal">
                {" "}/ {data.players.max}
              </span>
            </p>
          </div>

          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-elevated)]/50 p-3">
            <div className="flex items-center gap-2 text-[var(--color-text-muted)] text-xs mb-1">
              <Wifi className="h-3.5 w-3.5" />
              {t("status.latency")}
            </div>
            <p className="text-xl font-semibold tabular-nums">
              {data.latency !== null ? `${data.latency} ms` : "—"}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-elevated)]/30 px-3 py-2.5">
          <code className="font-mono text-sm text-[var(--color-primary)]">{data.ip || displayIp}</code>
          <Button variant="ghost" size="sm" onClick={handleCopy} className="h-8 shrink-0">
            <Copy className="h-3.5 w-3.5" />
            {t("status.copy")}
          </Button>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-dim)]">
          <Clock className="h-3 w-3" />
          {t("status.updated")}{" "}
          {secondsAgo < 5 ? t("status.justNow") : t("status.secondsAgo").replace("{n}", String(secondsAgo))}
        </div>
      </CardContent>
    </Card>
  )
}
