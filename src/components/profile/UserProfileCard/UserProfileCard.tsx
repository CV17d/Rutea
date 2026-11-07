import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { GlassCard } from '../../ui/GlassCard';
import { GlassBadge } from '../../ui/GlassBadge';
import { ProceduralAvatar } from '../../avatar/ProceduralAvatar';
import { useTrackingStore } from '../../../store/useTrackingStore';
import { useUserSessionStore } from '../../../store/useUserSessionStore';
import { userProfileCardStyles as styles } from './UserProfileCard.styles';

export interface UserProfileCardProps {
  onClose: () => void;
}

interface RankTier {
  min: number;
  max: number;
  current: string;
  next: string;
}

function calculateProgress(points: number): { nextRank: string; pct: number; needed: number } {
  const tiers: RankTier[] = [
    { min: 0, max: 30, current: 'Cuy Novato', next: 'Pasajero Frecuente' },
    { min: 30, max: 75, current: 'Pasajero Frecuente', next: 'Vigía del Galeras' },
    { min: 75, max: 150, current: 'Vigía del Galeras', next: 'Chasqui Urbano' },
    { min: 150, max: 300, current: 'Chasqui Urbano', next: 'Embajador Supremo' },
  ];

  for (const tier of tiers) {
    if (points < tier.max) {
      const earnedInTier = points - tier.min;
      const range = tier.max - tier.min;
      const pct = Math.min(100, Math.max(0, Math.round((earnedInTier / range) * 100)));
      return { nextRank: tier.next, pct, needed: tier.max - points };
    }
  }

  return { nextRank: 'Nivel Máximo', pct: 100, needed: 0 };
}

const PASTUSO_LEADERBOARD = [
  { rank: '🥇', alias: 'Don_Pastuso99', pts: 380 },
  { rank: '🥈', alias: 'CuyVeloz42', pts: 340 },
  { rank: '🥉', alias: 'GalerasRunner19', pts: 195 },
];

export const UserProfileCard: React.FC<UserProfileCardProps> = ({ onClose }) => {
  const totalPoints = useTrackingStore((s) => s.totalPoints);
  const currentRank = useTrackingStore((s) => s.currentRank);
  const profile = useUserSessionStore((s) => s.profile);

  const { nextRank, pct, needed } = calculateProgress(totalPoints);

  return (
    <View style={styles.overlay}>
      <GlassCard isHighlighted style={styles.card}>
        <View style={styles.header}>
          <View style={styles.userRow}>
            <ProceduralAvatar seed={profile.avatarSeed || 'user-seed'} size={44} />
            <View style={styles.userInfo}>
              <Text style={styles.alias}>{profile.alias}</Text>
              <Text style={styles.rankText}>{currentRank}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.pointsBox}>
          <Text style={styles.pointsNumber}>{totalPoints}</Text>
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
              <Text style={styles.leaderMedal}>⭐</Text>
              <Text style={[styles.leaderName, { color: '#10b981' }]}>{profile.alias} (Tú)</Text>
            </View>
            <Text style={[styles.leaderPoints, { color: '#10b981' }]}>{totalPoints} PTS</Text>
          </View>
        </View>
      </GlassCard>
    </View>
  );
};
