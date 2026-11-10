import { useColorScheme } from 'react-native';
import { useSettingsStore, AppTheme } from '../store/useSettingsStore';

export interface AppThemeColors {
  isDark: boolean;
  themeSetting: AppTheme;
  effectiveTheme: 'light' | 'dark';
  bgRoot: string;
  cardBg: string;
  cardBorder: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  inputBg: string;
}

export function useAppTheme(): AppThemeColors {
  const themeSetting = useSettingsStore((s) => s.theme);
  const systemScheme = useColorScheme();

  const isDark =
    themeSetting === 'dark' || (themeSetting === 'system' && systemScheme === 'dark');
  const effectiveTheme: 'light' | 'dark' = isDark ? 'dark' : 'light';

  return {
    isDark,
    themeSetting,
    effectiveTheme,
    bgRoot: isDark ? '#070b13' : '#f8fafc',
    cardBg: isDark ? 'rgba(30, 41, 59, 0.94)' : 'rgba(255, 255, 255, 0.94)',
    cardBorder: isDark ? '#334155' : 'rgba(255, 255, 255, 0.98)',
    textPrimary: isDark ? '#f8fafc' : '#0f172a',
    textSecondary: isDark ? '#cbd5e1' : '#475569',
    textMuted: isDark ? '#94a3b8' : '#64748b',
    inputBg: isDark ? '#1e293b' : '#f1f5f9',
  };
}
