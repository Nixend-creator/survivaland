import { Component, type ErrorInfo, type ReactNode } from "react"
import { Button } from "@/components/ui/button"

type Props = {
  children: ReactNode
  fallbackTitle?: string
}

type State = {
  hasError: boolean
  message: string
}

/**
 * Catches render errors so the whole app does not go blank.
 * Does not replace route-level 404/403 pages.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: "" }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      message: error?.message || "Невідома помилка",
    }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error("[ErrorBoundary]", error, info.componentStack)
    }
  }

  handleReload = () => {
    window.location.assign("/")
  }

  handleRetry = () => {
    this.setState({ hasError: false, message: "" })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 py-16 text-center">
          <p className="text-6xl font-bold text-[var(--color-accent-gold)]/30">500</p>
          <h1 className="mt-4 text-2xl font-bold">
            {this.props.fallbackTitle ?? "Щось пішло не так"}
          </h1>
          <p className="mt-2 max-w-md text-sm text-[var(--color-text-muted)]">
            Сталася помилка відображення. Спробуйте ще раз або поверніться на головну.
          </p>
          {import.meta.env.DEV && this.state.message && (
            <pre className="mt-4 max-w-lg overflow-x-auto rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3 text-left text-xs text-[var(--color-accent-red)]">
              {this.state.message}
            </pre>
          )}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button onClick={this.handleRetry} variant="secondary">
              Спробувати знову
            </Button>
            <Button onClick={this.handleReload}>На головну</Button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
