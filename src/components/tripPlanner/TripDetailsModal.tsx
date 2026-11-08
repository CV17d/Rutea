import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { RouteRecommendation } from '../../types/trip.types';
import { STANDARD_ROUTES_PART2 } from '../../constants/routes/standardRoutes2';
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
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.timelineScroll}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
        >
          <TripTimeline recommendation={recommendation} />
        </ScrollView>

        <TouchableOpacity
          style={styles.startTripBtn}
          onPress={() => onSelectRoute(recommendation)}
          activeOpacity={0.85}
        >
          <Text style={styles.startTripText}>Ver Ruta en el Mapa ➔</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
