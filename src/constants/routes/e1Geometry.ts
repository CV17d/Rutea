import { LatLng } from '../../types/route.types';
import e1Data from './e1OsrmGeometry.json';

/**
 * 431 coordenadas de alta resolución generadas por OSRM (snap-to-roads)
 * para la Ruta Expresa E1 (Dolores - Udenar, Pasto).
 */
export const E1_OSRM_LINESTRING = e1Data;

export const E1_FALLBACK_COORDINATES: LatLng[] = e1Data.coordinates.map(
  (coord: number[]) => ({
    latitude: coord[1],
    longitude: coord[0],
  })
);
