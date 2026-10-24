/**
 * Wiki — demo memory OR Supabase table `wiki_articles`.
 */

import { config } from "@/config"
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase"
import { DEMO_WIKI } from "@/data/demo"
import type { WikiArticle } from "@/types"
import { parseLocalized, type LocalizedString } from "@/lib/localized"

let memoryStore: WikiArticle[] = DEMO_WIKI.map((a) => ({
  ...a,
  title: { ...a.title },
  description: { ...a.description },
  content: { ...a.content },
  related: [...a.related],
}))

function useDemo() {
  return config.demoMode || !isSupabaseConfigured()
}

function slugify(title: string): string {
  return (
    title
      .toLowerCase()
      .trim()
      .replace(/[^\w\u0400-\u04FF\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 80) || `wiki-${Date.now()}`
  )
}

export type WikiInput = {
  title: LocalizedString
  description: LocalizedString
  content: LocalizedString
  category: string
  related: string[]
  slug?: string
}

function mapRow(row: Record<string, unknown>): WikiArticle {
  const related = Array.isArray(row.related_slugs)
    ? (row.related_slugs as string[])
    : []
  return {
    id: String(row.id),
    slug: String(row.slug),
    title: parseLocalized(row.title),
    description: parseLocalized(row.description),
    content: parseLocalized(row.content),
    category: String(row.category ?? "getting-started"),
    related,
    isDemo: false,
  }
}

export async function listWiki(): Promise<WikiArticle[]> {
  if (useDemo()) {
    await delay(200)
    return [...memoryStore]
  }
  const supabase = getSupabase()!
  const { data, error } = await supabase.from("wiki_articles").select("*").order("title")
  if (error) throw new Error(error.message)
  return (data ?? []).map(mapRow)
}

export async function getWikiBySlug(slug: string): Promise<WikiArticle | null> {
  if (useDemo()) {
    await delay(150)
    return memoryStore.find((a) => a.slug === slug) ?? null
  }
  const supabase = getSupabase()!
  const { data, error } = await supabase
    .from("wiki_articles")
    .select("*")
    .eq("slug", slug)
    .maybeSingle()
  if (error) throw new Error(error.message)
  return data ? mapRow(data) : null
}

export async function createWiki(input: WikiInput): Promise<WikiArticle> {
  const slug = input.slug?.trim() || slugify(input.title.uk || input.title.en)
  if (useDemo()) {
    await delay(300)
    if (!(input.title.uk || input.title.en).trim() || !(input.content.uk || input.content.en).trim()) {
      throw new Error("Заголовок і контент обов'язкові")
    }
    if (memoryStore.some((a) => a.slug === slug)) throw new Error("Стаття з таким slug вже існує")
    const article: WikiArticle = {
      id: `w-${Date.now()}`,
      slug,
      title: input.title,
      description: input.description,
      content: input.content,
      category: input.category.trim() || "getting-started",
      related: input.related.map((r) => r.trim()).filter(Boolean),
      isDemo: true,
    }
    memoryStore = [article, ...memoryStore]
    return article
  }
  const supabase = getSupabase()!
  const { data, error } = await supabase
    .from("wiki_articles")
    .insert({
      slug,
      title: input.title,
      description: input.description,
      content: input.content,
      category: input.category.trim() || "getting-started",
      related_slugs: input.related.map((r) => r.trim()).filter(Boolean),
    })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return mapRow(data)
}

export async function updateWiki(id: string, input: Partial<WikiInput>): Promise<WikiArticle> {
  if (useDemo()) {
    await delay(300)
    const idx = memoryStore.findIndex((a) => a.id === id)
    if (idx === -1) throw new Error("Статтю не знайдено")
    const current = memoryStore[idx]
    const nextSlug = input.slug?.trim() || current.slug
    if (nextSlug !== current.slug && memoryStore.some((a) => a.slug === nextSlug)) {
      throw new Error("Стаття з таким slug вже існує")
    }
    const updated: WikiArticle = {
      ...current,
      title: input.title ?? current.title,
      description: input.description ?? current.description,
      content: input.content ?? current.content,
      category: input.category?.trim() ?? current.category,
      related: input.related
        ? input.related.map((r) => r.trim()).filter(Boolean)
        : current.related,
      slug: nextSlug,
    }
    memoryStore = memoryStore.map((a) => (a.id === id ? updated : a))
    return updated
  }
  const supabase = getSupabase()!
  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (input.title !== undefined) patch.title = input.title
  if (input.description !== undefined) patch.description = input.description
  if (input.content !== undefined) patch.content = input.content
  if (input.category !== undefined) patch.category = input.category.trim()
  if (input.related !== undefined) {
    patch.related_slugs = input.related.map((r) => r.trim()).filter(Boolean)
  }
  if (input.slug !== undefined) patch.slug = input.slug.trim()
  const { data, error } = await supabase
    .from("wiki_articles")
    .update(patch)
    .eq("id", id)
    .select()
    .single()
  if (error) throw new Error(error.message)
  return mapRow(data)
}

export async function deleteWiki(id: string): Promise<void> {
  if (useDemo()) {
    await delay(200)
    const before = memoryStore.length
    memoryStore = memoryStore.filter((a) => a.id !== id)
    if (memoryStore.length === before) throw new Error("Статтю не знайдено")
    return
  }
  const supabase = getSupabase()!
  const { error } = await supabase.from("wiki_articles").delete().eq("id", id)
  if (error) throw new Error(error.message)
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}
