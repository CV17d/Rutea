import React from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { ProjectedBusLocation } from '../../../types/telemetry.types';

let NativeMarker: any = null;
if (Platform.OS !== 'web') {
  try {
    NativeMarker = require('react-native-maps').Marker;
  } catch (e) {
    NativeMarker = null;
  }
}

export interface BusMarkerProps {
  bus: ProjectedBusLocation;
  onPress?: () => void;
}

export const BusMarker: React.FC<BusMarkerProps> = ({ bus, onPress }) => {
  const isGhost = bus.status === 'GHOST' || (bus as any).is_ghost === true;
  const isLive = !isGhost;

  const markerContent = (
    <View style={[styles.wrapper, isGhost && styles.ghostWrapper]}>
      {/* Halo verde esmeralda para buses con usuarios reales */}
      {isLive && <View style={styles.emeraldHalo} />}
      <View
        style={[
          styles.busCircle,
          { backgroundColor: bus.routeColor || '#10b981' },
          isGhost && styles.ghostCircle,
        ]}
      >
        <Text style={styles.busIcon}>{isGhost ? '👻' : '🚍'}</Text>
      </View>
      <View style={[styles.badge, isLive ? styles.liveBadge : styles.ghostBadge]}>
        <Text style={styles.badgeText}>
          {bus.routeCode} {isLive ? '• EN VIVO' : '• FANTASMA'}
        </Text>
      </View>
    </View>
  );

  if (Platform.OS === 'web' || !NativeMarker) {
    // Web simulated positioning relative to Pasto bounds
    const topPct = Math.max(15, Math.min(75, 45 + (bus.snappedPosition.latitude - 1.2136) * 600));
    const leftPct = Math.max(15, Math.min(80, 50 + (bus.snappedPosition.longitude - (-77.2811)) * 600));

    return (
      <TouchableOpacity
        onPress={onPress}
        style={[styles.webPositioned, { top: `${topPct}%`, left: `${leftPct}%` }]}
      >
        {markerContent}
      </TouchableOpacity>
    );
  }

  return (
    <NativeMarker
      coordinate={bus.snappedPosition}
      onPress={onPress}
      anchor={{ x: 0.5, y: 0.5 }}
      flat={false}
      tracksViewChanges={false}
    >
      {markerContent}
    </NativeMarker>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  webPositioned: {
    position: 'absolute',
    zIndex: 10,
    cursor: 'pointer',
  },
  ghostWrapper: {
    opacity: 0.50, // Opacidad al 50% para buses fantasma
  },
  emeraldHalo: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(16, 185, 129, 0.40)', // Halo verde esmeralda
    borderWidth: 2,
    borderColor: '#10b981',
  },
  busCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: '#ffffff',
    elevation: 6,
  },
  ghostCircle: {
    borderStyle: 'dashed', // Borde punteado/discontinuo
    borderColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 2,
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
