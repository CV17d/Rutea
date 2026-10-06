export const THEME = {
  colors: {
    bgDark: '#070b13',
    cardGlass: 'rgba(15, 23, 42, 0.72)',
    cardGlassLight: 'rgba(255, 255, 255, 0.08)',
    cardGlassBorder: 'rgba(255, 255, 255, 0.16)',
    cardGlassBorderHighlight: 'rgba(255, 255, 255, 0.35)',
    cardGlassHeader: 'rgba(10, 15, 29, 0.90)',
    
    // Status colors
    livePulse: '#10b981', // Emerald green
    liveBadgeBg: 'rgba(16, 185, 129, 0.20)',
    ghostBadgeBg: 'rgba(148, 163, 184, 0.20)',
    ghostColor: '#94a3b8',
    
    // High contrast accents
    textPrimary: '#ffffff',
    textSecondary: '#cbd5e1',
    textMuted: '#94a3b8',
    accentBlue: '#38bdf8',
    accentYellow: '#fbbf24',
    accentOrange: '#f97316',
    dangerRed: '#ef4444',
  },
  glassmorphism: {
    blurIntensity: 28,
    borderRadius: {
      card: 24,
      pill: 999,
      button: 16,
    },
    shadow: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.35,
      shadowRadius: 20,
      elevation: 8,
    },
  },
  typography: {
    fontExtraBold: '800',
    fontBold: '700',
    fontMedium: '500',
  }
};
