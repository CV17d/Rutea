import React from 'react';
import { Polyline } from 'react-native-maps';
import { TransitRoute } from '../../../types/route.types';

export interface RoutePolylineProps {
  route: TransitRoute;
  isSelected?: boolean;
}

export const RoutePolyline: React.FC<RoutePolylineProps> = ({
  route,
  isSelected = true,
}) => {
  return (
    <>
      {/* Glow / Outline Casing */}
      <Polyline
        coordinates={route.coordinates}
        strokeColor={isSelected ? 'rgba(255, 255, 255, 0.45)' : 'rgba(0, 0, 0, 0.25)'}
        strokeWidth={isSelected ? 7 : 4}
        lineCap="round"
        lineJoin="round"
      />
      {/* Main Route Line */}
      <Polyline
        coordinates={route.coordinates}
        strokeColor={route.color}
        strokeWidth={isSelected ? 4 : 2.5}
        lineCap="round"
        lineJoin="round"
      />
    </>
  );
};
