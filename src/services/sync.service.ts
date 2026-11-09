import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './supabase.client';
import { TransitRoute, LatLng } from '../types/route.types';
import { MOCK_PASTO_ROUTES } from '../constants/mockRoutes';
import { ROUTE_FALLBACK_GEOMETRIES } from '../constants/routes/fallbackGeometries';
import { parsePostgisToCoordinates } from '../utils/geo.utils';
import { useRoutesStore } from '../store/useRoutesStore';

export const CACHE_KEYS = {
  ROUTES_CATALOG: '@rutea/routes_catalog_v1',
  GEOMETRIES: '@rutea/geometries_v1',
  LAST_SYNC: '@rutea/last_sync_timestamp',
};

export interface SyncResult {
  success: boolean;
  count: number;
  error: string | null;
  isOffline: boolean;
  timestamp: number;
}

/**
 * Servicio de Sincronización y Caché Local Offline para Catálogo y Geometrías
 */
export const syncService = {
  /**
   * Obtiene el catálogo de rutas guardado en AsyncStorage
   */
  async getCachedRoutes(): Promise<TransitRoute[] | null> {
    try {
      const raw = await AsyncStorage.getItem(CACHE_KEYS.ROUTES_CATALOG);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) && parsed.length > 0 ? (parsed as TransitRoute[]) : null;
    } catch {
      return null;
    }
  },

  /**
   * Obtiene las geometrías de rutas guardadas en AsyncStorage
   */
  async getCachedGeometries(): Promise<Record<string, LatLng[]> | null> {
    try {
      const raw = await AsyncStorage.getItem(CACHE_KEYS.GEOMETRIES);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  /**
   * Guarda rutas en almacenamiento local
   */
  async saveRoutesToCache(routes: TransitRoute[]): Promise<void> {
    try {
      await AsyncStorage.setItem(CACHE_KEYS.ROUTES_CATALOG, JSON.stringify(routes));
      await AsyncStorage.setItem(CACHE_KEYS.LAST_SYNC, Date.now().toString());
    } catch (err) {
      console.warn('[SyncService] Error guardando rutas en caché:', err);
    }
  },

  /**
   * Guarda geometrías en almacenamiento local
   */
  async saveGeometriesToCache(geometries: Record<string, LatLng[]>): Promise<void> {
    try {
      await AsyncStorage.setItem(CACHE_KEYS.GEOMETRIES, JSON.stringify(geometries));
    } catch (err) {
      console.warn('[SyncService] Error guardando geometrías en caché:', err);
    }
  },

  /**
   * Descarga silenciosa en segundo plano del catálogo oficial (C1 a E4) y coordenadas PostGIS
   */
  async syncRoutesCatalog(): Promise<SyncResult> {
    const timestamp = Date.now();

    try {
      // 1. Intentar descargar desde Supabase
      const { data, error } = await supabase
        .from('routes')
        .select('id, code, name, description, color, path');

      if (!error && data && data.length > 0) {
        const geometriesMap: Record<string, LatLng[]> = {};

        // Mapear geometrías PostGIS parseadas
        data.forEach((row: any) => {
          if (row.path) {
            const coords = parsePostgisToCoordinates(row.path);
            if (coords.length > 0) {
              geometriesMap[row.id] = coords;
            }
          }
        });

        // Combinar con paraderos oficiales de MOCK_PASTO_ROUTES
        const enrichedRoutes: TransitRoute[] = MOCK_PASTO_ROUTES.map((baseRoute) => {
          const remoteGeom = geometriesMap[baseRoute.id];
          return {
            ...baseRoute,
            coordinates: remoteGeom && remoteGeom.length > 0 ? remoteGeom : baseRoute.coordinates,
          };
        });

        await this.saveRoutesToCache(enrichedRoutes);
        await this.saveGeometriesToCache(geometriesMap);

        useRoutesStore.getState().setRoutes(enrichedRoutes);
        useRoutesStore.getState().setOffline(false);

        return {
          success: true,
          count: enrichedRoutes.length,
          error: null,
          isOffline: false,
          timestamp,
        };
      }

      // Si Supabase devuelve error de red o vacío (modo offline/avión):
      return await this.loadOfflineFallback(timestamp);
    } catch (err: any) {
      // Manejar modo avión o sin red sin lanzar errores no controlados
      return await this.loadOfflineFallback(timestamp);
    }
  },

  /**
   * Fallback offline: Carga la caché local de AsyncStorage o inicializa con las 20 rutas SETPasto
   */
  async loadOfflineFallback(timestamp: number): Promise<SyncResult> {
    const cached = await this.getCachedRoutes();
    if (cached && cached.length > 0) {
      useRoutesStore.getState().setRoutes(cached);
      useRoutesStore.getState().setOffline(true);
      return {
        success: true,
        count: cached.length,
        error: null,
        isOffline: true,
        timestamp,
      };
    }

    // Inicializar caché con las 20 rutas oficiales completas (C1-E4) y geometrías OSRM
    const initializedRoutes: TransitRoute[] = MOCK_PASTO_ROUTES.map((route) => ({
      ...route,
      coordinates: ROUTE_FALLBACK_GEOMETRIES[route.id] || route.coordinates,
    }));

    await this.saveRoutesToCache(initializedRoutes);
    await this.saveGeometriesToCache(ROUTE_FALLBACK_GEOMETRIES);

    useRoutesStore.getState().setRoutes(initializedRoutes);
    useRoutesStore.getState().setOffline(true);

    return {
      success: true,
      count: initializedRoutes.length,
      error: null,
      isOffline: true,
      timestamp,
    };
  },

  /**
   * Limpia la caché local (útil para pruebas y reseteo)
   */
  async clearCache(): Promise<void> {
    try {
      await Promise.all([
        AsyncStorage.removeItem(CACHE_KEYS.ROUTES_CATALOG),
        AsyncStorage.removeItem(CACHE_KEYS.GEOMETRIES),
        AsyncStorage.removeItem(CACHE_KEYS.LAST_SYNC),
      ]);
    } catch {
      // Ignorar
    }
  },
};
