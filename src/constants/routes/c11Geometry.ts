import { LatLng } from '../../types/route.types';
import c11Data from './c11OsrmGeometry.json';

/**
 * 396 coordenadas de alta resolución generadas por OSRM (snap-to-roads)
 * para la Ruta C11 (Mocondino - Villa Nueva, Pasto).
 */
export const C11_OSRM_LINESTRING = c11Data;

export const C11_FALLBACK_COORDINATES: LatLng[] = c11Data.coordinates.map(
  (coord: number[]) => ({
    latitude: coord[1],
    longitude: coord[0],
  })
);
