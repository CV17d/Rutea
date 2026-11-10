import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useUiStore } from '../../../store/useUiStore';
import { useTrackingStore } from '../../../store/useTrackingStore';
import { useAuthStore } from '../../../store/useAuthStore';
import { useRoutesStore } from '../../../store/useRoutesStore';
import { useTranslation } from '../../../i18n/useTranslation';
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
  { type: 'FULL_BUS', label: 'Bus Lleno', sub: 'Sin cupo disponible', icon: 'account-group', color: '#f59e0b' },
  { type: 'TRAFFIC', label: 'Tráfico Pesado', sub: 'Congestión vehicular', icon: 'car-brake-alert', color: '#ef4444' },
  { type: 'DETOUR', label: 'Desvío', sub: 'Cambio de recorrido', icon: 'routes', color: '#8b5cf6' },
  { type: 'ACCIDENT', label: 'Accidente', sub: 'Paso restringido', icon: 'alert-octagon', color: '#dc2626' },
];

export const ReportIncidentModal: React.FC = () => {
  const { isReportModalOpen, closeReportModal } = useUiStore();
  const { currentLocation } = useTrackingStore();
  const authUser = useAuthStore((s) => s.user);
  const isGuest = useAuthStore((s) => s.isGuest);
  const selectedRouteId = useRoutesStore((s) => s.selectedRouteId);
  const { t } = useTranslation();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const getOptionLabel = (type: IncidentType, fallback: string) => {
    switch (type) {
      case 'FULL_BUS': return t('incidents.busFull', fallback);
      case 'TRAFFIC': return t('incidents.traffic', fallback);
      case 'DETOUR': return t('incidents.detour', fallback);
      case 'ACCIDENT': return t('incidents.accident', fallback);
      default: return fallback;
    }
  };

  const getOptionSub = (type: IncidentType, fallback: string) => {
    switch (type) {
      case 'FULL_BUS': return t('incidents.busFullSub', fallback);
      case 'TRAFFIC': return t('incidents.trafficSub', fallback);
      case 'DETOUR': return t('incidents.detourSub', fallback);
      case 'ACCIDENT': return t('incidents.accidentSub', fallback);
      default: return fallback;
    }
  };

  const handleSelectOption = async (option: IncidentOption) => {
    setIsSubmitting(true);
    const lat = currentLocation?.latitude || 1.2145;
    const lng = currentLocation?.longitude || -77.2783;
    const routeId = selectedRouteId || 'general';

    const res = await reportService.createIncidentReport({
      routeId, userId: authUser?.id || null, type: option.type, lat, lng,
    });

    setIsSubmitting(false);
    if (res?.error === 'COOLDOWN_ACTIVE') {
      setToastMessage(t('incidents.cooldownWait', res.message));
    } else if (isGuest || res?.isGuest) {
      setToastMessage(t('incidents.guestAlert', 'Reporte enviado. Inicia sesión para ganar puntos por tu colaboración'));
    } else {
      setToastMessage(t('incidents.successReward', `¡+10 Puntos por tu reporte!`));
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
            <Text style={styles.title}>{t('incidents.reportTitle', 'Reportar Novedad')}</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeBtn} activeOpacity={0.7}>
              <MaterialCommunityIcons name="close" size={18} color="#94a3b8" />
            </TouchableOpacity>
          </View>
          <Text style={styles.subtitle}>{t('incidents.subtitle', 'Alerta en tiempo real a la comunidad de pasajeros')}</Text>

          <View style={styles.optionsGrid}>
            {INCIDENT_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.type} onPress={() => handleSelectOption(opt)}
                activeOpacity={0.8} disabled={isSubmitting} style={styles.optionCard}
              >
                <View style={styles.rewardTag}>
                  <Text style={styles.rewardText}>{isGuest ? t('incidents.guestTag', 'INVITADO') : t('incidents.ptsTag', '+10 PTS')}</Text>
                </View>
                <View style={[styles.iconBadge, { backgroundColor: `${opt.color}20` }]}>
                  <MaterialCommunityIcons name={opt.icon} size={22} color={opt.color} />
                </View>
                <Text style={styles.optionLabel}>{getOptionLabel(opt.type, opt.label)}</Text>
                <Text style={styles.optionSub}>{getOptionSub(opt.type, opt.sub)}</Text>
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
