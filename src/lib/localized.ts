import type { Language } from "@/types"

/** Multilingual text block (uk / ru / en) */
export type LocalizedString = {
  uk: string
  ru: string
  en: string
}

export type LocalizedStringList = {
  uk: string[]
  ru: string[]
  en: string[]
}

/** Build LocalizedString from plain text (all langs same until translated) */
export function loc(uk: string, ru?: string, en?: string): LocalizedString {
  return { uk, ru: ru ?? uk, en: en ?? uk }
}

export function locList(uk: string[], ru?: string[], en?: string[]): LocalizedStringList {
  return { uk, ru: ru ?? uk, en: en ?? uk }
}

/** Resolve string for UI language; accepts plain string for backward compatibility */
export function pickLocalized(
  value: string | LocalizedString | undefined | null,
  lang: Language
): string {
  if (value == null) return ""
  if (typeof value === "string") return value
  return value[lang] || value.uk || value.en || value.ru || ""
}

export function pickLocalizedList(
  value: string[] | LocalizedStringList | undefined | null,
  lang: Language
): string[] {
  if (value == null) return []
  if (Array.isArray(value)) return value
  return value[lang] || value.uk || value.en || value.ru || []
}

/** Parse DB/JSON field that may be string or localized object */
export function parseLocalized(raw: unknown, fallback = ""): LocalizedString {
  if (raw == null) return loc(fallback)
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw)
      if (parsed && typeof parsed === "object" && ("uk" in parsed || "en" in parsed)) {
        return {
          uk: String(parsed.uk ?? fallback),
          ru: String(parsed.ru ?? parsed.uk ?? fallback),
          en: String(parsed.en ?? parsed.uk ?? fallback),
        }
      }
    } catch {
      return loc(raw)
    }
    return loc(raw)
  }
  if (typeof raw === "object") {
    const o = raw as Record<string, unknown>
    return {
      uk: String(o.uk ?? o.en ?? fallback),
      ru: String(o.ru ?? o.uk ?? fallback),
      en: String(o.en ?? o.uk ?? fallback),
    }
  }
  return loc(fallback)
}
