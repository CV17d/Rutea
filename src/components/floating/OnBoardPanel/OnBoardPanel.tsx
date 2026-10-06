import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GlassCard } from '../../ui/GlassCard';
import { GlassButton } from '../../ui/GlassButton';
import { GlassBadge } from '../../ui/GlassBadge';
import { useUserSessionStore } from '../../../store/useUserSessionStore';
import { useUiStore } from '../../../store/useUiStore';

export const OnBoardPanel: React.FC = () => {
  const { profile, stopBroadcasting } = useUserSessionStore();
  const { setScreenMode, openReportModal } = useUiStore();

  const handleStop = () => {
    stopBroadcasting();
    setScreenMode('HOME');
  };

  return (
    <View style={styles.container}>
      <GlassCard isHighlighted style={styles.card}>
        {/* Active Tracking Header (Pocket Mode) */}
        <View style={styles.header}>
          <View style={styles.trackingStatusRow}>
            <View style={styles.pulseDot} />
            <Text style={styles.trackingTitle}>Rastreo Activo (Modo Bolsillo)</Text>
          </View>
          <GlassBadge type="LIVE" label="TRANSMITIENDO" />
        </View>

        {/* Big Neobrutalist Points Counter: '85 PTS' */}
        <View style={styles.pointsBlock}>
          <Text style={styles.pointsNumber}>{profile.points} PTS</Text>
          <Text style={styles.pointsSubtext}>
            Ganando +5 PTS por km verificado en Pasto
          </Text>
        </View>

        {/* Telemetry Stats Summary */}
        <View style={styles.statsRow}>
          <View style={styles.statCol}>
            <Text style={styles.statVal}>{profile.totalDistanceBroadcastKm} km</Text>
            <Text style={styles.statSub}>Distancia total</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statCol}>
            <Text style={styles.statVal}>{profile.totalTimeBroadcastMinutes} min</Text>
            <Text style={styles.statSub}>Tiempo a bordo</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonRow}>
          <GlassButton
            label="⚠️ Reportar Novedad"
            variant="glass"
            onPress={openReportModal}
            style={styles.actionBtn}
          />
          <GlassButton
            label="Bajar del Bus"
            variant="danger"
            onPress={handleStop}
            style={styles.actionBtn}
          />
        </View>
      </GlassCard>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    zIndex: 30,
  },
  card: {
    padding: 18,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  trackingStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pulseDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10b981',
  },
  trackingTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  pointsBlock: {
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.35)',
    marginBottom: 14,
  },
  pointsNumber: {
    color: '#10b981',
    fontSize: 38,
    fontWeight: '900',
    letterSpacing: 1,
  },
  pointsSubtext: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 14,
    paddingHorizontal: 8,
  },
  statCol: {
    alignItems: 'center',
  },
  statVal: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
  statSub: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  divider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 12,
  },
});
