import type { Player, RankingEntry, NewsArticle, WikiArticle, ShopProduct } from "@/types"
import { loc, locList } from "@/lib/localized"

export const DEMO_PLAYERS: Player[] = [
  {
    id: "demo-1",
    username: "BuilderPro",
    rank: "Легенда",
    firstJoined: "2024-03-12",
    lastSeen: "2026-10-01",
    playtimeMinutes: 18420,
    balance: 125400,
    kills: 342,
    deaths: 89,
    achievements: 47,
    isDemo: true,
  },
  {
    id: "demo-2",
    username: "SurvivalKing",
    rank: "Майстер",
    firstJoined: "2024-05-01",
    lastSeen: "2026-10-02",
    playtimeMinutes: 15600,
    balance: 98750,
    kills: 521,
    deaths: 134,
    achievements: 38,
    isDemo: true,
  },
  {
    id: "demo-3",
    username: "EcoTrader",
    rank: "Еліта",
    firstJoined: "2024-06-20",
    lastSeen: "2026-09-30",
    playtimeMinutes: 12300,
    balance: 256800,
    kills: 87,
    deaths: 42,
    achievements: 29,
    isDemo: true,
  },
  {
    id: "demo-4",
    username: "PvPMaster",
    rank: "Воїн",
    firstJoined: "2024-08-15",
    lastSeen: "2026-10-02",
    playtimeMinutes: 9800,
    balance: 45200,
    kills: 890,
    deaths: 210,
    achievements: 22,
    isDemo: true,
  },
  {
    id: "demo-5",
    username: "QuietBuilder",
    rank: "Гравець",
    firstJoined: "2025-01-10",
    lastSeen: "2026-09-28",
    playtimeMinutes: 7200,
    balance: 32100,
    kills: 12,
    deaths: 56,
    achievements: 15,
    isDemo: true,
  },
]

export function getDemoRankings(type: string): RankingEntry[] {
  const sorted = [...DEMO_PLAYERS].sort((a, b) => {
    switch (type) {
      case "wealth":
        return b.balance - a.balance
      case "playtime":
        return b.playtimeMinutes - a.playtimeMinutes
      case "kills":
        return b.kills - a.kills
      case "deaths":
        return b.deaths - a.deaths
      case "achievements":
        return b.achievements - a.achievements
      default:
        return b.playtimeMinutes - a.playtimeMinutes
    }
  })
  return sorted.map((player, i) => ({
    rank: i + 1,
    player,
    value:
      type === "wealth"
        ? player.balance
        : type === "kills"
          ? player.kills
          : type === "deaths"
            ? player.deaths
            : type === "achievements"
              ? player.achievements
              : player.playtimeMinutes,
    change: 0,
    isDemo: true,
  }))
}

