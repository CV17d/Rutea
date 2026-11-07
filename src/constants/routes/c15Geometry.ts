import { LatLng } from '../../types/route.types';
import c15Data from './c15OsrmGeometry.json';

/**
 * 246 coordenadas de alta resolución generadas por OSRM (snap-to-roads)
 * para la Ruta C15 (Obonuco - Villanueva, Pasto).
 */
export const C15_OSRM_LINESTRING = c15Data;

export const C15_FALLBACK_COORDINATES: LatLng[] = c15Data.coordinates.map(
  (coord: number[]) => ({
    latitude: coord[1],
    longitude: coord[0],
  })
);
