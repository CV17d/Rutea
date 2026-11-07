import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabase.client';
import { useRoutesStore } from '../store/useRoutesStore';
import { parsePostgisToCoordinates } from '../utils/geo.utils';
import { LatLng } from '../types/route.types';

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
    } catch (err: any) {
      console.warn(`[useRouteQuery] Error cargando geometria para ${routeId}:`, err?.message || err);
      setError(err?.message || 'Error al obtener la ruta de Supabase');
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
