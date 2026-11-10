import { LatLng } from '../types/route.types';

export const EARTH_RADIUS_METERS = 6371000;

/**
 * Distancia ortodrómica estricta usando fórmula de Haversine (lat1, lon1, lat2, lon2).
 */
export function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const rLat1 = lat1 * (Math.PI / 180);
  const rLat2 = lat2 * (Math.PI / 180);

  const a = Math.sin(dLat / 2) ** 2 + Math.cos(rLat1) * Math.cos(rLat2) * Math.sin(dLon / 2) ** 2;
  return EARTH_RADIUS_METERS * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function calculateDistanceMeters(p1?: LatLng | null, p2?: LatLng | null): number {
  if (!p1 || !p2 || p1.latitude == null || p2.latitude == null || p1.longitude == null || p2.longitude == null) {
    return 0;
  }
  return haversineDistance(p1.latitude, p1.longitude, p2.latitude, p2.longitude);
}

export function calculateBearingDegrees(start: LatLng, end: LatLng): number {
  const sLat = start.latitude * (Math.PI / 180);
  const sLng = start.longitude * (Math.PI / 180);
  const eLat = end.latitude * (Math.PI / 180);
  const eLng = end.longitude * (Math.PI / 180);

  const y = Math.sin(eLng - sLng) * Math.cos(eLat);
  const x = Math.cos(sLat) * Math.sin(eLat) - Math.sin(sLat) * Math.cos(eLat) * Math.cos(eLng - sLng);
  return (Math.atan2(y, x) * (180 / Math.PI) + 360) % 360;
}

export function snapPointToSegment(point: LatLng, segStart: LatLng, segEnd: LatLng): { snapped: LatLng; distance: number } {
  const dx = segEnd.longitude - segStart.longitude;
  const dy = segEnd.latitude - segStart.latitude;
  if (dx === 0 && dy === 0) return { snapped: segStart, distance: calculateDistanceMeters(point, segStart) };

  const t = Math.max(0, Math.min(1, ((point.longitude - segStart.longitude) * dx + (point.latitude - segStart.latitude) * dy) / (dx * dx + dy * dy)));
  const snapped: LatLng = { latitude: segStart.latitude + t * dy, longitude: segStart.longitude + t * dx };
  return { snapped, distance: calculateDistanceMeters(point, snapped) };
}

export function snapPointToRoute(point: LatLng, routeCoords: LatLng[], maxToleranceMeters: number = 45) {
  let minDistance = Infinity;
  let bestSnapped: LatLng = point;
  let bestBearing = 0;

  for (let i = 0; i < routeCoords.length - 1; i++) {
    const res = snapPointToSegment(point, routeCoords[i], routeCoords[i + 1]);
    if (res.distance < minDistance) {
      minDistance = res.distance;
      bestSnapped = res.snapped;
      bestBearing = calculateBearingDegrees(routeCoords[i], routeCoords[i + 1]);
    }
  }

  return { snapped: bestSnapped, distance: minDistance, isWithinRoute: minDistance <= maxToleranceMeters, bearing: bestBearing };
}

export function parsePostgisToCoordinates(path: any): LatLng[] {
  if (!path) return [];
  try {
    let raw = path;
    if (typeof raw === 'string') {
      let str = raw.trim();
      if ((str.startsWith('"') && str.endsWith('"')) || (str.startsWith("'") && str.endsWith("'"))) str = str.slice(1, -1).trim();
      if (str.startsWith('{') || str.startsWith('[')) {
        try { raw = JSON.parse(str); } catch { /* noop */ }
      } else if (str.toUpperCase().includes('LINESTRING')) {
        const match = str.match(/LINESTRING\s*\(([^)]+)\)/i);
        if (match && match[1]) {
          return match[1].split(',').map((p) => p.trim().split(/\s+/)).filter((p) => p.length >= 2)
            .map(([lngStr, latStr]) => ({ latitude: parseFloat(latStr), longitude: parseFloat(lngStr) }))
            .filter((p) => !isNaN(p.latitude) && !isNaN(p.longitude));
        }
      }
    }
    const coords = raw?.coordinates || (Array.isArray(raw) ? raw : null);
    if (Array.isArray(coords)) {
      return coords.map((c: any) => {
        if (Array.isArray(c) && c.length >= 2) return { latitude: Number(c[1]), longitude: Number(c[0]) };
        if (c && typeof c.latitude === 'number' && typeof c.longitude === 'number') return c as LatLng;
        return null;
      }).filter((c): c is LatLng => c !== null && !isNaN(c.latitude) && !isNaN(c.longitude));
    }
  } catch (err) {
    if (typeof __DEV__ !== 'undefined' && __DEV__) console.warn('[parsePostgisToCoordinates] Error:', err);
  }
  return [];
}
