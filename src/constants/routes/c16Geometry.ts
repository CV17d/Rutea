import { LatLng } from '../../types/route.types';
import c16Data from './c16OsrmGeometry.json';

/**
 * 128 coordenadas de alta resolución generadas por OSRM (snap-to-roads)
 * para la Ruta C16 (Hospital Departamental - Unicentro Pasto).
 */
export const C16_OSRM_LINESTRING = c16Data;

export const C16_FALLBACK_COORDINATES: LatLng[] = c16Data.coordinates.map(
  (coord: number[]) => ({
    latitude: coord[1],
    longitude: coord[0],
  })
);
