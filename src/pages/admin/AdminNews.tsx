import { useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Link } from "react-router-dom"
import { Plus, Pencil, Trash2, ExternalLink, X } from "lucide-react"
import { toast } from "sonner"
import { listNews, createNews, updateNews, deleteNews, type NewsInput } from "@/services/news"
import type { NewsArticle } from "@/types"
import { loc, pickLocalized, type LocalizedString } from "@/lib/localized"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const emptyForm: NewsInput = {
  title: loc(""),
  excerpt: loc(""),
  content: loc(""),
  category: loc("Новини", "Новости", "News"),
  author: "Адміністрація",
  publishedAt: new Date().toISOString().slice(0, 10),
  slug: "",
}

export function AdminNews() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState("")
  const [editing, setEditing] = useState<NewsArticle | null>(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState<NewsInput>(emptyForm)
  const [saving, setSaving] = useState(false)

  const { data: articles = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["admin-news"],
    queryFn: listNews,
  })

  const filtered = articles.filter(
    (a) =>
      pickLocalized(a.title, "uk").toLowerCase().includes(search.toLowerCase()) ||
      pickLocalized(a.category, "uk").toLowerCase().includes(search.toLowerCase()) ||
      a.slug.toLowerCase().includes(search.toLowerCase())
  )

  const openCreate = () => {
    setEditing(null)
    setForm({ ...emptyForm, publishedAt: new Date().toISOString().slice(0, 10) })
    setCreating(true)
  }

  const openEdit = (article: NewsArticle) => {
    setCreating(false)
    setEditing(article)
    setForm({
      title: { ...article.title },
      excerpt: { ...article.excerpt },
      content: { ...article.content },
      category: { ...article.category },
      author: article.author,
      publishedAt: article.publishedAt,
      slug: article.slug,
    })
  }

  const closeForm = () => {
    setCreating(false)
    setEditing(null)
    setForm(emptyForm)
  }

  const handleSave = async () => {
    if (!(form.title.uk || form.title.en).trim() || !(form.content.uk || form.content.en).trim()) {
      toast.error("Заголовок і контент обов'язкові (UA або EN)")
      return
    }
    setSaving(true)
    try {
      if (editing) {
        await updateNews(editing.id, form)
        toast.success("Статтю оновлено")
      } else {
        await createNews(form)
        toast.success("Статтю створено")
      }
      await queryClient.invalidateQueries({ queryKey: ["admin-news"] })
      closeForm()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Помилка збереження")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (article: NewsArticle) => {
    if (!confirm(`Видалити «${pickLocalized(article.title, "uk")}»?`)) return
    try {
      await deleteNews(article.id)
      toast.success("Статтю видалено")
      await queryClient.invalidateQueries({ queryKey: ["admin-news"] })
      if (editing?.id === article.id) closeForm()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Помилка видалення")
    }
  }

  const showForm = creating || editing

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Новини</h1>
          <p className="text-sm text-[var(--color-text-muted)]">
            CRUD у demo-режимі · дані в пам'яті до перезавантаження
          </p>
        </div>
        <Button onClick={openCreate} className="gap-1.5 shrink-0">
          <Plus className="h-4 w-4" />
          Додати новину
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6 border-[var(--color-primary)]/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base">
              {editing ? "Редагувати статтю" : "Нова стаття"}
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={closeForm} aria-label="Закрити">
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Заголовок UA *">
                <input
                  value={form.title.uk}
                  onChange={(e) => setForm((f) => ({ ...f, title: { ...f.title, uk: e.target.value } }))}
                  className={inputClass}
                  placeholder="UA"
                />
              </Field>
              <Field label="Заголовок RU">
                <input
                  value={form.title.ru}
                  onChange={(e) => setForm((f) => ({ ...f, title: { ...f.title, ru: e.target.value } }))}
                  className={inputClass}
                  placeholder="RU"
                />
              </Field>
              <Field label="Заголовок EN">
                <input
                  value={form.title.en}
                  onChange={(e) => setForm((f) => ({ ...f, title: { ...f.title, en: e.target.value } }))}
                  className={inputClass}
                  placeholder="EN"
                />
              </Field>
              <Field label="Категорія UA">
                <input
                  value={form.category.uk}
                  onChange={(e) => setForm((f) => ({ ...f, category: { ...f.category, uk: e.target.value, ru: f.category.ru, en: f.category.en } }))}
                  className={inputClass}
                />
              </Field>
              <Field label="Автор">
                <input
                  value={form.author}
                  onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
                  className={inputClass}
                />
              </Field>
              <Field label="Дата">
                <input
                  type="date"
                  value={form.publishedAt}
                  onChange={(e) => setForm((f) => ({ ...f, publishedAt: e.target.value }))}
                  className={inputClass}
                />
              </Field>
              <Field label="Slug (URL)">
                <input
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  className={inputClass}
                  placeholder="автоматично з заголовка"
                />
              </Field>
            </div>
            <Field label="Опис UA / RU / EN">
              <textarea value={form.excerpt.uk} onChange={(e) => setForm((f) => ({ ...f, excerpt: { ...f.excerpt, uk: e.target.value } }))} className={cn(inputClass, "min-h-[48px] resize-y mb-2")} rows={2} placeholder="UA" />
              <textarea value={form.excerpt.ru} onChange={(e) => setForm((f) => ({ ...f, excerpt: { ...f.excerpt, ru: e.target.value } }))} className={cn(inputClass, "min-h-[48px] resize-y mb-2")} rows={2} placeholder="RU" />
              <textarea value={form.excerpt.en} onChange={(e) => setForm((f) => ({ ...f, excerpt: { ...f.excerpt, en: e.target.value } }))} className={cn(inputClass, "min-h-[48px] resize-y")} rows={2} placeholder="EN" />
            </Field>
            <Field label="Контент UA *">
              <textarea value={form.content.uk} onChange={(e) => setForm((f) => ({ ...f, content: { ...f.content, uk: e.target.value } }))} className={cn(inputClass, "min-h-[100px] resize-y font-mono text-xs")} rows={5} />
            </Field>
            <Field label="Контент RU">
              <textarea value={form.content.ru} onChange={(e) => setForm((f) => ({ ...f, content: { ...f.content, ru: e.target.value } }))} className={cn(inputClass, "min-h-[80px] resize-y font-mono text-xs")} rows={4} />
            </Field>
            <Field label="Контент EN">
              <textarea value={form.content.en} onChange={(e) => setForm((f) => ({ ...f, content: { ...f.content, en: e.target.value } }))} className={cn(inputClass, "min-h-[80px] resize-y font-mono text-xs")} rows={4} />
            </Field>
            <div className="flex gap-2 pt-1">
              <Button onClick={handleSave} disabled={saving}>
                {saving ? "Збереження..." : editing ? "Оновити" : "Створити"}
              </Button>
              <Button variant="outline" onClick={closeForm}>
                Скасувати
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <input
        type="search"
        placeholder="Пошук за назвою, категорією, slug..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={cn(inputClass, "mb-4 max-w-md")}
      />

      {isLoading && (
        <p className="text-sm text-[var(--color-text-muted)]">Завантаження...</p>
      )}
      {isError && (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-10">
            <p className="text-[var(--color-text-muted)]">Не вдалося завантажити новини</p>
            <Button variant="secondary" size="sm" onClick={() => refetch()}>
              Спробувати знову
            </Button>
          </CardContent>
        </Card>
      )}

      {!isLoading && !isError && filtered.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-[var(--color-text-muted)]">
            {search ? "Нічого не знайдено" : "Новин ще немає"}
          </CardContent>
        </Card>
      )}

      {!isLoading && filtered.length > 0 && (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)] text-left text-[var(--color-text-muted)]">
                  <th className="px-4 py-3 font-medium">Назва</th>
                  <th className="px-4 py-3 font-medium hidden sm:table-cell">Категорія</th>
                  <th className="px-4 py-3 font-medium hidden md:table-cell">Дата</th>
                  <th className="px-4 py-3 font-medium text-right">Дії</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((article) => (
                  <tr
                    key={article.id}
                    className="border-b border-[var(--color-border)]/50 hover:bg-[var(--color-surface-elevated)]/50"
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium">{pickLocalized(article.title, "uk")}</p>
                      <p className="text-xs text-[var(--color-text-dim)] font-mono">{article.slug}</p>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <Badge variant="secondary">{pickLocalized(article.category, "uk")}</Badge>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-[var(--color-text-muted)]">
                      {article.publishedAt}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <Link to={`/news/${article.slug}`} target="_blank" rel="noopener noreferrer">
                          <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Переглянути">
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => openEdit(article)}
                          aria-label="Редагувати"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-[var(--color-accent-red)]"
                          onClick={() => handleDelete(article)}
                          aria-label="Видалити"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}

const inputClass =
  "w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-dim)] focus:border-[var(--color-primary)] focus:outline-none"

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-[var(--color-text-muted)]">{label}</label>
      {children}
    </div>
  )
}
