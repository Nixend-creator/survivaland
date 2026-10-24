# Підключення Supabase Auth до SurvivaLand

Покрокова інструкція. Поки `VITE_DEMO_MODE=true` або немає URL — сайт працює в demo-режимі.

## 1. Проєкт у Supabase

1. Створи проєкт на [supabase.com](https://supabase.com)
2. **Settings → API**: скопіюй
   - Project URL → `VITE_SUPABASE_URL`
   - `anon` `public` key → `VITE_SUPABASE_ANON_KEY`
3. **Ніколи** не клади `service_role` у фронтенд

## 2. Схема БД

1. **SQL Editor → New query**
2. Встав увесь файл `supabase/schema.sql`
3. Run
4. Окремим запитом виконай **`supabase/seed.sql`** (демо новини, wiki, shop, гравці)

Схема створює: `profiles`, гравці, news, wiki, shop, orders, reports, site_settings, RLS і тригер профілю після реєстрації.

## 3. Auth

1. **Authentication → Providers → Email** — увімкни Email
2. За бажанням вимкни «Confirm email» для тестів (або залиш увімкненим)
3. **Authentication → URL Configuration** — додай `http://localhost:5173` і прод-домен

## 4. Перший admin

1. Зареєструй себе на сайті (або через Auth → Users)
2. У SQL Editor:

```sql
UPDATE profiles SET role = 'admin' WHERE email = 'your@email.com';
```

## 5. `.env`

```env
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
VITE_DEMO_MODE=false
VITE_DISCORD_INVITE_URL=https://discord.gg/...
```

```bash
npm install
npm run dev
```

Після цього login/register йдуть через Supabase; роль читається з `profiles`.

## 6. Безпека

| Правило | Чому |
|---------|------|
| Admin-роль лише в БД + RLS | Клієнт можна підмінити |
| `anon` key у фронті — ок | Обмежена RLS |
| `service_role` лише на сервері / Edge Functions | Повний доступ до БД |
| Платежі — через backend / webhook | Секрети платіжки не у Vite |

## 7. Content CRUD (вже в коді)

При `VITE_DEMO_MODE=false` + валідних ключах сервіси пишуть у таблиці:

| Сервіс | Таблиця |
|--------|---------|
| news | `news` |
| wiki | `wiki_articles` |
| shop | `shop_products` |
| reports | `reports` |
| siteSettings | `site_settings` |

Потрібна сесія staff (`role` admin/moderator/editor) для write через RLS.

## 8. Наступні кроки після Auth

- Переключити `news` / `wiki` / `shop` services на `.from("news")` тощо
- Edge Function для платежів
- Plugin Minecraft → sync у `players` / `player_statistics` (service role або API key)

## Troubleshooting

- **«Invalid API key»** — перевір URL і anon key
- **Профіль порожній** — перевір тригер `on_auth_user_created`
- **Немає доступу в admin** — `UPDATE profiles SET role = 'admin' ...`
- **CORS / redirect** — Site URL у Auth settings

## OAuth (Discord / Google)

1. Supabase → **Authentication → Providers** → увімкни Discord і/або Google
2. Вкажи Client ID / Secret з Discord Developer Portal / Google Cloud
3. Redirect URL від Supabase (callback) додай у провайдера
4. У `.env`:

```env
VITE_OAUTH_DISCORD=true
VITE_OAUTH_GOOGLE=true
VITE_DEMO_MODE=false
```

5. Site URL / Redirect: `https://your-domain/profile`

Кнопки на Login/Register завжди видимі; без налаштування показують зрозумілу помилку (не «фейковий» вхід).
