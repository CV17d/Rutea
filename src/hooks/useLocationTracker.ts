import { useEffect, useState, useCallback } from 'react';
import * as Location from 'expo-location';
import { useUserSessionStore } from '../store/useUserSessionStore';
import { RawTelemetryPayload } from '../types/telemetry.types';

export function useLocationTracker(onLocationUpdate?: (payload: RawTelemetryPayload) => void) {
  const { role, profile, addPoints } = useUserSessionStore();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isTracking, setIsTracking] = useState(false);

  const requestPermissions = useCallback(async () => {
    try {
      const { status: fgStatus } = await Location.requestForegroundPermissionsAsync();
      if (fgStatus !== 'granted') {
        setHasPermission(false);
        return false;
      }
      const { status: bgStatus } = await Location.requestBackgroundPermissionsAsync();
      const granted = bgStatus === 'granted';
      setHasPermission(granted);
      return granted;
    } catch {
      setHasPermission(false);
      return false;
    }
  }, []);

  useEffect(() => {
    let sub: Location.LocationSubscription | null = null;
    let pointsInterval: NodeJS.Timeout | null = null;

    if (role === 'BROADCASTER' && profile.activeRouteId) {
      setIsTracking(true);

      // Start receiving location updates
      Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 3000,
          distanceInterval: 10,
        },
        (loc) => {
          // Anti-spoofing filter: horizontal accuracy must be < 30m
          if (loc.coords.accuracy && loc.coords.accuracy > 30) return;

          const speedKmh = (loc.coords.speed || 0) * 3.6;
          // Discard physical anomalies (> 85 km/h in urban Pasto)
          if (speedKmh > 85) return;

          const payload: RawTelemetryPayload = {
            userId: profile.id,
            routeId: profile.activeRouteId!,
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            accuracy: loc.coords.accuracy || 10,
            speedKmh,
            heading: loc.coords.heading || 0,
            timestamp: loc.timestamp,
          };

          if (onLocationUpdate) {
            onLocationUpdate(payload);
          }
        }
      ).then((s) => {
        sub = s;
      });

      // Gamification increment: award +2 PTS every 30 seconds of active broadcast
      pointsInterval = setInterval(() => {
        addPoints(2);
      }, 30000);
    } else {
      setIsTracking(false);
    }

    return () => {
      if (sub) sub.remove();
      if (pointsInterval) clearInterval(pointsInterval);
    };
  }, [role, profile.activeRouteId]);

  return {
    isTracking,
    hasPermission,
    requestPermissions,
  };
}
