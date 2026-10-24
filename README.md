# SurvivaLand

**Version:** 1.1.0 — see [CHANGELOG.md](./CHANGELOG.md)

Сайт преміум Minecraft-сервера.

**Survival • Building • Community**  
`survivaland.top` · 1.17.1–1.21.11

## Що реалізовано

### Публічна частина
- Головна (hero, статус сервера, фічі, топ, новини, Discord)
- Server, Rankings (+ Recharts), Wiki, Rules, News, Player profiles (+ графіки)
- Economy, Shop (абстракція платежів)
- i18n: UA / RU / EN · dark UI · toasts · 404

### Auth
- Login / Register / Profile
- **Demo-режим** за замовчуванням (localStorage)
- **Supabase Auth** — готовий клієнт і сервіс (`src/lib/supabase.ts`, `src/services/auth.ts`)
- Інструкція: [`docs/SUPABASE_SETUP.md`](docs/SUPABASE_SETUP.md)

### Адмінка (`/admin`)
| Розділ | Можливості |
|--------|------------|
| Dashboard | Статус, лічильники, відкриті скарги |
| Гравці | Список (demo) |
| Новини | Повний CRUD |
| Wiki | Повний CRUD |
| Магазин | Повний CRUD |
| Скарги | Статуси, фільтри, CRUD |
| Налаштування | IP, версії, Discord, слоган (localStorage) |

### Дані та інфраструктура
- `supabase/schema.sql` — profiles, RLS, content, reports, site_settings, тригер реєстрації
- Services: auth, news, wiki, shop, reports, siteSettings, minecraftServer, rankings, payment

## Стек

React 19 · TypeScript · Vite · Tailwind 4 · React Router 7 · TanStack Query · Recharts · Zod · Lucide · Sonner · Supabase JS

## Запуск

```bash
npm install
cp .env.example .env
npm run dev
```

**Demo login:** будь-який email/пароль. Email на `admin@...` → роль admin.

## Підключення Supabase

Див. **[docs/SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md)** · **[docs/DEPLOY.md](docs/DEPLOY.md)**

Коротко:
1. SQL → `supabase/schema.sql`
2. `.env`: URL + anon key, `VITE_DEMO_MODE=false`
3. `UPDATE profiles SET role = 'admin' WHERE email = '...'`

## Структура

```
src/
  components/   ui, layout, server
  pages/        public + auth/ + admin/
  services/     auth, news, wiki, shop, reports, siteSettings, ...
  lib/          utils, supabase
  hooks/        useAuth
  i18n/
  data/         demo seeds
supabase/
  schema.sql
  seed.sql      # demo content for Supabase
docs/
  SUPABASE_SETUP.md
```

## Деплой

Покроково: **[docs/DEPLOY.md](docs/DEPLOY.md)** (Vercel, Netlify, Nginx).

## Production

- `VITE_DEMO_MODE=false` + Supabase
- Admin лише через RLS / server checks
- Платіжні секрети — не у фронтенді
- Minecraft API — окремий backend або plugin bridge

© 2026 SurvivaLand · Not affiliated with Mojang or Microsoft
