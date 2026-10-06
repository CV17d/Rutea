import { useRef, useCallback } from 'react';
import MapView, { Region } from 'react-native-maps';
import { LatLng } from '../types/route.types';
import { PASTO_COORDINATES } from '../constants/pastoCoordinates';

export function useMapCamera() {
  const mapRef = useRef<MapView>(null);

  const resetToPastoCenter = useCallback(() => {
    if (!mapRef.current) return;
    mapRef.current.animateToRegion({
      latitude: PASTO_COORDINATES.center.latitude,
      longitude: PASTO_COORDINATES.center.longitude,
      latitudeDelta: PASTO_COORDINATES.defaultDelta.latitudeDelta,
      longitudeDelta: PASTO_COORDINATES.defaultDelta.longitudeDelta,
    }, 800);
  }, []);

  const focusOnCoordinates = useCallback((coords: LatLng[], padding = 60) => {
    if (!mapRef.current || coords.length === 0) return;
    mapRef.current.fitToCoordinates(coords, {
      edgePadding: { top: padding + 60, right: padding, bottom: padding + 120, left: padding },
      animated: true,
    });
  }, []);

  const focusOnPoint = useCallback((point: LatLng, delta = 0.015) => {
    if (!mapRef.current) return;
    mapRef.current.animateToRegion({
      latitude: point.latitude,
      longitude: point.longitude,
      latitudeDelta: delta,
      longitudeDelta: delta,
    }, 600);
  }, []);

  return {
    mapRef,
    resetToPastoCenter,
    focusOnCoordinates,
    focusOnPoint,
  };
}
