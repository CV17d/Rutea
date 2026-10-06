import { LatLng } from '../types/route.types';

export const EARTH_RADIUS_METERS = 6371000;

export function calculateDistanceMeters(p1: LatLng, p2: LatLng): number {
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
