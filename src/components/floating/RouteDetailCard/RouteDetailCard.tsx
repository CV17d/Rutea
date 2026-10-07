import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { GlassCard } from '../../ui/GlassCard';
import { GlassButton } from '../../ui/GlassButton';
import { GlassBadge } from '../../ui/GlassBadge';
import { useRoutesStore } from '../../../store/useRoutesStore';
import { useUserSessionStore } from '../../../store/useUserSessionStore';
import { useUiStore } from '../../../store/useUiStore';
import { formatEtaMinutes } from '../../../utils/time.utils';
import { routeDetailCardStyles as styles } from './RouteDetailCard.styles';

export const RouteDetailCard: React.FC = () => {
  const selectedRoute = useRoutesStore((s) => s.getSelectedRoute());
  const startBroadcasting = useUserSessionStore((s) => s.startBroadcasting);
  const { screenMode, setScreenMode } = useUiStore();

  if (!selectedRoute) return null;

  const isRouteDetailMode = screenMode === 'ROUTE_DETAILS';
  const firstStop = selectedRoute.stops[0];
  const nextStop = selectedRoute.stops[1] || firstStop;

  const handleStartBoarding = () => {
    startBroadcasting(selectedRoute.id);
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
              Próxima: {nextStop ? nextStop.name : 'En ruta'}
            </Text>
          </View>

          <View style={styles.etaContainer}>
            <Text style={styles.etaNumber}>
              {formatEtaMinutes(nextStop ? nextStop.estimatedWaitMinutes : 4)}
            </Text>
            <GlassBadge type="LIVE" label="ACTIVO" />
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
