# Track A — Acceptance (Stable Preview)

**Version baseline:** 1.4.2+  
**Domain:** survivaland.pp.ua  

## Must pass

- [ ] `main` builds on Vercel — status **Ready**
- [ ] GitHub Actions **Build** green (if workflow pushed)
- [ ] Site opens on `*.vercel.app` and/or `https://survivaland.pp.ua`
- [ ] Env: `VITE_DEMO_MODE=true` (preview) + Redeploy done
- [ ] Optional: `VITE_DISCORD_INVITE_URL` set
- [ ] Header: nav, language UA/RU/EN, **Увійти**, Discord (if URL set), **Preview** badge in demo
- [ ] Footer: brand, domain, links, version label
- [ ] `/admin/settings`: can change domain, name, SEO, logo URL, IP, Discord — Save works (demo → localStorage)
- [ ] Home loads (hero, status card, features, news)
- [ ] No critical console errors on home / server / shop

## DNS (if using custom domain)

- [ ] Domain added in Vercel → Domains
- [ ] DNS at registrar points to Vercel
- [ ] Status **Valid** + HTTPS

## Git tag (preview freeze)

```bash
cd ~/survivaland
git pull origin main
git tag -a v1.4.2-preview -m "Track A stable preview"
git push origin v1.4.2-preview
```

On GitHub: **Releases → Draft a new release → Choose tag v1.4.2-preview**

## Out of scope for Track A

- Supabase production (`DEMO_MODE=false`)
- Real payments
- Live Minecraft API
- Full legal localization

→ See Track B when ready.
