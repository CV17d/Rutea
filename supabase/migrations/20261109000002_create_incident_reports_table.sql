-- =====================================================================
-- MIGRACIÓN 20261109000002: Tabla de Reportes de Incidentes (Crowdsourcing)
-- Sistema de Transporte Inteligente SETPasto (Rutea)
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.incident_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('FULL_BUS', 'TRAFFIC', 'ACCIDENT', 'DETOUR')),
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índices de consulta rápida para optimizar el mapa en tiempo real
CREATE INDEX IF NOT EXISTS idx_incident_reports_route_id 
  ON public.incident_reports (route_id);

CREATE INDEX IF NOT EXISTS idx_incident_reports_created_at 
  ON public.incident_reports (created_at DESC);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.incident_reports ENABLE ROW LEVEL SECURITY;

-- Política de lectura: accesible para reportes activos de las últimas 2 horas
CREATE POLICY "Allow public read for recent incidents"
  ON public.incident_reports
  FOR SELECT
  USING (created_at >= now() - INTERVAL '2 hours');

-- Política de inserción: permitida para cualquier usuario autenticado o anónimo
CREATE POLICY "Allow public insert for incident reports"
  ON public.incident_reports
  FOR INSERT
  WITH CHECK (true);

-- Agregar la tabla a la publicación de Supabase Realtime
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
      AND schemaname = 'public' 
      AND tablename = 'incident_reports'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.incident_reports;
  END IF;
EXCEPTION
  WHEN undefined_object THEN
    NULL; -- Si supabase_realtime no está configurado en el entorno local
END $$;
