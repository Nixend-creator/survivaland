/**
 * News — demo memory OR Supabase. Titles/body are LocalizedString (uk/ru/en).
 */

import { config } from "@/config"
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase"
import { DEMO_NEWS } from "@/data/demo"
import { parseLocalized, loc, type LocalizedString } from "@/lib/localized"
import type { NewsArticle } from "@/types"

let memoryStore: NewsArticle[] = DEMO_NEWS.map((n) => ({
  ...n,
  title: { ...n.title },
  excerpt: { ...n.excerpt },
  content: { ...n.content },
  category: { ...n.category },
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
      .slice(0, 80) || `news-${Date.now()}`
  )
}

export type NewsInput = {
  title: LocalizedString
  excerpt: LocalizedString
  content: LocalizedString
  category: LocalizedString
  author: string
  publishedAt?: string
  slug?: string
}

function mapRow(row: Record<string, unknown>): NewsArticle {
  return {
    id: String(row.id),
    slug: String(row.slug),
    title: parseLocalized(row.title),
    excerpt: parseLocalized(row.excerpt),
    content: parseLocalized(row.content),
    category: parseLocalized(row.category, "News"),
    author: String(row.author ?? "Admin"),
    publishedAt: String(row.published_at ?? "").slice(0, 10),
    image: row.image_url ? String(row.image_url) : undefined,
    isDemo: false,
  }
}

export async function listNews(): Promise<NewsArticle[]> {
  if (useDemo()) {
    await delay(200)
    return [...memoryStore].sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
  }
  const supabase = getSupabase()!
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .order("published_at", { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []).map(mapRow)
}

export async function getNewsBySlug(slug: string): Promise<NewsArticle | null> {
  if (useDemo()) {
    await delay(150)
    return memoryStore.find((n) => n.slug === slug) ?? null
  }
  const supabase = getSupabase()!
  const { data, error } = await supabase.from("news").select("*").eq("slug", slug).maybeSingle()
  if (error) throw new Error(error.message)
  return data ? mapRow(data) : null
}

export async function createNews(input: NewsInput): Promise<NewsArticle> {
  const slug = input.slug?.trim() || slugify(input.title.uk || input.title.en)
  if (useDemo()) {
    await delay(300)
    if (memoryStore.some((n) => n.slug === slug)) throw new Error("Стаття з таким slug вже існує")
    const article: NewsArticle = {
      id: `n-${Date.now()}`,
      slug,
      title: input.title,
      excerpt: input.excerpt,
      content: input.content,
      category: input.category,
      author: input.author.trim() || "Admin",
      publishedAt: input.publishedAt || new Date().toISOString().slice(0, 10),
      isDemo: true,
    }
    memoryStore = [article, ...memoryStore]
    return article
  }
  const supabase = getSupabase()!
  const { data, error } = await supabase
    .from("news")
    .insert({
      slug,
      title: input.title,
      excerpt: input.excerpt,
      content: input.content,
      category: input.category,
      author: input.author.trim() || "Admin",
      published_at: input.publishedAt || new Date().toISOString(),
    })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return mapRow(data)
}

export async function updateNews(id: string, input: Partial<NewsInput>): Promise<NewsArticle> {
  if (useDemo()) {
    await delay(300)
    const current = memoryStore.find((n) => n.id === id)
    if (!current) throw new Error("Статтю не знайдено")
    const nextSlug = input.slug?.trim() || current.slug
    if (nextSlug !== current.slug && memoryStore.some((n) => n.slug === nextSlug)) {
      throw new Error("Стаття з таким slug вже існує")
    }
    const updated: NewsArticle = {
      ...current,
      title: input.title ?? current.title,
      excerpt: input.excerpt ?? current.excerpt,
      content: input.content ?? current.content,
      category: input.category ?? current.category,
      author: input.author?.trim() ?? current.author,
      publishedAt: input.publishedAt ?? current.publishedAt,
      slug: nextSlug,
    }
    memoryStore = memoryStore.map((n) => (n.id === id ? updated : n))
    return updated
  }
  const supabase = getSupabase()!
  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (input.title) patch.title = input.title
  if (input.excerpt) patch.excerpt = input.excerpt
  if (input.content) patch.content = input.content
  if (input.category) patch.category = input.category
  if (input.author !== undefined) patch.author = input.author.trim()
  if (input.publishedAt) patch.published_at = input.publishedAt
  if (input.slug) patch.slug = input.slug.trim()
  const { data, error } = await supabase.from("news").update(patch).eq("id", id).select().single()
  if (error) throw new Error(error.message)
  return mapRow(data)
}

export async function deleteNews(id: string): Promise<void> {
  if (useDemo()) {
    await delay(200)
    const before = memoryStore.length
    memoryStore = memoryStore.filter((n) => n.id !== id)
    if (memoryStore.length === before) throw new Error("Статтю не знайдено")
    return
  }
  const supabase = getSupabase()!
  const { error } = await supabase.from("news").delete().eq("id", id)
  if (error) throw new Error(error.message)
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

export { loc }
