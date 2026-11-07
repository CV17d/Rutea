import { LatLng } from '../../types/route.types';
import c10Data from './c10OsrmGeometry.json';

/**
 * 442 coordenadas de alta resolución generadas por OSRM (snap-to-roads)
 * para la Ruta C10 (Briceño - Jamondino, Pasto).
 */
export const C10_OSRM_LINESTRING = c10Data;

export const C10_FALLBACK_COORDINATES: LatLng[] = c10Data.coordinates.map(
  (coord: number[]) => ({
    latitude: coord[1],
    longitude: coord[0],
  })
);
