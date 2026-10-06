import React from 'react';
import { View, Text } from 'react-native';
import { GlassCard } from '../../ui/GlassCard';
import { GlassButton } from '../../ui/GlassButton';
import { GlassBadge } from '../../ui/GlassBadge';
import { useUserSessionStore } from '../../../store/useUserSessionStore';
import { useUiStore } from '../../../store/useUiStore';
import { onBoardPanelStyles as styles } from './OnBoardPanel.styles';

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
        <View style={styles.header}>
          <View style={styles.trackingStatusRow}>
            <View style={styles.pulseDot} />
            <Text style={styles.trackingTitle}>Rastreo Activo (Modo Bolsillo)</Text>
          </View>
          <GlassBadge type="LIVE" label="TRANSMITIENDO" />
        </View>

        <View style={styles.pointsBlock}>
          <Text style={styles.pointsNumber}>{profile.points} PTS</Text>
          <Text style={styles.pointsSubtext}>
            Ganando +5 PTS por km verificado en Pasto
          </Text>
        </View>

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
