import { useI18n } from "@/i18n"
import { pickLocalized, pickLocalizedList } from "@/lib/localized"
import { Link, useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { Calendar, User, ArrowLeft, ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getNewsBySlug, listNews } from "@/services/news"

export function NewsArticlePage() {
  const { t, language } = useI18n()
  const { slug } = useParams()

  const { data: article, isLoading, isError } = useQuery({
    queryKey: ["news", slug],
    queryFn: () => getNewsBySlug(slug!),
    enabled: Boolean(slug),
  })

  const { data: allNews = [] } = useQuery({
    queryKey: ["admin-news"],
    queryFn: listNews,
  })

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center text-[var(--color-text-muted)]">
        Завантаження...
      </div>
    )
  }

  if (isError || !article) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">{t("news.notFound")}</h1>
        <Link to="/news" className="mt-4 inline-block">
          <Button variant="outline">{t("news.back")}</Button>
        </Link>
      </div>
    )
  }

  const related = allNews.filter((a) => a.id !== article.id).slice(0, 2)

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
        <Link to="/news" className="hover:text-[var(--color-primary)]">{t("nav.news")}</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-[var(--color-text)] truncate">{pickLocalized(article.title, language)}</span>
      </div>

      <article>
        <Badge variant="info" className="mb-3">{pickLocalized(article.category, language)}</Badge>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{pickLocalized(article.title, language)}</h1>
        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-[var(--color-text-muted)]">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {article.publishedAt}
          </span>
          <span className="flex items-center gap-1.5">
            <User className="h-4 w-4" />
            {article.author}
          </span>
          {article.isDemo && <Badge variant="warning">DEMO</Badge>}
        </div>

        <div className="mt-8 aspect-video rounded-xl bg-[var(--color-surface-elevated)] flex items-center justify-center">
          <span className="text-6xl opacity-20">📰</span>
        </div>

        <div className="mt-8 space-y-4 text-[var(--color-text-muted)] leading-relaxed">
          {pickLocalized(article.content, language).split("\n").map((line, i) => {
            if (line.startsWith("## ")) return <h2 key={i} className="text-xl font-semibold text-[var(--color-text)] mt-6">{line.slice(3)}</h2>
            if (line.startsWith("### ")) return <h3 key={i} className="text-lg font-medium text-[var(--color-text)] mt-4">{line.slice(4)}</h3>
            if (line.startsWith("- ")) return <li key={i} className="ml-4">{line.slice(2)}</li>
            if (line.trim()) return <p key={i}>{line}</p>
            return null
          })}
        </div>
      </article>

      {related.length > 0 && (
        <div className="mt-12 border-t border-[var(--color-border)] pt-8">
          <h3 className="text-lg font-semibold mb-4">{t("news.related")}</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {related.map((r) => (
              <Link key={r.id} to={`/news/${r.slug}`}>
                <Card className="hover:border-[var(--color-primary)]/40 transition-colors">
                  <CardContent className="p-4">
                    <Badge variant="secondary" className="mb-2 text-[10px]">{pickLocalized(r.category, language)}</Badge>
                    <p className="font-medium text-sm">{pickLocalized(r.title, language)}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8">
        <Link to="/news">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4" />
            До всіх новин
          </Button>
        </Link>
      </div>
    </div>
  )
}
