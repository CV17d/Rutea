import { LatLng } from '../../types/route.types';
import c7Data from './c7OsrmGeometry.json';

/**
 * 388 coordenadas de alta resolución generadas por OSRM (snap-to-roads)
 * para la Ruta C7 (Altos De Chapalito - San Juan De Anganoy, Pasto).
 */
export const C7_OSRM_LINESTRING = c7Data;

export const C7_FALLBACK_COORDINATES: LatLng[] = c7Data.coordinates.map(
  (coord: number[]) => ({
    latitude: coord[1],
    longitude: coord[0],
  })
);
