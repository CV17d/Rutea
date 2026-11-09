import { create } from 'zustand';
import { authService, UserSessionData } from '../services/auth.service';

interface AuthState {
  user: UserSessionData | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  isLoading: boolean;
  error: string | null;
  favoriteRouteIds: string[];
  favoriteStopIds: string[];
  points: number;

  loginWithEmail: (email: string, pass: string) => Promise<boolean>;
  registerWithEmail: (email: string, pass: string, name?: string) => Promise<boolean>;
  loginAsGuest: () => Promise<void>;
  logout: () => Promise<void>;
  toggleFavoriteRoute: (routeId: string) => void;
  isFavoriteRoute: (routeId: string) => boolean;
  toggleFavoriteStop: (stopId: string) => void;
  isFavoriteStop: (stopId: string) => boolean;
  addPoints: (amount: number) => void;
  clearError: () => void;
  restoreSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isGuest: false,
  isLoading: false,
  error: null,
  favoriteRouteIds: ['route-c16', 'route-c1'], // Rutas favoritas por defecto para explorar
  favoriteStopIds: [],
  points: 85,

  loginWithEmail: async (email: string, pass: string) => {
    set({ isLoading: true, error: null });
    const res = await authService.signIn(email, pass);
    if (res.error || !res.data) {
      set({ isLoading: false, error: res.error || 'Credenciales inválidas' });
      return false;
    }
    set({
      user: res.data,
      isAuthenticated: true,
      isGuest: false,
      isLoading: false,
      error: null,
    });
    return true;
  },

  registerWithEmail: async (email: string, pass: string, name?: string) => {
    set({ isLoading: true, error: null });
    const res = await authService.signUp(email, pass, name);
    if (res.error || !res.data) {
      set({ isLoading: false, error: res.error || 'No se pudo crear la cuenta' });
      return false;
    }
    set({
      user: res.data,
      isAuthenticated: true,
      isGuest: false,
      isLoading: false,
      error: null,
    });
    return true;
  },

  loginAsGuest: async () => {
    set({ isLoading: true, error: null });
    const res = await authService.signInAnonymously();
    const guestUser = res.data || {
      id: `guest-${Date.now()}`,
      email: null,
      displayName: 'Pasajero Invitado',
      avatarSeed: 'guest-seed',
      isGuest: true,
    };
    set({
      user: guestUser,
      isAuthenticated: true,
      isGuest: true,
      isLoading: false,
      error: null,
    });
  },

  logout: async () => {
    set({ isLoading: true });
    await authService.signOut();
    set({
      user: null,
      isAuthenticated: false,
      isGuest: false,
      isLoading: false,
      error: null,
    });
  },

  toggleFavoriteRoute: (routeId: string) => {
    set((state) => {
      const exists = state.favoriteRouteIds.includes(routeId);
      const updated = exists
        ? state.favoriteRouteIds.filter((id) => id !== routeId)
        : [...state.favoriteRouteIds, routeId];
      return { favoriteRouteIds: updated };
    });
  },

  isFavoriteRoute: (routeId: string) => {
    return get().favoriteRouteIds.includes(routeId);
  },

  toggleFavoriteStop: (stopId: string) => {
    set((state) => {
      const exists = state.favoriteStopIds.includes(stopId);
      const updated = exists
        ? state.favoriteStopIds.filter((id) => id !== stopId)
        : [...state.favoriteStopIds, stopId];
      return { favoriteStopIds: updated };
    });
  },

  isFavoriteStop: (stopId: string) => {
    return get().favoriteStopIds.includes(stopId);
  },

  addPoints: (amount: number) => {
    set((state) => ({ points: state.points + amount }));
  },

  clearError: () => {
    set({ error: null });
  },

  restoreSession: async () => {
    try {
      const sessionData = await authService.getCurrentSession();
      if (sessionData) {
        set({
          user: sessionData,
          isAuthenticated: true,
          isGuest: sessionData.isGuest,
        });
      }
    } catch {
      // Ignorar fallback silencioso
    }
  },
}));
