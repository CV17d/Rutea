import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { BusStop } from '../../../types/route.types';
import { formatEtaMinutes } from '../../../utils/time.utils';

let NativeMarker: any = null;
if (Platform.OS !== 'web') {
  try {
    NativeMarker = require('react-native-maps').Marker;
  } catch (e) {
    NativeMarker = null;
  }
}

export interface StopMarkerProps {
  stop: BusStop;
  onPress?: () => void;
}

export const StopMarker: React.FC<StopMarkerProps> = ({ stop, onPress }) => {
  if (Platform.OS === 'web' || !NativeMarker) {
    return null;
  }

  return (
    <NativeMarker
      coordinate={stop.location}
      onPress={onPress}
      anchor={{ x: 0.5, y: 0.5 }}
      tracksViewChanges={false}
    >
      <View style={styles.container}>
        <View style={[styles.stopDot, stop.isTerminal && styles.terminalDot]} />
        <View style={styles.timeBadge}>
          <Text style={styles.timeText}>
            {formatEtaMinutes(stop.estimatedWaitMinutes)}
          </Text>
        </View>
      </View>
    </NativeMarker>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#ffffff',
    borderWidth: 3,
    borderColor: '#38bdf8',
    elevation: 3,
  },
  terminalDot: {
    borderColor: '#f59e0b',
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  timeBadge: {
    marginTop: 4,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.20)',
  },
  timeText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '800',
  },
});
