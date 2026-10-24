/**
 * Rankings — demo | Supabase players+stats | Minecraft API
 */

import { config } from "@/config"
import { getDemoRankings } from "@/data/demo"
import { listPlayers } from "@/services/players"
import { isSupabaseConfigured } from "@/lib/supabase"
import type { RankingEntry, RankingType, Player } from "@/types"

function useDemo() {
  return config.demoMode || (!isSupabaseConfigured() && !config.minecraftApiUrl)
}

function valueFor(type: RankingType, p: Player): number {
  switch (type) {
    case "wealth":
      return p.balance
    case "playtime":
      return p.playtimeMinutes
    case "kills":
      return p.kills
    case "deaths":
      return p.deaths
    case "achievements":
      return p.achievements
    case "players":
    default:
      return p.playtimeMinutes
  }
}

function toRankings(players: Player[], type: RankingType): RankingEntry[] {
  const sorted = [...players].sort((a, b) => valueFor(type, b) - valueFor(type, a))
  return sorted.map((player, i) => ({
    rank: i + 1,
    player,
    value: valueFor(type, player),
    change: 0,
    isDemo: player.isDemo,
  }))
}

export async function getRankings(type: RankingType): Promise<RankingEntry[]> {
  if (useDemo()) {
    await new Promise((r) => setTimeout(r, 300))
    return getDemoRankings(type)
  }

  if (isSupabaseConfigured()) {
    const players = await listPlayers()
    return toRankings(players, type)
  }

  const res = await fetch(`${config.minecraftApiUrl}/api/rankings?type=${type}`)
  if (!res.ok) throw new Error(`Failed to fetch rankings: ${res.status}`)
  return res.json()
}
