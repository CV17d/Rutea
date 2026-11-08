import { useEffect, useState, useCallback, useRef } from 'react';
import { Platform } from 'react-native';
import * as Location from 'expo-location';
import { useUserSessionStore } from '../store/useUserSessionStore';
import { useTrackingStore, CurrentUserLocation } from '../store/useTrackingStore';
import { socketClient } from '../services/socket.client';
import { RawTelemetryPayload } from '../types/telemetry.types';

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
  const emitIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastLocationRef = useRef<CurrentUserLocation | null>(null);

  // 1. Solicitar GPS real al montar para eliminar coordenadas mock
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted' && isMounted) {
          setHasPermission(true);
          const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
          if (loc && isMounted) {
            const realLoc: CurrentUserLocation = {
              latitude: loc.coords.latitude,
              longitude: loc.coords.longitude,
              speedKmh: Math.max(0, (loc.coords.speed || 0) * 3.6),
              heading: loc.coords.heading || 0,
              accuracy: loc.coords.accuracy || 10,
              timestamp: loc.timestamp,
            };
            lastLocationRef.current = realLoc;
            setCurrentLocation(realLoc);
            if (onLocationUpdate) onLocationUpdate(realLoc);
          }
        }
      } catch (err: any) {
        setErrorMsg(err?.message || 'Error obteniendo GPS');
      }
    })();
    return () => { isMounted = false; };
  }, [setCurrentLocation, onLocationUpdate]);

  const requestPermissions = useCallback(async (): Promise<boolean> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      const granted = status === 'granted';
      setHasPermission(granted);
      if (!granted) setErrorMsg('Permiso de ubicacion denegado');
      return granted;
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error solicitando permisos');
      return false;
    }
  }, []);

  const emitToGateway = useCallback((loc: CurrentUserLocation) => {
    const payload: RawTelemetryPayload = {
      userId: profile.id,
      routeId: profile.activeRouteId || 'route-c1',
      latitude: loc.latitude,
      longitude: loc.longitude,
      speedKmh: loc.speedKmh,
      heading: loc.heading,
      accuracy: loc.accuracy,
      timestamp: loc.timestamp,
    };
    socketClient.updateLocation(payload);
  }, [profile.id, profile.activeRouteId]);

  const stopTracking = useCallback(() => {
    subscriptionRef.current?.remove();
    subscriptionRef.current = null;
    if (pointsIntervalRef.current) clearInterval(pointsIntervalRef.current);
    if (emitIntervalRef.current) clearInterval(emitIntervalRef.current);
    if (profile.activeRouteId) socketClient.leaveRouteRoom(profile.activeRouteId);
    setIsTracking(false);
  }, [profile.activeRouteId]);

  const startTracking = useCallback(async (routeId?: string) => {
    const granted = await requestPermissions();
    if (!granted) return;
    stopTracking();
    setIsTracking(true);

    const targetRoute = routeId || profile.activeRouteId || 'route-c1';
    socketClient.connect();
    socketClient.joinRoom(targetRoute);
    socketClient.startBoarding({ userId: profile.id, routeId: targetRoute });

    try {
      subscriptionRef.current = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, timeInterval: 3000, distanceInterval: 5 },
        (loc) => {
          const locationData: CurrentUserLocation = {
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            speedKmh: Math.max(0, (loc.coords.speed || 0) * 3.6),
            heading: loc.coords.heading || 0,
            accuracy: loc.coords.accuracy || 10,
            timestamp: loc.timestamp,
          };
          lastLocationRef.current = locationData;
          setCurrentLocation(locationData);
          emitToGateway(locationData);
          if (onLocationUpdate) onLocationUpdate(locationData);
        }
      );
      emitIntervalRef.current = setInterval(() => {
        if (lastLocationRef.current) emitToGateway(lastLocationRef.current);
      }, 3000);
      pointsIntervalRef.current = setInterval(() => addPoints(2), 30000);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error en rastreo');
      setIsTracking(false);
    }
  }, [requestPermissions, stopTracking, profile.activeRouteId, setCurrentLocation, emitToGateway, onLocationUpdate, addPoints]);

  useEffect(() => {
    if (role === 'BROADCASTER' && profile.activeRouteId) startTracking(profile.activeRouteId);
    else if (role === 'RECEIVER') stopTracking();
    return () => stopTracking();
  }, [role, profile.activeRouteId, startTracking, stopTracking]);

  return { isTracking, hasPermission, hasBackgroundPermission, errorMsg, currentLocation, requestPermissions, startTracking, stopTracking };
}
