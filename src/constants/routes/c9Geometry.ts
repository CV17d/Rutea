import { LatLng } from '../../types/route.types';
import c9Data from './c9OsrmGeometry.json';

/**
 * 308 coordenadas de alta resolución generadas por OSRM (snap-to-roads)
 * para la Ruta C9 (Udenar/Briceño - Villa Nueva, Pasto).
 */
export const C9_OSRM_LINESTRING = c9Data;

export const C9_FALLBACK_COORDINATES: LatLng[] = c9Data.coordinates.map(
  (coord: number[]) => ({
    latitude: coord[1],
    longitude: coord[0],
  })
);
