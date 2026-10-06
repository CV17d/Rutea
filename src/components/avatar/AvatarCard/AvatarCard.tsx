import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { GlassCard } from '../../ui/GlassCard';
import { ProceduralAvatar } from '../ProceduralAvatar';
import { GlassBadge } from '../../ui/GlassBadge';

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
  return (
    <GlassCard isHighlighted style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userRow}>
          <ProceduralAvatar seed={avatarSeed} size={48} />
          <View style={styles.userInfo}>
            <Text style={styles.alias}>{alias}</Text>
            <Text style={styles.level}>{levelTitle}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{points} PTS</Text>
          <Text style={styles.statLabel}>Reputación</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{broadcastTimeMinutes} MIN</Text>
          <Text style={styles.statLabel}>A bordo hoy</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <GlassBadge type="LIVE" label="TRANSMISIÓN VERIFICADA" />
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
  closeText: {
    color: '#cbd5e1',
    fontSize: 13,
    fontWeight: 'bold',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  statNumber: {
    color: '#10b981',
    fontSize: 16,
    fontWeight: '900',
  },
  statLabel: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  footer: {
    alignItems: 'center',
  },
});
