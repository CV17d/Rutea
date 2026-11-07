import { LatLng } from '../../types/route.types';
import c6Data from './c6OsrmGeometry.json';

/**
 * 632 coordenadas de alta resolución generadas por OSRM (snap-to-roads)
 * para la Ruta C6 (Cam Anganoy - Catambuco/Coba Negra, Pasto).
 */
export const C6_OSRM_LINESTRING = c6Data;

export const C6_FALLBACK_COORDINATES: LatLng[] = c6Data.coordinates.map(
  (coord: number[]) => ({
    latitude: coord[1],
    longitude: coord[0],
  })
);
