import { useEffect, useRef } from 'react';
import { useTrackingStore } from '../store/useTrackingStore';
import { useRoutesStore } from '../store/useRoutesStore';
import { calculateDistanceMeters } from '../utils/geo.utils';
import { LatLng } from '../types/route.types';

export const STOP_GEOFENCE_RADIUS_METERS = 30;
export const ARRIVAL_SUCCESS_MESSAGE = '¡Llegaste a la parada!';

export function checkStopArrival(
  userLocation?: LatLng | null,
  stopLocation?: LatLng | null,
  thresholdMeters: number = STOP_GEOFENCE_RADIUS_METERS
): { isArrived: boolean; distanceMeters: number } {
  if (!userLocation || !stopLocation) {
    return { isArrived: false, distanceMeters: Infinity };
  }
  const distanceMeters = calculateDistanceMeters(userLocation, stopLocation);
  return {
    isArrived: distanceMeters < thresholdMeters,
    distanceMeters,
  };
}

export interface UseStopArrivalDetectionOptions {
  thresholdMeters?: number;
  onArrival?: () => void;
}

export function useStopArrivalDetection(options: UseStopArrivalDetectionOptions = {}) {
  const { thresholdMeters = STOP_GEOFENCE_RADIUS_METERS, onArrival } = options;
  const currentLocation = useTrackingStore((s) => s.currentLocation);
  const tripPhase = useTrackingStore((s) => s.tripPhase);
  const originStopLocation = useTrackingStore((s) => s.originStopLocation);
  const setTripPhase = useTrackingStore((s) => s.setTripPhase);
  const setArrivalMessage = useTrackingStore((s) => s.setArrivalMessage);
  const selectedRoute = useRoutesStore((s) => s.getSelectedRoute());

  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    if (tripPhase !== 'WALKING_TO_STOP') {
      hasTriggeredRef.current = false;
      return;
    }

    const targetStop: LatLng | null = originStopLocation
      ? { latitude: originStopLocation.latitude, longitude: originStopLocation.longitude }
      : selectedRoute?.stops?.[0]?.location || null;

    if (!currentLocation || !targetStop) return;

    const { isArrived } = checkStopArrival(
      { latitude: currentLocation.latitude, longitude: currentLocation.longitude },
      targetStop,
      thresholdMeters
    );

    if (isArrived && !hasTriggeredRef.current) {
      hasTriggeredRef.current = true;
      setTripPhase('WAITING_FOR_BUS');
      setArrivalMessage(ARRIVAL_SUCCESS_MESSAGE);
      onArrival?.();
    }
  }, [currentLocation, tripPhase, originStopLocation, selectedRoute, thresholdMeters, onArrival, setTripPhase, setArrivalMessage]);

  return {
    tripPhase,
    originStopLocation,
    isWaitingForBus: tripPhase === 'WAITING_FOR_BUS',
  };
}
