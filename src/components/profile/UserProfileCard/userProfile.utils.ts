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

export interface LeaderboardRival {
  id: string;
  alias: string;
  pts: number;
}

export interface DynamicLeaderboardEntry {
  pos: number;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  iconColor: string;
  alias: string;
  pts: number;
  isUser: boolean;
}

export const PREDEFINED_RIVALS: LeaderboardRival[] = [
  { id: 'rival-1', alias: 'Don_Pastuso99', pts: 1250 },
  { id: 'rival-2', alias: 'CuyVeloz42', pts: 680 },
  { id: 'rival-3', alias: 'Galeras Runner', pts: 320 },
];

export function calculateRank(points: number): string {
  if (points < 100) return 'Pasajero Novato';
  if (points < 500) return 'Pasajero Frecuente';
  if (points < 1000) return 'Guía Local';
  return 'Cuy Leyenda';
}

export function calculateUserPosition(points: number): number {
  return PREDEFINED_RIVALS.filter((r) => r.pts > points).length + 1;
}

export function calculateProgress(points: number): UserProgressResult {
  const currentRank = calculateRank(points);
  if (points < 100) {
    return {
      currentRank,
      nextRank: 'Guía Local',
      pct: Math.min(100, Math.max(0, Math.round((points / 100) * 100))),
      needed: 100 - points,
      badgeVectorIcon: 'sprout',
      badgeColor: '#10b981',
      badgeIcon: 'sprout',
    };
  }
  if (points < 500) {
    return {
      currentRank,
      nextRank: 'Guía Local',
      pct: Math.min(100, Math.max(0, Math.round(((points - 100) / 400) * 100))),
      needed: 500 - points,
      badgeVectorIcon: 'compass-outline',
      badgeColor: '#38bdf8',
      badgeIcon: 'compass-outline',
    };
  }
  if (points < 1000) {
    return {
      currentRank,
      nextRank: 'Cuy Leyenda',
      pct: Math.min(100, Math.max(0, Math.round(((points - 500) / 500) * 100))),
      needed: 1000 - points,
      badgeVectorIcon: 'shield-star',
      badgeColor: '#f59e0b',
      badgeIcon: 'shield-star',
    };
  }
  return {
    currentRank,
    nextRank: 'Nivel Máximo',
    pct: 100,
    needed: 0,
    badgeVectorIcon: 'crown',
    badgeColor: '#eab308',
    badgeIcon: 'crown',
  };
}

export function calculateLeaderboard(
  userPoints: number,
  userAlias: string = 'Tú',
  userBadgeIcon: keyof typeof MaterialCommunityIcons.glyphMap = 'sprout'
): DynamicLeaderboardEntry[] {
  const combined = [
    ...PREDEFINED_RIVALS.map((r) => ({ alias: r.alias, pts: r.pts, isUser: false })),
    { alias: `${userAlias} (Tú)`, pts: userPoints, isUser: true },
  ].sort((a, b) => b.pts - a.pts);

  return combined.map((entry, idx) => {
    const pos = idx + 1;
    let icon: keyof typeof MaterialCommunityIcons.glyphMap = 'account-outline';
    let iconColor = '#64748b';

    if (pos === 1) {
      icon = 'trophy';
      iconColor = '#eab308';
    } else if (pos === 2) {
      icon = 'medal';
      iconColor = '#94a3b8';
    } else if (pos === 3) {
      icon = 'medal-outline';
      iconColor = '#cd7f32';
    } else if (entry.isUser) {
      icon = userBadgeIcon;
      iconColor = '#10b981';
    }

    return {
      pos,
      icon,
      iconColor,
      alias: entry.alias,
      pts: entry.pts,
      isUser: entry.isUser,
    };
  });
}

export const PASTUSO_LEADERBOARD = calculateLeaderboard(85, 'Usuario');
