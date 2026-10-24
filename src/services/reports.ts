/**
 * Reports — demo memory OR Supabase table `reports`.
 */

import { config } from "@/config"
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase"
import type { Report, ReportStatus } from "@/types"

const SEED: Report[] = [
  {
    id: "r1",
    reporterUsername: "QuietBuilder",
    targetUsername: "PvPMaster",
    reason: "Підозра на використання читів у PvP-зоні",
    status: "open",
    createdAt: "2026-10-20T14:30:00Z",
    updatedAt: "2026-10-20T14:30:00Z",
    isDemo: true,
  },
  {
    id: "r2",
    reporterUsername: "EcoTrader",
    targetUsername: "BuilderPro",
    reason: "Можливий гриф біля захищеної території",
    status: "reviewing",
    createdAt: "2026-10-18T09:15:00Z",
    updatedAt: "2026-10-19T11:00:00Z",
    isDemo: true,
  },
  {
    id: "r3",
    reporterUsername: "SurvivalKing",
    targetUsername: "DemoPlayer",
    reason: "Спам у глобальному чаті",
    status: "resolved",
    createdAt: "2026-10-15T18:00:00Z",
    updatedAt: "2026-10-16T10:20:00Z",
    isDemo: true,
  },
]

let memoryStore: Report[] = SEED.map((r) => ({ ...r }))

function useDemo() {
  return config.demoMode || !isSupabaseConfigured()
}

export type ReportInput = {
  reporterUsername: string
  targetUsername: string
  reason: string
}

function mapRow(row: Record<string, unknown>): Report {
  return {
    id: String(row.id),
    reporterUsername: String(row.reporter_username),
    targetUsername: String(row.target_username),
    reason: String(row.reason),
    status: row.status as ReportStatus,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
    isDemo: false,
  }
}

export async function listReports(): Promise<Report[]> {
  if (useDemo()) {
    await delay(200)
    return [...memoryStore].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }
  const supabase = getSupabase()!
  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .order("created_at", { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []).map(mapRow)
}

export async function createReport(input: ReportInput): Promise<Report> {
  if (useDemo()) {
    await delay(300)
    if (!input.targetUsername.trim() || !input.reason.trim()) {
      throw new Error("Ціль і причина обов'язкові")
    }
    const now = new Date().toISOString()
    const report: Report = {
      id: `r-${Date.now()}`,
      reporterUsername: input.reporterUsername.trim() || "Anonymous",
      targetUsername: input.targetUsername.trim(),
      reason: input.reason.trim(),
      status: "open",
      createdAt: now,
      updatedAt: now,
      isDemo: true,
    }
    memoryStore = [report, ...memoryStore]
    return report
  }
  const supabase = getSupabase()!
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const { data, error } = await supabase
    .from("reports")
    .insert({
      reporter_id: user?.id ?? null,
      reporter_username: input.reporterUsername.trim() || "Anonymous",
      target_username: input.targetUsername.trim(),
      reason: input.reason.trim(),
      status: "open",
    })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return mapRow(data)
}

export async function updateReportStatus(
  id: string,
  status: ReportStatus
): Promise<Report> {
  if (useDemo()) {
    await delay(250)
    const idx = memoryStore.findIndex((r) => r.id === id)
    if (idx === -1) throw new Error("Скаргу не знайдено")
    const updated: Report = {
      ...memoryStore[idx],
      status,
      updatedAt: new Date().toISOString(),
    }
    memoryStore = memoryStore.map((r) => (r.id === id ? updated : r))
    return updated
  }
  const supabase = getSupabase()!
  const { data, error } = await supabase
    .from("reports")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()
  if (error) throw new Error(error.message)
  return mapRow(data)
}

export async function deleteReport(id: string): Promise<void> {
  if (useDemo()) {
    await delay(200)
    const before = memoryStore.length
    memoryStore = memoryStore.filter((r) => r.id !== id)
    if (memoryStore.length === before) throw new Error("Скаргу не знайдено")
    return
  }
  const supabase = getSupabase()!
  const { error } = await supabase.from("reports").delete().eq("id", id)
  if (error) throw new Error(error.message)
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}
