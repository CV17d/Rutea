-- =====================================================================
-- ESQUEMA POSTGRESQL + POSTGIS PARA RUTAS PASTO (RUTEA) - SUPABASE
-- =====================================================================

-- 1. Habilitar extensión espacial PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;

-- 2. Tabla de Usuarios Pseudo-Anónimos y Gamificación
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alias VARCHAR(50) NOT NULL UNIQUE,
    avatar_seed VARCHAR(100) NOT NULL,
    points INTEGER NOT NULL DEFAULT 0,
    level_title VARCHAR(60) NOT NULL DEFAULT 'Caminante de Pasto',
    total_distance_broadcast_km NUMERIC(10, 2) DEFAULT 0.0,
    total_time_broadcast_minutes INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Tabla de Rutas de Transporte de Pasto
CREATE TABLE IF NOT EXISTS public.routes (
    id VARCHAR(50) PRIMARY KEY,
    code VARCHAR(10) NOT NULL UNIQUE, -- ej: 'C1', 'C16', 'E1', 'E4'
    name VARCHAR(150) NOT NULL,
    color VARCHAR(20) NOT NULL DEFAULT '#10b981',
    description TEXT,
    direction VARCHAR(30) NOT NULL DEFAULT 'SUR_NORTE',
    estimated_frequency_minutes INTEGER NOT NULL DEFAULT 10,
    path_geometry GEOMETRY(LineString, 4326) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_routes_geom ON public.routes USING GIST (path_geometry);

-- 4. Tabla de Paraderos Oficiales
CREATE TABLE IF NOT EXISTS public.stops (
    id VARCHAR(50) PRIMARY KEY,
    route_id VARCHAR(50) NOT NULL REFERENCES public.routes(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    order_index INTEGER NOT NULL,
    estimated_wait_minutes INTEGER NOT NULL DEFAULT 5,
    is_terminal BOOLEAN NOT NULL DEFAULT FALSE,
    location_geometry GEOMETRY(Point, 4326) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_stops_geom ON public.stops USING GIST (location_geometry);
CREATE INDEX IF NOT EXISTS idx_stops_route_id ON public.stops (route_id);

-- 5. Tabla de Telemetría GPS Cruda y Proyectada
CREATE TABLE IF NOT EXISTS public.telemetry_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    route_id VARCHAR(50) NOT NULL REFERENCES public.routes(id) ON DELETE CASCADE,
    raw_location GEOMETRY(Point, 4326) NOT NULL,
    snapped_location GEOMETRY(Point, 4326),
    accuracy NUMERIC(6, 2) NOT NULL,
    speed_kmh NUMERIC(6, 2) NOT NULL DEFAULT 0,
    heading NUMERIC(6, 2) NOT NULL DEFAULT 0,
    distance_to_route_meters NUMERIC(8, 2),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_telemetry_created_at ON public.telemetry_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_telemetry_geom ON public.telemetry_logs USING GIST (raw_location);

-- 6. Tabla de Reportes Comunitarios
CREATE TABLE IF NOT EXISTS public.incident_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category VARCHAR(40) NOT NULL, -- 'TRAFFIC_JAM', 'DETOUR', 'ROAD_BLOCK', 'ACCIDENT'
    title VARCHAR(150) NOT NULL,
    description TEXT,
    reporter_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    route_id VARCHAR(50) REFERENCES public.routes(id) ON DELETE SET NULL,
    location_geometry GEOMETRY(Point, 4326),
    upvotes INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Función de proyección ortogonal espacial de telemetría (Snap-to-route)
CREATE OR REPLACE FUNCTION public.snap_telemetry_to_route(
    p_route_id VARCHAR(50),
    p_lat NUMERIC,
    p_lng NUMERIC
) RETURNS TABLE(
    snapped_lat DOUBLE PRECISION,
    snapped_lng DOUBLE PRECISION,
    distance_meters DOUBLE PRECISION
) AS $$
DECLARE
    v_raw_point GEOMETRY(Point, 4326);
    v_route_line GEOMETRY;
    v_snapped_point GEOMETRY;
    v_dist DOUBLE PRECISION;
BEGIN
    v_raw_point := ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326);
    SELECT path_geometry INTO v_route_line FROM public.routes WHERE id = p_route_id;
    
    IF v_route_line IS NULL THEN
        RETURN;
    END IF;

    v_snapped_point := ST_ClosestPoint(v_route_line, v_raw_point);
    v_dist := ST_Distance(v_raw_point::geography, v_snapped_point::geography);

    RETURN QUERY
    SELECT 
        ST_Y(v_snapped_point) AS snapped_lat,
        ST_X(v_snapped_point) AS snapped_lng,
        v_dist AS distance_meters;
END;
$$ LANGUAGE plpgsql;
