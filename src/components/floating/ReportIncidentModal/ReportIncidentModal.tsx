import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useUiStore } from '../../../store/useUiStore';
import { useTrackingStore } from '../../../store/useTrackingStore';
import { useAuthStore } from '../../../store/useAuthStore';
import { useRoutesStore } from '../../../store/useRoutesStore';
import { reportService, IncidentType } from '../../../services/report.service';
import { styles } from './ReportIncidentModal.styles';

export interface IncidentOption {
  type: IncidentType;
  label: string;
  sub: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  color: string;
}

export const INCIDENT_OPTIONS: IncidentOption[] = [
  { type: 'FULL_BUS', label: 'Bus Lleno', sub: 'Sin cupo disponible', icon: 'bus-alert', color: '#f59e0b' },
  { type: 'TRAFFIC', label: 'Tráfico Pesado', sub: 'Congestión vehicular', icon: 'car-multiple', color: '#ef4444' },
  { type: 'DETOUR', label: 'Desvío', sub: 'Cambio de recorrido', icon: 'routes', color: '#8b5cf6' },
  { type: 'ACCIDENT', label: 'Accidente', sub: 'Paso restringido', icon: 'car-emergency', color: '#dc2626' },
];

export const ReportIncidentModal: React.FC = () => {
  const { isReportModalOpen, closeReportModal } = useUiStore();
  const { currentLocation } = useTrackingStore();
  const authUser = useAuthStore((s) => s.user);
  const isGuest = useAuthStore((s) => s.isGuest);
  const selectedRouteId = useRoutesStore((s) => s.selectedRouteId);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSelectOption = async (option: IncidentOption) => {
    setIsSubmitting(true);
    const lat = currentLocation?.latitude || 1.2145;
    const lng = currentLocation?.longitude || -77.2783;
    const routeId = selectedRouteId || 'route-c16';

    const res = await reportService.createIncidentReport({
      routeId,
      userId: authUser?.id || null,
      type: option.type,
      lat,
      lng,
    });

    setIsSubmitting(false);
    if (isGuest || res?.isGuest) {
      setToastMessage('Reporte enviado. Inicia sesión para ganar puntos por tu colaboración');
    } else {
      setToastMessage(`¡+10 Puntos por tu reporte de ${option.label}!`);
    }

    setTimeout(() => {
      setToastMessage(null);
      closeReportModal();
    }, 1800);
  };

  const handleClose = () => {
    setToastMessage(null);
    closeReportModal();
  };

  return (
    <Modal visible={isReportModalOpen} transparent animationType="slide" onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <View style={styles.dragHandle} />
          <View style={styles.header}>
            <Text style={styles.title}>Reportar Novedad</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeBtn} activeOpacity={0.7}>
              <MaterialCommunityIcons name="close" size={18} color="#94a3b8" />
            </TouchableOpacity>
          </View>
          <Text style={styles.subtitle}>Alerta en tiempo real a la comunidad de pasajeros</Text>

          <View style={styles.optionsGrid}>
            {INCIDENT_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.type}
                onPress={() => handleSelectOption(opt)}
                activeOpacity={0.8}
                disabled={isSubmitting}
                style={styles.optionCard}
              >
                <View style={styles.rewardTag}>
                  <Text style={styles.rewardText}>{isGuest ? 'INVITADO' : '+10 PTS'}</Text>
                </View>
                <View style={[styles.iconBadge, { backgroundColor: `${opt.color}20` }]}>
                  <MaterialCommunityIcons name={opt.icon} size={22} color={opt.color} />
                </View>
                <Text style={styles.optionLabel}>{opt.label}</Text>
                <Text style={styles.optionSub}>{opt.sub}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {isSubmitting && (
            <View style={{ marginTop: 12, alignItems: 'center' }}>
              <ActivityIndicator color="#10b981" size="small" />
            </View>
          )}

          {toastMessage && (
            <View style={styles.toastBox}>
              <MaterialCommunityIcons name="information" size={18} color="#34d399" />
              <Text style={styles.toastText}>{toastMessage}</Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};
