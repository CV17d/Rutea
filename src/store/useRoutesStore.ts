import { create } from 'zustand';
import { TransitRoute, LatLng } from '../types/route.types';
import { MOCK_PASTO_ROUTES } from '../constants/mockRoutes';

interface RoutesState {
  routes: TransitRoute[];
  selectedRouteId: string | null;
  searchQuery: string;
  selectRoute: (routeId: string | null) => void;
  setSearchQuery: (query: string) => void;
  getSelectedRoute: () => TransitRoute | undefined;
  getFilteredRoutes: () => TransitRoute[];
  updateRouteCoordinates: (routeId: string, coordinates: LatLng[]) => void;
}

export const useRoutesStore = create<RoutesState>((set, get) => ({
  routes: MOCK_PASTO_ROUTES,
  selectedRouteId: 'route-c16', // Por defecto seleccionada Ruta C16 (Anganoy - Cabrera)
  searchQuery: '',

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
    return routes.find(r => r.id === selectedRouteId);
  },

  getFilteredRoutes: () => {
    const { routes, searchQuery } = get();
    if (!searchQuery.trim()) return routes;
    const lower = searchQuery.toLowerCase();
    return routes.filter(
      r =>
        r.code.toLowerCase().includes(lower) ||
        r.name.toLowerCase().includes(lower) ||
        r.description.toLowerCase().includes(lower)
    );
  },
}));
