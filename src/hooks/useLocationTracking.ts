import { useEffect, useState, useCallback, useRef } from 'react';
import { Platform } from 'react-native';
import * as Location from 'expo-location';
import { useUserSessionStore } from '../store/useUserSessionStore';
import { useTrackingStore, CurrentUserLocation } from '../store/useTrackingStore';

export function useLocationTracking(onLocationUpdate?: (location: CurrentUserLocation) => void) {
  const { role, profile, addPoints } = useUserSessionStore();
  const setCurrentLocation = useTrackingStore((s) => s.setCurrentLocation);
  const currentLocation = useTrackingStore((s) => s.currentLocation);

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [hasBackgroundPermission, setHasBackgroundPermission] = useState<boolean | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isTracking, setIsTracking] = useState(false);

  const subscriptionRef = useRef<Location.LocationSubscription | null>(null);
  const pointsIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const requestPermissions = useCallback(async (): Promise<boolean> => {
    try {
      const { status: fgStatus } = await Location.requestForegroundPermissionsAsync();
      if (fgStatus !== 'granted') {
        setHasPermission(false);
        setErrorMsg('Permiso de ubicación en primer plano denegado');
        return false;
      }
      setHasPermission(true);

      if (Platform.OS !== 'web') {
        try {
          const { status: bgStatus } = await Location.requestBackgroundPermissionsAsync();
          setHasBackgroundPermission(bgStatus === 'granted');
        } catch {
          setHasBackgroundPermission(false);
        }
      }

      return true;
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error solicitando permisos de ubicación');
      setHasPermission(false);
      return false;
    }
  }, []);

  const stopTracking = useCallback(() => {
    if (subscriptionRef.current) {
      subscriptionRef.current.remove();
      subscriptionRef.current = null;
    }
    if (pointsIntervalRef.current) {
      clearInterval(pointsIntervalRef.current);
      pointsIntervalRef.current = null;
    }
    setIsTracking(false);
    setCurrentLocation(null);
  }, [setCurrentLocation]);

  const startTracking = useCallback(async (_routeId?: string) => {
    const granted = await requestPermissions();
    if (!granted) return;

    stopTracking();
    setIsTracking(true);

    try {
      const sub = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 3000,
          distanceInterval: 5,
        },
        (loc) => {
          const speedKmh = Math.max(0, (loc.coords.speed || 0) * 3.6);
          const locationData: CurrentUserLocation = {
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            speedKmh,
            heading: loc.coords.heading || 0,
            accuracy: loc.coords.accuracy || 10,
            timestamp: loc.timestamp,
          };

          setCurrentLocation(locationData);

          if (onLocationUpdate) {
            onLocationUpdate(locationData);
          }
        }
      );

      subscriptionRef.current = sub;

      pointsIntervalRef.current = setInterval(() => {
        addPoints(2);
      }, 30000);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error iniciando rastreo GPS');
      setIsTracking(false);
    }
  }, [requestPermissions, stopTracking, setCurrentLocation, onLocationUpdate, addPoints]);

  useEffect(() => {
    if (role === 'BROADCASTER' && profile.activeRouteId) {
      startTracking(profile.activeRouteId);
    } else if (role === 'RECEIVER') {
      stopTracking();
    }

    return () => {
      stopTracking();
    };
  }, [role, profile.activeRouteId, startTracking, stopTracking]);

  return {
    isTracking,
    hasPermission,
    hasBackgroundPermission,
    errorMsg,
    currentLocation,
    requestPermissions,
    startTracking,
    stopTracking,
  };
}
