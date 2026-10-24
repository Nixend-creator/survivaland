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

/**
 * Minecraft server status service.
 * Replace DEMO_STATUS with real API call when VITE_MINECRAFT_API_URL is configured.
 */
export async function getServerStatus(): Promise<ServerStatus> {
  if (config.demoMode || !config.minecraftApiUrl) {
    // Simulate network delay
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
  const timeout = setTimeout(() => controller.abort(), 8000)

  try {
    const res = await fetch(`${config.minecraftApiUrl}/api/server/status`, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    })
    if (!res.ok) throw new Error(`Status ${res.status}`)
    const data = await res.json()
    return {
      online: data.online ?? false,
      players: {
        online: data.players?.online ?? 0,
        max: data.players?.max ?? 0,
      },
      version: data.version ?? config.currentVersion,
      ip: data.ip ?? config.serverIp,
      latency: data.latency ?? null,
      lastUpdated: new Date(),
    }
  } catch (err) {
    console.error("[minecraftServer] Failed to fetch status:", err)
    throw err
  } finally {
    clearTimeout(timeout)
  }
}
