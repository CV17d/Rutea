import { MaterialCommunityIcons } from '@expo/vector-icons';

export interface UserProgressResult {
  currentRank: string;
  nextRank: string;
  pct: number;
  needed: number;
  badgeVectorIcon: keyof typeof MaterialCommunityIcons.glyphMap;
  badgeColor: string;
  badgeIcon?: string;
}

export function calculateProgress(points: number): UserProgressResult {
  if (points < 100) {
    const pct = Math.min(100, Math.max(0, Math.round((points / 100) * 100)));
    return {
      currentRank: 'Pasajero Novato',
      nextRank: 'Guía Local',
      pct,
      needed: 100 - points,
      badgeVectorIcon: 'sprout',
      badgeColor: '#10b981',
      badgeIcon: 'sprout',
    };
  }
  if (points < 500) {
    const pct = Math.min(100, Math.max(0, Math.round(((points - 100) / 400) * 100)));
    return {
      currentRank: 'Pasajero Frecuente',
      nextRank: 'Guía Local',
      pct,
      needed: 500 - points,
      badgeVectorIcon: 'compass-outline',
      badgeColor: '#38bdf8',
      badgeIcon: 'compass-outline',
    };
  }
  if (points < 1000) {
    const pct = Math.min(100, Math.max(0, Math.round(((points - 500) / 500) * 100)));
    return {
      currentRank: 'Guía Local',
      nextRank: 'Cuy Leyenda',
      pct,
      needed: 1000 - points,
      badgeVectorIcon: 'shield-star',
      badgeColor: '#f59e0b',
      badgeIcon: 'shield-star',
    };
  }
  return {
    currentRank: 'Cuy Leyenda',
    nextRank: 'Nivel Máximo',
    pct: 100,
    needed: 0,
    badgeVectorIcon: 'crown',
    badgeColor: '#eab308',
    badgeIcon: 'crown',
  };
}

export const PASTUSO_LEADERBOARD = [
  { pos: 1, icon: 'trophy' as const, iconColor: '#eab308', alias: 'Don_Pastuso99', pts: 1250 },
  { pos: 2, icon: 'medal' as const, iconColor: '#94a3b8', alias: 'CuyVeloz42', pts: 680 },
  { pos: 3, icon: 'medal-outline' as const, iconColor: '#cd7f32', alias: 'GalerasRunner19', pts: 320 },
];
