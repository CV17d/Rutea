import { LatLng } from '../../types/route.types';
import c12Data from './c12OsrmGeometry.json';

/**
 * 422 coordenadas de alta resolución generadas por OSRM (snap-to-roads)
 * para la Ruta C12 (Briceño - Villaflor, Pasto).
 */
export const C12_OSRM_LINESTRING = c12Data;

export const C12_FALLBACK_COORDINATES: LatLng[] = c12Data.coordinates.map(
  (coord: number[]) => ({
    latitude: coord[1],
    longitude: coord[0],
  })
);
