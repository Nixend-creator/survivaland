import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { ArrowLeftRight } from "lucide-react"
import { useI18n } from "@/i18n"
import {
  fetchNbuRates,
  convertCurrency,
  formatMoney,
  SHOP_CURRENCIES,
  type CurrencyCode,
} from "@/services/nbuRates"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function CurrencyConverter() {
  const { t, language } = useI18n()
  const [amount, setAmount] = useState(100)
  const [from, setFrom] = useState<CurrencyCode>("UAH")
  const [to, setTo] = useState<CurrencyCode>("USD")
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))

  const { data: rates = [], isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["nbu-rates", date],
    queryFn: () => fetchNbuRates(date),
    staleTime: 60_000,
  })

  const result = convertCurrency(amount || 0, from, to, rates)
  const locale = language === "en" ? "en-US" : language === "ru" ? "ru-RU" : "uk-UA"
  const rateDate = rates[0]?.exchangedate ?? date

  const swap = () => {
    setFrom(to)
    setTo(from)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <ArrowLeftRight className="h-4 w-4 text-[var(--color-primary)]" />
          {t("currency.title")}
        </CardTitle>
        <CardDescription>
          {t("currency.subtitle")} · {t("currency.asOf")} {rateDate}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="mb-1 block text-xs text-[var(--color-text-muted)]">{t("currency.date")}</label>
          <input
            type="date"
            value={date}
            max={new Date().toISOString().slice(0, 10)}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3 py-2 text-sm"
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
          <div>
            <label className="mb-1 block text-xs text-[var(--color-text-muted)]">{t("currency.from")}</label>
            <div className="flex gap-2">
              <input
                type="number"
                min={0}
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3 py-2 text-sm"
              />
              <select
                value={from}
                onChange={(e) => setFrom(e.target.value as CurrencyCode)}
                className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-2 py-2 text-sm"
              >
                {SHOP_CURRENCIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Button type="button" variant="outline" size="icon" onClick={swap} className="mx-auto" aria-label="Swap">
            <ArrowLeftRight className="h-4 w-4" />
          </Button>

          <div>
            <label className="mb-1 block text-xs text-[var(--color-text-muted)]">{t("currency.to")}</label>
            <div className="flex gap-2">
              <div className="flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm font-medium tabular-nums">
                {isLoading ? "…" : formatMoney(result, to, locale)}
              </div>
              <select
                value={to}
                onChange={(e) => setTo(e.target.value as CurrencyCode)}
                className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-2 py-2 text-sm"
              >
                {SHOP_CURRENCIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {isError && (
          <p className="text-xs text-[var(--color-accent-gold)]">{t("currency.fallback")}</p>
        )}

        <Button variant="secondary" size="sm" onClick={() => refetch()} disabled={isFetching}>
          {t("currency.refresh")}
        </Button>

        <p className="text-[10px] text-[var(--color-text-dim)]">{t("currency.disclaimer")}</p>
      </CardContent>
    </Card>
  )
}
