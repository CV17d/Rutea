import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ProceduralAvatar } from '../avatar/ProceduralAvatar';
import { useUiStore } from '../../store/useUiStore';
import { useUserSessionStore } from '../../store/useUserSessionStore';
import { useTrackingStore } from '../../store/useTrackingStore';
import { useRoutesStore } from '../../store/useRoutesStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useLocationTracking } from '../../hooks/useLocationTracking';
import { socketClient } from '../../services/socket.client';
import { checkReportCooldown, recordReportCooldown, awardReportPoints } from '../../services/report.service';
import { styles } from './ActiveTrackingView.styles';

export const ActiveTrackingView: React.FC = () => {
  const { setScreenMode } = useUiStore();
  const { profile, stopBroadcasting } = useUserSessionStore();
  const { currentLocation, addReport } = useTrackingStore();
  const { isAuthenticated, isGuest } = useAuthStore();
  const { stopTracking } = useLocationTracking();
  const selectedRoute = useRoutesStore((s) => s.getSelectedRoute());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activeCode = selectedRoute?.code || (profile.activeRouteId ? profile.activeRouteId.replace('route-', '').toUpperCase() : 'SETP');
  const activeRouteId = profile.activeRouteId || selectedRoute?.id || 'general';

  const handleStopRide = () => {
    stopTracking(); stopBroadcasting(); setScreenMode('HOME');
  };

  const handleQuickReport = (type: 'BUS_FULL' | 'TRAFFIC_JAM', label: string) => {
    const cooldown = checkReportCooldown(type);
    if (!cooldown.canReport) {
      setToastMessage(`Debes esperar ${Math.ceil(cooldown.remainingSeconds / 60)} min para reportar nuevamente`);
      setTimeout(() => setToastMessage(null), 2000);
      return;
    }
    recordReportCooldown(type);
    const isUserGuest = isGuest || !isAuthenticated;
    if (!isUserGuest) { awardReportPoints(15); }

    const lat = currentLocation?.latitude || 1.2145;
    const lng = currentLocation?.longitude || -77.2783;

    addReport({
      id: `rep-${Date.now()}`, category: type, title: `${label} en vía`,
      description: `Reporte rápido de ${label} en Pasto`, reporterAlias: profile.alias || 'Andrés',
      reporterAvatarSeed: profile.avatarSeed || 'andres12', timestamp: Date.now(),
      upvotes: 1, routeCode: activeCode, latitude: lat, longitude: lng,
    });

    socketClient.emit('report:create', {
      userId: profile.id, routeId: activeRouteId, reportType: type,
      title: `${label} en vía`, reporterAlias: profile.alias || 'Andrés', latitude: lat, longitude: lng,
    });

    setToastMessage(isUserGuest ? 'Reporte enviado. Inicia sesión para ganar puntos' : `¡+15 Puntos por tu reporte: ${label}!`);
    setTimeout(() => setToastMessage(null), 2000);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 36 }}>
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backButton} onPress={handleStopRide} activeOpacity={0.7}>
          <MaterialCommunityIcons name="arrow-left" size={20} color="#94a3b8" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rutas Pasto</Text>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 8 }}>
        <MaterialCommunityIcons name="bus" size={22} color="#38bdf8" style={{ marginRight: 6 }} />
        <Text style={styles.routeTitle}>¡Vas en la Ruta {activeCode}!</Text>
      </View>

      <TouchableOpacity style={styles.neonPillButton} activeOpacity={0.85}>
        <Text style={styles.neonPillMainText}>Rastreo Activo</Text>
        <Text style={styles.neonPillSubText}>(Modo Bolsillo)</Text>
      </TouchableOpacity>

      <View style={styles.statsCard}>
        <View style={styles.statCol}><Text style={styles.statLabel}>Aportes hoy:</Text><Text style={styles.statValue}>{profile.points || 85} PTS</Text></View>
        <View style={styles.statsDivider} />
        <View style={styles.statCol}><Text style={styles.statLabel}>Puntos ganados:</Text><Text style={styles.statValue}>3</Text></View>
      </View>

      <Text style={styles.sectionTitle}>Reportes en vivo</Text>
      <View style={styles.reportsFeedContainer}>
        <View style={styles.speechBubbleSimple}>
          <Text style={styles.bubbleText}>El tráfico en la 17 está pesado</Text>
          <MaterialCommunityIcons name="comment-text-outline" size={16} color="#94a3b8" />
        </View>
        <View style={styles.speechBubbleWithAvatar}>
          <View style={styles.avatarWrap}><ProceduralAvatar seed="andres" size={34} /></View>
          <View style={styles.bubbleContent}><Text style={styles.bubbleText}>El tráfico en la 17 está pesado</Text><Text style={styles.bubbleAuthor}>Andrés</Text></View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Reportar rápido</Text>
      {toastMessage && <View style={styles.toastContainer}><Text style={styles.toastText}>{toastMessage}</Text></View>}

      <View style={styles.quickReportRow}>
        <TouchableOpacity style={styles.quickPillButton} onPress={() => handleQuickReport('BUS_FULL', 'Bus Lleno')} activeOpacity={0.8}>
          <View style={styles.quickPillIconCircle}><MaterialCommunityIcons name="account-group" size={18} color="#f59e0b" /></View>
          <Text style={styles.quickPillLabel}>Bus Lleno</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickPillButton} onPress={() => handleQuickReport('TRAFFIC_JAM', 'Trancón')} activeOpacity={0.8}>
          <View style={styles.quickPillIconCircle}><MaterialCommunityIcons name="car-brake-alert" size={18} color="#ef4444" /></View>
          <Text style={styles.quickPillLabel}>Trancón</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.exitTextBtn} onPress={handleStopRide}>
        <Text style={styles.exitText}>Bajar del bus y finalizar viaje</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};
