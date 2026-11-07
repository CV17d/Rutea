import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { ProceduralAvatar } from '../avatar/ProceduralAvatar';
import { useUiStore } from '../../store/useUiStore';
import { useUserSessionStore } from '../../store/useUserSessionStore';
import { useTrackingStore } from '../../store/useTrackingStore';
import { useLocationTracking } from '../../hooks/useLocationTracking';
import { socketClient } from '../../services/socket.client';
import { styles } from './ActiveTrackingView.styles';

export const ActiveTrackingView: React.FC = () => {
  const { setScreenMode } = useUiStore();
  const { profile, addPoints, stopBroadcasting } = useUserSessionStore();
  const { totalPoints, setGamification, currentRank, currentLocation, addReport } = useTrackingStore();
  const { stopTracking } = useLocationTracking();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleStopRide = () => {
    stopTracking();
    stopBroadcasting();
    setScreenMode('HOME');
  };

  const handleQuickReport = (type: 'BUS_FULL' | 'TRAFFIC_JAM', label: string) => {
    addPoints(15);
    setGamification(totalPoints + 15, currentRank);

    const lat = currentLocation?.latitude || 1.2145;
    const lng = currentLocation?.longitude || -77.2783;
    const routeId = profile.activeRouteId || 'route-c16';

    addReport({
      id: `rep-${Date.now()}`,
      category: type,
      title: `${label} en vía`,
      description: `Reporte rápido de ${label} en Pasto`,
      reporterAlias: profile.alias || 'Andrés',
      reporterAvatarSeed: profile.avatarSeed || 'andres12',
      timestamp: Date.now(),
      upvotes: 1,
      routeCode: 'C16',
      latitude: lat,
      longitude: lng,
    });

    socketClient.emit('report:create', {
      userId: profile.id,
      routeId,
      reportType: type,
      title: `${label} en vía`,
      reporterAlias: profile.alias || 'Andrés',
      latitude: lat,
      longitude: lng,
    });

    setToastMessage(`🎉 ¡+15 Puntos por tu reporte: ${label}!`);
    setTimeout(() => setToastMessage(null), 2000);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 36 }}>
      {/* Top Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backButton} onPress={handleStopRide} activeOpacity={0.7}>
          <Text style={styles.backArrowText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rutas Pasto</Text>
      </View>

      {/* Title */}
      <Text style={styles.routeTitle}>¡Vas en la Ruta C16! 🚌</Text>

      {/* Giant Neon Pill Button */}
      <TouchableOpacity style={styles.neonPillButton} activeOpacity={0.85}>
        <Text style={styles.neonPillMainText}>Rastreo Activo</Text>
        <Text style={styles.neonPillSubText}>(Modo Bolsillo 👝)</Text>
      </TouchableOpacity>

      {/* Stats Card */}
      <View style={styles.statsCard}>
        <View style={styles.statCol}>
          <Text style={styles.statLabel}>Aportes hoy:</Text>
          <Text style={styles.statValue}>{profile.points || 85} PTS</Text>
        </View>
        <View style={styles.statsDivider} />
        <View style={styles.statCol}>
          <Text style={styles.statLabel}>Puntos ganados:</Text>
          <Text style={styles.statValue}>3</Text>
        </View>
      </View>

      {/* Feed de Reportes */}
      <Text style={styles.sectionTitle}>Reportes en vivo</Text>
      <View style={styles.reportsFeedContainer}>
        <View style={styles.speechBubbleSimple}>
          <Text style={styles.bubbleText}>El tráfico en la 17 está pesado</Text>
          <Text style={styles.bubbleReaction}>🙂</Text>
        </View>

        <View style={styles.speechBubbleWithAvatar}>
          <View style={styles.avatarWrap}>
            <ProceduralAvatar seed="andres" size={34} />
          </View>
          <View style={styles.bubbleContent}>
            <Text style={styles.bubbleText}>El tráfico en la 17 está pesado</Text>
            <Text style={styles.bubbleAuthor}>Andrés</Text>
          </View>
        </View>
      </View>

      {/* Reportar rápido */}
      <Text style={styles.sectionTitle}>Reportar rápido</Text>
      {toastMessage && (
        <View style={styles.toastContainer}>
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      )}

      <View style={styles.quickReportRow}>
        <TouchableOpacity
          style={styles.quickPillButton}
          onPress={() => handleQuickReport('BUS_FULL', 'Bus Lleno')}
          activeOpacity={0.8}
        >
          <View style={styles.quickPillIconCircle}>
            <Text style={{ fontSize: 16 }}>🚌</Text>
          </View>
          <Text style={styles.quickPillLabel}>Bus Lleno</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickPillButton}
          onPress={() => handleQuickReport('TRAFFIC_JAM', 'Trancón')}
          activeOpacity={0.8}
        >
          <View style={styles.quickPillIconCircle}>
            <Text style={{ fontSize: 16 }}>🚗</Text>
          </View>
          <Text style={styles.quickPillLabel}>Trancón</Text>
        </TouchableOpacity>
      </View>

      {/* Bajar del bus exit button */}
      <TouchableOpacity style={styles.exitTextBtn} onPress={handleStopRide}>
        <Text style={styles.exitText}>✕ Bajar del bus y finalizar viaje</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};
