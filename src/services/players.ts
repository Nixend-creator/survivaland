/**
 * Players — demo data OR Supabase `players` + `player_statistics`
 * OR future Minecraft API.
 */

import { config } from "@/config"
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase"
import { DEMO_PLAYERS } from "@/data/demo"
import type { Player } from "@/types"

function useDemo() {
  return config.demoMode || (!isSupabaseConfigured() && !config.minecraftApiUrl)
}

function mapJoined(
  p: Record<string, unknown>,
  s?: Record<string, unknown> | null
): Player {
  return {
    id: String(p.id),
    username: String(p.username),
    uuid: p.uuid ? String(p.uuid) : undefined,
    rank: String(p.rank ?? "Гравець"),
    firstJoined: String(p.first_joined ?? "").slice(0, 10),
    lastSeen: String(p.last_seen ?? "").slice(0, 10),
    playtimeMinutes: Number(s?.playtime_minutes ?? 0),
    balance: Number(s?.balance ?? 0),
    kills: Number(s?.kills ?? 0),
    deaths: Number(s?.deaths ?? 0),
    achievements: Number(s?.achievements_count ?? 0),
    isDemo: false,
  }
}

export async function listPlayers(): Promise<Player[]> {
  if (useDemo()) {
    await delay(200)
    return DEMO_PLAYERS.map((p) => ({ ...p }))
  }

  if (isSupabaseConfigured()) {
    const supabase = getSupabase()!
    const { data: players, error } = await supabase.from("players").select("*")
    if (error) throw new Error(error.message)
    const { data: stats, error: sErr } = await supabase.from("player_statistics").select("*")
    if (sErr) throw new Error(sErr.message)
    const byPlayer = new Map((stats ?? []).map((s) => [s.player_id, s]))
    return (players ?? []).map((p) => mapJoined(p, byPlayer.get(p.id)))
  }

  const res = await fetch(`${config.minecraftApiUrl}/api/players`)
  if (!res.ok) throw new Error(`Players API: ${res.status}`)
  return res.json()
}

export async function getPlayerByUsername(username: string): Promise<Player | null> {
  if (useDemo()) {
    await delay(150)
    return (
      DEMO_PLAYERS.find((p) => p.username.toLowerCase() === username.toLowerCase()) ?? null
    )
  }

  if (isSupabaseConfigured()) {
    const supabase = getSupabase()!
    const { data: p, error } = await supabase
      .from("players")
      .select("*")
      .ilike("username", username)
      .maybeSingle()
    if (error) throw new Error(error.message)
    if (!p) return null
    const { data: s } = await supabase
      .from("player_statistics")
      .select("*")
      .eq("player_id", p.id)
      .maybeSingle()
    return mapJoined(p, s)
  }

  const res = await fetch(
    `${config.minecraftApiUrl}/api/player/${encodeURIComponent(username)}`
  )
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`Player API: ${res.status}`)
  return res.json()
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}