export const DEMO_NEWS: NewsArticle[] = [
  {
    id: "n1",
    slug: "welcome-season",
    title: loc(
      "Ласкаво просимо до нового сезону!",
      "Добро пожаловать в новый сезон!",
      "Welcome to the new season!"
    ),
    excerpt: loc(
      "Офіційний старт сезону: нові квести, оновлена економіка та івенти.",
      "Официальный старт сезона: новые квесты, обновлённая экономика и ивенты.",
      "Season launch: new quests, economy updates, and events."
    ),
    content: loc(
      "## Новий сезон SurvivaLand\n\nМи раді вітати всіх на старті сезону.\n\n### Що нового\n- Оновлені стартові квести\n- Баланс економіки\n- Тижневі івенти\n\nПриєднуйтесь до Discord!",
      "## Новый сезон SurvivaLand\n\nМы рады приветствовать всех на старте сезона.\n\n### Что нового\n- Обновлённые стартовые квесты\n- Баланс экономики\n- Еженедельные ивенты\n\nПрисоединяйтесь к Discord!",
      "## New SurvivaLand season\n\nWelcome to the start of the season.\n\n### What's new\n- Updated starter quests\n- Economy balance\n- Weekly events\n\nJoin Discord!"
    ),
    category: loc("Оновлення", "Обновления", "Updates"),
    author: "Адміністрація",
    publishedAt: "2026-10-01",
    isDemo: true,
  },
  {
    id: "n2",
    slug: "economy-update",
    title: loc("Оновлення економіки", "Обновление экономики", "Economy update"),
    excerpt: loc(
      "Зміни цін, нові магазини NPC та аукціон.",
      "Изменения цен, новые NPC-магазины и аукцион.",
      "Price changes, new NPC shops, and the auction."
    ),
    content: loc(
      "## Економіка 2.0\n\n- Нові NPC-торговці на спавні\n- Аукціон `/ah`\n- Збалансовані ціни\n\nДокладніше — у Wiki.",
      "## Экономика 2.0\n\n- Новые NPC на спавне\n- Аукцион `/ah`\n- Сбалансированные цены\n\nПодробнее — в Wiki.",
      "## Economy 2.0\n\n- New spawn NPCs\n- Auction `/ah`\n- Balanced prices\n\nSee the Wiki for details."
    ),
    category: loc("Оновлення", "Обновления", "Updates"),
    author: "Адміністрація",
    publishedAt: "2026-09-15",
    isDemo: true,
  },
  {
    id: "n3",
    slug: "halloween-event",
    title: loc("Halloween Event", "Halloween Event", "Halloween Event"),
    excerpt: loc(
      "Обмежений івент з унікальними нагородами.",
      "Ограниченный ивент с уникальными наградами.",
      "Limited-time event with unique rewards."
    ),
    content: loc(
      "## Halloween на SurvivaLand\n\nЗбирайте гарбузи, виконуйте квести та отримуйте косметику.\n\nТривалість: до кінця жовтня.",
      "## Halloween на SurvivaLand\n\nСобирайте тыквы, выполняйте квесты и получайте косметику.\n\nДо конца октября.",
      "## Halloween on SurvivaLand\n\nCollect pumpkins, complete quests, earn cosmetics.\n\nUntil the end of October."
    ),
    category: loc("Івенти", "Ивенты", "Events"),
    author: "Адміністрація",
    publishedAt: "2026-10-10",
    isDemo: true,
  },
]

export const DEMO_WIKI: WikiArticle[] = [
  {
    id: "w1",
    slug: "getting-started",
    title: loc("Початок гри", "Начало игры", "Getting started"),
    description: loc(
      "Як приєднатися до сервера та зробити перші кроки.",
      "Как подключиться к серверу и сделать первые шаги.",
      "How to join the server and take your first steps."
    ),
    content: loc(
      "## Як почати грати\n\n1. Додайте сервер **survivaland.top**\n2. Увійдіть у гру\n3. Виконайте стартові квести\n4. Отримайте перші ресурси\n\n### Корисні команди\n- `/spawn` — спавн\n- `/home` — додому\n- `/tpa <гравець>` — телепорт",
      "## Как начать играть\n\n1. Добавьте сервер **survivaland.top**\n2. Войдите в игру\n3. Выполните стартовые квесты\n4. Добудьте первые ресурсы\n\n### Полезные команды\n- `/spawn` — спавн\n- `/home` — домой\n- `/tpa <игрок>` — телепорт",
      "## How to start\n\n1. Add server **survivaland.top**\n2. Join the game\n3. Complete starter quests\n4. Gather first resources\n\n### Useful commands\n- `/spawn` — spawn\n- `/home` — home\n- `/tpa <player>` — teleport request"
    ),
    category: "getting-started",
    related: ["server-basics", "commands"],
    isDemo: true,
  },
  {
    id: "w2",
    slug: "server-basics",
    title: loc("Основи сервера", "Основы сервера", "Server basics"),
    description: loc(
      "Основні механіки та особливості SurvivaLand.",
      "Основные механики и особенности SurvivaLand.",
      "Core mechanics and features of SurvivaLand."
    ),
    content: loc(
      "## Основи SurvivaLand\n\nSurvivaLand — survival з PvP, економікою та спільнотою.\n\n### Режими\n- Survival\n- PvP-зони\n- Захист територій",
      "## Основы SurvivaLand\n\nSurvivaLand — survival с PvP, экономикой и сообществом.\n\n### Режимы\n- Survival\n- PvP-зоны\n- Защита территорий",
      "## SurvivaLand basics\n\nSurvivaLand is survival with PvP, economy, and community.\n\n### Modes\n- Survival\n- PvP zones\n- Land protection"
    ),
    category: "server-basics",
    related: ["getting-started", "economy"],
    isDemo: true,
  },
  {
    id: "w3",
    slug: "economy",
    title: loc("Економіка", "Экономика", "Economy"),
    description: loc(
      "Як працює валюта, магазини та торгівля.",
      "Как работают валюта, магазины и торговля.",
      "How currency, shops, and trading work."
    ),
    content: loc(
      "## Економіка\n\nВалюта — **Coins**.\n\n- Роботи та квести\n- NPC на спавні\n- `/pay`, аукціон",
      "## Экономика\n\nВалюта — **Coins**.\n\n- Работы и квесты\n- NPC на спавне\n- `/pay`, аукцион",
      "## Economy\n\nCurrency — **Coins**.\n\n- Jobs and quests\n- Spawn NPCs\n- `/pay`, auction"
    ),
    category: "economy",
    related: ["getting-started"],
    isDemo: true,
  },
  {
    id: "w4",
    slug: "commands",
    title: loc("Команди", "Команды", "Commands"),
    description: loc(
      "Список основних команд гравця.",
      "Список основных команд игрока.",
      "List of main player commands."
    ),
    content: loc(
      "## Команди\n\n- `/spawn`\n- `/sethome` / `/home`\n- `/tpa`\n- `/msg`\n- `/bal`",
      "## Команды\n\n- `/spawn`\n- `/sethome` / `/home`\n- `/tpa`\n- `/msg`\n- `/bal`",
      "## Commands\n\n- `/spawn`\n- `/sethome` / `/home`\n- `/tpa`\n- `/msg`\n- `/bal`"
    ),
    category: "commands",
    related: ["getting-started"],
    isDemo: true,
  },
]

