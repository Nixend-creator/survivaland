import { Card, CardContent } from "@/components/ui/card"

export function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight">Політика конфіденційності</h1>
      <p className="mt-2 text-sm text-[var(--color-text-muted)]">
        Останнє оновлення: жовтень 2026 · шаблонний текст для запуску
      </p>

      <Card className="mt-8">
        <CardContent className="space-y-4 p-6 text-sm leading-relaxed text-[var(--color-text-muted)]">
          <section>
            <h2 className="text-lg font-semibold text-[var(--color-text)]">1. Які дані збираємо</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Email і нікнейм при реєстрації</li>
              <li>Minecraft username (якщо вказано в профілі)</li>
              <li>Технічні логи (IP, браузер) у межах хостингу / Supabase</li>
              <li>Ігрова статистика, синхронізована з сервера (за наявності API)</li>
            </ul>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-[var(--color-text)]">2. Навіщо</h2>
            <p>
              Для входу в акаунт, модерації, роботи рейтингу, покращення сервісу та безпеки.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-[var(--color-text)]">3. Зберігання</h2>
            <p>
              Дані облікового запису зберігаються в Supabase (або еквівалентній БД). Доступ
              обмежується політиками RLS і ролями персоналу.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-[var(--color-text)]">4. Передача третім сторонам</h2>
            <p>
              Можлива передача платіжному провайдеру при покупках і хостинг-провайдеру.
              Ми не продаємо персональні дані.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-[var(--color-text)]">5. Ваші права</h2>
            <p>
              Ви можете надіслати запит на перегляд або видалення акаунта через підтримку
              сервера. Частина логів може зберігатися для безпеки згідно із законом.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-[var(--color-text)]">6. Cookies</h2>
            <p>
              Використовуються лише необхідні cookies сесії (auth) і локальні налаштування
              (мова, demo settings).
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  )
}
