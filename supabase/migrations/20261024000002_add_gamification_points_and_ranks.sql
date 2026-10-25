-- ========================================================
-- RUTEA: Gamificación, Rangos Locales y Recompensas
-- ========================================================

-- 1. Añadir columnas de puntos y rangos a active_sessions
ALTER TABLE active_sessions
  ADD COLUMN IF NOT EXISTS total_points INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS current_rank TEXT DEFAULT 'Cuy Novato',
  ADD COLUMN IF NOT EXISTS total_distance_meters DOUBLE PRECISION DEFAULT 0,
  ADD COLUMN IF NOT EXISTS session_start_time TIMESTAMPTZ DEFAULT NOW();

-- 2. Tabla de perfiles comunitarios persistentes
CREATE TABLE IF NOT EXISTS user_profiles (
  id TEXT PRIMARY KEY,
  alias TEXT NOT NULL,
  avatar_seed TEXT NOT NULL,
  total_points INT DEFAULT 0,
  current_rank TEXT DEFAULT 'Cuy Novato',
  distance_traveled_km DOUBLE PRECISION DEFAULT 0,
  reports_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Índices de rendimiento para tabla de clasificación (Leaderboard)
CREATE INDEX IF NOT EXISTS idx_active_sessions_points ON active_sessions(total_points DESC);
CREATE INDEX IF NOT EXISTS idx_user_profiles_points ON user_profiles(total_points DESC);
