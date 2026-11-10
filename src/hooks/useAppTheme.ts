import { useColorScheme } from 'react-native';
import { useSettingsStore, AppTheme } from '../store/useSettingsStore';
import { getPalette, Palette } from '../constants/palette';

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
  palette: Palette;
}

export function useAppTheme(): AppThemeColors {
  const themeSetting = useSettingsStore((s) => s.theme);
  const systemScheme = useColorScheme();

  const isDark =
    themeSetting === 'dark' || (themeSetting === 'system' && systemScheme === 'dark');
  const effectiveTheme: 'light' | 'dark' = isDark ? 'dark' : 'light';

  const palette = getPalette(isDark);
  return {
    isDark,
    palette,
    themeSetting,
    effectiveTheme,
    bgRoot: palette.bg,
    cardBg: palette.surface,
    cardBorder: palette.line,
    textPrimary: palette.text,
    textSecondary: palette.text2,
    textMuted: palette.muted,
    inputBg: palette.raised,
  };
}
