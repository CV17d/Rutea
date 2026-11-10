import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RouteRecommendation } from '../../types/trip.types';
import { STANDARD_ROUTES_PART2 } from '../../constants/routes/standardRoutes2';
import { useUiStore } from '../../store/useUiStore';
import { useTranslation } from '../../i18n/useTranslation';
import { TripTimeline } from './TripTimeline';
import { styles } from './TripDetailsModal.styles';

export interface TripDetailsModalProps {
  recommendation: RouteRecommendation | null;
  visible: boolean;
  onClose: () => void;
  onSelectRoute: (rec: RouteRecommendation) => void;
}

export const TripDetailsModal: React.FC<TripDetailsModalProps> = ({
  recommendation,
  visible,
  onClose,
  onSelectRoute,
}) => {
  const openReportModal = useUiStore((s) => s.openReportModal);
  const { t } = useTranslation();

  if (!visible || !recommendation) return null;

  const { routeId, routeCode, routeName } = recommendation;
  const s2Route = STANDARD_ROUTES_PART2.find((r) => r.id === routeId || r.code === routeCode);
  const badgeColor = s2Route?.color || recommendation.routeColor || '#0284c7';

  return (
    <View style={styles.overlay}>
      <View style={styles.content}>
        <View style={styles.dragHandle} />

        <View style={styles.headerRow}>
          <View style={styles.titleCol}>
            <View style={[styles.codeBadge, { backgroundColor: badgeColor }]}>
              <Text style={styles.codeText}>{routeCode}</Text>
            </View>
            <Text style={styles.modalTitle} numberOfLines={1}>
              {routeName}
            </Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <MaterialCommunityIcons name="close" size={18} color="#64748b" />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.timelineScroll}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
        >
          <TripTimeline recommendation={recommendation} />
        </ScrollView>

        <View style={styles.actionBtnRow}>
          <TouchableOpacity
            style={styles.reportBtn}
            onPress={openReportModal}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="alert-circle-outline" size={16} color="#d97706" />
            <Text style={styles.reportBtnText}>{t('incidents.reportTitle', 'Reportar Novedad')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.startTripBtn}
            onPress={() => onSelectRoute(recommendation)}
            activeOpacity={0.85}
          >
            <Text style={styles.startTripText}>{t('search.viewRouteOnMap', 'Ver Ruta en el Mapa')}</Text>
            <MaterialCommunityIcons name="arrow-right" size={16} color="#ffffff" style={{ marginLeft: 4 }} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
