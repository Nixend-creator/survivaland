/**
 * Supabase browser client.
 * Only initializes when VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY are set.
 * Never put service_role key in frontend.
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js"
import { config } from "@/config"

let client: SupabaseClient | null = null

export function isSupabaseConfigured(): boolean {
  return Boolean(config.supabaseUrl && config.supabaseAnonKey)
}

export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null
  if (!client) {
    client = createClient(config.supabaseUrl, config.supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  }
  return client
}
