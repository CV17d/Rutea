-- =====================================================================
-- MIGRACIÓN 20261109000003: Columna points y Gamificación Comunitaria
-- =====================================================================

-- 1. Añadir columna points (entero, default 0) a user_profiles
ALTER TABLE IF EXISTS public.user_profiles
  ADD COLUMN IF NOT EXISTS points INT DEFAULT 0;

-- Sincronizar points con total_points si ya contenía registros previos
UPDATE public.user_profiles
  SET points = COALESCE(total_points, 0)
  WHERE points = 0 AND total_points > 0;

-- 2. Función RPC para incrementar puntos de usuario de forma atómica (+10 por reporte)
CREATE OR REPLACE FUNCTION public.increment_user_points(
  target_user_id TEXT,
  points_to_add INT DEFAULT 10
)
RETURNS INT AS $$
DECLARE
  updated_points INT;
BEGIN
  INSERT INTO public.user_profiles (id, alias, avatar_seed, points, total_points)
  VALUES (target_user_id, 'Pasajero Pastuso', target_user_id, points_to_add, points_to_add)
  ON CONFLICT (id) DO UPDATE
  SET points = COALESCE(user_profiles.points, 0) + points_to_add,
      total_points = COALESCE(user_profiles.total_points, 0) + points_to_add,
      updated_at = now()
  RETURNING points INTO updated_points;

  RETURN updated_points;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
