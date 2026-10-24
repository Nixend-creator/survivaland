import { Link } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"

export function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight">Умови використання</h1>
      <p className="mt-2 text-sm text-[var(--color-text-muted)]">
        Останнє оновлення: жовтень 2026 · шаблонний текст, замініть перед продакшеном
      </p>

      <Card className="mt-8">
        <CardContent className="prose-invert space-y-4 p-6 text-sm leading-relaxed text-[var(--color-text-muted)]">
          <section>
            <h2 className="text-lg font-semibold text-[var(--color-text)]">1. Загальні положення</h2>
            <p>
              Сайт SurvivaLand та пов’язані сервіси надаються «як є». Користуючись сайтом і
              Minecraft-сервером survivaland.top, ви погоджуєтесь із цими умовами та{" "}
              <Link to="/rules" className="text-[var(--color-primary)] hover:underline">
                правилами сервера
              </Link>
              .
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-[var(--color-text)]">2. Акаунт</h2>
            <p>
              Ви відповідаєте за збереження доступу до акаунта. Заборонено передавати облікові
              дані третім особам і використовувати чужі акаунти.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-[var(--color-text)]">3. Контент і поведінка</h2>
            <p>
              Заборонені шахрайство, чити, переслідування, спам і порушення законодавства.
              Адміністрація може обмежити доступ без попередження у разі порушень.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-[var(--color-text)]">4. Донати та товари</h2>
            <p>
              Віртуальні товари не є інвестицією. Умови повернення визначаються політикою
              платежів і законодавством. Реальна оплата підключається лише через налаштованого
              провайдера.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-[var(--color-text)]">5. Відмова від відповідальності</h2>
            <p>
              SurvivaLand не пов’язаний з Mojang Studios чи Microsoft. Minecraft є торговою
              маркою відповідних правовласників.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-[var(--color-text)]">6. Контакти</h2>
            <p>
              З питань щодо умов звертайтесь через Discord спільноти (посилання на сайті) або
              канал підтримки сервера.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  )
}
