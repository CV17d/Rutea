import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { GlassCard } from '../../ui/GlassCard';
import { GlassButton } from '../../ui/GlassButton';
import { GlassBadge } from '../../ui/GlassBadge';
import { useRoutesStore } from '../../../store/useRoutesStore';
import { useUserSessionStore } from '../../../store/useUserSessionStore';
import { useUiStore } from '../../../store/useUiStore';
import { formatEtaMinutes } from '../../../utils/time.utils';

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
        {/* Header Block: High contrast ETA & Points */}
        <View style={styles.headerBlock}>
          <View>
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

        {/* Stops Preview List if Expanded */}
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

        {/* Action Controls */}
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

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    zIndex: 25,
  },
  card: {
    padding: 16,
  },
  headerBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  routeHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  codeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  codeText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '900',
  },
  routeName: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
    maxWidth: 180,
  },
  nextStopLabel: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  etaContainer: {
    alignItems: 'flex-end',
    gap: 4,
  },
  etaNumber: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  stopsSection: {
    marginTop: 6,
    marginBottom: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.12)',
  },
  stopsHeader: {
    color: '#38bdf8',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  stopsScroll: {
    flexDirection: 'row',
  },
  stopChip: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  stopChipName: {
    color: '#cbd5e1',
    fontSize: 11,
    fontWeight: '600',
    maxWidth: 110,
  },
  stopChipTime: {
    color: '#10b981',
    fontSize: 12,
    fontWeight: '900',
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  expandToggle: {
    paddingVertical: 8,
  },
  expandToggleText: {
    color: '#38bdf8',
    fontSize: 12,
    fontWeight: '700',
  },
  boardBtn: {
    flex: 1,
    paddingVertical: 12,
  },
});
