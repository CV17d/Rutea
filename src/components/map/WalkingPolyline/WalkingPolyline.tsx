import React from 'react';
import { Platform } from 'react-native';
import { useTrackingStore } from '../../../store/useTrackingStore';

let NativePolyline: any = null;
if (Platform.OS !== 'web') {
  try {
    NativePolyline = require('react-native-maps').Polyline;
  } catch {
    NativePolyline = null;
  }
}

export const WalkingPolyline: React.FC = () => {
  const tripPhase = useTrackingStore((s) => s.tripPhase);
  const walkingPolyline = useTrackingStore((s) => s.walkingPolyline);

  if (tripPhase !== 'WALKING_TO_STOP' || !walkingPolyline || walkingPolyline.length < 2) {
    return null;
  }

  if (Platform.OS === 'web' || !NativePolyline) {
    return null;
  }

  return (
    <NativePolyline
      coordinates={walkingPolyline}
      strokeColor="#10b981"
      strokeWidth={4}
      lineDashPattern={[6, 6]}
      lineCap="round"
      lineJoin="round"
    />
  );
};
