import { APP_VERSION } from "@/config/version"
export const config = {
  version: APP_VERSION,
  appName: "SurvivaLand",
  slogan: "Survival • Building • Community",
  serverIp: "survivaland.pp.ua",
  versionRange: "1.17.1–1.21.11",
  currentVersion: "1.21.11",
  discordInvite: import.meta.env.VITE_DISCORD_INVITE_URL || "",
  demoMode: import.meta.env.VITE_DEMO_MODE !== "false", // default true until explicitly false
  minecraftApiUrl: import.meta.env.VITE_MINECRAFT_API_URL || "",
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || "",
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || "",
  /** Enable when provider is turned on in Supabase Auth */
  oauthDiscord: import.meta.env.VITE_OAUTH_DISCORD === "true",
  oauthGoogle: import.meta.env.VITE_OAUTH_GOOGLE === "true",
} as const

export type Config = typeof config
