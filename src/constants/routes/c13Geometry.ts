import { LatLng } from '../../types/route.types';
import c13Data from './c13OsrmGeometry.json';

/**
 * 265 coordenadas de alta resolución generadas por OSRM (snap-to-roads)
 * para la Ruta C13 (Hospital De Santa Mónica - Santa Rita, Pasto).
 */
export const C13_OSRM_LINESTRING = c13Data;

export const C13_FALLBACK_COORDINATES: LatLng[] = c13Data.coordinates.map(
  (coord: number[]) => ({
    latitude: coord[1],
    longitude: coord[0],
  })
);
