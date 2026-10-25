# Track A — Stable Preview (вітрина)

**Домен:** `survivaland.pp.ua`  
**Мета:** стабільний публічний сайт без обов’язкового Supabase.

## Чеклист

- [ ] Зелений Vercel Deploy на `main`
- [ ] Domain `survivaland.pp.ua` у Vercel → Domains + DNS
- [ ] Env: `VITE_DEMO_MODE=true` (preview) або `false` після Supabase
- [ ] Env: `VITE_DISCORD_INVITE_URL`
- [ ] Admin → Settings: домен, назва, SEO, лого, IP
- [ ] Header показує лого/назву з налаштувань
- [ ] Бейдж Preview/Demo якщо demo mode
- [ ] CI: `npm run build` (опційно)

## DNS (pp.ua)

1. Vercel → Project → **Settings → Domains** → Add `survivaland.pp.ua`
2. У реєстратора / панелі pp.ua додати записи, які покаже Vercel (зазвичай A / CNAME)
3. Дочекатись SSL (кілька хвилин – годин)

## Брендинг у адмінці

`/admin/settings`:

| Поле | Приклад |
|------|---------|
| Публічний домен | survivaland.pp.ua |
| Назва бренду | SurvivaLand |
| SEO title | SurvivaLand — Minecraft Server |
| Logo URL | https://.../logo.png |
| IP гри | survivaland.pp.ua |
| Discord | https://discord.gg/... |

У demo зміни зберігаються в `localStorage` браузера.
