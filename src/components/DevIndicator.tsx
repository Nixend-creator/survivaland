import { config } from "@/config"
import { APP_VERSION_LABEL } from "@/config/version"

/** Visible only in Vite DEV — not in production builds */
export function DevIndicator() {
  if (!import.meta.env.DEV) return null
  return (
    <div
      className="pointer-events-none fixed bottom-3 left-3 z-[100] rounded-md border border-[var(--color-border)] bg-[var(--color-surface)]/90 px-2 py-1 font-mono text-[10px] text-[var(--color-text-dim)] shadow-lg backdrop-blur-sm"
      aria-hidden
    >
      DEV · {APP_VERSION_LABEL}{config.demoMode ? " · DEMO" : ""}
    </div>
  )
}
