import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { GlassCard } from '../../ui/GlassCard';
import { GlassBadge } from '../../ui/GlassBadge';
import { ProceduralAvatar } from '../../avatar/ProceduralAvatar';
import { useAuthStore } from '../../../store/useAuthStore';
import { userProfileCardStyles as styles } from './UserProfileCard.styles';

export interface UserProfileCardProps {
  onClose: () => void;
}

export interface UserProgressResult {
  currentRank: string;
  nextRank: string;
  pct: number;
  needed: number;
  badgeIcon: string;
}

export function calculateProgress(points: number): UserProgressResult {
  if (points < 100) {
    const pct = Math.min(100, Math.max(0, Math.round((points / 100) * 100)));
    return { currentRank: 'Pasajero Novato', nextRank: 'Guía Local', pct, needed: 100 - points, badgeIcon: '🌱' };
  }
  if (points < 500) {
    const pct = Math.min(100, Math.max(0, Math.round(((points - 100) / 400) * 100)));
    return { currentRank: 'Pasajero Frecuente', nextRank: 'Guía Local', pct, needed: 500 - points, badgeIcon: '🧭' };
  }
  if (points < 1000) {
    const pct = Math.min(100, Math.max(0, Math.round(((points - 500) / 500) * 100)));
    return { currentRank: 'Guía Local', nextRank: 'Cuy Leyenda', pct, needed: 1000 - points, badgeIcon: '⭐' };
  }
  return { currentRank: 'Cuy Leyenda', nextRank: 'Nivel Máximo', pct: 100, needed: 0, badgeIcon: '👑' };
}

const PASTUSO_LEADERBOARD = [
  { rank: '🥇', alias: 'Don_Pastuso99', pts: 1250, badge: '👑' },
  { rank: '🥈', alias: 'CuyVeloz42', pts: 680, badge: '⭐' },
  { rank: '🥉', alias: 'GalerasRunner19', pts: 320, badge: '🧭' },
];

export const UserProfileCard: React.FC<UserProfileCardProps> = ({ onClose }) => {
  const points = useAuthStore((s) => s.points);
  const authUser = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const displayName = authUser?.displayName || 'Pasajero Pastuso';
  const avatarSeed = authUser?.avatarSeed || 'user-seed';
  const { currentRank, nextRank, pct, needed, badgeIcon } = calculateProgress(points);

  const handleLogout = async () => {
    onClose();
    await logout();
  };

  return (
    <View style={styles.overlay}>
      <GlassCard isHighlighted style={styles.card}>
        <View style={styles.header}>
          <View style={styles.userRow}>
            <ProceduralAvatar seed={avatarSeed} size={44} />
            <View style={styles.userInfo}>
              <Text style={styles.alias}>{displayName}</Text>
              <Text style={styles.rankText}>{badgeIcon} {currentRank}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.pointsBox}>
          <Text style={styles.pointsNumber}>{points}</Text>
          <Text style={styles.pointsLabel}>PTS acumulados</Text>
          <View style={{ marginLeft: 'auto' }}>
            <GlassBadge type="POINTS" label="EN VIVO" />
          </View>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressLabels}>
            <Text style={styles.progressNextRank}>
              {needed > 0 ? `Siguiente: ${nextRank} (${needed} pts)` : '¡Rango Máximo!'}
            </Text>
            <Text style={styles.progressPctText}>{pct}%</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressBar, { width: `${pct}%` }]} />
          </View>
        </View>

        <View style={styles.leaderboardSection}>
          <Text style={styles.leaderboardTitle}>🏆 TOP PASAJEROS PASTO</Text>
          {PASTUSO_LEADERBOARD.map((item, idx) => (
            <View key={idx} style={styles.leaderRow}>
              <View style={styles.leaderLeft}>
                <Text style={styles.leaderMedal}>{item.rank}</Text>
                <Text style={styles.leaderName}>{item.alias}</Text>
              </View>
              <Text style={styles.leaderPoints}>{item.pts} PTS</Text>
            </View>
          ))}
          <View style={[styles.leaderRow, { backgroundColor: 'rgba(16, 185, 129, 0.12)', borderRadius: 8, paddingHorizontal: 6 }]}>
            <View style={styles.leaderLeft}>
              <Text style={styles.leaderMedal}>{badgeIcon}</Text>
              <Text style={[styles.leaderName, { color: '#10b981' }]}>{displayName} (Tú)</Text>
            </View>
            <Text style={[styles.leaderPoints, { color: '#10b981' }]}>{points} PTS</Text>
          </View>
        </View>

        <TouchableOpacity
          style={{ marginTop: 12, paddingVertical: 10, alignItems: 'center', borderRadius: 10, backgroundColor: 'rgba(239, 68, 68, 0.12)' }}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Text style={{ color: '#ef4444', fontSize: 13, fontWeight: '700' }}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </GlassCard>
    </View>
  );
};
