import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import { config } from "@/config"
import { getSiteSettings } from "@/services/siteSettings"

type SeoProps = {
  title?: string
  description?: string
  noIndex?: boolean
}

const ROUTE_SEO: Record<string, { title: string; description?: string }> = {
  "/server": { title: "Server — SurvivaLand" },
  "/rankings": { title: "Rankings — SurvivaLand" },
  "/wiki": { title: "Wiki — SurvivaLand" },
  "/rules": { title: "Rules — SurvivaLand" },
  "/news": { title: "News — SurvivaLand" },
  "/shop": { title: "Shop — SurvivaLand" },
  "/economy": { title: "Economy — SurvivaLand" },
  "/login": { title: "Sign in — SurvivaLand" },
  "/register": { title: "Register — SurvivaLand" },
  "/profile": { title: "Profile — SurvivaLand" },
  "/report": { title: "Report — SurvivaLand" },
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

/** Updates document title + meta description/og per route. */
export function Seo({ title, description, noIndex }: SeoProps = {}) {
  const { pathname } = useLocation()
  const { data: site } = useQuery({ queryKey: ["site-settings"], queryFn: getSiteSettings })

  useEffect(() => {
    const routeKey =
      Object.keys(ROUTE_SEO).find((k) => pathname === k || pathname.startsWith(k + "/")) || ""
    const route = routeKey ? ROUTE_SEO[routeKey] : undefined

    const brand = site?.siteName || config.appName
    const pageTitle =
      title ||
      route?.title ||
      (pathname === "/"
        ? site?.siteTitle || `${brand} — Minecraft Server`
        : `${brand}`)
    const pageDesc =
      description ||
      route?.description ||
      site?.siteDescription ||
      "Minecraft survival server"

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

    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
    if (!link) {
      link = document.createElement("link")
      link.rel = "canonical"
      document.head.appendChild(link)
    }
    // Prefer configured public domain for canonical when available
    const host = site?.siteDomain?.trim()
    const origin = host ? `https://${host.replace(/^https?:\/\//, "")}` : window.location.origin
    link.href = `${origin}${pathname === "/" ? "/" : pathname}`
  }, [pathname, title, description, noIndex, site])

  return null
}
