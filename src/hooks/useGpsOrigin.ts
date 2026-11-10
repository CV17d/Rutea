import { useCallback } from 'react';
import * as Location from 'expo-location';
import { LatLng } from '../types/route.types';
import { useTrackingStore } from '../store/useTrackingStore';

/**
 * Devuelve la ubicación real del usuario para usarla como origen del viaje.
 * Si el GPS aún no tiene posición, la solicita en ese momento (nunca inventa un origen).
 */
export function useGpsOrigin() {
  const currentLocation = useTrackingStore((s) => s.currentLocation);
  const setCurrentLocation = useTrackingStore((s) => s.setCurrentLocation);

  return useCallback(async (): Promise<LatLng | null> => {
    if (currentLocation) return { latitude: currentLocation.latitude, longitude: currentLocation.longitude };
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return null;
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const coord = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
      setCurrentLocation({
        ...coord,
        speedKmh: Math.max(0, (loc.coords.speed || 0) * 3.6),
        heading: loc.coords.heading || 0,
        accuracy: loc.coords.accuracy || 0,
        timestamp: loc.timestamp,
      });
      return coord;
    } catch {
      return null;
    }
  }, [currentLocation, setCurrentLocation]);
}
