import React from 'react';
import { View, Text, StyleProp, ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LatLng } from '../../../types/route.types';
import { useTrackingStore } from '../../../store/useTrackingStore';
import { useTranslation } from '../../../i18n/useTranslation';
import { useAppTheme } from '../../../hooks/useAppTheme';
import { findNextBusAlongRoute } from '../../../services/etaCalculator.service';
import { getRoutePath, projectOnPath } from '../../../services/routeBoarding.service';
import { styles } from './LiveArrivalBadge.styles';

export interface LiveArrivalBadgeProps {
  routeId?: string;
  targetLocation?: LatLng;
  style?: StyleProp<ViewStyle>;
  customLabel?: string;
  /** Posición exacta del punto de abordaje sobre el recorrido (si se conoce). */
  boardAlongMeters?: number;
}

export const LiveArrivalBadge: React.FC<LiveArrivalBadgeProps> = ({
  routeId,
  targetLocation,
  style,
  customLabel,
  boardAlongMeters,
}) => {
  const activeBuses = useTrackingStore((s) => s.activeBuses);
  const { language } = useTranslation();
  const { palette: P } = useAppTheme();
  const isEn = language === 'en';
  const busList = Object.values(activeBuses);

  if (!targetLocation) {
    return (
      <View style={[styles.fallbackContainer, { backgroundColor: P.raised }, style]}>
        <MaterialCommunityIcons name="bus-clock" size={14} color={P.muted} />
        <Text style={[styles.fallbackText, { color: P.text2 }]}>
          {isEn ? 'Est. frequency: ~10 min' : 'Frecuencia estimada: ~10 min'}
        </Text>
      </View>
    );
  }

  const path = routeId ? getRoutePath(routeId) : null;
  const boardAlong = boardAlongMeters ?? (path ? projectOnPath(path, targetLocation)?.alongMeters : undefined);
  const arrivalInfo = routeId && path && boardAlong != null ? findNextBusAlongRoute(busList, routeId, path, boardAlong) : null;

  if (!arrivalInfo) {
    return (
      <View style={[styles.fallbackContainer, { backgroundColor: P.raised }, style]}>
        <MaterialCommunityIcons name="bus-clock" size={14} color={P.muted} />
        <Text style={[styles.fallbackText, { color: P.text2 }]}>
          {customLabel || (isEn ? 'No live buses on this route right now' : 'Sin buses en vivo de esta ruta ahora')}
        </Text>
      </View>
    );
  }

  const { displayText, distanceMeters, etaMinutes, bus } = arrivalInfo;
  const distLabel = distanceMeters < 1000 ? `${distanceMeters}m` : `${(distanceMeters / 1000).toFixed(1)}km`;
  const alias = bus.broadcasterAlias || `Bus ${bus.routeCode}`;
  const localizedLabel = isEn
    ? (etaMinutes <= 1 ? `${alias} arriving now (< 1 min)` : `${alias} arriving in ~${etaMinutes} min`)
    : displayText;

  return (
    <View style={[styles.container, { backgroundColor: P.liveSoft }, style]}>
      <View style={[styles.pulseDot, { backgroundColor: P.live }]} />
      <MaterialCommunityIcons name="bus" size={14} color={P.live} />
      <Text style={[styles.text, { color: P.text }]} numberOfLines={1}>
        {localizedLabel}
      </Text>
      <Text style={[styles.distText, { color: P.live }]}>({distLabel})</Text>
    </View>
  );
};
