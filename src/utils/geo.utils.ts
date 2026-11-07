import { LatLng } from '../types/route.types';

export const EARTH_RADIUS_METERS = 6371000;

export function calculateDistanceMeters(p1?: LatLng | null, p2?: LatLng | null): number {
  if (!p1 || !p2 || p1.latitude == null || p2.latitude == null || p1.longitude == null || p2.longitude == null) {
    return 0;
  }
  const dLat = (p2.latitude - p1.latitude) * (Math.PI / 180);
  const dLon = (p2.longitude - p1.longitude) * (Math.PI / 180);
  const lat1 = p1.latitude * (Math.PI / 180);
  const lat2 = p2.latitude * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_METERS * c;
}

export function calculateBearingDegrees(start: LatLng, end: LatLng): number {
  const startLat = start.latitude * (Math.PI / 180);
  const startLng = start.longitude * (Math.PI / 180);
  const endLat = end.latitude * (Math.PI / 180);
  const endLng = end.longitude * (Math.PI / 180);

  const y = Math.sin(endLng - startLng) * Math.cos(endLat);
  const x =
    Math.cos(startLat) * Math.sin(endLat) -
    Math.sin(startLat) * Math.cos(endLat) * Math.cos(endLng - startLng);
  const brng = Math.atan2(y, x) * (180 / Math.PI);

  return (brng + 360) % 360;
}

export function snapPointToSegment(point: LatLng, segStart: LatLng, segEnd: LatLng): { snapped: LatLng; distance: number } {
  const dx = segEnd.longitude - segStart.longitude;
  const dy = segEnd.latitude - segStart.latitude;

  if (dx === 0 && dy === 0) {
    const d = calculateDistanceMeters(point, segStart);
    return { snapped: segStart, distance: d };
  }

  const t = Math.max(0, Math.min(1,
    ((point.longitude - segStart.longitude) * dx + (point.latitude - segStart.latitude) * dy) / (dx * dx + dy * dy)
  ));

  const snapped: LatLng = {
    latitude: segStart.latitude + t * dy,
    longitude: segStart.longitude + t * dx,
  };

  const distance = calculateDistanceMeters(point, snapped);
  return { snapped, distance };
}

export function snapPointToRoute(point: LatLng, routeCoords: LatLng[], maxToleranceMeters: number = 45): {
  snapped: LatLng;
  distance: number;
  isWithinRoute: boolean;
  bearing: number;
} {
  let minDistance = Infinity;
  let bestSnapped: LatLng = point;
  let bestBearing = 0;

  for (let i = 0; i < routeCoords.length - 1; i++) {
    const s1 = routeCoords[i];
    const s2 = routeCoords[i + 1];
    const result = snapPointToSegment(point, s1, s2);

    if (result.distance < minDistance) {
      minDistance = result.distance;
      bestSnapped = result.snapped;
      bestBearing = calculateBearingDegrees(s1, s2);
    }
  }

  return {
    snapped: bestSnapped,
    distance: minDistance,
    isWithinRoute: minDistance <= maxToleranceMeters,
    bearing: bestBearing,
  };
}

/**
 * Convierte una geometría de PostGIS (GeoJSON LineString, EWKT o array de pares)
 * al formato { latitude, longitude } requerido por react-native-maps.
 */
export function parsePostgisToCoordinates(path: any): LatLng[] {
  if (!path) return [];

  try {
    let rawPath = path;
    if (typeof rawPath === 'string') {
      const trimmed = rawPath.trim();
      if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
        rawPath = JSON.parse(trimmed);
      } else if (trimmed.includes('LINESTRING')) {
        const match = trimmed.match(/LINESTRING\s*\(([^)]+)\)/i);
        if (match && match[1]) {
          return match[1]
            .split(',')
            .map((pair) => pair.trim().split(/\s+/))
            .filter((p) => p.length >= 2)
            .map(([lngStr, latStr]) => ({
              latitude: parseFloat(latStr),
              longitude: parseFloat(lngStr),
            }))
            .filter((p) => !isNaN(p.latitude) && !isNaN(p.longitude));
        }
      }
    }

    const coords = rawPath?.coordinates || (Array.isArray(rawPath) ? rawPath : null);
    if (Array.isArray(coords)) {
      return coords
        .map((coord: any) => {
          if (Array.isArray(coord) && coord.length >= 2) {
            return {
              latitude: Number(coord[1]),
              longitude: Number(coord[0]),
            };
          }
          if (coord && typeof coord.latitude === 'number' && typeof coord.longitude === 'number') {
            return coord as LatLng;
          }
          return null;
        })
        .filter((c): c is LatLng => c !== null && !isNaN(c.latitude) && !isNaN(c.longitude));
    }
  } catch (err) {
    console.warn('[parsePostgisToCoordinates] Error parseando geometria:', err);
  }

  return [];
}
