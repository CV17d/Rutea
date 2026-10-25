-- ========================================================
-- RUTEA: Migración inicial con PostGIS y tablas operativas
-- ========================================================

-- 1. Habilitar extensión PostGIS para tipos espaciales geometry(Point, 4326)
CREATE EXTENSION IF NOT EXISTS postgis;

-- 2. Tabla de rutas oficiales del transporte colectivo de San Juan de Pasto
CREATE TABLE IF NOT EXISTS routes (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#0284c7',
  polyline JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabla de paraderos con geometrías PostGIS
CREATE TABLE IF NOT EXISTS stops (
  id TEXT PRIMARY KEY,
  route_id TEXT REFERENCES routes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sequence INT NOT NULL DEFAULT 0,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  location GEOMETRY(Point, 4326),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tabla de sesiones activas de pasajeros emitiendo telemetría ("Estoy a bordo")
CREATE TABLE IF NOT EXISTS active_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  route_id TEXT REFERENCES routes(id) ON DELETE SET NULL,
  avatar_seed TEXT NOT NULL,
  alias TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  speed_kmh DOUBLE PRECISION DEFAULT 0,
  heading DOUBLE PRECISION DEFAULT 0,
  accuracy DOUBLE PRECISION DEFAULT 10,
  last_location GEOMETRY(Point, 4326),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Índices espaciales GiST para consultas de proximidad ultrarrápidas
CREATE INDEX IF NOT EXISTS idx_stops_location ON stops USING GIST(location);
CREATE INDEX IF NOT EXISTS idx_active_sessions_location ON active_sessions USING GIST(last_location);
CREATE INDEX IF NOT EXISTS idx_active_sessions_user_id ON active_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_active_sessions_route_id ON active_sessions(route_id);

-- 6. Trigger para sincronizar columna geometry a partir de (latitude, longitude)
CREATE OR REPLACE FUNCTION update_location_geometry()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.latitude IS NOT NULL AND NEW.longitude IS NOT NULL THEN
    NEW.location := ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_session_geometry()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.latitude IS NOT NULL AND NEW.longitude IS NOT NULL THEN
    NEW.last_location := ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326);
  END IF;
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_stops_location ON stops;
CREATE TRIGGER trg_stops_location
  BEFORE INSERT OR UPDATE ON stops
  FOR EACH ROW
  EXECUTE FUNCTION update_location_geometry();

DROP TRIGGER IF EXISTS trg_active_sessions_location ON active_sessions;
CREATE TRIGGER trg_active_sessions_location
  BEFORE INSERT OR UPDATE ON active_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_session_geometry();

-- 7. Datos de prueba iniciales (San Juan de Pasto)
INSERT INTO routes (id, code, name, color)
VALUES
  ('route-c1', 'C1', 'Catambuco - Torobajo', '#0284c7'),
  ('route-c16', 'C16', 'Chapal - Pandiaco', '#10b981'),
  ('route-e4', 'E4', 'Terminal - San Ezequiel', '#f59e0b')
ON CONFLICT (id) DO NOTHING;

INSERT INTO stops (id, route_id, name, sequence, latitude, longitude)
VALUES
  ('stop-c1-01', 'route-c1', 'Paradero Catambuco Sur', 1, 1.1732, -77.2845),
  ('stop-c1-02', 'route-c1', 'Paradero Chapal Centro', 2, 1.1980, -77.2790),
  ('stop-c1-03', 'route-c1', 'Paradero Plaza de Nariño', 3, 1.2145, -77.2783),
  ('stop-c1-04', 'route-c1', 'Paradero Udenar Torobajo', 4, 1.2312, -77.2918)
ON CONFLICT (id) DO NOTHING;
