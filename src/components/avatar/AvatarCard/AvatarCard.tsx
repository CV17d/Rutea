import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GlassCard } from '../../ui/GlassCard';
import { ProceduralAvatar } from '../ProceduralAvatar';
import { GlassBadge } from '../../ui/GlassBadge';
import { useTranslation } from '../../../i18n/useTranslation';

export interface AvatarCardProps {
  alias: string;
  avatarSeed: string;
  points: number;
  levelTitle: string;
  broadcastTimeMinutes?: number;
  onClose: () => void;
}

export const AvatarCard: React.FC<AvatarCardProps> = ({
  alias,
  avatarSeed,
  points,
  levelTitle,
  broadcastTimeMinutes = 8,
  onClose,
}) => {
  const { t } = useTranslation();

  const getTranslatedLevel = (lvl: string) => {
    switch (lvl) {
      case 'Pasajero Novato': return t('profile.rookie', lvl);
      case 'Pasajero Frecuente': return t('profile.frequent', lvl);
      case 'Guía Local': return t('profile.guide', lvl);
      case 'Cuy Leyenda': return t('profile.legend', lvl);
      case 'Vigía del Galeras': return t('profile.galerasWatcher', lvl);
      case 'Caminante de Pasto': return t('profile.pastoWalker', lvl);
      case 'Guía Mayor de Ruta': return t('profile.seniorGuide', lvl);
      case 'Embajador Supremo de Pasto': return t('profile.supremeAmbassador', lvl);
      default: return lvl;
    }
  };

  return (
    <GlassCard isHighlighted style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userRow}>
          <ProceduralAvatar seed={avatarSeed} size={48} />
          <View style={styles.userInfo}>
            <Text style={styles.alias}>{alias}</Text>
            <Text style={styles.level}>{getTranslatedLevel(levelTitle)}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <MaterialCommunityIcons name="close" size={16} color="#cbd5e1" />
        </TouchableOpacity>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{points} PTS</Text>
          <Text style={styles.statLabel}>{t('profile.reputation', 'Reputación')}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{broadcastTimeMinutes} MIN</Text>
          <Text style={styles.statLabel}>{t('profile.onBoardToday', 'A bordo hoy')}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <GlassBadge type="LIVE" label={t('profile.verifiedBroadcast', 'TRANSMISIÓN VERIFICADA')} />
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 340,
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  userInfo: {
    justifyContent: 'center',
  },
  alias: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '800',
  },
  level: {
    color: '#38bdf8',
    fontSize: 12,
    fontWeight: '600',
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    borderRadius: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
  statLabel: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(148, 163, 184, 0.2)',
  },
  footer: {
    alignItems: 'center',
  },
});
