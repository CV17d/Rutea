import { LatLng } from '../../types/route.types';
import c14Data from './c14OsrmGeometry.json';

/**
 * 491 coordenadas de alta resolución generadas por OSRM (snap-to-roads)
 * para la Ruta C14 (Altos De Daza - Lorenzo, Pasto).
 */
export const C14_OSRM_LINESTRING = c14Data;

export const C14_FALLBACK_COORDINATES: LatLng[] = c14Data.coordinates.map(
  (coord: number[]) => ({
    latitude: coord[1],
    longitude: coord[0],
  })
);
