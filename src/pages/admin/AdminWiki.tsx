import { useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Link } from "react-router-dom"
import { Plus, Pencil, Trash2, ExternalLink, X } from "lucide-react"
import { toast } from "sonner"
import { listWiki, createWiki, updateWiki, deleteWiki, type WikiInput } from "@/services/wiki"
import type { WikiArticle } from "@/types"
import { loc, pickLocalized } from "@/lib/localized"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const CATEGORIES = [
  { id: "getting-started", label: "Початок гри" },
  { id: "server-basics", label: "Основи сервера" },
  { id: "economy", label: "Економіка" },
  { id: "protection", label: "Захист" },
  { id: "pvp", label: "PvP" },
  { id: "quests", label: "Квести" },
  { id: "jobs", label: "Роботи" },
  { id: "ranks", label: "Ранги" },
  { id: "commands", label: "Команди" },
  { id: "faq", label: "FAQ" },
]

const emptyForm: WikiInput = {
  title: loc(""),
  description: loc(""),
  content: loc(""),
  category: "getting-started",
  related: [],
  slug: "",
}

export function AdminWiki() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState("")
  const [editing, setEditing] = useState<WikiArticle | null>(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState<WikiInput>(emptyForm)
  const [relatedText, setRelatedText] = useState("")
  const [saving, setSaving] = useState(false)

  const { data: articles = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["admin-wiki"],
    queryFn: listWiki,
  })

  const filtered = articles.filter(
    (a) =>
      pickLocalized(a.title, "uk").toLowerCase().includes(search.toLowerCase()) ||
      a.category.toLowerCase().includes(search.toLowerCase()) ||
      a.slug.toLowerCase().includes(search.toLowerCase())
  )

  const categoryLabel = (id: string) => CATEGORIES.find((c) => c.id === id)?.label ?? id

  const openCreate = () => {
    setEditing(null)
    setForm({ ...emptyForm })
    setRelatedText("")
    setCreating(true)
  }

  const openEdit = (article: WikiArticle) => {
    setCreating(false)
    setEditing(article)
    setForm({
      title: { ...article.title },
      description: { ...article.description },
      content: { ...article.content },
      category: article.category,
      related: [...article.related],
      slug: article.slug,
    })
    setRelatedText(article.related.join(", "))
  }

  const closeForm = () => {
    setCreating(false)
    setEditing(null)
    setForm(emptyForm)
    setRelatedText("")
  }

  const handleSave = async () => {
    if (!(form.title.uk || form.title.en).trim() || !(form.content.uk || form.content.en).trim()) {
      toast.error("Заголовок і контент обов'язкові")
      return
    }
    setSaving(true)
    try {
      const payload: WikiInput = {
        ...form,
        related: relatedText
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      }
      if (editing) {
        await updateWiki(editing.id, payload)
        toast.success("Статтю оновлено")
      } else {
        await createWiki(payload)
        toast.success("Статтю створено")
      }
      await queryClient.invalidateQueries({ queryKey: ["admin-wiki"] })
      closeForm()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Помилка збереження")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (article: WikiArticle) => {
    if (!confirm(`Видалити «${pickLocalized(article.title, "uk")}»?`)) return
    try {
      await deleteWiki(article.id)
      toast.success("Статтю видалено")
      await queryClient.invalidateQueries({ queryKey: ["admin-wiki"] })
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
          <h1 className="text-2xl font-bold">Wiki</h1>
          <p className="text-sm text-[var(--color-text-muted)]">
            CRUD статей · demo-режим (пам'ять до reload)
          </p>
        </div>
        <Button onClick={openCreate} className="gap-1.5 shrink-0">
          <Plus className="h-4 w-4" />
          Додати статтю
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
              <Field label="Заголовок *">
                <input
                  value={form.title.uk}
                  onChange={(e) => setForm((f) => ({ ...f, title: { ...f.title, uk: e.target.value, ru: e.target.value, en: e.target.value } }))}
                  className={inputClass}
                  placeholder="UA (копіюється в RU/EN — редагуйте в JSON пізніше)"
                />
              </Field>
              <Field label="Категорія">
                <select
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  className={inputClass}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Slug (URL)">
                <input
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  className={inputClass}
                  placeholder="автоматично з заголовка"
                />
              </Field>
              <Field label="Схожі (slug через кому)">
                <input
                  value={relatedText}
                  onChange={(e) => setRelatedText(e.target.value)}
                  className={inputClass}
                  placeholder="server-basics, commands"
                />
              </Field>
            </div>
            <Field label="Короткий опис">
              <textarea
                value={form.description.uk}
                onChange={(e) => setForm((f) => ({ ...f, description: { ...f.description, uk: e.target.value, ru: e.target.value, en: e.target.value } }))}
                className={cn(inputClass, "min-h-[60px] resize-y")}
                rows={2}
              />
            </Field>
            <Field label="Контент *">
              <textarea
                value={form.content.uk}
                onChange={(e) => setForm((f) => ({ ...f, content: { ...f.content, uk: e.target.value, ru: e.target.value, en: e.target.value } }))}
                className={cn(inputClass, "min-h-[160px] resize-y font-mono text-xs")}
                rows={10}
              />
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
            <p className="text-[var(--color-text-muted)]">Не вдалося завантажити Wiki</p>
            <Button variant="secondary" size="sm" onClick={() => refetch()}>
              Спробувати знову
            </Button>
          </CardContent>
        </Card>
      )}

      {!isLoading && !isError && filtered.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-[var(--color-text-muted)]">
            {search ? "Нічого не знайдено" : "Статей ще немає"}
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
                      <Badge variant="secondary">{categoryLabel(article.category)}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <Link to={`/wiki/${article.slug}`} target="_blank" rel="noopener noreferrer">
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
