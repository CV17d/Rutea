import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from './StopTimeline.styles';

export interface TimelineStop {
  id: string;
  name: string;
  eta: string;
  variant: 'pink' | 'green' | 'gray';
}

const DEFAULT_STOPS: TimelineStop[] = [
  { id: '1', name: 'Parque Infantil', eta: '1 min', variant: 'pink' },
  { id: '2', name: 'Plaza de Nariño', eta: '3 min', variant: 'green' },
  { id: '3', name: 'Unicentro', eta: '3 min', variant: 'gray' },
];

interface StopTimelineProps {
  stops?: TimelineStop[];
  onPressDetails?: () => void;
}

export const StopTimeline: React.FC<StopTimelineProps> = ({
  stops = DEFAULT_STOPS,
  onPressDetails,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.stopsContainer}>
        {stops.map((stop, index) => {
          const isLast = index === stops.length - 1;

          return (
            <View
              key={stop.id}
              style={[styles.stopRow, !isLast && { marginBottom: 18 }]}
            >
              <View style={styles.indicatorCol}>
                {!isLast && <View style={styles.trackLine} />}
                {stop.variant === 'pink' ? (
                  <View style={[styles.iconCircle, styles.iconPink]}>
                    <Text style={styles.iconEmoji}>🚌</Text>
                  </View>
                ) : stop.variant === 'green' ? (
                  <View style={[styles.iconCircle, styles.iconGreen]}>
                    <View style={styles.greenDot} />
                  </View>
                ) : (
                  <View style={[styles.iconCircle, styles.iconGray]}>
                    <Text style={styles.iconEmoji}>🚌</Text>
                  </View>
                )}
              </View>

              <View style={styles.stopInfoCol}>
                <Text style={styles.stopName} numberOfLines={1}>
                  {stop.name}
                </Text>
                <View style={styles.stopSubtitleRow}>
                  <Text style={styles.stopSubtitle}>📍 Paradero</Text>
                </View>
              </View>

              <View style={styles.etaCol}>
                <Text style={styles.clockIcon}>⏱</Text>
                <Text style={styles.etaText}>{stop.eta}</Text>
              </View>
            </View>
          );
        })}
      </View>

      <TouchableOpacity
        style={styles.detailsButton}
        onPress={onPressDetails}
        activeOpacity={0.8}
      >
        <Text style={styles.detailsButtonText}>Ver detalles</Text>
      </TouchableOpacity>
    </View>
  );
};
