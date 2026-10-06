-- =====================================================================
-- SEED DATA PARA RUTAS PASTO (RUTEA) - POSTGIS GEOMETRIES
-- =====================================================================

-- 1. Insertar Rutas Oficiales de Pasto con LineString (Lon Lat)
INSERT INTO public.routes (id, code, name, color, description, direction, estimated_frequency_minutes, path_geometry)
VALUES 
(
    'route-c1', 'C1', 'Catambuco - Centro - Torobajo', '#10b981',
    'Corredor vial sur-norte conectando Catambuco con la U. de Nariño.', 'SUR_NORTE', 7,
    ST_GeomFromText('LINESTRING(-77.2845 1.1732, -77.2810 1.1850, -77.2790 1.1980, -77.2775 1.2085, -77.2783 1.2145, -77.2830 1.2210, -77.2890 1.2280, -77.2918 1.2312)', 4326)
),
(
    'route-c16', 'C16', 'Chapal - Plaza Carnaval - Pandiaco', '#38bdf8',
    'Ruta transversal central hacia la zona norte residencial de Pandiaco.', 'SUR_NORTE', 10,
    ST_GeomFromText('LINESTRING(-77.2760 1.1920, -77.2750 1.2010, -77.2778 1.2115, -77.2815 1.2205, -77.2855 1.2295)', 4326)
),
(
    'route-e1', 'E1', 'Aranda - Maridíaz - Torobajo', '#f59e0b',
    'Línea expresa oriental que conecta barrios altos con el corredor universitario.', 'NORTE_SUR', 12,
    ST_GeomFromText('LINESTRING(-77.2650 1.2240, -77.2720 1.2190, -77.2783 1.2145, -77.2860 1.2230, -77.2918 1.2312)', 4326)
),
(
    'route-e4', 'E4', 'Lorenzo - Terminal - San Ezequiel', '#ec4899',
    'Conexión directa entre Lorenzo de Aldana y Terminal de Transportes.', 'CIRCULAR', 15,
    ST_GeomFromText('LINESTRING(-77.2880 1.2050, -77.2662 1.2018, -77.2710 1.2150, -77.2840 1.2289)', 4326)
)
ON CONFLICT (id) DO NOTHING;

-- 2. Insertar Paraderos de la Ruta C1
INSERT INTO public.stops (id, route_id, name, order_index, estimated_wait_minutes, is_terminal, location_geometry)
VALUES
('s-c1-1', 'route-c1', 'Portal Catambuco', 1, 2, true, ST_SetSRID(ST_MakePoint(-77.2845, 1.1732), 4326)),
('s-c1-2', 'route-c1', 'Chapal Sur', 2, 5, false, ST_SetSRID(ST_MakePoint(-77.2790, 1.1980), 4326)),
('s-c1-3', 'route-c1', 'Plaza Nariño (Cra 25)', 3, 9, false, ST_SetSRID(ST_MakePoint(-77.2783, 1.2145), 4326)),
('s-c1-4', 'route-c1', 'Maridíaz Calle 18', 4, 13, false, ST_SetSRID(ST_MakePoint(-77.2830, 1.2210), 4326)),
('s-c1-5', 'route-c1', 'Universidad de Nariño Torobajo', 5, 18, true, ST_SetSRID(ST_MakePoint(-77.2918, 1.2312), 4326))
ON CONFLICT (id) DO NOTHING;

-- 3. Insertar Usuarios Semilla Pseudo-Anónimos
INSERT INTO public.users (id, alias, avatar_seed, points, level_title, total_distance_broadcast_km, total_time_broadcast_minutes)
VALUES
('a0000000-0000-0000-0000-000000000001', 'CuyVeloz42', 'cuy42', 340, 'Guía Mayor de Ruta', 45.8, 140),
('a0000000-0000-0000-0000-000000000002', 'GalerasRunner19', 'galeras19', 195, 'Vigía del Galeras', 28.5, 92),
('a0000000-0000-0000-0000-000000000003', 'VolcanGuia85', 'volcan85', 85, 'Vigía del Galeras', 14.2, 48)
ON CONFLICT (id) DO NOTHING;

-- 4. Insertar Reportes Viales Iniciales
INSERT INTO public.incident_reports (id, category, title, description, reporter_id, route_id, upvotes)
VALUES
('b0000000-0000-0000-0000-000000000001', 'TRAFFIC_JAM', 'Tráfico lento en Calle 18', 'Congestión vehicular por obras cerca a la Plaza del Carnaval.', 'a0000000-0000-0000-0000-000000000002', 'route-c1', 7),
('b0000000-0000-0000-0000-000000000002', 'DETOUR', 'Desvío temporal en Torobajo', 'Buses tomando carrera 30 por mantenimiento de vía.', 'a0000000-0000-0000-0000-000000000001', 'route-c16', 12)
ON CONFLICT (id) DO NOTHING;
