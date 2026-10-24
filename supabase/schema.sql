-- SurvivaLand PostgreSQL / Supabase schema
-- Run in Supabase SQL Editor (Dashboard → SQL → New query).
-- Enable Email auth in Authentication → Providers.

-- ========== Profiles (extends auth.users) ==========
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  email TEXT,
  minecraft_username TEXT,
  avatar_url TEXT,
  language TEXT DEFAULT 'uk' CHECK (language IN ('uk', 'ru', 'en')),
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'moderator', 'editor', 'user')),
  notifications BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, username)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'username',
      split_part(NEW.email, '@', 1)
    )
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Helper: is staff (for RLS)
CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
      AND role IN ('admin', 'moderator', 'editor')
  );
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- ========== Minecraft players (plugin sync) ==========
CREATE TABLE IF NOT EXISTS players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  uuid TEXT UNIQUE,
  username TEXT UNIQUE NOT NULL,
  rank TEXT DEFAULT 'Гравець',
  first_joined TIMESTAMPTZ,
  last_seen TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS player_statistics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID REFERENCES players(id) ON DELETE CASCADE UNIQUE,
  playtime_minutes INTEGER DEFAULT 0,
  balance NUMERIC(14, 2) DEFAULT 0,
  kills INTEGER DEFAULT 0,
  deaths INTEGER DEFAULT 0,
  achievements_count INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ========== Content ==========
CREATE TABLE IF NOT EXISTS news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  category TEXT,
  author TEXT,
  image_url TEXT,
  published_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS wiki_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  category TEXT,
  related_slugs TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS shop_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  benefits JSONB DEFAULT '[]',
  price NUMERIC(10, 2) NOT NULL,
  currency TEXT DEFAULT 'UAH',
  category TEXT CHECK (category IN ('ranks', 'cosmetics', 'kits', 'special', 'bundles')),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  product_id UUID REFERENCES shop_products(id) ON DELETE SET NULL,
  amount NUMERIC(10, 2) NOT NULL,
  currency TEXT DEFAULT 'UAH',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
  provider TEXT,
  provider_ref TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reporter_username TEXT NOT NULL,
  target_username TEXT NOT NULL,
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'reviewing', 'resolved', 'dismissed')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO site_settings (key, value) VALUES
  ('server_ip', '"survivaland.top"'),
  ('version_range', '"1.17.1–1.21.11"'),
  ('current_version', '"1.21.11"'),
  ('slogan', '"Survival • Building • Community"'),
  ('discord_invite', '""'),
  ('maintenance_mode', 'false')
ON CONFLICT (key) DO NOTHING;

-- ========== RLS ==========
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE wiki_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE shop_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "Profiles: read own" ON profiles
  FOR SELECT USING (auth.uid() = id OR public.is_staff());
CREATE POLICY "Profiles: update own" ON profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Profiles: admin update role" ON profiles
  FOR UPDATE USING (public.is_admin());

-- Public content
CREATE POLICY "News: public read" ON news FOR SELECT USING (true);
CREATE POLICY "News: staff write" ON news FOR ALL USING (public.is_staff());

CREATE POLICY "Wiki: public read" ON wiki_articles FOR SELECT USING (true);
CREATE POLICY "Wiki: staff write" ON wiki_articles FOR ALL USING (public.is_staff());

CREATE POLICY "Shop: public read active" ON shop_products FOR SELECT USING (active = true OR public.is_staff());
CREATE POLICY "Shop: staff write" ON shop_products FOR ALL USING (public.is_staff());

CREATE POLICY "Players: public read" ON players FOR SELECT USING (true);
CREATE POLICY "Stats: public read" ON player_statistics FOR SELECT USING (true);

-- Orders
CREATE POLICY "Orders: own read" ON orders FOR SELECT USING (auth.uid() = user_id OR public.is_staff());
CREATE POLICY "Orders: insert own" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Reports
CREATE POLICY "Reports: staff all" ON reports FOR ALL USING (public.is_staff());
CREATE POLICY "Reports: insert authenticated" ON reports FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Site settings
CREATE POLICY "Settings: public read" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Settings: admin write" ON site_settings FOR ALL USING (public.is_admin());

-- ========== Promote first admin (run after signup) ==========
-- UPDATE profiles SET role = 'admin' WHERE email = 'your@email.com';
