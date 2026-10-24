/**
 * Shop — demo memory OR Supabase table `shop_products`.
 */

import { config } from "@/config"
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase"
import { DEMO_SHOP } from "@/data/demo"
import type { ShopProduct } from "@/types"
import { parseLocalized, locList, type LocalizedString, type LocalizedStringList } from "@/lib/localized"

let memoryStore: ShopProduct[] = DEMO_SHOP.map((p) => ({
  ...p,
  name: { ...p.name },
  description: { ...p.description },
  benefits: {
    uk: [...p.benefits.uk],
    ru: [...p.benefits.ru],
    en: [...p.benefits.en],
  },
}))

function useDemo() {
  return config.demoMode || !isSupabaseConfigured()
}

export type ShopInput = {
  name: LocalizedString
  description: LocalizedString
  benefits: LocalizedStringList
  price: number
  currency: string
  category: ShopProduct["category"]
}

function mapRow(row: Record<string, unknown>): ShopProduct {
  let benefitsRaw = row.benefits
  let benefits
  if (benefitsRaw && typeof benefitsRaw === "object" && !Array.isArray(benefitsRaw) && ("uk" in (benefitsRaw as object))) {
    benefits = benefitsRaw as import("@/lib/localized").LocalizedStringList
  } else {
    let list: string[] = []
    if (Array.isArray(benefitsRaw)) list = benefitsRaw.map(String)
    else if (typeof benefitsRaw === "string") {
      try { list = JSON.parse(benefitsRaw) } catch { list = [] }
    }
    benefits = locList(list)
  }
  return {
    id: String(row.id),
    name: parseLocalized(row.name),
    description: parseLocalized(row.description),
    benefits,
    price: Number(row.price),
    currency: String(row.currency ?? "UAH"),
    category: row.category as ShopProduct["category"],
    isDemo: false,
  }
}

export async function listProducts(): Promise<ShopProduct[]> {
  if (useDemo()) {
    await delay(200)
    return [...memoryStore]
  }
  const supabase = getSupabase()!
  const { data, error } = await supabase
    .from("shop_products")
    .select("*")
    .eq("active", true)
    .order("name")
  if (error) throw new Error(error.message)
  return (data ?? []).map(mapRow)
}

/** Admin list includes inactive products when staff policies allow */
export async function listAllProducts(): Promise<ShopProduct[]> {
  if (useDemo()) {
    await delay(200)
    return [...memoryStore]
  }
  const supabase = getSupabase()!
  const { data, error } = await supabase.from("shop_products").select("*").order("name")
  if (error) throw new Error(error.message)
  return (data ?? []).map(mapRow)
}

export async function createProduct(input: ShopInput): Promise<ShopProduct> {
  if (useDemo()) {
    await delay(300)
    if (!(input.name.uk || input.name.en).trim()) throw new Error("Назва обов'язкова")
    if (input.price < 0) throw new Error("Ціна не може бути від'ємною")
    const product: ShopProduct = {
      id: `s-${Date.now()}`,
      name: input.name,
      description: input.description,
      benefits: input.benefits,
      price: input.price,
      currency: input.currency.trim() || "UAH",
      category: input.category,
      isDemo: true,
    }
    memoryStore = [product, ...memoryStore]
    return product
  }
  const supabase = getSupabase()!
  const { data, error } = await supabase
    .from("shop_products")
    .insert({
      name: input.name,
      description: input.description,
      benefits: input.benefits,
      price: input.price,
      currency: input.currency.trim() || "UAH",
      category: input.category,
      active: true,
    })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return mapRow(data)
}

export async function updateProduct(id: string, input: Partial<ShopInput>): Promise<ShopProduct> {
  if (useDemo()) {
    await delay(300)
    const idx = memoryStore.findIndex((p) => p.id === id)
    if (idx === -1) throw new Error("Товар не знайдено")
    const current = memoryStore[idx]
    if (input.price !== undefined && input.price < 0) throw new Error("Ціна не може бути від'ємною")
    const updated: ShopProduct = {
      ...current,
      name: input.name ?? current.name,
      description: input.description ?? current.description,
      benefits: input.benefits ?? current.benefits,
      price: input.price ?? current.price,
      currency: input.currency?.trim() ?? current.currency,
      category: input.category ?? current.category,
    }
    memoryStore = memoryStore.map((p) => (p.id === id ? updated : p))
    return updated
  }
  const supabase = getSupabase()!
  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (input.name !== undefined) patch.name = input.name
  if (input.description !== undefined) patch.description = input.description
  if (input.benefits !== undefined) {
    patch.benefits = input.benefits
  }
  if (input.price !== undefined) patch.price = input.price
  if (input.currency !== undefined) patch.currency = input.currency.trim()
  if (input.category !== undefined) patch.category = input.category
  const { data, error } = await supabase
    .from("shop_products")
    .update(patch)
    .eq("id", id)
    .select()
    .single()
  if (error) throw new Error(error.message)
  return mapRow(data)
}

export async function deleteProduct(id: string): Promise<void> {
  if (useDemo()) {
    await delay(200)
    const before = memoryStore.length
    memoryStore = memoryStore.filter((p) => p.id !== id)
    if (memoryStore.length === before) throw new Error("Товар не знайдено")
    return
  }
  // Soft-delete: mark inactive (safer for orders FK)
  const supabase = getSupabase()!
  const { error } = await supabase
    .from("shop_products")
    .update({ active: false, updated_at: new Date().toISOString() })
    .eq("id", id)
  if (error) throw new Error(error.message)
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}
