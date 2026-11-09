import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabase.client';
import { useRoutesStore } from '../store/useRoutesStore';
import { parsePostgisToCoordinates } from '../utils/geo.utils';
import { LatLng } from '../types/route.types';
import { ROUTE_FALLBACK_GEOMETRIES } from '../constants/routes/fallbackGeometries';

export interface UseRouteQueryResult {
  coordinates: LatLng[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useRouteQuery(routeId: string = ''): UseRouteQueryResult {
  const [coordinates, setCoordinates] = useState<LatLng[]>(() => {
    if (!routeId) return [];
    const storeRoute = useRoutesStore.getState().routes.find((r) => r.id === routeId);
    return storeRoute?.coordinates && storeRoute.coordinates.length > 0
      ? storeRoute.coordinates
      : ROUTE_FALLBACK_GEOMETRIES[routeId] || [];
  });
  const [isLoading, setIsLoading] = useState<boolean>(routeId ? coordinates.length === 0 : false);
  const [error, setError] = useState<string | null>(null);

  const updateRouteCoordinates = useRoutesStore((s) => s.updateRouteCoordinates);

  const fetchRouteGeometry = useCallback(async () => {
    if (!routeId) {
      setCoordinates([]);
      setIsLoading(false);
      return;
    }

    // Si ya tenemos coordenadas cacheadas, mantenerlas activas inmediatamente
    const cached = useRoutesStore.getState().routes.find((r) => r.id === routeId);
    if (cached?.coordinates && cached.coordinates.length > 0) {
      setCoordinates(cached.coordinates);
      setIsLoading(false);
    }

    try {
      const { data, error: supabaseError } = await supabase
        .from('routes')
        .select('id, name, path')
        .eq('id', routeId);

      if (!supabaseError && data && data.length > 0 && data[0].path) {
        const parsedCoords = parsePostgisToCoordinates(data[0].path);
        if (parsedCoords.length > 0) {
          setCoordinates(parsedCoords);
          updateRouteCoordinates(routeId, parsedCoords);
          return;
        }
      }

      // Fallback a geometrías locales si Supabase no responde o está offline
      const fallback = ROUTE_FALLBACK_GEOMETRIES[routeId];
      if (fallback && fallback.length > 0) {
        setCoordinates(fallback);
        updateRouteCoordinates(routeId, fallback);
      }
    } catch {
      // Manejar sin conexión (modo avión) sin lanzar errores de red
      const fallback = ROUTE_FALLBACK_GEOMETRIES[routeId];
      if (fallback && fallback.length > 0) {
        setCoordinates(fallback);
        updateRouteCoordinates(routeId, fallback);
      }
      setError(null);
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
