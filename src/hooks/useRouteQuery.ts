import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabase.client';
import { useRoutesStore } from '../store/useRoutesStore';
import { parsePostgisToCoordinates } from '../utils/geo.utils';
import { LatLng } from '../types/route.types';
import { C16_FALLBACK_COORDINATES } from '../constants/routes/c16Geometry';
import { C1_FALLBACK_COORDINATES } from '../constants/routes/c1Geometry';
import { C2_FALLBACK_COORDINATES } from '../constants/routes/c2Geometry';
import { C3_FALLBACK_COORDINATES } from '../constants/routes/c3Geometry';

const ROUTE_FALLBACKS: Record<string, LatLng[]> = {
  'route-c1': C1_FALLBACK_COORDINATES,
  'route-c2': C2_FALLBACK_COORDINATES,
  'route-c3': C3_FALLBACK_COORDINATES,
  'route-c16': C16_FALLBACK_COORDINATES,
};

export interface UseRouteQueryResult {
  coordinates: LatLng[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useRouteQuery(routeId: string = 'route-c16'): UseRouteQueryResult {
  const [coordinates, setCoordinates] = useState<LatLng[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const updateRouteCoordinates = useRoutesStore((s) => s.updateRouteCoordinates);

  const fetchRouteGeometry = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // 1. SELECT id, name, path FROM routes WHERE id = 'route-c16'
      const { data, error: supabaseError } = await supabase
        .from('routes')
        .select('id, name, path')
        .eq('id', routeId);

      console.log('Data cruda de Supabase:', data);

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      if (data && data.length > 0 && data[0].path) {
        const parsedCoords = parsePostgisToCoordinates(data[0].path);
        if (parsedCoords.length > 0) {
          setCoordinates(parsedCoords);
          updateRouteCoordinates(routeId, parsedCoords);
          return;
        }
      }

      // Si data está vacía por políticas de RLS de Supabase, cargar fallback OSRM
      const fallback = ROUTE_FALLBACKS[routeId];
      if (fallback && fallback.length > 0) {
        console.log(`[useRouteQuery] Fallback RLS activo: ${fallback.length} puntos OSRM renderizados para ${routeId}`);
        setCoordinates(fallback);
        updateRouteCoordinates(routeId, fallback);
      }
    } catch (err: any) {
      console.warn(`[useRouteQuery] Error cargando geometria para ${routeId}:`, err?.message || err);
      setError(err?.message || 'Error al obtener la ruta de Supabase');

      const fallback = ROUTE_FALLBACKS[routeId];
      if (fallback && fallback.length > 0) {
        setCoordinates(fallback);
        updateRouteCoordinates(routeId, fallback);
      }
    } finally {
      setIsLoading(false);
    }
  }, [routeId, updateRouteCoordinates]);

  useEffect(() => {
    fetchRouteGeometry();
  }, [fetchRouteGeometry]);

  return {
    coordinates,
    isLoading,
    error,
    refetch: fetchRouteGeometry,
  };
}
