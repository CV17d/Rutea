-- ========================================================
-- RUTEA: Motor de Recomendación Origen-Destino con PostGIS (find_best_routes RPC)
-- ========================================================

-- 1. Asegurar tabla stops y tipos espaciales
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

CREATE INDEX IF NOT EXISTS idx_stops_location ON stops USING GIST(location);
CREATE INDEX IF NOT EXISTS idx_stops_route_id ON stops(route_id);

-- 2. Función RPC para recomendación de rutas óptimas
CREATE OR REPLACE FUNCTION find_best_routes(
  origin_lat DOUBLE PRECISION,
  origin_lng DOUBLE PRECISION,
  dest_lat DOUBLE PRECISION,
  dest_lng DOUBLE PRECISION,
  radius_meters DOUBLE PRECISION DEFAULT 1000
)
RETURNS TABLE (
  route_id TEXT,
  route_code TEXT,
  route_name TEXT,
  route_color TEXT,
  origin_stop_id TEXT,
  origin_stop_name TEXT,
  origin_stop_lat DOUBLE PRECISION,
  origin_stop_lng DOUBLE PRECISION,
  dest_stop_id TEXT,
  dest_stop_name TEXT,
  dest_stop_lat DOUBLE PRECISION,
  dest_stop_lng DOUBLE PRECISION,
  walking_distance_meters DOUBLE PRECISION,
  dest_walking_distance_meters DOUBLE PRECISION
) AS $$
DECLARE
  orig_geom GEOMETRY;
  dest_geom GEOMETRY;
BEGIN
  orig_geom := ST_SetSRID(ST_MakePoint(origin_lng, origin_lat), 4326);
  dest_geom := ST_SetSRID(ST_MakePoint(dest_lng, dest_lat), 4326);

  RETURN QUERY
  SELECT
    r.id AS route_id,
    COALESCE(r.code, '') AS route_code,
    r.name AS route_name,
    COALESCE(r.color, '#0284c7') AS route_color,
    s_orig.id AS origin_stop_id,
    s_orig.name AS origin_stop_name,
    s_orig.latitude AS origin_stop_lat,
    s_orig.longitude AS origin_stop_lng,
    s_dest.id AS dest_stop_id,
    s_dest.name AS dest_stop_name,
    s_dest.latitude AS dest_stop_lat,
    s_dest.longitude AS dest_stop_lng,
    ROUND(ST_DistanceSphere(s_orig.location, orig_geom)::numeric, 1)::DOUBLE PRECISION AS walking_distance_meters,
    ROUND(ST_DistanceSphere(s_dest.location, dest_geom)::numeric, 1)::DOUBLE PRECISION AS dest_walking_distance_meters
  FROM stops s_orig
  INNER JOIN stops s_dest
    ON s_orig.route_id = s_dest.route_id
    AND s_orig.sequence < s_dest.sequence
  INNER JOIN routes r
    ON r.id = s_orig.route_id
  WHERE
    ST_DWithin(s_orig.location::geography, orig_geom::geography, radius_meters)
    AND ST_DWithin(s_dest.location::geography, dest_geom::geography, radius_meters)
    AND r.is_active = TRUE
  ORDER BY
    walking_distance_meters ASC,
    dest_walking_distance_meters ASC;
END;
$$ LANGUAGE plpgsql STABLE;

GRANT EXECUTE ON FUNCTION find_best_routes TO anon, authenticated, service_role;
