/**
 * Typed HTTP client for external APIs (Minecraft bridge, etc.).
 * Supabase uses its own client — do not put secrets here.
 */

import { config } from "@/config"

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public body?: string
  ) {
    super(message)
    this.name = "ApiError"
  }
}

export type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
  body?: unknown
  headers?: Record<string, string>
  timeoutMs?: number
  signal?: AbortSignal
}

const DEFAULT_TIMEOUT = 12_000

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const base = config.minecraftApiUrl.replace(/\/$/, "")
  if (!base) {
    throw new ApiError("VITE_MINECRAFT_API_URL is not configured", 0)
  }

  const url = path.startsWith("http") ? path : `${base}${path.startsWith("/") ? "" : "/"}${path}`
  const controller = new AbortController()
  const timeout = setTimeout(
    () => controller.abort(),
    options.timeoutMs ?? DEFAULT_TIMEOUT
  )

  const parentSignal = options.signal
  if (parentSignal) {
    if (parentSignal.aborted) controller.abort()
    else parentSignal.addEventListener("abort", () => controller.abort(), { once: true })
  }

  try {
    const res = await fetch(url, {
      method: options.method ?? "GET",
      headers: {
        Accept: "application/json",
        ...(options.body !== undefined ? { "Content-Type": "application/json" } : {}),
        ...options.headers,
      },
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
      signal: controller.signal,
    })

    if (!res.ok) {
      const text = await res.text().catch(() => "")
      throw new ApiError(
        text || `Request failed with status ${res.status}`,
        res.status,
        text
      )
    }

    if (res.status === 204) return undefined as T
    const contentType = res.headers.get("content-type") ?? ""
    if (contentType.includes("application/json")) {
      return (await res.json()) as T
    }
    return (await res.text()) as T
  } catch (err) {
    if (err instanceof ApiError) throw err
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new ApiError("Request timeout", 408)
    }
    throw new ApiError(err instanceof Error ? err.message : "Network error", 0)
  } finally {
    clearTimeout(timeout)
  }
}

/** Minecraft API helpers — paths match future bridge */
export const minecraftApi = {
  serverStatus: () => apiRequest<import("@/types").ServerStatus>("/api/server/status"),
  players: () => apiRequest<import("@/types").Player[]>("/api/players"),
  player: (username: string) =>
    apiRequest<import("@/types").Player>(`/api/player/${encodeURIComponent(username)}`),
  rankings: (type: string) =>
    apiRequest<import("@/types").RankingEntry[]>(
      `/api/rankings?type=${encodeURIComponent(type)}`
    ),
}
