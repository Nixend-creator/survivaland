import { AlertTriangle } from "lucide-react"
import { useI18n } from "@/i18n"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const sections: { titleKey: string; ruleKeys: string[] }[] = [
  { titleKey: "rules.general", ruleKeys: ["rules.g1", "rules.g2", "rules.g3", "rules.g4"] },
  { titleKey: "rules.gameplay", ruleKeys: ["rules.gp1", "rules.gp2", "rules.gp3"] },
  { titleKey: "rules.pvp", ruleKeys: ["rules.p1", "rules.p2"] },
  { titleKey: "rules.economy", ruleKeys: ["rules.e1", "rules.e2"] },
  { titleKey: "rules.chat", ruleKeys: ["rules.c1", "rules.c2"] },
  { titleKey: "rules.building", ruleKeys: ["rules.b1"] },
  { titleKey: "rules.accounts", ruleKeys: ["rules.a1"] },
  { titleKey: "rules.punishments", ruleKeys: ["rules.pu1"] },
]

export function RulesPage() {
  const { t } = useI18n()

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight">{t("rules.title")}</h1>
      <p className="mt-2 text-[var(--color-text-muted)]">{t("rules.subtitle")}</p>

      <Card className="mt-6 border-[var(--color-accent-gold)]/30 bg-[rgba(232,184,74,0.06)]">
        <CardContent className="flex gap-3 p-4 text-sm">
          <AlertTriangle className="h-5 w-5 shrink-0 text-[var(--color-accent-gold)]" />
          <p className="text-[var(--color-text-muted)]">{t("rules.warning")}</p>
        </CardContent>
      </Card>

      <div className="mt-8 space-y-4">
        {sections.map((section, si) => (
          <Card key={section.titleKey}>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{si + 1}</Badge>
                <CardTitle className="text-base">{t(section.titleKey)}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal space-y-2 pl-5 text-sm text-[var(--color-text-muted)]">
                {section.ruleKeys.map((key) => (
                  <li key={key}>{t(key)}</li>
                ))}
              </ol>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
