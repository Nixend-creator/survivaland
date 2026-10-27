/**
 * Minecraft server status.
 * Supports:
 * - Full URL to JSON (e.g. mcsrvstat.us / own API)
 * - Demo simulation when VITE_DEMO_MODE or no URL
 */

import { config } from "@/config"
import { getSiteSettings } from "@/services/siteSettings"
import type { ServerStatus } from "@/types"

const DEMO_STATUS: ServerStatus = {
  online: true,
  players: { online: 47, max: 100 },
  version: config.currentVersion,
  ip: config.serverIp,
  latency: 28,
  lastUpdated: new Date(),
}

/** Default public query for this project (override with VITE_MINECRAFT_API_URL) */
export const DEFAULT_MC_STATUS_URL =
  "https://api.mcsrvstat.us/3/142.132.134.223:25620"

export async function getServerStatus(): Promise<ServerStatus> {
  const apiUrl = (config.minecraftApiUrl || "").trim() || DEFAULT_MC_STATUS_URL

  if (config.demoMode && !config.minecraftApiUrl) {
    await new Promise((r) => setTimeout(r, 400 + Math.random() * 300))
    const settings = await getSiteSettings()
    return {
      ...DEMO_STATUS,
      ip: settings.serverIp,
      version: settings.currentVersion,
      lastUpdated: new Date(),
      latency: 20 + Math.floor(Math.random() * 25),
      players: {
        online: 40 + Math.floor(Math.random() * 20),
        max: 100,
      },
    }
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10000)

  try {
    // Use URL as-is (mcsrvstat is a full path; do not append /api/server/status)
    const res = await fetch(apiUrl, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    })
    if (!res.ok) throw new Error(`Status ${res.status}`)
    const data = (await res.json()) as Record<string, unknown>
    return mapStatusPayload(data)
  } catch (err) {
    console.error("[minecraftServer] Failed to fetch status:", err)
    throw err
  } finally {
    clearTimeout(timeout)
  }
}

function mapStatusPayload(data: Record<string, unknown>): ServerStatus {
  const settingsIp = config.serverIp
  const online = Boolean(data.online)

  // mcsrvstat: players: { online, max }, version: string | { name }
  const playersRaw = data.players as { online?: number; max?: number } | undefined
  let version = config.currentVersion
  if (typeof data.version === "string") version = data.version
  else if (data.version && typeof data.version === "object") {
    const v = data.version as { name?: string }
    if (v.name) version = v.name
  }
  // protocol.name sometimes more accurate on newer APIs
  if (data.protocol && typeof data.protocol === "object") {
    const p = data.protocol as { name?: string }
    if (p.name) version = p.name
  }

  const ip =
    typeof data.hostname === "string" && data.hostname
      ? data.hostname
      : typeof data.ip === "string"
        ? data.port
          ? `${data.ip}:${data.port}`
          : data.ip
        : settingsIp

  return {
    online,
    players: {
      online: Number(playersRaw?.online ?? 0),
      max: Number(playersRaw?.max ?? 0),
    },
    version,
    ip: String(ip),
    latency: typeof data.latency === "number" ? data.latency : null,
    lastUpdated: new Date(),
  }
}
