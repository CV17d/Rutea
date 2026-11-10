import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RouteRecommendation } from '../../types/trip.types';
import { STANDARD_ROUTES_PART2 } from '../../constants/routes/standardRoutes2';
import { useTranslation } from '../../i18n/useTranslation';
import { LiveArrivalBadge } from '../ui/LiveArrivalBadge';
import { styles } from './RouteRecommendationCard.styles';

interface Props {
  recommendation: RouteRecommendation;
  onSelect?: (rec: RouteRecommendation) => void;
}

export const RouteRecommendationCard: React.FC<Props> = ({ recommendation, onSelect }) => {
  const { t } = useTranslation();
  const {
    routeId,
    routeCode,
    routeName,
    originStop,
    destStop,
    walkingDistanceMeters,
    estimatedWalkingMinutes,
  } = recommendation;

  // Extraer color temático oficial desde standardRoutes2 si pertenece a C9-C16
  const s2Route = STANDARD_ROUTES_PART2.find((r) => r.id === routeId || r.code === routeCode);
  const badgeColor = s2Route?.color || recommendation.routeColor || '#0284c7';

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => onSelect && onSelect(recommendation)}
    >
      <View style={styles.headerRow}>
        <View style={[styles.codeBadge, { backgroundColor: badgeColor }]}>
          <Text style={styles.codeText}>{routeCode}</Text>
        </View>
        <View style={styles.titleCol}>
          <Text style={styles.routeName} numberOfLines={1}>
            {routeName}
          </Text>
          <View style={styles.walkingRow}>
            <MaterialCommunityIcons name="walk" size={14} color="#0284c7" />
            <Text style={styles.walkingText}>
              A {walkingDistanceMeters} m a pie (~{estimatedWalkingMinutes} min)
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.itineraryBox}>
        <View style={styles.stopRow}>
          <View style={[styles.indicatorDot, { backgroundColor: '#10b981' }]} />
          <View style={styles.stopInfo}>
            <Text style={styles.stopLabel}>Subirse en:</Text>
            <Text style={styles.stopName} numberOfLines={1}>
              {originStop.name}
            </Text>
          </View>
        </View>

        <View style={styles.itineraryLine} />

        <View style={styles.stopRow}>
          <View style={[styles.indicatorDot, { backgroundColor: '#ef4444' }]} />
          <View style={styles.stopInfo}>
            <Text style={styles.stopLabel}>Bajarse en:</Text>
            <Text style={styles.stopName} numberOfLines={1}>
              {destStop.name}
            </Text>
          </View>
        </View>
      </View>

      <View style={{ marginTop: 8 }}>
        <LiveArrivalBadge routeId={routeId} targetLocation={originStop.location} />
      </View>

      <View style={styles.footerRow}>
        <Text style={styles.selectBtnText}>{t('search.viewRouteOnMap', 'Ver en mapa')}</Text>
        <MaterialCommunityIcons name="arrow-right" size={14} color="#0284c7" />
      </View>
    </TouchableOpacity>
  );
};
