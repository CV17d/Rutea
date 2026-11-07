import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRoutesStore } from '../../../store/useRoutesStore';
import { styles } from './StopTimeline.styles';

export interface TimelineStop {
  id: string;
  name: string;
  eta: string;
  variant: 'pink' | 'green' | 'gray';
}

const DEFAULT_STOPS: TimelineStop[] = [
  { id: '1', name: 'Anganoy', eta: '2 min', variant: 'pink' },
  { id: '2', name: 'Teatro Imperial', eta: '11 min', variant: 'green' },
  { id: '3', name: 'Cabrera', eta: '28 min', variant: 'gray' },
];

interface StopTimelineProps {
  stops?: TimelineStop[];
  onPressDetails?: () => void;
}

export const StopTimeline: React.FC<StopTimelineProps> = ({
  stops,
  onPressDetails,
}) => {
  const selectedRoute = useRoutesStore((s) => s.getSelectedRoute());

  const activeStops: TimelineStop[] = stops || (selectedRoute?.stops && selectedRoute.stops.length > 0
    ? selectedRoute.stops.map((s, idx) => ({
        id: s.id,
        name: s.name,
        eta: `${s.estimatedWaitMinutes} min`,
        variant: idx === 0 ? 'pink' : idx === selectedRoute.stops.length - 1 ? 'gray' : 'green',
      }))
    : DEFAULT_STOPS);

  return (
    <View style={styles.card}>
      <ScrollView
        style={[styles.stopsContainer, { maxHeight: 220 }]}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
      >
        {activeStops.map((stop, index) => {
          const isLast = index === activeStops.length - 1;

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
      </ScrollView>

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
