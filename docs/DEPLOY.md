# Деплой SurvivaLand

Фронтенд — Vite SPA. Підходить: **Vercel**, **Netlify**, Cloudflare Pages, будь-який static host + SPA fallback.

## Перед деплоєм

```bash
npm install
cp .env.example .env
# заповни змінні (див. нижче)
npm run build
```

Перевір локально:

```bash
npm run preview
```

## Змінні середовища

| Змінна | Обов'язкова | Опис |
|--------|-------------|------|
| `VITE_DEMO_MODE` | ні | `false` для продакшену з Supabase; інакше demo |
| `VITE_SUPABASE_URL` | для прод-auth | URL проєкту Supabase |
| `VITE_SUPABASE_ANON_KEY` | для прод-auth | anon public key |
| `VITE_DISCORD_INVITE_URL` | бажано | посилання Discord |
| `VITE_MINECRAFT_API_URL` | ні | статус сервера (поки demo) |
| `VITE_PAYMENT_*` | ні | лише public keys, не секрети |

Усі `VITE_*` вшиваються **під час build**. Після зміни env — перезбери проєкт.

---

## Vercel

1. Залий репозиторій на GitHub/GitLab.
2. [vercel.com](https://vercel.com) → **Add New Project** → вибери репо.
3. **Root Directory** — папка з `package.json` (корінь `survivaland-app`).
4. Framework: **Vite** (визначиться сам).
5. Build Command: `npm run build`
6. Output Directory: `dist`
7. Environment Variables — додай `VITE_*` з таблиці вище.
8. Deploy.

### SPA routing

Додай у корінь проєкту `vercel.json` (вже є в репо):

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

Кастомний домен: Project → Settings → Domains → `survivaland.top`.

---

## Netlify

1. [netlify.com](https://netlify.com) → Add new site → Import from Git.
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Environment variables → `VITE_*`.
5. Файл `public/_redirects` або `netlify.toml` (в репо):

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## Cloudflare Pages

1. Workers & Pages → Create → Connect repo.
2. Build command: `npm run build`
3. Output: `dist`
4. Env vars у Settings.
5. SPA: Settings → Functions / або `_redirects`:

```
/*    /index.html   200
```

---

## Будь-який Nginx

```nginx
server {
  listen 80;
  server_name survivaland.top;
  root /var/www/survivaland/dist;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }

  location ~* \.(js|css|png|svg|ico|woff2)$ {
    expires 7d;
    add_header Cache-Control "public";
  }
}
```

Залити вміст `dist/` після `npm run build`.

---

## Supabase + домен

1. Пройди `docs/SUPABASE_SETUP.md`.
2. Auth → URL Configuration:
   - Site URL: `https://survivaland.top`
   - Redirect URLs: `https://survivaland.top/**`, `http://localhost:5173/**`
3. `VITE_DEMO_MODE=false` у CI/hosting env.
4. Після першої реєстрації:

```sql
UPDATE profiles SET role = 'admin' WHERE email = 'your@email.com';
```

---

## Чеклист перед запуском

- [ ] `npm run build` без помилок
- [ ] Dark theme, головна, /shop, /admin
- [ ] Demo login або реальний Supabase login
- [ ] Discord URL у Settings або env
- [ ] robots.txt / sitemap (домен у sitemap)
- [ ] HTTPS і кастомний домен
- [ ] Немає `service_role` / платіжних секретів у фронті

## Troubleshooting

| Проблема | Що перевірити |
|----------|----------------|
| 404 на /wiki при refresh | SPA rewrite не налаштований |
| Білий екран | Console, шляхи assets, env на build |
| Auth не працює | `VITE_DEMO_MODE`, URL/keys, Supabase redirect |
| Старий Discord/IP | env перезібрано? Settings localStorage? |

© SurvivaLand
