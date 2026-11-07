import { LatLng } from '../../types/route.types';
import e4Data from './e4OsrmGeometry.json';

/**
 * 742 coordenadas de alta resolución generadas por OSRM (snap-to-roads)
 * para la Ruta Expresa E4 (Genoy - Jamondino, Pasto).
 */
export const E4_OSRM_LINESTRING = e4Data;

export const E4_FALLBACK_COORDINATES: LatLng[] = e4Data.coordinates.map(
  (coord: number[]) => ({
    latitude: coord[1],
    longitude: coord[0],
  })
);
