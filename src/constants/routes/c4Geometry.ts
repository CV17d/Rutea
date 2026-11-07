import { LatLng } from '../../types/route.types';
import c4Data from './c4OsrmGeometry.json';

/**
 * 471 coordenadas de alta resolución generadas por OSRM (snap-to-roads)
 * para la Ruta C4 (El Porvenir - Jongovito, Pasto).
 */
export const C4_OSRM_LINESTRING = c4Data;

export const C4_FALLBACK_COORDINATES: LatLng[] = c4Data.coordinates.map(
  (coord: number[]) => ({
    latitude: coord[1],
    longitude: coord[0],
  })
);
