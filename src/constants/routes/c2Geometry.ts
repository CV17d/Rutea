import { LatLng } from '../../types/route.types';
import c2Data from './c2OsrmGeometry.json';

/**
 * 387 coordenadas de alta resolución generadas por OSRM (snap-to-roads)
 * para la Ruta C2 (Altavista - La Paz, Pasto).
 */
export const C2_OSRM_LINESTRING = c2Data;

export const C2_FALLBACK_COORDINATES: LatLng[] = c2Data.coordinates.map(
  (coord: number[]) => ({
    latitude: coord[1],
    longitude: coord[0],
  })
);
