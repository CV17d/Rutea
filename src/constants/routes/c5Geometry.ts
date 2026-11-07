import { LatLng } from '../../types/route.types';
import c5Data from './c5OsrmGeometry.json';

/**
 * 716 coordenadas de alta resolución generadas por OSRM (snap-to-roads)
 * para la Ruta C5 (Buesaquillo/Puente Tabla - Udenar, Pasto).
 */
export const C5_OSRM_LINESTRING = c5Data;

export const C5_FALLBACK_COORDINATES: LatLng[] = c5Data.coordinates.map(
  (coord: number[]) => ({
    latitude: coord[1],
    longitude: coord[0],
  })
);
