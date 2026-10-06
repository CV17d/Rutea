import { useMemo, useCallback } from 'react';
import { LatLng, TransitRoute } from '../types/route.types';
import { snapPointToRoute } from '../utils/geo.utils';

export function useRouteMatching(currentRoute?: TransitRoute) {
  const routeCoordinates = useMemo(() => {
    return currentRoute ? currentRoute.coordinates : [];
  }, [currentRoute]);

  const matchPointToCurrentRoute = useCallback(
    (rawPosition: LatLng, toleranceMeters = 45) => {
      if (routeCoordinates.length === 0) {
        return {
          snapped: rawPosition,
          distance: 0,
          isWithinRoute: false,
          bearing: 0,
        };
      }

      return snapPointToRoute(rawPosition, routeCoordinates, toleranceMeters);
    },
    [routeCoordinates]
  );

  return {
    matchPointToCurrentRoute,
    hasRouteCoordinates: routeCoordinates.length > 0,
  };
}
