import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-[var(--color-primary)] text-[var(--color-background)]",
        secondary: "border-transparent bg-[var(--color-surface-elevated)] text-[var(--color-text-muted)]",
        outline: "text-[var(--color-text-muted)] border-[var(--color-border)]",
        success: "border-transparent bg-[var(--color-primary-muted)] text-[var(--color-primary)]",
        warning: "border-transparent bg-[rgba(232,184,74,0.15)] text-[var(--color-accent-gold)]",
        danger: "border-transparent bg-[rgba(232,90,90,0.15)] text-[var(--color-accent-red)]",
        info: "border-transparent bg-[rgba(91,155,213,0.15)] text-[var(--color-secondary)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
