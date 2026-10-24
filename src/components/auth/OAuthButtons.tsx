import { useState } from "react"
import { toast } from "sonner"
import { config } from "@/config"
import { signInWithOAuthProvider, type OAuthProvider } from "@/services/auth"
import { Button } from "@/components/ui/button"

/**
 * OAuth entry points. Buttons are always visible; actions explain if not configured.
 * Enable providers in Supabase + VITE_OAUTH_DISCORD / VITE_OAUTH_GOOGLE.
 */
export function OAuthButtons() {
  const [loading, setLoading] = useState<OAuthProvider | null>(null)

  const handle = async (provider: OAuthProvider) => {
    setLoading(provider)
    try {
      await signInWithOAuthProvider(provider)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "OAuth недоступний")
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="space-y-3">
      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[var(--color-border)]" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-[var(--color-surface)] px-2 text-[var(--color-text-dim)]">або</span>
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <Button
          type="button"
          variant="outline"
          className="w-full gap-2"
          disabled={loading !== null}
          onClick={() => handle("discord")}
        >
          <DiscordIcon />
          {loading === "discord" ? "..." : "Discord"}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full gap-2"
          disabled={loading !== null}
          onClick={() => handle("google")}
        >
          <GoogleIcon />
          {loading === "google" ? "..." : "Google"}
        </Button>
      </div>

      {config.demoMode && (
        <p className="text-center text-[10px] text-[var(--color-text-dim)]">
          OAuth працює лише з Supabase (не demo)
        </p>
      )}
    </div>
  )
}

function DiscordIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  )
}

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M12 10.2v3.6h5.1c-.2 1.2-1.5 3.6-5.1 3.6-3.1 0-5.6-2.5-5.6-5.6S8.9 6.2 12 6.2c1.8 0 3 .7 3.7 1.4l2.5-2.4C16.8 3.8 14.6 3 12 3 6.9 3 2.8 7.1 2.8 12.2S6.9 21.4 12 21.4c5.2 0 8.6-3.6 8.6-8.7 0-.6-.1-1-.2-1.5H12z"
      />
    </svg>
  )
}
