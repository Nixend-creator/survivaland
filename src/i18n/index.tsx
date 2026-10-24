import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import type { Language } from "@/types"
import uk from "./uk.json"
import ru from "./ru.json"
import en from "./en.json"

const translations = { uk, ru, en } as const


interface I18nContextValue {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextValue | null>(null)

function getNested(obj: Record<string, unknown>, path: string): string {
  const parts = path.split(".")
  let current: unknown = obj
  for (const part of parts) {
    if (current && typeof current === "object" && part in (current as object)) {
      current = (current as Record<string, unknown>)[part]
    } else {
      return path
    }
  }
  return typeof current === "string" ? current : path
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("sl-lang") as Language | null
      if (stored && ["uk", "ru", "en"].includes(stored)) return stored
    }
    return "uk"
  })

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("sl-lang", lang)
    document.documentElement.lang = lang
  }, [])

  const t = useCallback(
    (key: string) => getNested(translations[language] as unknown as Record<string, unknown>, key),
    [language]
  )

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error("useI18n must be used within I18nProvider")
  return ctx
}
