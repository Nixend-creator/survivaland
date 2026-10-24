import { useI18n } from "@/i18n"
import { pickLocalized, pickLocalizedList } from "@/lib/localized"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { ShoppingBag, Check } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { listProducts } from "@/services/shop"
import { ShopGridSkeleton } from "@/components/skeletons"
import type { ShopProduct } from "@/types"
import { toast } from "sonner"

const categories = [
  { id: "all", labelKey: "shop.all" },
  { id: "ranks", labelKey: "shop.ranks" },
  { id: "kits", labelKey: "shop.kits" },
  { id: "cosmetics", labelKey: "shop.cosmetics" },
  { id: "special", labelKey: "shop.special" },
  { id: "bundles", labelKey: "shop.bundles" },
] as const

export function ShopPage() {
  const { t, language } = useI18n()
  const [category, setCategory] = useState<string>("all")
  const { data: allProducts = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["admin-shop"],
    queryFn: listProducts,
  })

  const products =
    category === "all"
      ? allProducts
      : allProducts.filter((p) => p.category === category)

  const handlePurchase = (product: ShopProduct) => {
    toast.info(t("shop.paymentComing"), {
      description: `${pickLocalized(product.name, language)} — ${product.price} ${product.currency}`,
    })
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl flex items-center gap-3">
          <ShoppingBag className="h-8 w-8 text-[var(--color-primary)]" />
          Магазин
        </h1>
        <p className="mt-2 text-[var(--color-text-muted)]">
          {t("shop.subtitle")} · <Badge variant="warning">{t("shop.paymentComing")}</Badge>
        </p>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setCategory(c.id)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              category === c.id
                ? "bg-[var(--color-primary)] text-[var(--color-background)]"
                : "bg-[var(--color-surface)] text-[var(--color-text-muted)] border border-[var(--color-border)] hover:bg-[var(--color-surface-elevated)]"
            }`}
          >
            {t(c.labelKey)}
          </button>
        ))}
      </div>

      {isLoading && <ShopGridSkeleton />}

      {isError && (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-16">
            <p className="text-[var(--color-text-muted)]">{t("shop.loadError")}</p>
            <Button variant="secondary" size="sm" onClick={() => refetch()}>
              Спробувати знову
            </Button>
          </CardContent>
        </Card>
      )}

      {!isLoading && !isError && products.length === 0 && (
        <Card>
          <CardContent className="py-16 text-center text-[var(--color-text-muted)]">
            Товарів у цій категорії поки немає
          </CardContent>
        </Card>
      )}

      {!isLoading && !isError && products.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Card key={product.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{pickLocalized(product.name, language)}</CardTitle>
                  {product.isDemo && (
                    <Badge variant="warning" className="text-[10px]">
                      DEMO
                    </Badge>
                  )}
                </div>
                <CardDescription>{pickLocalized(product.description, language)}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-2">
                  {pickLocalizedList(product.benefits, language).map((b, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-[var(--color-text-muted)]"
                    >
                      <Check className="h-4 w-4 shrink-0 text-[var(--color-primary)] mt-0.5" />
                      {b}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="flex items-center justify-between border-t border-[var(--color-border)] pt-4">
                <span className="text-xl font-bold text-[var(--color-accent-gold)]">
                  {product.price} {product.currency}
                </span>
                <Button onClick={() => handlePurchase(product)}>{t("shop.purchase")}</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Card className="mt-10 border-[var(--color-secondary)]/20">
        <CardContent className="p-6 text-center">
          <p className="text-sm text-[var(--color-text-muted)]">
            Платіжна інтеграція (Stripe / WayForPay / LiqPay) буде підключена пізніше.
            <br />
            Зараз це інформаційна вітрина. Секрети API ніколи не потрапляють у фронтенд.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
