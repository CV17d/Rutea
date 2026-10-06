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

    const handleProjectedUpdate = (data: ProjectedBusLocation) => {
      updateBusLocation(data);
    };

    socketClient.on('telemetry:projected', handleProjectedUpdate);

    if (selectedRouteId) {
      socketClient.joinRouteRoom(selectedRouteId);
    }

    return () => {
      if (selectedRouteId) {
        socketClient.leaveRouteRoom(selectedRouteId);
      }
      socketClient.off('telemetry:projected', handleProjectedUpdate);
    };
  }, [selectedRouteId]);

  return {
    isConnected: socketClient.isConnected(),
  };
}
