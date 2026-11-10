import React from 'react';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RouteRecommendation } from '../../types/trip.types';
import { STANDARD_ROUTES_PART2 } from '../../constants/routes/standardRoutes2';
import { useTranslation } from '../../i18n/useTranslation';
import { useAppTheme } from '../../hooks/useAppTheme';
import { LiveArrivalBadge } from '../ui/LiveArrivalBadge';
import { styles } from './TripTimeline.styles';

export interface TripTimelineProps {
  recommendation: RouteRecommendation;
}

export const TripTimeline: React.FC<TripTimelineProps> = ({ recommendation }) => {
  const { t, language } = useTranslation();
  const { palette: P } = useAppTheme();
  const isEn = language === 'en';

  const {
    routeId, routeCode, routeName, originStop, destStop,
    walkingDistanceMeters, estimatedWalkingMinutes,
    destWalkingDistanceMeters, destWalkingMinutes,
    rideDistanceMeters, rideMinutes, boardAlongMeters,
  } = recommendation;

  const s2Route = STANDARD_ROUTES_PART2.find((r) => r.id === routeId || r.code === routeCode);
  const badgeColor = s2Route?.color || recommendation.routeColor || '#0284c7';

  // Los buses paran en cualquier punto: no hay paraderos intermedios, sólo distancia y tiempo reales.
  const rideKm = ((rideDistanceMeters || 0) / 1000).toFixed(1);
  const header = [styles.stepHeader, { color: P.text }];
  const sub = [styles.stepSubtext, { color: P.text2 }];

  return (
    <View style={styles.container}>
      {/* NODO 1: Caminata inicial */}
      <View style={styles.stepRow}>
        <View style={styles.leftCol}>
          <View style={[styles.iconCircle, styles.walkCircle, { backgroundColor: P.raised }]}>
            <MaterialCommunityIcons name="walk" size={18} color={P.text} />
          </View>
          <View style={[styles.trackLine, styles.walkLine, { borderColor: P.muted }]} />
        </View>
        <View style={styles.contentCol}>
          <Text style={header}>
            {isEn ? `Walk ${walkingDistanceMeters}m to the route and wave the bus down` : `Camina ${walkingDistanceMeters} metros hasta la ruta y hazle la parada al bus`}
          </Text>
          <Text style={sub}>{originStop.name} · ~{estimatedWalkingMinutes} min</Text>
        </View>
      </View>

      {/* NODO 2: Trayecto en Bus */}
      <View style={styles.stepRow}>
        <View style={styles.leftCol}>
          <View style={[styles.iconCircle, styles.busCircle, { backgroundColor: badgeColor }]}>
            <MaterialCommunityIcons name="bus" size={18} color="#ffffff" />
          </View>
          <View style={[styles.trackLine, { backgroundColor: badgeColor }]} />
        </View>
        <View style={styles.contentCol}>
          <Text style={header}>{isEn ? `Take ${routeName}` : `Toma la ${routeName}`}</Text>
          <Text style={sub}>
            {isEn ? `Ride ${rideKm} km (~${rideMinutes} min)` : `Viaja ${rideKm} km en bus (~${rideMinutes} min)`}
          </Text>
          <View style={styles.badgeWrap}>
            <LiveArrivalBadge routeId={routeId} targetLocation={originStop.location} boardAlongMeters={boardAlongMeters} />
          </View>
        </View>
      </View>

      {/* NODO 3: Llegada a Destino */}
      <View style={styles.stepRow}>
        <View style={styles.leftCol}>
          <View style={[styles.iconCircle, styles.destCircle, { backgroundColor: P.dangerSoft }]}>
            <MaterialCommunityIcons name="flag-checkered" size={18} color={P.danger} />
          </View>
        </View>
        <View style={styles.contentCol}>
          <Text style={header}>{isEn ? `Get off: ${destStop.name}` : `Bájate en: ${destStop.name}`}</Text>
          <Text style={sub}>
            {(destWalkingDistanceMeters ?? 0) > 0
              ? (isEn ? `Then walk ${destWalkingDistanceMeters} m (~${destWalkingMinutes} min) to your destination` : `Luego camina ${destWalkingDistanceMeters} m (~${destWalkingMinutes} min) hasta tu destino`)
              : t('alerts.arrivedAtStop', 'Llegada a tu destino final')}
          </Text>
        </View>
      </View>
    </View>
  );
};
