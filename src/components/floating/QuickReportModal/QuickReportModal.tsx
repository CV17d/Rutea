import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { GlassCard } from '../../ui/GlassCard';
import { IncidentCategory } from '../../../types/user.types';
import { useUiStore } from '../../../store/useUiStore';
import { useUserSessionStore } from '../../../store/useUserSessionStore';
import { useTrackingStore } from '../../../store/useTrackingStore';
import { socketClient } from '../../../services/socket.client';
import { quickReportModalStyles as styles } from './QuickReportModal.styles';

interface ReportOption {
  key: IncidentCategory;
  label: string;
  icon: string;
  sub: string;
}

const REPORT_OPTIONS: ReportOption[] = [
  { key: 'TRAFFIC_JAM', label: 'Tráfico', icon: '🚗', sub: 'Congestión vehicular lenta' },
  { key: 'ROAD_BLOCK', label: 'Vía Cerrada', icon: '🚧', sub: 'Obras, paso o calle bloqueada' },
  { key: 'BUS_FULL', label: 'Bus Lleno', icon: '🚌', sub: 'Sin cupo disponible a bordo' },
];

export const QuickReportModal: React.FC = () => {
  const { isReportModalOpen, closeReportModal } = useUiStore();
  const { profile, addPoints } = useUserSessionStore();
  const { currentLocation, addReport, totalPoints, setGamification, currentRank } = useTrackingStore();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSelectReport = (option: ReportOption) => {
    // 1. Otorgar +15 puntos de recompensa en estado global
    addPoints(15);
    setGamification(totalPoints + 15, currentRank);

    const lat = currentLocation?.latitude || 1.2145;
    const lng = currentLocation?.longitude || -77.2783;
    const routeId = profile.activeRouteId || 'route-c1';

    // 2. Guardar en store local
    addReport({
      id: `rep-${Date.now()}`,
      category: option.key,
      title: `${option.label} en vía`,
      description: option.sub,
      reporterAlias: profile.alias,
      reporterAvatarSeed: profile.avatarSeed,
      timestamp: Date.now(),
      upvotes: 1,
      routeCode: routeId.replace('route-', '').toUpperCase(),
      latitude: lat,
      longitude: lng,
    });

    // 3. Emitir evento vía WebSockets hacia el backend
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

    // 4. Mostrar toast de recompensa
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
    <Modal
      visible={isReportModalOpen}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <GlassCard isHighlighted style={styles.modalCard}>
          <View style={styles.header}>
            <Text style={styles.title}>Reportar Novedad Vial</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.subtitle}>Toca un botón para alertar a la comunidad de Pasto</Text>

          <View style={styles.buttonsList}>
            {REPORT_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.key}
                onPress={() => handleSelectReport(opt)}
                activeOpacity={0.75}
                style={styles.bigReportBtn}
              >
                <Text style={styles.bigBtnIcon}>{opt.icon}</Text>
                <View style={styles.bigBtnTextWrap}>
                  <Text style={styles.bigBtnTitle}>{opt.label} ({opt.icon})</Text>
                  <Text style={styles.bigBtnSub}>{opt.sub}</Text>
                </View>
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
        </GlassCard>
      </View>
    </Modal>
  );
};
