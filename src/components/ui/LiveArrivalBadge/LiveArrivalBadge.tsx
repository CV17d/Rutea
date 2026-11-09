import React from 'react';
import { View, Text, StyleProp, ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LatLng } from '../../../types/route.types';
import { useTrackingStore } from '../../../store/useTrackingStore';
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
  const busList = Object.values(activeBuses);

  if (!targetLocation) {
    return (
      <View style={[styles.fallbackContainer, style]}>
        <MaterialCommunityIcons name="bus" size={13} color="#64748b" />
        <Text style={styles.fallbackText}>Frecuencia estimada: ~10 min</Text>
      </View>
    );
  }

  const arrivalInfo = findClosestApproachingBus(busList, targetLocation, routeId);

  if (!arrivalInfo) {
    return (
      <View style={[styles.fallbackContainer, style]}>
        <MaterialCommunityIcons name="bus" size={13} color="#64748b" />
        <Text style={styles.fallbackText}>
          {customLabel || 'Próximo bus en camino (~8-12 min)'}
        </Text>
      </View>
    );
  }

  const { displayText, distanceMeters } = arrivalInfo;
  const distLabel = distanceMeters < 1000 ? `${distanceMeters}m` : `${(distanceMeters / 1000).toFixed(1)}km`;

  return (
    <View style={[styles.container, style]}>
      <View style={styles.pulseDot} />
      <MaterialCommunityIcons name="bus" size={13} color="#15803d" />
      <Text style={styles.text} numberOfLines={1}>
        {displayText}
      </Text>
      <Text style={styles.distText}>({distLabel})</Text>
    </View>
  );
};
