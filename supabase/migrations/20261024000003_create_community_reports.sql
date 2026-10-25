-- ========================================================
-- RUTEA: Reportes Comunitarios Georreferenciados (45 min)
-- ========================================================

CREATE TABLE IF NOT EXISTS community_reports (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  route_id TEXT NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
  report_type TEXT NOT NULL, -- 'TRAFFIC', 'ROAD_CLOSED', 'BUS_FULL'
  title TEXT NOT NULL,
  description TEXT,
  reporter_alias TEXT NOT NULL,
  reporter_avatar_seed TEXT,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  location GEOMETRY(Point, 4326),
  upvotes INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '45 minutes')
);

-- Trigger para sincronizar geometría de reportes
CREATE OR REPLACE FUNCTION update_report_geometry()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.latitude IS NOT NULL AND NEW.longitude IS NOT NULL THEN
    NEW.location := ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_report_location ON community_reports;
CREATE TRIGGER trg_report_location
  BEFORE INSERT OR UPDATE ON community_reports
  FOR EACH ROW
  EXECUTE FUNCTION update_report_geometry();

-- Índices espaciales GiST y de expiración
CREATE INDEX IF NOT EXISTS idx_reports_location ON community_reports USING GIST(location);
CREATE INDEX IF NOT EXISTS idx_reports_route_id ON community_reports(route_id);
CREATE INDEX IF NOT EXISTS idx_reports_expires_at ON community_reports(expires_at);

-- Vista de reportes activos no vencidos
CREATE OR REPLACE VIEW active_community_reports AS
SELECT * FROM community_reports
WHERE expires_at > NOW();
