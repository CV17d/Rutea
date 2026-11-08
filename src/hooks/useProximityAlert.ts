import { useEffect, useRef, useState } from 'react';
import { Alert, Platform } from 'react-native';
import { LatLng } from '../types/route.types';
import { ProjectedBusLocation } from '../types/telemetry.types';
import { useTrackingStore } from '../store/useTrackingStore';
import { findClosestApproachingBus } from '../services/etaCalculator.service';

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

  const [isWithinProximity, setIsWithinProximity] = useState(false);
  const [distanceMeters, setDistanceMeters] = useState<number | null>(null);
  const [approachingBus, setApproachingBus] = useState<ProjectedBusLocation | null>(null);

  const alertedBusIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!targetLocation) {
      setIsWithinProximity(false);
      setDistanceMeters(null);
      setApproachingBus(null);
      return;
    }

    const arrival = findClosestApproachingBus(busList, targetLocation, routeId);

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

        const alertMessage = '¡Prepárate! Tu bus está a punto de llegar';

        if (Platform.OS === 'web') {
          console.log(`[Geofence Proximity Alert] ${alertMessage} (${dist}m)`);
        } else {
          Alert.alert('¡Prepárate!', alertMessage, [{ text: 'Entendido' }]);
        }

        if (onAlert) {
          onAlert(arrival.bus, dist);
        }
      }
    } else {
      setIsWithinProximity(false);
      // Resetear si el bus se alejó significativamente
      if (dist > thresholdMeters + 300) {
        alertedBusIdsRef.current.delete(arrival.bus.busId);
      }
    }
  }, [busList, targetLocation, routeId, thresholdMeters, onAlert]);

  return { isWithinProximity, distanceMeters, approachingBus };
}
