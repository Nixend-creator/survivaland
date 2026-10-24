import { Coins, Store, Gavel, Briefcase, Gift, ArrowLeftRight } from "lucide-react"
import { useI18n } from "@/i18n"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CurrencyConverter } from "@/components/CurrencyConverter"

const featureDefs = [
  { icon: Coins, titleKey: "economy.f_currency_t", descKey: "economy.f_currency_d" },
  { icon: Store, titleKey: "economy.f_shops_t", descKey: "economy.f_shops_d" },
  { icon: Gavel, titleKey: "economy.f_ah_t", descKey: "economy.f_ah_d" },
  { icon: ArrowLeftRight, titleKey: "economy.f_trade_t", descKey: "economy.f_trade_d" },
  { icon: Briefcase, titleKey: "economy.f_jobs_t", descKey: "economy.f_jobs_d" },
  { icon: Gift, titleKey: "economy.f_rewards_t", descKey: "economy.f_rewards_d" },
] as const

export function EconomyPage() {
  const { t } = useI18n()

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{t("economy.title")}</h1>
        <p className="mt-2 text-[var(--color-text-muted)]">{t("economy.subtitle")}</p>
      </div>

      <Card className="mb-10 border-[var(--color-accent-gold)]/30">
        <CardContent className="flex flex-col sm:flex-row items-center gap-6 p-8">
          <div className="rounded-2xl bg-[rgba(232,184,74,0.15)] p-4">
            <Coins className="h-10 w-10 text-[var(--color-accent-gold)]" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">{t("economy.currencyTitle")}</h2>
            <p className="mt-1 text-[var(--color-text-muted)]">
              <span className="text-2xl font-bold text-[var(--color-accent-gold)]">Coins</span>
              {" "}{t("economy.currencyText")}
            </p>
            <Badge variant="warning" className="mt-3">{t("economy.demoBadge")}</Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {featureDefs.map((f) => (
          <Card key={f.titleKey} className="hover:border-[var(--color-primary)]/30 transition-colors">
            <CardHeader>
              <div className="rounded-lg bg-[var(--color-primary-muted)] p-2.5 text-[var(--color-primary)] w-fit mb-2">
                <f.icon className="h-5 w-5" />
              </div>
              <CardTitle className="text-base">{t(f.titleKey)}</CardTitle>
              <p className="text-sm text-[var(--color-text-muted)] mt-1">{t(f.descKey)}</p>
            </CardHeader>
          </Card>
        ))}
      </div>

      <div className="mt-10">
        <CurrencyConverter />
      </div>

      <Card className="mt-10">
        <CardHeader>
          <CardTitle className="text-base">{t("economy.commandsTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-[var(--color-text-muted)] font-mono">
            <li><span className="text-[var(--color-primary)]">/bal</span> — {t("economy.cmd_bal")}</li>
            <li><span className="text-[var(--color-primary)]">/pay</span> — {t("economy.cmd_pay")}</li>
            <li><span className="text-[var(--color-primary)]">/ah</span> — {t("economy.cmd_ah")}</li>
            <li><span className="text-[var(--color-primary)]">/shop</span> — {t("economy.cmd_shop")}</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