export const DEMO_SHOP: ShopProduct[] = [
  {
    id: "s1",
    name: loc("VIP", "VIP", "VIP"),
    description: loc(
      "Базовий преміум-ранг з корисними бонусами.",
      "Базовый премиум-ранг с полезными бонусами.",
      "Entry premium rank with useful perks."
    ),
    benefits: locList(
      ["Префікс [VIP]", "+2 доміки", "Кольоровий чат", "Доступ до /fly на спавні"],
      ["Префикс [VIP]", "+2 дома", "Цветной чат", "Доступ к /fly на спавне"],
      ["[VIP] prefix", "+2 homes", "Colored chat", "/fly at spawn"]
    ),
    price: 149,
    currency: "UAH",
    category: "ranks",
    isDemo: true,
  },
  {
    id: "s2",
    name: loc("Premium", "Premium", "Premium"),
    description: loc(
      "Розширені можливості для активних гравців.",
      "Расширенные возможности для активных игроков.",
      "Extended perks for active players."
    ),
    benefits: locList(
      ["Префікс [Premium]", "+5 доміків", "Всі бонуси VIP", "Унікальні набори"],
      ["Префикс [Premium]", "+5 домов", "Все бонусы VIP", "Уникальные наборы"],
      ["[Premium] prefix", "+5 homes", "All VIP perks", "Unique kits"]
    ),
    price: 299,
    currency: "UAH",
    category: "ranks",
    isDemo: true,
  },
  {
    id: "s3",
    name: loc("Стартовий набір", "Стартовый набор", "Starter kit"),
    description: loc(
      "Корисні речі для швидкого старту.",
      "Полезные вещи для быстрого старта.",
      "Useful items for a quick start."
    ),
    benefits: locList(
      ["Залізний набір", "16 стейків", "Верстак", "Ліжко"],
      ["Железный набор", "16 стейков", "Верстак", "Кровать"],
      ["Iron gear", "16 steaks", "Crafting table", "Bed"]
    ),
    price: 49,
    currency: "UAH",
    category: "kits",
    isDemo: true,
  },
  {
    id: "s4",
    name: loc("Косметичний плащ", "Косметический плащ", "Cosmetic cape"),
    description: loc(
      "Унікальний плащ для вашого скіна.",
      "Уникальный плащ для вашего скина.",
      "A unique cape for your skin."
    ),
    benefits: locList(
      ["Ексклюзивний плащ", "Видимий усім гравцям"],
      ["Эксклюзивный плащ", "Виден всем игрокам"],
      ["Exclusive cape", "Visible to all players"]
    ),
    price: 99,
    currency: "UAH",
    category: "cosmetics",
    isDemo: true,
  },
]
