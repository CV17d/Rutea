import { LatLng } from '../../types/route.types';
import e2Data from './e2OsrmGeometry.json';

/**
 * 352 coordenadas de alta resolución generadas por OSRM (snap-to-roads)
 * para la Ruta Expresa E2 (Altos De Chapalito - Udenar, Pasto).
 */
export const E2_OSRM_LINESTRING = e2Data;

export const E2_FALLBACK_COORDINATES: LatLng[] = e2Data.coordinates.map(
  (coord: number[]) => ({
    latitude: coord[1],
    longitude: coord[0],
  })
);
