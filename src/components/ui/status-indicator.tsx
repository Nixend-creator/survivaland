import { cn } from "@/lib/utils"

interface StatusIndicatorProps {
  online: boolean
  className?: string
  showLabel?: boolean
  size?: "sm" | "md" | "lg"
}

export function StatusIndicator({ online, className, showLabel = true, size = "md" }: StatusIndicatorProps) {
  const sizeClasses = {
    sm: "h-2 w-2",
    md: "h-2.5 w-2.5",
    lg: "h-3 w-3",
  }

  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span className="relative flex">
        <span
          className={cn(
            "rounded-full",
            sizeClasses[size],
            online ? "bg-[var(--color-primary)]" : "bg-[var(--color-accent-red)]"
          )}
        />
        {online && (
          <span
            className={cn(
              "absolute inline-flex h-full w-full animate-ping rounded-full opacity-40",
              "bg-[var(--color-primary)]"
            )}
          />
        )}
      </span>
      {showLabel && (
        <span className={cn("text-sm font-medium", online ? "text-[var(--color-primary)]" : "text-[var(--color-accent-red)]")}>
          {online ? "ONLINE" : "OFFLINE"}
        </span>
      )}
    </span>
  )
}
