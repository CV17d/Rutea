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

const warnDev = (msg: string, err: unknown) => {
  if (typeof __DEV__ !== 'undefined' && __DEV__) console.warn(msg, err);
};

/** Servicio de sincronización y caché local offline para catálogo y geometrías. */
export const syncService = {
  async getCachedRoutes(): Promise<TransitRoute[] | null> {
    try {
      const raw = await AsyncStorage.getItem(CACHE_KEYS.ROUTES_CATALOG);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) && parsed.length > 0 ? (parsed as TransitRoute[]) : null;
    } catch { return null; }
  },

  async getCachedGeometries(): Promise<Record<string, LatLng[]> | null> {
    try {
      const raw = await AsyncStorage.getItem(CACHE_KEYS.GEOMETRIES);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  },

  async saveRoutesToCache(routes: TransitRoute[]): Promise<void> {
    try {
      await AsyncStorage.setItem(CACHE_KEYS.ROUTES_CATALOG, JSON.stringify(routes));
      await AsyncStorage.setItem(CACHE_KEYS.LAST_SYNC, Date.now().toString());
    } catch (err) { warnDev('[SyncService] Error guardando rutas:', err); }
  },

  async saveGeometriesToCache(geometries: Record<string, LatLng[]>): Promise<void> {
    try {
      await AsyncStorage.setItem(CACHE_KEYS.GEOMETRIES, JSON.stringify(geometries));
    } catch (err) { warnDev('[SyncService] Error guardando geometrías:', err); }
  },

  /** Descarga en segundo plano el catálogo oficial (C1-E4) con fallback offline automático. */
  async syncRoutesCatalog(): Promise<SyncResult> {
    const timestamp = Date.now();
    try {
      const { data, error } = await supabase.from('routes').select('id, code, name, description, color, path');
      if (!error && data && data.length > 0) {
        const geometriesMap: Record<string, LatLng[]> = {};
        data.forEach((row: any) => {
          if (row.path) {
            const coords = parsePostgisToCoordinates(row.path);
            if (coords.length > 0) geometriesMap[row.id] = coords;
          }
        });

        const enrichedRoutes: TransitRoute[] = MOCK_PASTO_ROUTES.map((base) => {
          const remoteGeom = geometriesMap[base.id];
          return { ...base, coordinates: remoteGeom && remoteGeom.length > 0 ? remoteGeom : base.coordinates };
        });

        await this.saveRoutesToCache(enrichedRoutes);
        await this.saveGeometriesToCache(geometriesMap);
        useRoutesStore.getState().setRoutes(enrichedRoutes);
        useRoutesStore.getState().setOffline(false);

        return { success: true, count: enrichedRoutes.length, error: null, isOffline: false, timestamp };
      }
      return await this.loadOfflineFallback(timestamp);
    } catch {
      return await this.loadOfflineFallback(timestamp);
    }
  },

  /** Fallback offline: carga AsyncStorage o inicializa las 20 rutas SETPasto locales. */
  async loadOfflineFallback(timestamp: number): Promise<SyncResult> {
    const cached = await this.getCachedRoutes();
    if (cached && cached.length > 0) {
      useRoutesStore.getState().setRoutes(cached);
      useRoutesStore.getState().setOffline(true);
      return { success: true, count: cached.length, error: null, isOffline: true, timestamp };
    }

    const initializedRoutes: TransitRoute[] = MOCK_PASTO_ROUTES.map((route) => ({
      ...route,
      coordinates: ROUTE_FALLBACK_GEOMETRIES[route.id] || route.coordinates,
    }));

    await this.saveRoutesToCache(initializedRoutes);
    await this.saveGeometriesToCache(ROUTE_FALLBACK_GEOMETRIES);
    useRoutesStore.getState().setRoutes(initializedRoutes);
    useRoutesStore.getState().setOffline(true);

    return { success: true, count: initializedRoutes.length, error: null, isOffline: true, timestamp };
  },

  async clearCache(): Promise<void> {
    try {
      await Promise.all([
        AsyncStorage.removeItem(CACHE_KEYS.ROUTES_CATALOG),
        AsyncStorage.removeItem(CACHE_KEYS.GEOMETRIES),
        AsyncStorage.removeItem(CACHE_KEYS.LAST_SYNC),
      ]);
    } catch { /* Ignorar */ }
  },
};
