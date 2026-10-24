-- SurvivaLand demo seed
-- Run AFTER schema.sql in Supabase SQL Editor.
-- Safe to re-run: uses fixed IDs / ON CONFLICT where possible.

-- ========== News ==========
INSERT INTO news (id, slug, title, excerpt, content, category, author, published_at)
VALUES
  (
    'a0000001-0001-4000-8000-000000000001',
    'welcome-season',
    'Ласкаво просимо до нового сезону!',
    'Офіційний старт сезону: нові квести, оновлена економіка та івенти.',
    E'## Новий сезон SurvivaLand\n\nМи раді вітати всіх на старті сезону.\n\n### Що нового\n- Оновлені стартові квести\n- Баланс економіки\n- Тижневі івенти\n\nПриєднуйтесь до Discord, щоб не пропустити анонси.',
    'Оновлення',
    'Адміністрація',
    '2026-10-01'
  ),
  (
    'a0000001-0001-4000-8000-000000000002',
    'economy-update',
    'Оновлення економіки',
    'Зміни цін, нові магазини NPC та аукціон.',
    E'## Економіка 2.0\n\n- Нові NPC-торговці на спавні\n- Аукціон `/ah`\n- Збалансовані ціни на ресурси\n\nДокладніше — у розділі Wiki → Економіка.',
    'Оновлення',
    'Адміністрація',
    '2026-09-15'
  ),
  (
    'a0000001-0001-4000-8000-000000000003',
    'halloween-event',
    'Halloween Event',
    'Обмежений івент з унікальними нагородами.',
    E'## Halloween на SurvivaLand\n\nЗбирайте гарбузи, виконуйте квести та отримуйте косметику.\n\nТривалість: до кінця жовтня.',
    'Івенти',
    'Адміністрація',
    '2026-10-10'
  )
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  category = EXCLUDED.category,
  author = EXCLUDED.author,
  published_at = EXCLUDED.published_at,
  updated_at = now();

-- ========== Wiki ==========
INSERT INTO wiki_articles (id, slug, title, description, content, category, related_slugs)
VALUES
  (
    'b0000001-0001-4000-8000-000000000001',
    'getting-started',
    'Початок гри',
    'Як приєднатися до сервера та зробити перші кроки.',
    E'## Як почати грати\n\n1. Додайте сервер **survivaland.top**\n2. Увійдіть у гру\n3. Виконайте стартові квести\n4. Отримайте перші ресурси\n\n### Корисні команди\n- `/spawn` — повернутися на спавн\n- `/home` — додому\n- `/tpa <гравець>` — запросити телепорт',
    'getting-started',
    ARRAY['server-basics', 'commands']
  ),
  (
    'b0000001-0001-4000-8000-000000000002',
    'server-basics',
    'Основи сервера',
    'Основні механіки та особливості SurvivaLand.',
    E'## Основи SurvivaLand\n\nSurvivaLand — survival-сервер з елементами PvP, економіки та спільноти.\n\n### Режими\n- Survival будівництво\n- PvP-зони\n- Захист територій',
    'server-basics',
    ARRAY['getting-started', 'economy']
  ),
  (
    'b0000001-0001-4000-8000-000000000003',
    'economy',
    'Економіка',
    'Як працює валюта, магазини та торгівля.',
    E'## Економіка сервера\n\nОсновна валюта — **Coins**.\n\n- Заробіток: роботи, квести, продаж\n- Магазини NPC на спавні\n- Гравець-гравець: `/pay`, аукціон',
    'economy',
    ARRAY['getting-started']
  ),
  (
    'b0000001-0001-4000-8000-000000000004',
    'commands',
    'Команди',
    'Список основних команд гравця.',
    E'## Команди\n\n- `/spawn` — спавн\n- `/sethome [name]` — дім\n- `/home [name]` — додому\n- `/tpa <nick>` — запит телепорту\n- `/msg <nick> <text>` — приват\n- `/bal` — баланс',
    'commands',
    ARRAY['getting-started']
  )
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  content = EXCLUDED.content,
  category = EXCLUDED.category,
  related_slugs = EXCLUDED.related_slugs,
  updated_at = now();

