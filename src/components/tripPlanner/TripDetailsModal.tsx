import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RouteRecommendation } from '../../types/trip.types';
import { STANDARD_ROUTES_PART2 } from '../../constants/routes/standardRoutes2';
import { useUiStore } from '../../store/useUiStore';
import { useTranslation } from '../../i18n/useTranslation';
import { useAppTheme } from '../../hooks/useAppTheme';
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
  const { palette: P } = useAppTheme();

  if (!visible || !recommendation) return null;

  const { routeId, routeCode, routeName, routeDescription, totalMinutes } = recommendation;
  const s2Route = STANDARD_ROUTES_PART2.find((r) => r.id === routeId || r.code === routeCode);
  const badgeColor = s2Route?.color || recommendation.routeColor || '#0284c7';

  return (
    <View style={[styles.overlay, { backgroundColor: P.scrim }]}>
      <View style={[styles.content, { backgroundColor: P.bg, shadowColor: P.shadow }]}>
        <View style={[styles.dragHandle, { backgroundColor: P.line }]} />

        <View style={styles.headerRow}>
          <View style={styles.titleCol}>
            <View style={[styles.codeBadge, { backgroundColor: badgeColor }]}>
              <Text style={styles.codeText}>{routeCode}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.modalTitle, { color: P.text }]} numberOfLines={1}>{routeName}</Text>
              {!!routeDescription && <Text style={[styles.modalSub, { color: P.muted }]} numberOfLines={1}>{routeDescription}</Text>}
            </View>
            {totalMinutes != null && (
              <View style={styles.totalCol}>
                <Text style={[styles.totalValue, { color: P.text }]}>{totalMinutes}</Text>
                <Text style={[styles.totalUnit, { color: P.muted }]}>min</Text>
              </View>
            )}
          </View>
          <TouchableOpacity onPress={onClose} style={[styles.closeBtn, { backgroundColor: P.raised }]} accessibilityLabel="Cerrar">
            <MaterialCommunityIcons name="close" size={18} color={P.text2} />
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
            style={[styles.reportBtn, { backgroundColor: P.raised }]} accessibilityLabel="Reportar Novedad en esta ruta"
            onPress={openReportModal}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="alert-circle-outline" size={20} color={P.text2} />
            
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.startTripBtn, { backgroundColor: P.brand }]}
            onPress={() => onSelectRoute(recommendation)}
            activeOpacity={0.85}
          >
            <MaterialCommunityIcons name="navigation-variant" size={18} color={P.onBrand} style={{ marginRight: 6 }} />
            <Text style={[styles.startTripText, { color: P.onBrand }]}>{t('search.viewRouteOnMap', 'Ver Ruta en el Mapa')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
