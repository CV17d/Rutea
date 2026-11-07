import { LatLng } from '../../types/route.types';
import c3Data from './c3OsrmGeometry.json';

/**
 * 435 coordenadas de alta resolución generadas por OSRM (snap-to-roads)
 * para la Ruta C3 (Arnulfo Guerrero - Gilberto Pabón, Pasto).
 */
export const C3_OSRM_LINESTRING = c3Data;

export const C3_FALLBACK_COORDINATES: LatLng[] = c3Data.coordinates.map(
  (coord: number[]) => ({
    latitude: coord[1],
    longitude: coord[0],
  })
);
