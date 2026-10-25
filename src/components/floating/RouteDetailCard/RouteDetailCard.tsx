import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { GlassCard } from '../../ui/GlassCard';
import { GlassButton } from '../../ui/GlassButton';
import { GlassBadge } from '../../ui/GlassBadge';
import { useRoutesStore } from '../../../store/useRoutesStore';
import { useTrackingStore } from '../../../store/useTrackingStore';
import { useUserSessionStore } from '../../../store/useUserSessionStore';
import { useUiStore } from '../../../store/useUiStore';
import { useLocationTracking } from '../../../hooks/useLocationTracking';
import { formatEtaMinutes } from '../../../utils/time.utils';
import { calculateDistanceMeters } from '../../../utils/geo.utils';
import { routeDetailCardStyles as styles } from './RouteDetailCard.styles';

export const RouteDetailCard: React.FC = () => {
  const selectedRoute = useRoutesStore((s) => s.getSelectedRoute());
  const currentLocation = useTrackingStore((s) => s.currentLocation);
  const getBusesByRoute = useTrackingStore((s) => s.getBusesByRoute);
  const startBroadcasting = useUserSessionStore((s) => s.startBroadcasting);
  const { screenMode, setScreenMode } = useUiStore();
  const { startTracking } = useLocationTracking();

  const userPoint = useMemo(() => {
    return currentLocation
      ? { latitude: currentLocation.latitude, longitude: currentLocation.longitude }
      : { latitude: 1.2136, longitude: -77.2811 }; // Plaza de Nariño
  }, [currentLocation]);

  const nearestData = useMemo(() => {
    if (!selectedRoute || !selectedRoute.stops.length) return null;

    let nearest = selectedRoute.stops[0];
    let minDist = Infinity;
    for (const stop of selectedRoute.stops) {
      const d = calculateDistanceMeters(userPoint, stop.coordinate);
      if (d < minDist) {
        minDist = d;
        nearest = stop;
      }
    }

    const buses = getBusesByRoute(selectedRoute.id);
    let closestBus = buses[0];
    let minBusDist = Infinity;
    for (const bus of buses) {
      const d = calculateDistanceMeters(bus.snappedPosition, nearest.coordinate);
      if (d < minBusDist) {
        minBusDist = d;
        closestBus = bus;
      }
    }

    const eta = minBusDist !== Infinity
      ? Math.max(1, Math.round(minBusDist / 300))
      : nearest.estimatedWaitMinutes || 4;

    return {
      nearestStop: nearest,
      stopDistanceMeters: Math.round(minDist),
      closestBus,
      etaMinutes: eta,
      isLive: closestBus?.status === 'LIVE',
    };
  }, [selectedRoute, userPoint, getBusesByRoute]);

  if (!selectedRoute || !nearestData) return null;

  const isRouteDetailMode = screenMode === 'ROUTE_DETAILS';

  const handleStartBoarding = () => {
    startBroadcasting(selectedRoute.id);
    startTracking(selectedRoute.id);
    setScreenMode('ON_BOARD');
  };

  return (
    <View style={styles.container}>
      <GlassCard isHighlighted style={styles.card}>
        <View style={styles.headerBlock}>
          <View style={{ flex: 1, marginRight: 12 }}>
            <View style={styles.routeHeaderRow}>
              <View style={[styles.codeBadge, { backgroundColor: selectedRoute.color }]}>
                <Text style={styles.codeText}>{selectedRoute.code}</Text>
              </View>
              <Text style={styles.routeName} numberOfLines={1}>
                {selectedRoute.name}
              </Text>
            </View>
            <Text style={styles.nextStopLabel}>
              Paradero más cercano: {nearestData.nearestStop.name} ({nearestData.stopDistanceMeters}m)
            </Text>
          </View>

          <View style={styles.etaContainer}>
            <Text style={styles.etaNumber}>
              {formatEtaMinutes(nearestData.etaMinutes)}
            </Text>
            <GlassBadge
              type={nearestData.isLive ? 'LIVE' : 'DEFAULT'}
              label={nearestData.isLive ? 'EN VIVO' : 'ESTIMADO'}
            />
          </View>
        </View>

        {isRouteDetailMode && (
          <View style={styles.stopsSection}>
            <Text style={styles.stopsHeader}>PARADEROS Y TIEMPOS DE ESPERA</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.stopsScroll}>
              {selectedRoute.stops.map((stop) => (
                <View key={stop.id} style={styles.stopChip}>
                  <Text style={styles.stopChipName} numberOfLines={1}>{stop.name}</Text>
                  <Text style={styles.stopChipTime}>{formatEtaMinutes(stop.estimatedWaitMinutes)}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.expandToggle}
            onPress={() => setScreenMode(isRouteDetailMode ? 'HOME' : 'ROUTE_DETAILS')}
          >
            <Text style={styles.expandToggleText}>
              {isRouteDetailMode ? '▼ Menos detalles' : '▲ Ver paraderos'}
            </Text>
          </TouchableOpacity>

          <GlassButton
            label="⚡ Estoy a bordo de esta ruta"
            variant="primary"
            onPress={handleStartBoarding}
            style={styles.boardBtn}
          />
        </View>
      </GlassCard>
    </View>
  );
};
