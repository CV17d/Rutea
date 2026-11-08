import { useEffect } from 'react';
import { LatLng, TransitRoute } from '../types/route.types';
import { busSimulator } from '../services/busSimulator.service';
import { useTrackingStore } from '../store/useTrackingStore';

export function useBusSimulator(route?: TransitRoute, coordinates?: LatLng[]) {
  const updateBusLocation = useTrackingStore((s) => s.updateBusLocation);
  const removeBus = useTrackingStore((s) => s.removeBus);

  useEffect(() => {
    if (!route || !coordinates || coordinates.length < 2) {
      busSimulator.stop();
      return;
    }

    const simulatedBusIds = [
      `${route.id}-sim-1`,
      `${route.id}-sim-2`,
      `${route.id}-sim-3`,
    ];

    busSimulator.start({
      routeId: route.id,
      routeCode: route.code,
      routeColor: route.color,
      coordinates,
      busCount: 3,
      intervalMs: 1500,
      onUpdate: (buses) => {
        buses.forEach((b) => updateBusLocation(b));
      },
    });

    return () => {
      busSimulator.stop();
      simulatedBusIds.forEach((id) => removeBus(id));
    };
  }, [route?.id, route?.code, route?.color, coordinates, updateBusLocation, removeBus]);
}
