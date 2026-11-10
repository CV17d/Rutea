import { useEffect } from 'react';
import { LatLng, TransitRoute } from '../types/route.types';
import { busSimulator } from '../services/busSimulator.service';
import { useTrackingStore } from '../store/useTrackingStore';
import { ROUTE_FALLBACK_GEOMETRIES } from '../constants/routes/fallbackGeometries';

export function useBusSimulator(route?: TransitRoute, coordinates?: LatLng[]) {
  const updateBusLocation = useTrackingStore((s) => s.updateBusLocation);
  const removeBus = useTrackingStore((s) => s.removeBus);

  useEffect(() => {
    if (!route) {
      busSimulator.stop();
      return;
    }

    const activeCoords =
      coordinates && coordinates.length >= 2
        ? coordinates
        : route.coordinates && route.coordinates.length >= 2
        ? route.coordinates
        : ROUTE_FALLBACK_GEOMETRIES[route.id] || [];

    if (activeCoords.length < 2) {
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
      coordinates: activeCoords,
      busCount: 3,
      intervalMs: 1000,
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
