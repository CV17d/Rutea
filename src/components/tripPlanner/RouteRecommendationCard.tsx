import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RouteRecommendation } from '../../types/trip.types';
import { STANDARD_ROUTES_PART2 } from '../../constants/routes/standardRoutes2';
import { useTranslation } from '../../i18n/useTranslation';
import { useAppTheme } from '../../hooks/useAppTheme';
import { LiveArrivalBadge } from '../ui/LiveArrivalBadge';
import { styles } from './RouteRecommendationCard.styles';

interface Props {
  recommendation: RouteRecommendation;
  onSelect?: (rec: RouteRecommendation) => void;
  /** Primera opción de la lista (la más rápida). */
  isBest?: boolean;
}

export const RouteRecommendationCard: React.FC<Props> = ({ recommendation, onSelect, isBest }) => {
  const { language } = useTranslation();
  const { palette: P } = useAppTheme();
  const isEn = language === 'en';
  const {
    routeId, routeCode, routeName, routeDescription, originStop, destStop,
    walkingDistanceMeters, estimatedWalkingMinutes, destWalkingMinutes = 0,
    rideMinutes = 0, totalMinutes, boardAlongMeters,
  } = recommendation;

  const s2Route = STANDARD_ROUTES_PART2.find((r) => r.id === routeId || r.code === routeCode);
  const badgeColor = s2Route?.color || recommendation.routeColor || '#0284c7';
  const total = totalMinutes ?? estimatedWalkingMinutes + rideMinutes + destWalkingMinutes;
  // Barra proporcional: caminata · bus · caminata (mínimo visible para tramos cortos).
  const segs = [estimatedWalkingMinutes, rideMinutes, destWalkingMinutes].map((m) => Math.max(m, 1));

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: P.surface, borderColor: isBest ? P.brand : P.line }]}
      activeOpacity={0.85}
      onPress={() => onSelect && onSelect(recommendation)}
      accessibilityRole="button"
      accessibilityLabel={`${routeName}, ${total} minutos en total`}
    >
      <View style={styles.headerRow}>
        <View style={[styles.codeBadge, { backgroundColor: badgeColor }]}>
          <Text style={styles.codeText}>{routeCode}</Text>
        </View>
        <View style={styles.titleCol}>
          {isBest && <Text style={[styles.bestTag, { color: P.brand }]}>{isEn ? 'Fastest' : 'La más rápida'}</Text>}
          <Text style={[styles.routeName, { color: P.text }]} numberOfLines={1}>{routeName}</Text>
          {!!routeDescription && <Text style={[styles.routeDesc, { color: P.muted }]} numberOfLines={1}>{routeDescription}</Text>}
        </View>
        <View style={styles.totalCol}>
          <Text style={[styles.totalValue, { color: P.text }]}>{total}</Text>
          <Text style={[styles.totalUnit, { color: P.muted }]}>min</Text>
        </View>
      </View>

      <View style={styles.legBar}>
        <View style={[styles.leg, { flex: segs[0], backgroundColor: P.raised }]} />
        <View style={[styles.leg, { flex: segs[1] * 1.2, backgroundColor: badgeColor }]} />
        <View style={[styles.leg, { flex: segs[2], backgroundColor: P.raised }]} />
      </View>
      <View style={styles.legLabels}>
        <View style={styles.legLabel}>
          <MaterialCommunityIcons name="walk" size={14} color={P.text2} />
          <Text style={[styles.legText, { color: P.text2 }]}>{estimatedWalkingMinutes} min</Text>
        </View>
        <View style={styles.legLabel}>
          <MaterialCommunityIcons name="bus" size={14} color={P.text2} />
          <Text style={[styles.legText, { color: P.text2 }]}>{rideMinutes} min</Text>
        </View>
        <View style={styles.legLabel}>
          <MaterialCommunityIcons name="walk" size={14} color={P.text2} />
          <Text style={[styles.legText, { color: P.text2 }]}>{destWalkingMinutes} min</Text>
        </View>
      </View>

      <View style={[styles.itineraryBox, { borderTopColor: P.line }]}>
        <Text style={[styles.stopName, { color: P.text }]} numberOfLines={1}>
          <Text style={{ color: P.muted }}>{isEn ? 'Board at: ' : 'Subirse en: '}</Text>{originStop.name}
          <Text style={{ color: P.muted }}>{`  ·  ${walkingDistanceMeters} m`}</Text>
        </Text>
        <Text style={[styles.stopName, { color: P.text }]} numberOfLines={1}>
          <Text style={{ color: P.muted }}>{isEn ? 'Get off at: ' : 'Bajarse en: '}</Text>{destStop.name}
        </Text>
      </View>

      <LiveArrivalBadge routeId={routeId} targetLocation={originStop.location} boardAlongMeters={boardAlongMeters} />
    </TouchableOpacity>
  );
};
