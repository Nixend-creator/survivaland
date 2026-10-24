import { useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Plus, Pencil, Trash2, X } from "lucide-react"
import { toast } from "sonner"
import {
  listAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  type ShopInput,
} from "@/services/shop"
import type { ShopProduct } from "@/types"
import { loc, locList, pickLocalized } from "@/lib/localized"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const CATEGORIES: { value: ShopProduct["category"]; label: string }[] = [
  { value: "ranks", label: "Ранги" },
  { value: "kits", label: "Набори" },
  { value: "cosmetics", label: "Косметика" },
  { value: "special", label: "Спеціальне" },
  { value: "bundles", label: "Бандлі" },
]

const emptyForm: ShopInput = {
  name: loc(""),
  description: loc(""),
  benefits: locList([""]),
  price: 0,
  currency: "UAH",
  category: "ranks",
}

export function AdminShop() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState("")
  const [editing, setEditing] = useState<ShopProduct | null>(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState<ShopInput>(emptyForm)
  const [saving, setSaving] = useState(false)

  const { data: products = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["admin-shop"],
    queryFn: listAllProducts,
  })

  const filtered = products.filter(
    (p) =>
      pickLocalized(p.name, "uk").toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      pickLocalized(p.description, "uk").toLowerCase().includes(search.toLowerCase())
  )

  const openCreate = () => {
    setEditing(null)
    setForm({ ...emptyForm, benefits: locList([""]) })
    setCreating(true)
  }

  const openEdit = (product: ShopProduct) => {
    setCreating(false)
    setEditing(product)
    setForm({
      name: { ...product.name },
      description: { ...product.description },
      benefits: {
        uk: [...product.benefits.uk],
        ru: [...product.benefits.ru],
        en: [...product.benefits.en],
      },
      price: product.price,
      currency: product.currency,
      category: product.category,
    })
  }

  const closeForm = () => {
    setCreating(false)
    setEditing(null)
    setForm(emptyForm)
  }

  const setBenefit = (index: number, value: string) => {
    setForm((f) => {
      const uk = [...f.benefits.uk]
      uk[index] = value
      return { ...f, benefits: { uk, ru: uk, en: uk } }
    })
  }

  const addBenefit = () => {
    setForm((f) => {
      const uk = [...f.benefits.uk, ""]
      return { ...f, benefits: { uk, ru: uk, en: uk } }
    })
  }

  const removeBenefit = (index: number) => {
    setForm((f) => {
      const uk = f.benefits.uk.length > 1 ? f.benefits.uk.filter((_, i) => i !== index) : [""]
      return { ...f, benefits: { uk, ru: [...uk], en: [...uk] } }
    })
  }

  const handleSave = async () => {
    if (!(form.name.uk || form.name.en).trim()) {
      toast.error("Назва обов'язкова")
      return
    }
    setSaving(true)
    try {
      const payload = {
        ...form,
        benefits: {
          uk: form.benefits.uk.map((b) => b.trim()).filter(Boolean),
          ru: form.benefits.ru.map((b) => b.trim()).filter(Boolean),
          en: form.benefits.en.map((b) => b.trim()).filter(Boolean),
        },
      }
      if (editing) {
        await updateProduct(editing.id, payload)
        toast.success("Товар оновлено")
      } else {
        await createProduct(payload)
        toast.success("Товар створено")
      }
      await queryClient.invalidateQueries({ queryKey: ["admin-shop"] })
      closeForm()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Помилка збереження")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (product: ShopProduct) => {
    if (!confirm(`Видалити «${pickLocalized(product.name, "uk")}»?`)) return
    try {
      await deleteProduct(product.id)
      toast.success("Товар видалено")
      await queryClient.invalidateQueries({ queryKey: ["admin-shop"] })
      if (editing?.id === product.id) closeForm()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Помилка видалення")
    }
  }

  const showForm = creating || editing
  const categoryLabel = (c: string) => CATEGORIES.find((x) => x.value === c)?.label ?? c

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Магазин</h1>
          <p className="text-sm text-[var(--color-text-muted)]">
            CRUD товарів · demo-режим (пам'ять до reload)
          </p>
        </div>
        <Button onClick={openCreate} className="gap-1.5 shrink-0">
          <Plus className="h-4 w-4" />
          Додати товар
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6 border-[var(--color-primary)]/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base">
              {editing ? "Редагувати товар" : "Новий товар"}
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={closeForm} aria-label="Закрити">
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Назва *">
                <input
                  value={form.name.uk}
                  onChange={(e) => setForm((f) => ({ ...f, name: { uk: e.target.value, ru: e.target.value, en: e.target.value } }))}
                  className={inputClass}
                  placeholder="VIP"
                />
              </Field>
              <Field label="Категорія">
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      category: e.target.value as ShopProduct["category"],
                    }))
                  }
                  className={inputClass}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Ціна *">
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={form.price}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, price: Number(e.target.value) || 0 }))
                  }
                  className={inputClass}
                />
              </Field>
              <Field label="Валюта">
                <input
                  value={form.currency}
                  onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value }))}
                  className={inputClass}
                  placeholder="UAH"
                />
              </Field>
            </div>
            <Field label="Опис">
              <textarea
                value={form.description.uk}
                onChange={(e) => setForm((f) => ({ ...f, description: { uk: e.target.value, ru: e.target.value, en: e.target.value } }))}
                className={cn(inputClass, "min-h-[60px] resize-y")}
                rows={2}
              />
            </Field>
            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--color-text-muted)]">
                Переваги
              </label>
              <div className="space-y-2">
                {form.benefits.uk.map((b, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      value={b}
                      onChange={(e) => setBenefit(i, e.target.value)}
                      className={inputClass}
                      placeholder={`Перевага ${i + 1}`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="shrink-0"
                      onClick={() => removeBenefit(i)}
                      aria-label="Видалити перевагу"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={addBenefit}>
                  + Перевага
                </Button>
              </div>
            </div>
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
        placeholder="Пошук за назвою, категорією..."
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
            <p className="text-[var(--color-text-muted)]">Не вдалося завантажити товари</p>
            <Button variant="secondary" size="sm" onClick={() => refetch()}>
              Спробувати знову
            </Button>
          </CardContent>
        </Card>
      )}

      {!isLoading && !isError && filtered.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-[var(--color-text-muted)]">
            {search ? "Нічого не знайдено" : "Товарів ще немає"}
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
                  <th className="px-4 py-3 font-medium text-right">Ціна</th>
                  <th className="px-4 py-3 font-medium text-right">Дії</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-[var(--color-border)]/50 hover:bg-[var(--color-surface-elevated)]/50"
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium">{pickLocalized(product.name, "uk")}</p>
                      <p className="text-xs text-[var(--color-text-dim)] line-clamp-1">
                        {pickLocalized(product.description, "uk")}
                      </p>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <Badge variant="secondary">{categoryLabel(product.category)}</Badge>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums font-medium text-[var(--color-accent-gold)]">
                      {product.price} {product.currency}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => openEdit(product)}
                          aria-label="Редагувати"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-[var(--color-accent-red)]"
                          onClick={() => handleDelete(product)}
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
