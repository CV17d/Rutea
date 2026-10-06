import { create } from 'zustand';
import { TransitRoute } from '../types/route.types';
import { MOCK_PASTO_ROUTES } from '../constants/mockRoutes';

interface RoutesState {
  routes: TransitRoute[];
  selectedRouteId: string | null;
  searchQuery: string;
  selectRoute: (routeId: string | null) => void;
  setSearchQuery: (query: string) => void;
  getSelectedRoute: () => TransitRoute | undefined;
  getFilteredRoutes: () => TransitRoute[];
}

export const useRoutesStore = create<RoutesState>((set, get) => ({
  routes: MOCK_PASTO_ROUTES,
  selectedRouteId: 'route-c1', // Por defecto seleccionada Ruta C1
  searchQuery: '',

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
