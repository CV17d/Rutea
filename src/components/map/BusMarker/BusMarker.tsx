import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';
import { ProjectedBusLocation } from '../../../types/telemetry.types';

export interface BusMarkerProps {
  bus: ProjectedBusLocation;
  onPress?: () => void;
}

export const BusMarker: React.FC<BusMarkerProps> = ({ bus, onPress }) => {
  const isLive = bus.status === 'LIVE';

  return (
    <Marker
      coordinate={bus.snappedPosition}
      onPress={onPress}
      anchor={{ x: 0.5, y: 0.5 }}
      flat={false}
      tracksViewChanges={false}
    >
      <View style={[styles.wrapper, !isLive && styles.ghostWrapper]}>
        {/* Pulsing Outer Glow for Live Buses */}
        {isLive && <View style={styles.livePulseHalo} />}

        <View
          style={[
            styles.busCircle,
            { backgroundColor: bus.routeColor },
            !isLive && styles.ghostCircle,
          ]}
        >
          <Text style={styles.busIcon}>🚍</Text>
        </View>

        {/* Floating Route Badge */}
        <View
          style={[
            styles.badge,
            isLive ? styles.liveBadge : styles.ghostBadge,
          ]}
        >
          <Text style={styles.badgeText}>
            {bus.routeCode} {isLive ? '• VIVO' : '• EST'}
          </Text>
        </View>
      </View>
    </Marker>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ghostWrapper: {
    opacity: 0.65,
  },
  livePulseHalo: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(16, 185, 129, 0.35)',
    borderWidth: 1.5,
    borderColor: 'rgba(16, 185, 129, 0.70)',
  },
  busCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },
  ghostCircle: {
    borderStyle: 'dashed',
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  busIcon: {
    fontSize: 16,
  },
  badge: {
    marginTop: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  liveBadge: {
    backgroundColor: '#064e3b',
    borderColor: '#10b981',
  },
  ghostBadge: {
    backgroundColor: '#1e293b',
    borderColor: '#64748b',
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '800',
  },
});
