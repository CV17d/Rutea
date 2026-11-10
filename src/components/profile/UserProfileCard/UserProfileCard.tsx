import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GlassCard } from '../../ui/GlassCard';
import { GlassBadge } from '../../ui/GlassBadge';
import { ProceduralAvatar } from '../../avatar/ProceduralAvatar';
import { useAuthStore } from '../../../store/useAuthStore';
import { useTranslation } from '../../../i18n/useTranslation';
import {
  calculateRank,
  calculateProgress,
  calculateUserPosition,
  calculateLeaderboard,
  PASTUSO_LEADERBOARD,
  UserProgressResult,
} from './userProfile.utils';
import { makeUserProfileCardStyles } from './UserProfileCard.styles';
import { useThemedStyles } from '../../../hooks/useThemedStyles';

// Rangos oficiales: Pasajero Novato (<100 pt), Guía Local (>500 pt), Cuy Leyenda (>1000 pt)
export { calculateRank, calculateProgress, calculateUserPosition, calculateLeaderboard, PASTUSO_LEADERBOARD, UserProgressResult };

export interface UserProfileCardProps {
  onClose: () => void;
}

export const UserProfileCard: React.FC<UserProfileCardProps> = ({ onClose }) => {
  const styles = useThemedStyles(makeUserProfileCardStyles);
  const points = useAuthStore((s) => s.points);
  const authUser = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { t } = useTranslation();

  const displayName = authUser?.displayName || t('profile.defaultAlias', 'Pasajero Pastuso');
  const avatarSeed = authUser?.avatarSeed || 'user-seed';

  const currentRank = calculateRank(points);
  const currentPosition = calculateUserPosition(points);
  const { nextRank, pct, needed, badgeVectorIcon, badgeColor } = calculateProgress(points);
  const leaderboard = calculateLeaderboard(points, displayName, badgeVectorIcon);

  const getTranslatedRank = (rank: string) => {
    if (rank === 'Pasajero Novato') return t('profile.rookie', 'Pasajero Novato');
    if (rank === 'Pasajero Frecuente') return t('profile.frequent', 'Pasajero Frecuente');
    if (rank === 'Guía Local') return t('profile.guide', 'Guía Local');
    if (rank === 'Cuy Leyenda') return t('profile.legend', 'Cuy Leyenda');
    return rank;
  };

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
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
                <MaterialCommunityIcons name={badgeVectorIcon} size={15} color={badgeColor} />
                <Text style={styles.rankText}>{getTranslatedRank(currentRank)}</Text>
                <Text style={{ fontSize: 11, color: '#94a3b8', fontWeight: '700', marginLeft: 2 }}>
                  #{currentPosition}
                </Text>
              </View>
            </View>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <MaterialCommunityIcons name="close" size={16} color="#cbd5e1" />
          </TouchableOpacity>
        </View>

        <View style={styles.pointsBox}>
          <Text style={styles.pointsNumber}>{points}</Text>
          <Text style={styles.pointsLabel}>{t('profile.points', 'PTS acumulados')}</Text>
          <View style={{ marginLeft: 'auto' }}>
            <GlassBadge type="POINTS" label={t('routeDetail.live', 'EN VIVO')} />
          </View>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressLabels}>
            <Text style={styles.progressNextRank}>
              {needed > 0 ? `${t('profile.nextRank', 'Siguiente')}: ${getTranslatedRank(nextRank)} (${needed} pts)` : t('profile.maxRank', '¡Rango Máximo!')}
            </Text>
            <Text style={styles.progressPctText}>{pct}%</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressBar, { width: `${pct}%` }]} />
          </View>
        </View>

        <View style={styles.leaderboardSection}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <MaterialCommunityIcons name="trophy-outline" size={15} color="#eab308" />
            <Text style={styles.leaderboardTitle}>{t('profile.ranking', 'TOP PASAJEROS PASTO')}</Text>
          </View>
          {leaderboard.map((item) => (
            <View
              key={`${item.pos}-${item.alias}`}
              style={[
                styles.leaderRow,
                item.isUser && { backgroundColor: 'rgba(16, 185, 129, 0.12)', borderRadius: 8, paddingHorizontal: 6 },
              ]}
            >
              <View style={styles.leaderLeft}>
                <View style={{ width: 22, alignItems: 'center' }}>
                  <MaterialCommunityIcons name={item.icon} size={16} color={item.iconColor} />
                </View>
                <Text style={[styles.leaderName, item.isUser && { color: '#10b981', fontWeight: '800' }]}>
                  {item.isUser ? `${displayName} (${t('profile.you', 'Tú')})` : item.alias}
                </Text>
              </View>
              <Text style={[styles.leaderPoints, item.isUser && { color: '#10b981', fontWeight: '800' }]}>
                {item.pts} pts
              </Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={{ marginTop: 12, paddingVertical: 10, alignItems: 'center', borderRadius: 10, backgroundColor: 'rgba(239, 68, 68, 0.12)' }}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Text style={{ color: '#ef4444', fontSize: 13, fontWeight: '700' }}>{t('profile.logout', 'Cerrar Sesión')}</Text>
        </TouchableOpacity>
      </GlassCard>
    </View>
  );
};
