import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { IncidentCategory } from '../../../types/user.types';
import { useUiStore } from '../../../store/useUiStore';
import { useUserSessionStore } from '../../../store/useUserSessionStore';
import { useTrackingStore } from '../../../store/useTrackingStore';
import { useAuthStore } from '../../../store/useAuthStore';
import { socketClient } from '../../../services/socket.client';
import { checkReportCooldown, recordReportCooldown, awardReportPoints } from '../../../services/report.service';
import { quickReportModalStyles as styles } from './QuickReportModal.styles';

export interface ReportOption {
  key: IncidentCategory;
  label: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  sub: string;
}

export const REPORT_OPTIONS: ReportOption[] = [
  { key: 'BUS_FULL', label: 'Bus Lleno', icon: 'account-group', sub: 'Sin cupo disponible' },
  { key: 'TRAFFIC_JAM', label: 'Trancón', icon: 'car-brake-alert', sub: 'Congestión vehicular lenta' },
  { key: 'ROAD_BLOCK', label: 'Vía Cerrada', icon: 'alert-octagon', sub: 'Obras o paso bloqueado' },
];

export const QuickReportModal: React.FC = () => {
  const { isReportModalOpen, closeReportModal } = useUiStore();
  const { profile } = useUserSessionStore();
  const { currentLocation, addReport } = useTrackingStore();
  const { isAuthenticated, isGuest } = useAuthStore();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSelectReport = (option: ReportOption) => {
    const cooldown = checkReportCooldown(option.key);
    if (!cooldown.canReport) {
      setToastMessage(`Debes esperar ${Math.ceil(cooldown.remainingSeconds / 60)} min para reportar nuevamente`);
      setTimeout(() => setToastMessage(null), 2000);
      return;
    }
    recordReportCooldown(option.key);

    const isUserGuest = isGuest || !isAuthenticated;
    if (!isUserGuest) {
      awardReportPoints(15);
    }

    const lat = currentLocation?.latitude || 1.2145;
    const lng = currentLocation?.longitude || -77.2783;
    const routeId = profile.activeRouteId || 'route-c16';

    addReport({
      id: `rep-${Date.now()}`,
      category: option.key,
      title: `${option.label} en vía`,
      description: option.sub,
      reporterAlias: profile.alias,
      reporterAvatarSeed: profile.avatarSeed,
      timestamp: Date.now(),
      upvotes: 1,
      routeCode: 'C16',
      latitude: lat,
      longitude: lng,
    });

    socketClient.emit('report:create', {
      userId: profile.id, routeId, reportType: option.key,
      title: `${option.label} en vía`, description: option.sub,
      reporterAlias: profile.alias, latitude: lat, longitude: lng,
    });

    if (isUserGuest) {
      setToastMessage('Reporte enviado. Inicia sesión para ganar puntos por tu colaboración');
    } else {
      setToastMessage(`¡+15 Puntos por tu reporte de ${option.label}!`);
    }

    setTimeout(() => {
      setToastMessage(null);
      closeReportModal();
    }, 1500);
  };

  const handleClose = () => {
    setToastMessage(null);
    closeReportModal();
  };

  return (
    <Modal visible={isReportModalOpen} transparent animationType="fade" onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <View style={styles.header}>
            <Text style={styles.title}>Reportar rápido</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
              <MaterialCommunityIcons name="close" size={18} color="#94a3b8" />
            </TouchableOpacity>
          </View>
          <Text style={styles.subtitle}>Toca para alertar a la comunidad de Pasto</Text>

          <View style={styles.horizontalPillsRow}>
            {REPORT_OPTIONS.slice(0, 2).map((opt) => (
              <TouchableOpacity
                key={opt.key}
                onPress={() => handleSelectReport(opt)}
                activeOpacity={0.8}
                style={styles.darkHorizontalPill}
              >
                <View style={styles.pillIconWrap}>
                  <MaterialCommunityIcons name={opt.icon} size={20} color="#38bdf8" />
                </View>
                <Text style={styles.pillLabelText}>{opt.label}</Text>
                <View style={styles.rewardTag}>
                  <Text style={styles.rewardTagText}>{(!isAuthenticated || isGuest) ? 'INVITADO' : '+15 PTS'}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {toastMessage && (
            <View style={styles.toastContainer}>
              <Text style={styles.toastText}>{toastMessage}</Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};
