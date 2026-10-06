import React from 'react';
import { Platform } from 'react-native';
import { TransitRoute } from '../../../types/route.types';

let NativePolyline: any = null;
if (Platform.OS !== 'web') {
  try {
    NativePolyline = require('react-native-maps').Polyline;
  } catch (e) {
    NativePolyline = null;
  }
}

export interface RoutePolylineProps {
  route: TransitRoute;
  isSelected?: boolean;
}

export const RoutePolyline: React.FC<RoutePolylineProps> = ({
  route,
  isSelected = true,
}) => {
  if (Platform.OS === 'web' || !NativePolyline) {
    return null;
  }

  return (
    <>
      <NativePolyline
        coordinates={route.coordinates}
        strokeColor={isSelected ? 'rgba(255, 255, 255, 0.45)' : 'rgba(0, 0, 0, 0.25)'}
        strokeWidth={isSelected ? 7 : 4}
        lineCap="round"
        lineJoin="round"
      />
      <NativePolyline
        coordinates={route.coordinates}
        strokeColor={route.color}
        strokeWidth={isSelected ? 4 : 2.5}
        lineCap="round"
        lineJoin="round"
      />
    </>
  );
};
