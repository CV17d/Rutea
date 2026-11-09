import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRoutesStore } from '../../../store/useRoutesStore';
import { useUiStore } from '../../../store/useUiStore';
import { LiveArrivalBadge } from '../../ui/LiveArrivalBadge';
import { routeSummaryCardStyles as styles } from './RouteSummaryCard.styles';

export const RouteSummaryCard: React.FC = () => {
  const selectedRoute = useRoutesStore((s) => s.getSelectedRoute());
  const setScreenMode = useUiStore((s) => s.setScreenMode);
  const [isFavorite, setIsFavorite] = useState(false);

  // Si no hay ruta seleccionada, no renderizar tarjeta fantasma
  if (!selectedRoute) {
    return null;
  }

  const displayTitle = `Ruta ${selectedRoute.code} • ${selectedRoute.name}`;
  const firstStopLoc = selectedRoute.stops?.[0]?.location;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => setScreenMode('ROUTE_DETAILS')}
      style={styles.card}
    >
      <View style={styles.headerRow}>
        <Text style={styles.titleText} numberOfLines={1}>
          {displayTitle}
        </Text>
        <TouchableOpacity
          onPress={() => setIsFavorite(!isFavorite)}
          style={styles.favoriteBtn}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={18}
            color={isFavorite ? '#ef4444' : '#64748b'}
          />
        </TouchableOpacity>
      </View>

      <View style={{ marginBottom: 10 }}>
        <LiveArrivalBadge routeId={selectedRoute.id} targetLocation={firstStopLoc} />
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCol}>
          <Text style={styles.statValue}>78 Visitas</Text>
          <Text style={styles.statSubtext}>aproximadas</Text>
        </View>

        <View style={[styles.statCol, { alignItems: 'flex-start', paddingLeft: 20 }]}>
          <Text style={styles.statValue}>3 Pasajeros</Text>
          <View style={styles.liveIndicatorRow}>
            <View style={styles.pulseGreenDot} />
            <Text style={styles.liveText}>en vivo</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
