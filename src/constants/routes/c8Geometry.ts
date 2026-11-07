import { LatLng } from '../../types/route.types';
import c8Data from './c8OsrmGeometry.json';

/**
 * 509 coordenadas de alta resolución generadas por OSRM (snap-to-roads)
 * para la Ruta C8 (Cujacal/Puente Tabla - San Martín, Pasto).
 */
export const C8_OSRM_LINESTRING = c8Data;

export const C8_FALLBACK_COORDINATES: LatLng[] = c8Data.coordinates.map(
  (coord: number[]) => ({
    latitude: coord[1],
    longitude: coord[0],
  })
);
