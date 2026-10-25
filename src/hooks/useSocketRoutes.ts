import { useEffect } from 'react';
import { useRoutesStore } from '../store/useRoutesStore';
import { useTrackingStore } from '../store/useTrackingStore';
import { socketClient } from '../services/socket.client';
import { ProjectedBusLocation } from '../types/telemetry.types';

export function useSocketRoutes() {
  const selectedRouteId = useRoutesStore((s) => s.selectedRouteId);
  const updateBusLocation = useTrackingStore((s) => s.updateBusLocation);

  useEffect(() => {
    socketClient.connect();

    const handleUpdate = (data: any) => {
      if (!data) return;
      if (data.snappedPosition) {
        updateBusLocation(data);
        return;
      }
      if (data.latitude && data.longitude) {
        const isGhost = data.is_ghost === true || data.status === 'GHOST';
        const busId = data.busId || (isGhost ? `ghost-${data.routeId}` : `bus-${data.userId || 'live'}`);
        const projected: ProjectedBusLocation = {
          busId,
          routeId: data.routeId,
          routeCode: (data.routeId || 'C1').replace('route-', '').toUpperCase(),
          routeColor: isGhost ? '#64748b' : '#10b981',
          status: isGhost ? 'GHOST' : 'LIVE',
          position: { latitude: data.latitude, longitude: data.longitude },
          snappedPosition: {
            latitude: data.snappedLatitude || data.latitude,
            longitude: data.snappedLongitude || data.longitude,
          },
          heading: data.heading || 0,
          speedKmh: data.speedKmh || (isGhost ? 18 : 22),
          distanceToNextStopMeters: 350,
          estimatedArrivalMinutes: 3,
          nextStopName: 'Paradero en aproximación',
          broadcasterAlias: isGhost ? undefined : 'Pasajero a bordo',
          broadcasterAvatarSeed: isGhost ? undefined : 'cuy-sombrero',
          lastUpdated: Date.now(),
        };
        updateBusLocation(projected);
      }
    };

    socketClient.on('telemetry:projected', handleUpdate);
    socketClient.on('locationUpdated', handleUpdate);

    if (selectedRouteId) {
      socketClient.joinRouteRoom(selectedRouteId);
    }

    return () => {
      if (selectedRouteId) {
        socketClient.leaveRouteRoom(selectedRouteId);
      }
      socketClient.off('telemetry:projected', handleUpdate);
      socketClient.off('locationUpdated', handleUpdate);
    };
  }, [selectedRouteId, updateBusLocation]);

  return {
    isConnected: socketClient.isConnected(),
  };
}
