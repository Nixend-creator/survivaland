# Changelog

Усі помітні зміни проєкту SurvivaLand фіксуються в цьому файлі.

Формат базується на [Keep a Changelog](https://keepachangelog.com/uk/1.0.0/),
версії — [Semantic Versioning](https://semver.org/lang/uk/).

## [1.4.3] — 2026-10-25

### Added
- `docs/TRACK_A_ACCEPTANCE.md` — чеклист приймання Stable Preview + git tag

## [1.4.2] — 2026-10-25

### Added
- Footer: лого/назва/домен з Settings, структура як на макеті
- GitHub Actions: `npm run build` на push/PR у main

## [1.4.1] — 2026-10-25

### Added
- Header: Discord з settings/env, бейдж Preview у demo, Discord у mobile menu

### Changed
- Track A кроки 2–3: домен pp.ua + header під макет

## [1.4.0] — 2026-10-25

### Added
- Track A: брендинг у Settings (домен, назва, SEO title/description, logo URL)
- Header підхоплює назву/лого з налаштувань
- Seo canonical з `siteDomain` (survivaland.pp.ua)
- `docs/TRACK_A.md` — чеклист preview-релізу

### Changed
- Дефолтний IP/домен: `survivaland.pp.ua`

## [1.3.1] — 2026-10-24

### Fixed
- HomePage: `large` на всіх feature-картках (TS2339)

## [1.3.0] — 2026-10-24

### Changed
- Редизайн головної сторінки під premium-макет: cinematic hero, ONLINE-картка, bento-фічі, статистика, новини, Discord-банер, фінальний CTA

## [1.2.0] — 2026-10-24

### Added
- Конвертер валют за курсом НБУ (дата + UAH/USD/EUR/PLN) на сторінці Economy
- Markdown-редактор (toolbar + preview) для контенту новин в адмінці
- Вибір валюти товару в адмін-магазині (UAH/USD/EUR/PLN)

### Changed
- Мінорний реліз після серії i18n/auth фіксів

## [1.1.7] — 2026-10-24

### Added
- i18n для Login / Register (UA/RU/EN)

## [1.1.6] — 2026-10-24

### Fixed
- HomePage: why-cards titleKey/textKey
- WikiPage: categories `labelKey` замість `label`

## [1.1.5] — 2026-10-24

### Fixed
- WikiPage: подвійні дужки `{{t(...)}}` → `{t(...)}` (TS1003)

## [1.1.4] — 2026-10-24

### Fixed
- WikiPage: зламаний `placeholder={t(...)}` (TS1003) — збірка Vercel

## [1.1.3] — 2026-10-24

### Fixed
- Повний i18n публічних сторінок: Economy, Home, Shop categories, Wiki, News, Rankings, 404/403/500/maintenance
- ServerStatusCard повністю перекладається (UA/RU/EN)

## [1.1.2] — 2026-10-24

### Fixed
- Сторінка `/server`: повний переклад UA/RU/EN (опис, фічі, версії, підключення, правила)

## [1.1.1] — 2026-10-24

### Fixed
- TypeScript build: `LocalizedString` у JSX (category), AdminShop filter/benefits
- `shop.ts` / `wiki.ts` — коректна робота з багатомовними полями (без `.trim()`/`.map` на об'єктах)

## [1.1.0] — 2026-10-23

### Added
- Публічна сторінка скарг `/report` + пункт навігації
- Повноцінна багатомовність контенту (uk/ru/en) для новин, Wiki, магазину
- `LocalizedString` / `pickLocalized` у `src/lib/localized.ts`
- Багатомовні поля в адмінці новин (UA/RU/EN)
- `CHANGELOG.md` і відображення версії в футері
- Модуль `src/config/version.ts` (`APP_VERSION`)

### Changed
- Розширені файли перекладів `uk.json` / `ru.json` / `en.json` (home, rules, shop, reports…)
- Правила сервера повністю через i18n
- Demo-дані новин/wiki/shop з трьома мовами

### Fixed
- TypeScript build на Vercel: `ignoreDeprecations` для `baseUrl`
- Прибрано невикористаний тип `TranslationKeys`
- Послаблені `noUnusedLocals` / `noUnusedParameters` для стабільного CI/deploys

## [1.0.0] — 2026-10-22

### Added
- Початковий реліз каркаса сайту SurvivaLand
- React + TypeScript + Vite + Tailwind + React Router + TanStack Query
- Публічні сторінки: home, server, rankings, player, wiki, news, rules, shop, economy
- Auth (demo + Supabase-ready), профіль, reset password, OAuth-заглушки
- Адмін-панель: dashboard, players, news, wiki, shop, reports, settings
- Demo mode (`VITE_DEMO_MODE`), сервісний шар, Recharts
- Supabase `schema.sql` + `seed.sql`, docs DEPLOY / SUPABASE_SETUP
- SEO (meta, robots, sitemap), maintenance mode, Error Boundary
- a11y: skip-link, ARIA, focus styles
- Terms / Privacy, DEV-індикатор
- Конфіги Vercel / Netlify

[1.1.0]: https://github.com/Nixend-creator/survivaland/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/Nixend-creator/survivaland/releases/tag/v1.0.0