-- ========== Shop ==========
INSERT INTO shop_products (id, name, description, benefits, price, currency, category, active)
VALUES
  (
    'c0000001-0001-4000-8000-000000000001',
    'VIP',
    'Базовий преміум-ранг з корисними бонусами.',
    '["Префікс [VIP]", "+2 доміки", "Кольоровий чат", "Доступ до /fly на спавні"]'::jsonb,
    149,
    'UAH',
    'ranks',
    true
  ),
  (
    'c0000001-0001-4000-8000-000000000002',
    'Premium',
    'Розширені можливості для активних гравців.',
    '["Префікс [Premium]", "+5 доміків", "Всі бонуси VIP", "Унікальні набори"]'::jsonb,
    299,
    'UAH',
    'ranks',
    true
  ),
  (
    'c0000001-0001-4000-8000-000000000003',
    'Стартовий набір',
    'Корисні речі для швидкого старту.',
    '["Залізний набір", "16 стейків", "Верстак", "Ліжко"]'::jsonb,
    49,
    'UAH',
    'kits',
    true
  ),
  (
    'c0000001-0001-4000-8000-000000000004',
    'Косметичний плащ',
    'Унікальний плащ для вашого скіна.',
    '["Ексклюзивний плащ", "Видимий усім гравцям"]'::jsonb,
    99,
    'UAH',
    'cosmetics',
    true
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  benefits = EXCLUDED.benefits,
  price = EXCLUDED.price,
  currency = EXCLUDED.currency,
  category = EXCLUDED.category,
  active = EXCLUDED.active,
  updated_at = now();

-- ========== Demo players (for rankings sync later) ==========
INSERT INTO players (id, uuid, username, rank, first_joined, last_seen)
VALUES
  ('d0000001-0001-4000-8000-000000000001', 'demo-uuid-1', 'BuilderPro', 'Легенда', '2024-03-12', '2026-10-01'),
  ('d0000001-0001-4000-8000-000000000002', 'demo-uuid-2', 'SurvivalKing', 'Майстер', '2024-05-01', '2026-10-02'),
  ('d0000001-0001-4000-8000-000000000003', 'demo-uuid-3', 'EcoTrader', 'Еліта', '2024-06-20', '2026-09-30'),
  ('d0000001-0001-4000-8000-000000000004', 'demo-uuid-4', 'PvPMaster', 'Воїн', '2024-08-15', '2026-10-02'),
  ('d0000001-0001-4000-8000-000000000005', 'demo-uuid-5', 'QuietBuilder', 'Гравець', '2025-01-10', '2026-09-28')
ON CONFLICT (username) DO UPDATE SET
  rank = EXCLUDED.rank,
  last_seen = EXCLUDED.last_seen,
  updated_at = now();

INSERT INTO player_statistics (player_id, playtime_minutes, balance, kills, deaths, achievements_count)
VALUES
  ('d0000001-0001-4000-8000-000000000001', 18420, 125400, 342, 89, 47),
  ('d0000001-0001-4000-8000-000000000002', 15600, 98750, 521, 134, 38),
  ('d0000001-0001-4000-8000-000000000003', 12300, 256800, 87, 42, 29),
  ('d0000001-0001-4000-8000-000000000004', 9800, 45200, 890, 210, 22),
  ('d0000001-0001-4000-8000-000000000005', 7200, 32100, 12, 56, 15)
ON CONFLICT (player_id) DO UPDATE SET
  playtime_minutes = EXCLUDED.playtime_minutes,
  balance = EXCLUDED.balance,
  kills = EXCLUDED.kills,
  deaths = EXCLUDED.deaths,
  achievements_count = EXCLUDED.achievements_count,
  updated_at = now();

-- ========== Sample reports (no auth.users FK required for reporter_id null) ==========
INSERT INTO reports (id, reporter_username, target_username, reason, status, created_at, updated_at)
VALUES
  (
    'e0000001-0001-4000-8000-000000000001',
    'QuietBuilder',
    'PvPMaster',
    'Підозра на використання читів у PvP-зоні',
    'open',
    '2026-10-20T14:30:00Z',
    '2026-10-20T14:30:00Z'
  ),
  (
    'e0000001-0001-4000-8000-000000000002',
    'EcoTrader',
    'BuilderPro',
    'Можливий гриф біля захищеної території',
    'reviewing',
    '2026-10-18T09:15:00Z',
    '2026-10-19T11:00:00Z'
  )
ON CONFLICT (id) DO NOTHING;

-- site_settings defaults already in schema.sql
