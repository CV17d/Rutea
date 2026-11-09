import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { LatLng } from '../../../types/route.types';

let NativeMarker: any = null;
if (Platform.OS !== 'web') {
  try {
    NativeMarker = require('react-native-maps').Marker;
  } catch (e) {
    NativeMarker = null;
  }
}

export interface ClusterMarkerProps {
  coordinate: LatLng;
  count: number;
  onPress?: () => void;
}

export const ClusterMarker: React.FC<ClusterMarkerProps> = React.memo(({
  coordinate,
  count,
  onPress,
}) => {
  if (Platform.OS === 'web' || !NativeMarker) {
    return null;
  }

  const badgeSize = count > 50 ? 44 : count > 20 ? 40 : 36;

  return (
    <NativeMarker
      coordinate={coordinate}
      anchor={{ x: 0.5, y: 0.5 }}
      tracksViewChanges={false}
      onPress={onPress}
    >
      <View style={[styles.clusterCircle, { width: badgeSize, height: badgeSize, borderRadius: badgeSize / 2 }]}>
        <View style={styles.clusterInner}>
          <Text style={styles.clusterText}>{count}</Text>
        </View>
      </View>
    </NativeMarker>
  );
});

const styles = StyleSheet.create({
  clusterCircle: {
    backgroundColor: 'rgba(14, 165, 233, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 3,
  },
  clusterInner: {
    flex: 1,
    width: '100%',
    backgroundColor: '#0284c7',
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  clusterText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
});
