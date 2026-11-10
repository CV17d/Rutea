import React from 'react';
import { View, Text } from 'react-native';
import { useRoutesStore } from '../../../store/useRoutesStore';
import { useTrackingStore } from '../../../store/useTrackingStore';
import { useAppTheme } from '../../../hooks/useAppTheme';
import { findNextBusAlongRoute } from '../../../services/etaCalculator.service';
import { getRoutePath, projectOnPath } from '../../../services/routeBoarding.service';
import { styles } from './RouteHeroCard.styles';

interface RouteHeroCardProps {
  routeCode?: string;
}

/**
 * Cabecera de la ruta seleccionada: placa de la ruta y el ETA real del próximo bus
 * hasta el punto de abordaje del usuario (o su ubicación actual).
 */
export const RouteHeroCard: React.FC<RouteHeroCardProps> = ({ routeCode }) => {
  const selectedRoute = useRoutesStore((s) => s.getSelectedRoute());
  const activeBuses = useTrackingStore((s) => s.activeBuses);
  const boardPoint = useTrackingStore((s) => s.originStopLocation);
  const currentLocation = useTrackingStore((s) => s.currentLocation);
  const { palette: P } = useAppTheme();

  // Si no hay ruta seleccionada ni código provisto, no renderizar
  if (!selectedRoute && !routeCode) {
    return null;
  }

  const routeBuses = selectedRoute ? Object.values(activeBuses).filter((b) => b.routeId === selectedRoute.id) : [];
  const target = boardPoint || currentLocation;
  const path = selectedRoute ? getRoutePath(selectedRoute.id) : null;
  const along = path && target ? projectOnPath(path, target)?.alongMeters : undefined;
  const next = selectedRoute && path && along != null ? findNextBusAlongRoute(routeBuses, selectedRoute.id, path, along) : null;
  const code = selectedRoute?.code || routeCode || '';

  return (
    <View style={[styles.container, { backgroundColor: P.surface, borderColor: P.line, shadowColor: P.shadow }]}>
      <View style={[styles.codeTile, { backgroundColor: selectedRoute?.color || P.brand }]}>
        <Text style={styles.codeText}>{code}</Text>
      </View>

      <View style={styles.infoCol}>
        <Text style={[styles.routeTitle, { color: P.text }]} numberOfLines={1}>{selectedRoute?.name || code}</Text>
        {!!selectedRoute?.description && (
          <Text style={[styles.routeDesc, { color: P.muted }]} numberOfLines={1}>{selectedRoute.description}</Text>
        )}
        <View style={styles.liveRow}>
          <View style={[styles.liveDot, { backgroundColor: routeBuses.length > 0 ? P.live : P.muted }]} />
          <Text style={[styles.liveText, { color: P.text2 }]}>
            {routeBuses.length === 1 ? '1 bus en vivo' : `${routeBuses.length} buses en vivo`}
          </Text>
        </View>
      </View>

      <View style={styles.etaCol}>
        {next ? (
          <>
            <Text style={[styles.etaNumber, { color: P.live }]}>{next.etaMinutes}</Text>
            <Text style={[styles.etaLabel, { color: P.muted }]}>min · próximo</Text>
          </>
        ) : (
          <>
            <Text style={[styles.etaNumber, { color: P.muted }]}>–</Text>
            <Text style={[styles.etaLabel, { color: P.muted }]}>sin datos</Text>
          </>
        )}
      </View>
    </View>
  );
};
