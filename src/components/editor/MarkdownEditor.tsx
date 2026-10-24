import { useMemo, useState } from "react"
import { Bold, Italic, Heading2, List, ListOrdered, Link2, Code, Eye, Pencil } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type Props = {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  className?: string
  minRows?: number
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder,
  className,
  minRows = 10,
}: Props) {
  const [tab, setTab] = useState<"write" | "preview">("write")

  const insert = (before: string, after = "", sample = "") => {
    const el = document.getElementById("md-editor-area") as HTMLTextAreaElement | null
    if (!el) {
      onChange(value + before + sample + after)
      return
    }
    const start = el.selectionStart
    const end = el.selectionEnd
    const selected = value.slice(start, end) || sample
    const next = value.slice(0, start) + before + selected + after + value.slice(end)
    onChange(next)
    requestAnimationFrame(() => {
      el.focus()
      const pos = start + before.length + selected.length
      el.setSelectionRange(pos, pos)
    })
  }

  const html = useMemo(() => simpleMarkdownToHtml(value), [value])

  return (
    <div className={cn("overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-elevated)]", className)}>
      <div className="flex flex-wrap items-center gap-1 border-b border-[var(--color-border)] p-1.5">
        <Tool onClick={() => insert("**", "**", "bold")} title="Bold"><Bold className="h-3.5 w-3.5" /></Tool>
        <Tool onClick={() => insert("*", "*", "italic")} title="Italic"><Italic className="h-3.5 w-3.5" /></Tool>
        <Tool onClick={() => insert("\n## ", "", "Heading")} title="H2"><Heading2 className="h-3.5 w-3.5" /></Tool>
        <Tool onClick={() => insert("\n- ", "", "item")} title="List"><List className="h-3.5 w-3.5" /></Tool>
        <Tool onClick={() => insert("\n1. ", "", "item")} title="Ordered"><ListOrdered className="h-3.5 w-3.5" /></Tool>
        <Tool onClick={() => insert("[", "](https://)", "link")} title="Link"><Link2 className="h-3.5 w-3.5" /></Tool>
        <Tool onClick={() => insert("`", "`", "code")} title="Code"><Code className="h-3.5 w-3.5" /></Tool>
        <div className="ml-auto flex gap-1">
          <Button type="button" size="sm" variant={tab === "write" ? "secondary" : "ghost"} className="h-7 gap-1 text-xs" onClick={() => setTab("write")}>
            <Pencil className="h-3 w-3" /> Write
          </Button>
          <Button type="button" size="sm" variant={tab === "preview" ? "secondary" : "ghost"} className="h-7 gap-1 text-xs" onClick={() => setTab("preview")}>
            <Eye className="h-3 w-3" /> Preview
          </Button>
        </div>
      </div>
      {tab === "write" ? (
        <textarea
          id="md-editor-area"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={minRows}
          className="w-full resize-y bg-transparent px-3 py-2 font-mono text-xs leading-relaxed text-[var(--color-text)] placeholder:text-[var(--color-text-dim)] focus:outline-none"
        />
      ) : (
        <div
          className="min-h-[200px] space-y-2 px-3 py-2 text-sm text-[var(--color-text-muted)]"
          dangerouslySetInnerHTML={{ __html: html || "<p class='opacity-50'>Empty</p>" }}
        />
      )}
    </div>
  )
}

function Tool({ children, onClick, title }: { children: React.ReactNode; onClick: () => void; title: string }) {
  return (
    <button type="button" title={title} onClick={onClick} className="rounded p-1.5 text-[var(--color-text-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]">
      {children}
    </button>
  )
}

function simpleMarkdownToHtml(md: string): string {
  const esc = md.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  return esc.split("\n").map((line) => {
    if (line.startsWith("## ")) return `<h2 class="text-lg font-semibold text-[var(--color-text)]">${line.slice(3)}</h2>`
    if (line.startsWith("# ")) return `<h1 class="text-xl font-bold text-[var(--color-text)]">${line.slice(2)}</h1>`
    if (line.startsWith("- ")) return `<li class="ml-4 list-disc">${inline(line.slice(2))}</li>`
    if (/^\d+\.\s/.test(line)) return `<li class="ml-4 list-decimal">${inline(line.replace(/^\d+\.\s/, ""))}</li>`
    if (!line.trim()) return "<br/>"
    return `<p>${inline(line)}</p>`
  }).join("")
}

function inline(s: string) {
  return s
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code class='rounded bg-black/30 px-1'>$1</code>")
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a class="text-[var(--color-primary)] underline" href="$2" target="_blank" rel="noreferrer">$1</a>')
}
