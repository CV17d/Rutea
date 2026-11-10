import React from 'react';
import { View, Text, StyleProp, ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LatLng } from '../../../types/route.types';
import { useTrackingStore } from '../../../store/useTrackingStore';
import { useTranslation } from '../../../i18n/useTranslation';
import { findClosestApproachingBus } from '../../../services/etaCalculator.service';
import { styles } from './LiveArrivalBadge.styles';

export interface LiveArrivalBadgeProps {
  routeId?: string;
  targetLocation?: LatLng;
  style?: StyleProp<ViewStyle>;
  customLabel?: string;
}

export const LiveArrivalBadge: React.FC<LiveArrivalBadgeProps> = ({
  routeId,
  targetLocation,
  style,
  customLabel,
}) => {
  const activeBuses = useTrackingStore((s) => s.activeBuses);
  const { language } = useTranslation();
  const isEn = language === 'en';
  const busList = Object.values(activeBuses);

  if (!targetLocation) {
    return (
      <View style={[styles.fallbackContainer, style]}>
        <MaterialCommunityIcons name="bus" size={13} color="#64748b" />
        <Text style={styles.fallbackText}>
          {isEn ? 'Est. frequency: ~10 min' : 'Frecuencia estimada: ~10 min'}
        </Text>
      </View>
    );
  }

  const arrivalInfo = findClosestApproachingBus(busList, targetLocation, routeId);

  if (!arrivalInfo) {
    return (
      <View style={[styles.fallbackContainer, style]}>
        <MaterialCommunityIcons name="bus" size={13} color="#64748b" />
        <Text style={styles.fallbackText}>
          {customLabel || (isEn ? 'Next bus on the way (~8-12 min)' : 'Próximo bus en camino (~8-12 min)')}
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
    <View style={[styles.container, style]}>
      <View style={styles.pulseDot} />
      <MaterialCommunityIcons name="bus" size={13} color="#15803d" />
      <Text style={styles.text} numberOfLines={1}>
        {localizedLabel}
      </Text>
      <Text style={styles.distText}>({distLabel})</Text>
    </View>
  );
};
