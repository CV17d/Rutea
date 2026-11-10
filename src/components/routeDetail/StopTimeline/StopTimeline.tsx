import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRoutesStore } from '../../../store/useRoutesStore';
import { useTranslation } from '../../../i18n/useTranslation';
import { styles } from './StopTimeline.styles';

export interface TimelineStop {
  id: string;
  name: string;
  eta: string;
  variant: 'pink' | 'green' | 'gray';
}

interface StopTimelineProps {
  stops?: TimelineStop[];
  onPressDetails?: () => void;
}

export const StopTimeline: React.FC<StopTimelineProps> = ({
  stops,
  onPressDetails,
}) => {
  const selectedRoute = useRoutesStore((s) => s.getSelectedRoute());
  const { t } = useTranslation();

  // Si no hay ruta seleccionada ni paradas provistas, no renderizar paradas fantasma
  if (!selectedRoute && (!stops || stops.length === 0)) {
    return null;
  }

  const activeStops: TimelineStop[] = stops || (selectedRoute?.stops && selectedRoute.stops.length > 0
    ? selectedRoute.stops.map((s, idx) => ({
        id: s.id,
        name: s.name,
        eta: `${s.estimatedWaitMinutes} min`,
        variant: idx === 0 ? 'pink' : idx === selectedRoute.stops.length - 1 ? 'gray' : 'green',
      }))
    : []);

  if (activeStops.length === 0) {
    return null;
  }

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
                    <MaterialCommunityIcons name="bus" size={14} color="#ec4899" />
                  </View>
                ) : stop.variant === 'green' ? (
                  <View style={[styles.iconCircle, styles.iconGreen]}>
                    <View style={styles.greenDot} />
                  </View>
                ) : (
                  <View style={[styles.iconCircle, styles.iconGray]}>
                    <MaterialCommunityIcons name="bus" size={14} color="#64748b" />
                  </View>
                )}
              </View>

              <View style={styles.stopInfoCol}>
                <Text style={styles.stopName} numberOfLines={1}>
                  {stop.name}
                </Text>
                <View style={styles.stopSubtitleRow}>
                  <Text style={styles.stopSubtitle}>{t('routeDetail.setpStop', 'Paradero SETP')}</Text>
                </View>
              </View>

              <View style={styles.etaCol}>
                <MaterialCommunityIcons name="clock-outline" size={13} color="#94a3b8" />
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
        <Text style={styles.detailsButtonText}>{t('routeDetail.viewDetails', 'Ver detalles')}</Text>
      </TouchableOpacity>
    </View>
  );
};
