import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function AdminPlaceholder({ title }: { title: string }) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{title}</h1>
      <Card>
        <CardContent className="py-16 text-center">
          <Badge variant="warning" className="mb-3">В розробці</Badge>
          <p className="text-[var(--color-text-muted)]">
            CRUD для {title.toLowerCase()} буде доступний після підключення бази даних (Supabase).
          </p>
          <p className="mt-2 text-xs text-[var(--color-text-dim)]">
            Таблиці: search, filter, pagination, sorting — архітектура готова.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
