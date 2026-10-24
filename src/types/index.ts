import type { LocalizedString, LocalizedStringList } from "@/lib/localized"

export type Language = "uk" | "ru" | "en"

export type UserRole = "admin" | "moderator" | "editor" | "user"

export interface ServerStatus {
  online: boolean
  players: {
    online: number
    max: number
  }
  version: string
  ip: string
  latency: number | null
  lastUpdated: Date
}

export interface Player {
  id: string
  username: string
  uuid?: string
  rank: string
  firstJoined: string
  lastSeen: string
  playtimeMinutes: number
  balance: number
  kills: number
  deaths: number
  achievements: number
  isDemo?: boolean
}

export interface RankingEntry {
  rank: number
  player: Player
  value: number
  change: number
  isDemo?: boolean
}

export type RankingType = "players" | "wealth" | "playtime" | "kills" | "deaths" | "achievements"

export interface NewsArticle {
  id: string
  slug: string
  title: LocalizedString
  excerpt: LocalizedString
  content: LocalizedString
  category: LocalizedString
  author: string
  publishedAt: string
  image?: string
  isDemo?: boolean
}

export interface WikiArticle {
  id: string
  slug: string
  title: LocalizedString
  description: LocalizedString
  content: LocalizedString
  category: string
  related: string[]
  isDemo?: boolean
}

export interface ShopProduct {
  id: string
  name: LocalizedString
  description: LocalizedString
  benefits: LocalizedStringList
  price: number
  currency: string
  category: "ranks" | "cosmetics" | "kits" | "special" | "bundles"
  isDemo?: boolean
}

export interface UserProfile {
  id: string
  email: string
  username: string
  minecraftUsername?: string
  avatarUrl?: string
  language: Language
  role: UserRole
  notifications: boolean
  createdAt: string
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  rarity: "common" | "rare" | "epic" | "legendary"
}

export type ReportStatus = "open" | "reviewing" | "resolved" | "dismissed"

export interface Report {
  id: string
  reporterUsername: string
  targetUsername: string
  reason: string
  status: ReportStatus
  createdAt: string
  updatedAt: string
  isDemo?: boolean
}

export type { LocalizedString, LocalizedStringList }
