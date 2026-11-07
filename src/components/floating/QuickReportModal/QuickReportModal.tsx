import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { IncidentCategory } from '../../../types/user.types';
import { useUiStore } from '../../../store/useUiStore';
import { useUserSessionStore } from '../../../store/useUserSessionStore';
import { useTrackingStore } from '../../../store/useTrackingStore';
import { socketClient } from '../../../services/socket.client';
import { quickReportModalStyles as styles } from './QuickReportModal.styles';

export interface ReportOption {
  key: IncidentCategory;
  label: string;
  icon: string;
  sub: string;
}

export const REPORT_OPTIONS: ReportOption[] = [
  { key: 'BUS_FULL', label: 'Bus Lleno', icon: '🚌', sub: 'Sin cupo disponible' },
  { key: 'TRAFFIC_JAM', label: 'Trancón', icon: '🚗', sub: 'Congestión vehicular lenta' },
  { key: 'ROAD_BLOCK', label: 'Vía Cerrada', icon: '🚧', sub: 'Obras o paso bloqueado' },
];

export const QuickReportModal: React.FC = () => {
  const { isReportModalOpen, closeReportModal } = useUiStore();
  const { profile, addPoints } = useUserSessionStore();
  const { currentLocation, addReport, totalPoints, setGamification, currentRank } = useTrackingStore();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSelectReport = (option: ReportOption) => {
    addPoints(15);
    setGamification(totalPoints + 15, currentRank);

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
      userId: profile.id,
      routeId,
      reportType: option.key,
      title: `${option.label} en vía`,
      description: option.sub,
      reporterAlias: profile.alias,
      latitude: lat,
      longitude: lng,
    });

    setToastMessage(`🎉 ¡+15 Puntos por tu reporte de ${option.label}!`);
    setTimeout(() => {
      setToastMessage(null);
      closeReportModal();
    }, 1200);
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
              <Text style={styles.closeText}>✕</Text>
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
                  <Text style={styles.pillIconText}>{opt.icon}</Text>
                </View>
                <Text style={styles.pillLabelText}>{opt.label}</Text>
                <View style={styles.rewardTag}>
                  <Text style={styles.rewardTagText}>+15 PTS</Text>
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
