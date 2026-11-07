-- ========================================================
-- RUTEA: Habilitar lectura pública (RLS) en tabla routes
-- Permite que clientes móviles con anon_key consulten rutas y geometrías
-- ========================================================

-- 1. Asegurar que RLS esté activo
ALTER TABLE routes ENABLE ROW LEVEL SECURITY;

-- 2. Crear política permisiva para SELECT en la tabla routes (lectura pública)
DROP POLICY IF EXISTS "Permitir lectura publica de rutas" ON routes;
DROP POLICY IF EXISTS "public_read_routes" ON routes;

CREATE POLICY "public_read_routes"
ON routes
FOR SELECT
TO anon, authenticated
USING (true);
