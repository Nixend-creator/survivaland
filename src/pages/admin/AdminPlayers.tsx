import { useState } from "react"
import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { listPlayers } from "@/services/players"
import { formatNumber, formatPlaytime } from "@/lib/utils"

export function AdminPlayers() {
  const [search, setSearch] = useState("")
  const { data: players = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["admin-players"],
    queryFn: listPlayers,
  })

  const filtered = players.filter((p) =>
    p.username.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Гравці</h1>
      <p className="mb-6 text-sm text-[var(--color-text-muted)]">
        Дані з demo або Supabase `players` / `player_statistics`
      </p>
      <input
        type="search"
        placeholder="Пошук..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 w-full max-w-sm rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm focus:border-[var(--color-primary)] focus:outline-none"
      />

      {isLoading && (
        <p className="text-sm text-[var(--color-text-muted)]">Завантаження...</p>
      )}
      {isError && (
        <Card>
          <CardContent className="py-8 text-center text-[var(--color-text-muted)]">
            Помилка завантаження.{" "}
            <button className="text-[var(--color-primary)] underline" onClick={() => refetch()}>
              Повторити
            </button>
          </CardContent>
        </Card>
      )}

      {!isLoading && !isError && (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)] text-left text-[var(--color-text-muted)]">
                  <th className="px-4 py-3 font-medium">Гравець</th>
                  <th className="px-4 py-3 font-medium">Ранг</th>
                  <th className="px-4 py-3 font-medium hidden sm:table-cell">Баланс</th>
                  <th className="px-4 py-3 font-medium hidden md:table-cell">Час гри</th>
                  <th className="px-4 py-3 font-medium">Джерело</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-[var(--color-border)]/50 hover:bg-[var(--color-surface-elevated)]/50"
                  >
                    <td className="px-4 py-3">
                      <Link
                        to={`/player/${p.username}`}
                        className="font-medium hover:text-[var(--color-primary)]"
                      >
                        {p.username}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-[var(--color-text-muted)]">{p.rank}</td>
                    <td className="px-4 py-3 hidden sm:table-cell tabular-nums">
                      {formatNumber(p.balance)}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      {formatPlaytime(p.playtimeMinutes)}
                    </td>
                    <td className="px-4 py-3">
                      {p.isDemo ? (
                        <Badge variant="warning">DEMO</Badge>
                      ) : (
                        <Badge variant="success">DB</Badge>
                      )}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-[var(--color-text-muted)]">
                      Гравців не знайдено
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}
