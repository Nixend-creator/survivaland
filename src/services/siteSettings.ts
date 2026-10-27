/**
 * Site settings — demo: localStorage; prod: site_settings table.
 * Branding: domain, logo, titles — editable from Admin → Settings.
 */

import { config } from "@/config"
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase"

const STORAGE_KEY = "sl-site-settings"

export type SiteSettings = {
  /** Public site hostname, e.g. survivaland.pp.ua */
  siteDomain: string
  siteName: string
  siteTitle: string
  siteDescription: string
  /** Image URL or path for header logo */
  logoUrl: string
  serverIp: string
  versionRange: string
  currentVersion: string
  discordInvite: string
  slogan: string
  maintenanceMode: boolean
}

export const defaultSiteSettings: SiteSettings = {
  siteDomain: "survivaland.pp.ua",
  siteName: "SurvivaLand",
  siteTitle: "SurvivaLand — Minecraft Server",
  siteDescription:
    "Premium Minecraft survival server: building, economy, PvP and community.",
  logoUrl: "",
  serverIp: "142.132.134.223:25620",
  versionRange: config.versionRange,
  currentVersion: config.currentVersion,
  discordInvite: config.discordInvite,
  slogan: config.slogan,
  maintenanceMode: false,
}

const KEY_MAP: Record<keyof SiteSettings, string> = {
  siteDomain: "site_domain",
  siteName: "site_name",
  siteTitle: "site_title",
  siteDescription: "site_description",
  logoUrl: "logo_url",
  serverIp: "server_ip",
  versionRange: "version_range",
  currentVersion: "current_version",
  discordInvite: "discord_invite",
  slogan: "slogan",
  maintenanceMode: "maintenance_mode",
}

function useDemo() {
  return config.demoMode || !isSupabaseConfigured()
}

function loadFromStorage(): Partial<SiteSettings> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as Partial<SiteSettings>
  } catch {
    return {}
  }
}

function parseValue(key: keyof SiteSettings, raw: unknown): SiteSettings[typeof key] {
  if (key === "maintenanceMode") {
    return Boolean(raw === true || raw === "true") as SiteSettings["maintenanceMode"]
  }
  if (typeof raw === "string") return raw as SiteSettings[typeof key]
  return String(raw ?? "") as SiteSettings[typeof key]
}

export async function getSiteSettings(): Promise<SiteSettings> {
  if (useDemo()) {
    await delay(100)
    return { ...defaultSiteSettings, ...loadFromStorage() }
  }
  const supabase = getSupabase()!
  const { data, error } = await supabase.from("site_settings").select("key, value")
  if (error) throw new Error(error.message)
  const next = { ...defaultSiteSettings }
  for (const row of data ?? []) {
    const entry = Object.entries(KEY_MAP).find(([, dbKey]) => dbKey === row.key)
    if (!entry) continue
    const [field] = entry as [keyof SiteSettings, string]
    let val = row.value
    if (typeof val === "string") {
      try {
        val = JSON.parse(val)
      } catch {
        /* keep string */
      }
    }
    ;(next as Record<string, unknown>)[field] = parseValue(field, val)
  }
  return next
}

export async function updateSiteSettings(
  patch: Partial<SiteSettings>
): Promise<SiteSettings> {
  if (useDemo()) {
    await delay(200)
    const current = { ...defaultSiteSettings, ...loadFromStorage() }
    const next = { ...current, ...patch }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    return next
  }
  const supabase = getSupabase()!
  const rows = Object.entries(patch).map(([field, value]) => ({
    key: KEY_MAP[field as keyof SiteSettings],
    value: value as string | boolean,
    updated_at: new Date().toISOString(),
  }))
  for (const row of rows) {
    const { error } = await supabase.from("site_settings").upsert(row, { onConflict: "key" })
    if (error) throw new Error(error.message)
  }
  return getSiteSettings()
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}
