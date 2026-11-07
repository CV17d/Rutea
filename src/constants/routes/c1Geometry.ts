import { LatLng } from '../../types/route.types';
import c1Data from './c1OsrmGeometry.json';

/**
 * 330 coordenadas de alta resolución generadas por OSRM (snap-to-roads)
 * para la Ruta C1 (Altos de Chapalito - Obonuco, Pasto).
 */
export const C1_OSRM_LINESTRING = c1Data;

export const C1_FALLBACK_COORDINATES: LatLng[] = c1Data.coordinates.map(
  (coord: number[]) => ({
    latitude: coord[1],
    longitude: coord[0],
  })
);
