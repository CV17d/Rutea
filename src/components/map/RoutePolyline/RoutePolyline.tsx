import React from 'react';
import { Platform } from 'react-native';
import { TransitRoute, LatLng } from '../../../types/route.types';

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
  coordinates?: LatLng[];
  isSelected?: boolean;
}

export const RoutePolyline: React.FC<RoutePolylineProps> = ({
  route,
  coordinates,
  isSelected = true,
}) => {
  if (Platform.OS === 'web' || !NativePolyline) {
    return null;
  }

  const polylineCoordinates =
    coordinates && coordinates.length > 0 ? coordinates : route.coordinates;

  if (!polylineCoordinates || polylineCoordinates.length === 0) {
    return null;
  }

  const mainStrokeColor = route.color || '#3b82f6';

  return (
    <>
      {/* Halo de resplandor para contraste máximo en Dark Mode */}
      <NativePolyline
        coordinates={polylineCoordinates}
        strokeColor={isSelected ? 'rgba(59, 130, 246, 0.45)' : 'rgba(0, 0, 0, 0.25)'}
        strokeWidth={isSelected ? 8 : 6}
        lineCap="round"
        lineJoin="round"
        simplify={true}
      />
      {/* Línea principal azul brillante / neón de alta visibilidad */}
      <NativePolyline
        coordinates={polylineCoordinates}
        strokeColor={mainStrokeColor}
        strokeWidth={5}
        lineCap="round"
        lineJoin="round"
        simplify={true}
      />
    </>
  );
};
