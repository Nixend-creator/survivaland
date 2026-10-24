import { useI18n } from "@/i18n"
import { pickLocalized, pickLocalizedList } from "@/lib/localized"
import { useState } from "react"
import { Link, useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { Search, BookOpen, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { listWiki, getWikiBySlug } from "@/services/wiki"
import { WikiListSkeleton } from "@/components/skeletons"

const categories = [
  { id: "getting-started", labelKey: "wiki.cat_start" },
  { id: "server-basics", labelKey: "wiki.cat_basics" },
  { id: "economy", labelKey: "wiki.cat_economy" },
  { id: "protection", labelKey: "wiki.cat_protection" },
  { id: "pvp", labelKey: "wiki.cat_pvp" },
  { id: "quests", labelKey: "wiki.cat_quests" },
  { id: "jobs", labelKey: "wiki.cat_jobs" },
  { id: "ranks", labelKey: "wiki.cat_ranks" },
  { id: "commands", labelKey: "wiki.cat_commands" },
  { id: "faq", labelKey: "wiki.cat_faq" },
]

export function WikiPage() {
  const { t, language } = useI18n()
  const { slug } = useParams()
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState("getting-started")

  const { data: allArticles = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["admin-wiki"],
    queryFn: listWiki,
  })

  const { data: articleBySlug, isLoading: articleLoading } = useQuery({
    queryKey: ["wiki", slug],
    queryFn: () => getWikiBySlug(slug!),
    enabled: Boolean(slug),
  })

  const filtered = allArticles.filter(
    (a) =>
      pickLocalized(a.title, language).toLowerCase().includes(search.toLowerCase()) ||
      pickLocalized(a.description, language).toLowerCase().includes(search.toLowerCase())
  )

  const article = slug ? articleBySlug : null
  const categoryArticles = allArticles.filter((a) => a.category === activeCategory)

  if (slug && (articleLoading || isLoading)) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center text-[var(--color-text-muted)]">
        Завантаження...
      </div>
    )
  }

  if (slug && !articleLoading && !article) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Статтю не знайдено</h1>
        <Link to="/wiki" className="mt-4 inline-block">
          <Button variant="outline">До Wiki</Button>
        </Link>
      </div>
    )
  }

  if (article) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
          <Link to="/wiki" className="hover:text-[var(--color-primary)]">
            Wiki
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-[var(--color-text)]">{pickLocalized(article.title, language)}</span>
        </div>
        <article className="max-w-3xl">
          <Badge variant="info" className="mb-3">
            {article.category}
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight">{pickLocalized(article.title, language)}</h1>
          <p className="mt-2 text-[var(--color-text-muted)]">{pickLocalized(article.description, language)}</p>
          <div className="mt-8 space-y-4 text-[var(--color-text-muted)] leading-relaxed">
            {pickLocalized(article.content, language).split("\n").map((line, i) => {
              if (line.startsWith("## "))
                return (
                  <h2 key={i} className="text-xl font-semibold text-[var(--color-text)] mt-6">
                    {line.slice(3)}
                  </h2>
                )
              if (line.startsWith("### "))
                return (
                  <h3 key={i} className="text-lg font-medium text-[var(--color-text)] mt-4">
                    {line.slice(4)}
                  </h3>
                )
              if (line.startsWith("- "))
                return (
                  <li key={i} className="ml-4">
                    {line.slice(2)}
                  </li>
                )
              if (line.match(/^\d+\. /))
                return (
                  <li key={i} className="ml-4 list-decimal">
                    {line.replace(/^\d+\.\s*/, "")}
                  </li>
                )
              if (line.includes("`")) {
                const parts = line.split(/(`[^`]+`)/g)
                return (
                  <p key={i}>
                    {parts.map((p, j) =>
                      p.startsWith("`") ? (
                        <code
                          key={j}
                          className="rounded bg-[var(--color-surface-elevated)] px-1.5 py-0.5 font-mono text-sm text-[var(--color-primary)]"
                        >
                          {p.slice(1, -1)}
                        </code>
                      ) : (
                        p
                      )
                    )}
                  </p>
                )
              }
              if (line.trim()) return <p key={i}>{line}</p>
              return null
            })}
          </div>
          {article.related.length > 0 && (
            <div className="mt-10 border-t border-[var(--color-border)] pt-6">
              <h3 className="text-sm font-semibold text-[var(--color-text-muted)] mb-3">
                {t("wiki.related")}
              </h3>
              <div className="flex flex-wrap gap-2">
                {article.related.map((rel) => {
                  const relArticle = allArticles.find((a) => a.slug === rel)
                  return relArticle ? (
                    <Link key={rel} to={`/wiki/${rel}`}>
                      <Badge
                        variant="outline"
                        className="hover:border-[var(--color-primary)] cursor-pointer"
                      >
                        {pickLocalized(relArticle.title, language)}
                      </Badge>
                    </Link>
                  ) : null
                })}
              </div>
            </div>
          )}
        </article>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl flex items-center gap-3">
          <BookOpen className="h-8 w-8 text-[var(--color-primary)]" />
          {t("wiki.title")}
        </h1>
        <p className="mt-2 text-[var(--color-text-muted)]">{t("wiki.subtitle")}</p>
      </div>

      <div className="mb-6 relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-dim)]" />
        <input
          type="search"
          placeholder={t("wiki.search")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] py-2.5 pl-10 pr-4 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-dim)] focus:border-[var(--color-primary)] focus:outline-none"
        />
      </div>

      {isLoading && <WikiListSkeleton />}
      {isError && (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-10">
            <p className="text-[var(--color-text-muted)]">{t("wiki.loadError")}</p>
            <Button variant="secondary" size="sm" onClick={() => refetch()}>
              {t("common.retry")}
            </Button>
          </CardContent>
        </Card>
      )}

      {!isLoading && !isError && (
        <div className="grid gap-8 lg:grid-cols-4">
          <aside className="lg:col-span-1">
            <nav className="space-y-1 sticky top-24">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id)
                    setSearch("")
                  }}
                  className={cn(
                    "block w-full text-left rounded-lg px-3 py-2 text-sm transition-colors",
                    activeCategory === cat.id && !search
                      ? "bg-[var(--color-primary-muted)] text-[var(--color-primary)] font-medium"
                      : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]"
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </nav>
          </aside>

          <div className="lg:col-span-3 space-y-3">
            {(search ? filtered : categoryArticles).length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-[var(--color-text-muted)]">
                  {t("wiki.empty")}
                </CardContent>
              </Card>
            ) : (
              (search ? filtered : categoryArticles).map((a) => (
                <Link key={a.id} to={`/wiki/${a.slug}`}>
                  <Card className="transition-colors hover:border-[var(--color-primary)]/40">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base">{pickLocalized(a.title, language)}</CardTitle>
                        {a.isDemo && (
                          <Badge variant="warning" className="text-[10px]">
                            DEMO
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-[var(--color-text-muted)]">{pickLocalized(a.description, language)}</p>
                    </CardHeader>
                  </Card>
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
