import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRoutesStore } from '../../../store/useRoutesStore';
import { useTrackingStore } from '../../../store/useTrackingStore';
import { useAppTheme } from '../../../hooks/useAppTheme';
import { calculateDistanceMeters } from '../../../utils/geo.utils';
import { styles } from './StopTimeline.styles';

interface StopTimelineProps {
  onPressDetails?: () => void;
}

/**
 * Tarjeta de acción de la ruta. Sin paraderos: los buses paran donde el usuario
 * les haga la parada, así que mostramos cuánto falta para llegar a la ruta y
 * el botón para empezar a compartir el viaje a bordo.
 */
export const StopTimeline: React.FC<StopTimelineProps> = ({ onPressDetails }) => {
  const selectedRoute = useRoutesStore((s) => s.getSelectedRoute());
  const boardPoint = useTrackingStore((s) => s.originStopLocation);
  const currentLocation = useTrackingStore((s) => s.currentLocation);
  const { palette: P } = useAppTheme();

  // Si no hay ruta seleccionada, no renderizar
  if (!selectedRoute) {
    return null;
  }

  const walkMeters = boardPoint && currentLocation
    ? Math.round(calculateDistanceMeters(currentLocation, boardPoint) * 1.3)
    : null;

  return (
    <View style={[styles.card, { backgroundColor: P.surface, borderColor: P.line, shadowColor: P.shadow }]}>
      {boardPoint && (
        <View style={styles.stepRow}>
          <View style={[styles.stepIcon, { backgroundColor: P.raised }]}>
            <MaterialCommunityIcons name="walk" size={20} color={P.text} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.stepTitle, { color: P.text }]}>
              {walkMeters != null ? `Camina ${walkMeters} m hasta la ruta` : 'Camina hasta la ruta'}
            </Text>
            <Text style={[styles.stepSub, { color: P.muted }]} numberOfLines={1}>
              {boardPoint.name || 'Punto de la ruta más cercano'} · hazle la parada al bus
            </Text>
          </View>
        </View>
      )}

      <TouchableOpacity
        style={[styles.detailsButton, { backgroundColor: P.brand }]}
        onPress={onPressDetails}
        activeOpacity={0.85}
        accessibilityRole="button"
      >
        <MaterialCommunityIcons name="bus-marker" size={20} color={P.onBrand} />
        <Text style={[styles.detailsButtonText, { color: P.onBrand }]}>Ya voy en el bus</Text>
      </TouchableOpacity>
      <Text style={[styles.helper, { color: P.muted }]}>
        Compartirás tu ubicación para que otros vean este bus en vivo.
      </Text>
    </View>
  );
};
