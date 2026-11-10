import { create } from 'zustand';

export type AppTheme = 'light' | 'dark' | 'system';
export type AppLanguage = 'es' | 'en';

interface SettingsState {
  theme: AppTheme;
  language: AppLanguage;
  hapticsEnabled: boolean;
  proximityRadiusMeters: number;
  setTheme: (theme: AppTheme) => void;
  setLanguage: (lang: AppLanguage) => void;
  setHapticsEnabled: (enabled: boolean) => void;
  setProximityRadiusMeters: (radius: number) => void;
  clearAppCache: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  theme: 'system',
  language: 'es',
  hapticsEnabled: true,
  proximityRadiusMeters: 400,
  setTheme: (theme) => set({ theme }),
  setLanguage: (language) => set({ language }),
  setHapticsEnabled: (hapticsEnabled) => set({ hapticsEnabled }),
  setProximityRadiusMeters: (proximityRadiusMeters) => set({ proximityRadiusMeters }),
  clearAppCache: async () => {
    // Purga simulada de caché en memoria y persistente
    await new Promise((r) => setTimeout(r, 400));
  },
}));
