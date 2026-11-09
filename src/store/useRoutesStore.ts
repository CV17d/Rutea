import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TransitRoute, LatLng } from '../types/route.types';
import { MOCK_PASTO_ROUTES } from '../constants/mockRoutes';
import { CACHE_KEYS } from '../services/sync.service';

interface RoutesState {
  routes: TransitRoute[];
  selectedRouteId: string | null;
  searchQuery: string;
  isOffline: boolean;
  isCacheLoaded: boolean;
  selectRoute: (routeId: string | null) => void;
  setSearchQuery: (query: string) => void;
  getSelectedRoute: () => TransitRoute | undefined;
  getFilteredRoutes: () => TransitRoute[];
  updateRouteCoordinates: (routeId: string, coordinates: LatLng[]) => void;
  setRoutes: (routes: TransitRoute[]) => void;
  setOffline: (offline: boolean) => void;
  loadLocalCache: () => Promise<void>;
}

export const useRoutesStore = create<RoutesState>((set, get) => ({
  routes: MOCK_PASTO_ROUTES,
  selectedRouteId: 'route-c16',
  searchQuery: '',
  isOffline: false,
  isCacheLoaded: false,

  setRoutes: (routes: TransitRoute[]) => {
    set({ routes, isCacheLoaded: true });
  },

  setOffline: (isOffline: boolean) => {
    set({ isOffline });
  },

  loadLocalCache: async () => {
    try {
      const raw = await AsyncStorage.getItem(CACHE_KEYS.ROUTES_CATALOG);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          set({ routes: parsed, isCacheLoaded: true });
          return;
        }
      }
    } catch {
      // Ignorar fallback silencioso
    }
  },

  updateRouteCoordinates: (routeId: string, coordinates: LatLng[]) => {
    set((state) => ({
      routes: state.routes.map((r) =>
        r.id === routeId ? { ...r, coordinates } : r
      ),
    }));
  },

  selectRoute: (routeId: string | null) => {
    set({ selectedRouteId: routeId });
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  getSelectedRoute: () => {
    const { routes, selectedRouteId } = get();
    return routes.find((r) => r.id === selectedRouteId);
  },

  getFilteredRoutes: () => {
    const { routes, searchQuery } = get();
    if (!searchQuery.trim()) return routes;
    const lower = searchQuery.toLowerCase();
    return routes.filter(
      (r) =>
        r.code.toLowerCase().includes(lower) ||
        r.name.toLowerCase().includes(lower) ||
        r.description.toLowerCase().includes(lower)
    );
  },
}));

// Inicializar lectura de caché local de forma asíncrona inmediata
useRoutesStore.getState().loadLocalCache();
