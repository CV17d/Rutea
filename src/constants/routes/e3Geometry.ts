import { LatLng } from '../../types/route.types';
import e3Data from './e3OsrmGeometry.json';

/**
 * 432 coordenadas de alta resolución generadas por OSRM (snap-to-roads)
 * para la Ruta Expresa E3 (Altamira - San Ezequiel Moreno, Pasto).
 */
export const E3_OSRM_LINESTRING = e3Data;

export const E3_FALLBACK_COORDINATES: LatLng[] = e3Data.coordinates.map(
  (coord: number[]) => ({
    latitude: coord[1],
    longitude: coord[0],
  })
);
