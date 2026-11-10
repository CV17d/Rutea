import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RouteRecommendation } from '../../types/trip.types';
import { STANDARD_ROUTES_PART2 } from '../../constants/routes/standardRoutes2';
import { MOCK_PASTO_ROUTES } from '../../constants/mockRoutes';
import { useTranslation } from '../../i18n/useTranslation';
import { LiveArrivalBadge } from '../ui/LiveArrivalBadge';
import { styles } from './TripTimeline.styles';

export interface TripTimelineProps {
  recommendation: RouteRecommendation;
}

export const TripTimeline: React.FC<TripTimelineProps> = ({ recommendation }) => {
  const [isStopsExpanded, setIsStopsExpanded] = useState(false);
  const { t, language } = useTranslation();
  const isEn = language === 'en';

  const {
    routeId,
    routeCode,
    routeName,
    originStop,
    destStop,
    walkingDistanceMeters,
    estimatedWalkingMinutes,
  } = recommendation;

  // Extraer color respectivo
  const s2Route = STANDARD_ROUTES_PART2.find((r) => r.id === routeId || r.code === routeCode);
  const badgeColor = s2Route?.color || recommendation.routeColor || '#0284c7';

  // Obtener paradas intermedias de la ruta
  const fullRoute = MOCK_PASTO_ROUTES.find((r) => r.id === routeId);
  const intermediateStops = (() => {
    if (!fullRoute?.stops) return [];
    const origIdx = fullRoute.stops.findIndex((s) => s.id === originStop.id || s.name === originStop.name);
    const destIdx = fullRoute.stops.findIndex((s) => s.id === destStop.id || s.name === destStop.name);
    if (origIdx >= 0 && destIdx > origIdx) {
      return fullRoute.stops.slice(origIdx + 1, destIdx);
    }
    return [];
  })();

  const intermediateCount = intermediateStops.length || 3;

  return (
    <View style={styles.container}>
      {/* NODO 1: Caminata inicial */}
      <View style={styles.stepRow}>
        <View style={styles.leftCol}>
          <View style={[styles.iconCircle, styles.walkCircle]}>
            <MaterialCommunityIcons name="walk" size={18} color="#0284c7" />
          </View>
          <View style={styles.trackLine} />
        </View>
        <View style={styles.contentCol}>
          <Text style={styles.stepHeader}>
            {isEn ? `Walk ${walkingDistanceMeters}m to stop ${originStop.name}` : `Camina ${walkingDistanceMeters} metros hasta el paradero ${originStop.name}`}
          </Text>
          <Text style={styles.stepSubtext}>
            {isEn ? `~${estimatedWalkingMinutes} min walk` : `~${estimatedWalkingMinutes} min de caminata a pie`}
          </Text>
        </View>
      </View>

      {/* NODO 2: Trayecto en Bus */}
      <View style={styles.stepRow}>
        <View style={styles.leftCol}>
          <View style={[styles.iconCircle, styles.busCircle, { backgroundColor: badgeColor }]}>
            <MaterialCommunityIcons name="bus" size={18} color="#ffffff" />
          </View>
          <View style={styles.trackLine} />
        </View>
        <View style={styles.contentCol}>
          <Text style={styles.stepHeader}>
            {isEn ? `Take ${routeName} (${routeCode})` : `Toma la ${routeName} (${routeCode})`}
          </Text>

          <View style={styles.badgeWrap}>
            <LiveArrivalBadge routeId={routeId} targetLocation={originStop.location} />
          </View>

          <TouchableOpacity
            style={styles.intermediateToggle}
            onPress={() => setIsStopsExpanded(!isStopsExpanded)}
            activeOpacity={0.7}
          >
            <Text style={styles.intermediateToggleText}>
              {isEn ? `Ride for ${intermediateCount} stops` : `Viaja durante ${intermediateCount} paradas`}
            </Text>
            <MaterialCommunityIcons
              name={isStopsExpanded ? 'chevron-up' : 'chevron-down'}
              size={16}
              color="#334155"
            />
          </TouchableOpacity>

          {isStopsExpanded && intermediateStops.length > 0 && (
            <View style={styles.intermediateList}>
              {intermediateStops.map((stop) => (
                <Text key={stop.id} style={styles.intermediateItem}>
                  • {stop.name}
                </Text>
              ))}
            </View>
          )}
        </View>
      </View>

      {/* NODO 3: Llegada a Destino */}
      <View style={styles.stepRow}>
        <View style={styles.leftCol}>
          <View style={[styles.iconCircle, styles.destCircle]}>
            <MaterialCommunityIcons name="flag-checkered" size={18} color="#ef4444" />
          </View>
        </View>
        <View style={styles.contentCol}>
          <Text style={styles.stepHeader}>{isEn ? `Get off at ${destStop.name}` : `Bájate en ${destStop.name}`}</Text>
          <Text style={styles.stepSubtext}>{t('alerts.arrivedAtStop', 'Llegada a tu destino final')}</Text>
        </View>
      </View>
    </View>
  );
};
