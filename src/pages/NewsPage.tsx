import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { Calendar, User } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { listNews } from "@/services/news"
import { useI18n } from "@/i18n"
import { pickLocalized, pickLocalizedList } from "@/lib/localized"
import { NewsGridSkeleton } from "@/components/skeletons"

export function NewsPage() {
  const { t, language } = useI18n()
  const { data: articles = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["admin-news"],
    queryFn: listNews,
  })

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{t("news.title")}</h1>
        <p className="mt-2 text-[var(--color-text-muted)]">{t("news.subtitle")}</p>
      </div>

      {isLoading && <NewsGridSkeleton />}

      {isError && (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-16">
            <p className="text-[var(--color-text-muted)]">{t("news.loadError")}</p>
            <Button variant="secondary" size="sm" onClick={() => refetch()}>
              Спробувати знову
            </Button>
          </CardContent>
        </Card>
      )}

      {!isLoading && !isError && articles.length === 0 && (
        <Card>
          <CardContent className="py-16 text-center text-[var(--color-text-muted)]">
            {t("news.empty")}
          </CardContent>
        </Card>
      )}

      {!isLoading && !isError && articles.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <Link key={article.id} to={`/news/${article.slug}`}>
              <Card className="h-full transition-colors hover:border-[var(--color-primary)]/40">
                <div className="aspect-video bg-[var(--color-surface-elevated)] rounded-t-[var(--radius-md)] flex items-center justify-center">
                  <span className="text-4xl opacity-20">📰</span>
                </div>
                <CardHeader>
                  <div className="flex items-center gap-2 text-xs text-[var(--color-text-dim)]">
                    <Badge variant="info">{pickLocalized(article.category, language)}</Badge>
                    {article.isDemo && <Badge variant="warning">DEMO</Badge>}
                  </div>
                  <CardTitle className="text-base leading-snug">{pickLocalized(article.title, language)}</CardTitle>
                  <CardDescription className="line-clamp-2">{pickLocalized(article.excerpt, language)}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center gap-4 text-xs text-[var(--color-text-dim)]">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {article.publishedAt}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {article.author}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
