import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import { config } from "@/config"

type SeoProps = {
  title?: string
  description?: string
  noIndex?: boolean
}

const DEFAULT_DESCRIPTION =
  "SurvivaLand — Minecraft сервер із виживанням, PvP, економікою, будівництвом та активною спільнотою."

const ROUTE_SEO: Record<string, { title: string; description?: string }> = {
  "/": {
    title: "SurvivaLand — Minecraft сервер | Survival • PvP • Economy",
    description: DEFAULT_DESCRIPTION,
  },
  "/server": {
    title: "Про сервер — SurvivaLand",
    description: "Версії, IP, правила світу та особливості SurvivaLand.",
  },
  "/rankings": {
    title: "Рейтинги гравців — SurvivaLand",
    description: "Топ гравців за часом гри, багатством, PvP та досягненнями.",
  },
  "/wiki": {
    title: "Wiki — SurvivaLand",
    description: "Гайди, команди та довідка по серверу SurvivaLand.",
  },
  "/rules": {
    title: "Правила — SurvivaLand",
    description: "Правила поведінки та гри на сервері SurvivaLand.",
  },
  "/news": {
    title: "Новини — SurvivaLand",
    description: "Оновлення, івенти та анонси SurvivaLand.",
  },
  "/shop": {
    title: "Магазин — SurvivaLand",
    description: "Ранги, набори та підтримка сервера SurvivaLand.",
  },
  "/economy": {
    title: "Економіка — SurvivaLand",
    description: "Як працює валюта, торгівля та магазини на SurvivaLand.",
  },
  "/login": {
    title: "Вхід — SurvivaLand",
  },
  "/register": {
    title: "Реєстрація — SurvivaLand",
  },
  "/profile": {
    title: "Профіль — SurvivaLand",
  },
}

function setMeta(name: string, content: string, property = false) {
  const attr = property ? "property" : "name"
  let el = document.querySelector(`meta[${attr}="${name}"]`)
  if (!el) {
    el = document.createElement("meta")
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  el.setAttribute("content", content)
}

/**
 * Updates document title + meta description/og per route.
 * Place once inside the router.
 */
export function Seo({ title, description, noIndex }: SeoProps = {}) {
  const { pathname } = useLocation()

  useEffect(() => {
    const routeKey =
      Object.keys(ROUTE_SEO)
        .filter((k) => k !== "/")
        .find((k) => pathname === k || pathname.startsWith(k + "/")) ||
      (pathname === "/" ? "/" : "")

    const route = routeKey ? ROUTE_SEO[routeKey] : undefined
    const pageTitle = title || route?.title || `${config.appName} — Minecraft сервер`
    const pageDesc = description || route?.description || DEFAULT_DESCRIPTION
    const shouldNoIndex =
      noIndex ||
      pathname.startsWith("/admin") ||
      pathname.startsWith("/profile") ||
      pathname.startsWith("/login") ||
      pathname.startsWith("/register")

    document.title = pageTitle
    setMeta("description", pageDesc)
    setMeta("og:title", pageTitle, true)
    setMeta("og:description", pageDesc, true)
    setMeta("og:type", "website", true)
    setMeta("twitter:card", "summary_large_image")
    setMeta("twitter:title", pageTitle)
    setMeta("twitter:description", pageDesc)
    setMeta("robots", shouldNoIndex ? "noindex, nofollow" : "index, follow")

    // canonical
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
    if (!link) {
      link = document.createElement("link")
      link.rel = "canonical"
      document.head.appendChild(link)
    }
    const origin = window.location.origin
    link.href = `${origin}${pathname === "/" ? "/" : pathname}`
  }, [pathname, title, description, noIndex])

  return null
}
