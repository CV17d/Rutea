import { useEffect, useRef, useState } from 'react';
import * as Notifications from 'expo-notifications';
import { LatLng } from '../types/route.types';
import { ProjectedBusLocation } from '../types/telemetry.types';
import { useTrackingStore } from '../store/useTrackingStore';
import { useRoutesStore } from '../store/useRoutesStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { findClosestApproachingBus, findNextBusAlongRoute } from '../services/etaCalculator.service';
import { getRoutePath, projectOnPath } from '../services/routeBoarding.service';
import { notificationService } from '../services/notification.service';
import { Toast } from '../store/useNotificationStore';

export interface ProximityAlertOptions {
  targetLocation?: LatLng | null;
  routeId?: string;
  thresholdMeters?: number;
  onAlert?: (bus: ProjectedBusLocation, distanceMeters: number) => void;
}

export interface ProximityAlertResult {
  isWithinProximity: boolean;
  distanceMeters: number | null;
  approachingBus: ProjectedBusLocation | null;
}

export function useProximityAlert({
  targetLocation,
  routeId,
  thresholdMeters = 400,
  onAlert,
}: ProximityAlertOptions): ProximityAlertResult {
  const activeBuses = useTrackingStore((s) => s.activeBuses);
  const busList = Object.values(activeBuses);
  const routes = useRoutesStore((s) => s.routes);

  const [isWithinProximity, setIsWithinProximity] = useState(false);
  const [distanceMeters, setDistanceMeters] = useState<number | null>(null);
  const [approachingBus, setApproachingBus] = useState<ProjectedBusLocation | null>(null);

  const alertedBusIdsRef = useRef<Set<string>>(new Set());

  // Registrar permisos y canales de notificación push
  useEffect(() => {
    notificationService.registerForPushNotificationsAsync();
  }, []);

  useEffect(() => {
    if (!targetLocation) {
      setIsWithinProximity(false);
      setDistanceMeters(null);
      setApproachingBus(null);
      return;
    }

    // Distancia real por la ruta (sentido de circulación); si no hay geometría, línea recta.
    const path = routeId ? getRoutePath(routeId) : null;
    const along = path ? projectOnPath(path, targetLocation)?.alongMeters : undefined;
    const arrival = routeId && path && along != null
      ? findNextBusAlongRoute(busList, routeId, path, along)
      : findClosestApproachingBus(busList, targetLocation, routeId);

    if (!arrival) {
      setIsWithinProximity(false);
      setDistanceMeters(null);
      setApproachingBus(null);
      return;
    }

    const dist = arrival.distanceMeters;
    setDistanceMeters(dist);
    setApproachingBus(arrival.bus);

    if (dist <= thresholdMeters) {
      setIsWithinProximity(true);

      const busId = arrival.bus.busId;
      if (!alertedBusIdsRef.current.has(busId)) {
        alertedBusIdsRef.current.add(busId);

        const currentRouteId = routeId || arrival.bus.routeId;
        const matchedRoute = routes.find((r) => r.id === currentRouteId);
        const routeCode = matchedRoute?.code || (currentRouteId ? currentRouteId.replace('route-', '').toUpperCase() : 'SETPasto');
        const alertMessage = '¡Prepárate! Tu bus está a punto de llegar';
        const notificationBody = `¡Prepárate! La ruta ${routeCode} está llegando a tu parada`;

        const isEn = useSettingsStore.getState().language === 'en';
        const alertTitle = isEn ? 'Get ready!' : '¡Prepárate!';
        const toastSub = isEn ? `Your bus ${routeCode} is arriving at your stop` : `Tu bus ${routeCode} está llegando a tu parada`;
        const pushBody = isEn ? `Get ready! Route ${routeCode} is arriving at your stop` : notificationBody;

        // Notificación In-App visual temática (Toast)
        Toast.show({
          type: 'success',
          text1: alertTitle,
          text2: toastSub,
        });

        // Disparo de notificación local nativa con Expo Notifications
        Notifications.scheduleNotificationAsync({
          content: {
            title: alertTitle,
            body: pushBody,
            sound: true,
            vibrate: [0, 250, 250, 250],
            priority: Notifications.AndroidNotificationPriority.MAX,
            color: '#10b981',
            data: { routeCode, busId, distanceMeters: dist },
          },
          trigger: null,
        }).catch((err) => {
          if (typeof __DEV__ !== 'undefined' && __DEV__) console.warn('[useProximityAlert] Push local error:', err);
        });

        if (onAlert) {
          onAlert(arrival.bus, dist);
        }
      }
    } else {
      setIsWithinProximity(false);
      if (dist > thresholdMeters + 300) {
        alertedBusIdsRef.current.delete(arrival.bus.busId);
      }
    }
  }, [busList, targetLocation, routeId, thresholdMeters, routes, onAlert]);

  return {
    isWithinProximity,
    distanceMeters,
    approachingBus,
  };
}
