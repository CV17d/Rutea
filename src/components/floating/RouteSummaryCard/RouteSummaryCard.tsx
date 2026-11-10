import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRoutesStore } from '../../../store/useRoutesStore';
import { useUiStore } from '../../../store/useUiStore';
import { useTrackingStore } from '../../../store/useTrackingStore';
import { useTranslation } from '../../../i18n/useTranslation';
import { useAppTheme } from '../../../hooks/useAppTheme';
import { LiveArrivalBadge } from '../../ui/LiveArrivalBadge';
import { makeRouteSummaryCardStyles } from './RouteSummaryCard.styles';
import { useThemedStyles } from '../../../hooks/useThemedStyles';

export const RouteSummaryCard: React.FC = () => {
  const styles = useThemedStyles(makeRouteSummaryCardStyles);
  const selectedRoute = useRoutesStore((s) => s.getSelectedRoute());
  const setScreenMode = useUiStore((s) => s.setScreenMode);
  const { t } = useTranslation();
  const { palette } = useAppTheme();
  const [isFavorite, setIsFavorite] = useState(false);
  const boardPoint = useTrackingStore((st) => st.originStopLocation);
  const activeBuses = useTrackingStore((st) => st.activeBuses);

  // Si no hay ruta seleccionada, no renderizar tarjeta fantasma
  if (!selectedRoute) {
    return null;
  }

  const displayTitle = `${t('nav.routes', 'Ruta')} ${selectedRoute.code} • ${selectedRoute.name}`;
  const liveBusCount = Object.values(activeBuses).filter((b) => b.routeId === selectedRoute.id).length;
  // Si el usuario planeó un viaje, el ETA se calcula hasta su punto de abordaje.
  const firstStopLoc = boardPoint ? { latitude: boardPoint.latitude, longitude: boardPoint.longitude } : selectedRoute.stops?.[0]?.location;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => setScreenMode('ROUTE_DETAILS')}
      style={[styles.card]}
    >
      <View style={styles.headerRow}>
        <Text style={[styles.titleText]} numberOfLines={1}>
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
            color={isFavorite ? palette.danger : palette.muted}
          />
        </TouchableOpacity>
      </View>

      <View style={{ marginBottom: 10 }}>
        <LiveArrivalBadge routeId={selectedRoute.id} targetLocation={firstStopLoc} />
      </View>

      <View style={styles.liveIndicatorRow}>
        <View style={[styles.pulseGreenDot, liveBusCount === 0 && { backgroundColor: '#94a3b8' }]} />
        <Text style={[styles.liveText, liveBusCount === 0 && { color: '#94a3b8' }]}>
          {liveBusCount === 1 ? '1 bus en vivo' : `${liveBusCount} buses en vivo`}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
