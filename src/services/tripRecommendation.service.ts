import { LatLng } from '../types/route.types';
import { RouteRecommendation, TripQuery } from '../types/trip.types';
import { supabase } from './supabase.client';
import { MOCK_PASTO_ROUTES } from '../constants/mockRoutes';
import { STANDARD_ROUTES_PART2 } from '../constants/routes/standardRoutes2';
import { PASTO_LOCATIONS } from '../constants/routes/pastoWaypoints';
import { calculateDistanceMeters, haversineDistance } from '../utils/geo.utils';

export { haversineDistance, calculateDistanceMeters };
export const PASTO_CENTROID: LatLng = { latitude: 1.2136, longitude: -77.2811 };
export const MAX_COVERAGE_METERS = 15000;

export interface CoverageCheckResult {
  isOutOfArea: boolean;
  distanceKm: number;
  message?: string;
}

export function calculateWalkingMinutes(distanceInMeters: number): number {
  if (distanceInMeters <= 0) return 0;
  return Math.ceil(distanceInMeters / 80);
}

export function checkCoverageArea(location?: LatLng | null): CoverageCheckResult {
  if (!location || location.latitude == null || location.longitude == null) {
    return { isOutOfArea: true, distanceKm: 0, message: 'Ubicación no disponible' };
  }
  const distMeters = calculateDistanceMeters(location, PASTO_CENTROID);
  const distanceKm = Math.round((distMeters / 1000) * 10) / 10;
  const isOutOfArea = distMeters > MAX_COVERAGE_METERS;

  return {
    isOutOfArea,
    distanceKm,
    message: isOutOfArea
      ? 'Parece que estás fuera de San Juan de Pasto. Por favor, ingresa un punto de origen manualmente'
      : undefined,
  };
}

export function resolvePastoLocation(input: string): LatLng | null {
  if (!input) return null;
  const raw = input.trim();
  const coords = raw.split(',').map((s) => parseFloat(s.trim()));
  if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
    return { latitude: coords[0], longitude: coords[1] };
  }

  const clean = (str: string) =>
    str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');
  const qClean = clean(raw);
  if (!qClean) return null;

  for (const [key, loc] of Object.entries(PASTO_LOCATIONS)) {
    const kClean = clean(key);
    if (kClean === qClean || kClean.includes(qClean) || qClean.includes(kClean)) return loc;
  }

  for (const route of MOCK_PASTO_ROUTES) {
    for (const stop of route.stops) {
      const sClean = clean(stop.name);
      if (sClean === qClean || sClean.includes(qClean) || qClean.includes(sClean)) return stop.location;
    }
  }
  return null;
}

export function findLocalBestRoutes(query: TripQuery): RouteRecommendation[] {
  if (checkCoverageArea(query.origin).isOutOfArea) return [];
  const radius = query.radiusMeters || 1200;
  const results: RouteRecommendation[] = [];

  for (const route of MOCK_PASTO_ROUTES) {
    const destCandidates = route.stops
      .map((s) => ({ stop: s, dist: calculateDistanceMeters(query.destination, s.location) }))
      .filter((d) => d.dist <= radius)
      .sort((a, b) => a.dist - b.dist);

    if (destCandidates.length === 0) continue;
    const bestDest = destCandidates[0];

    const origCandidates = route.stops
      .filter((s) => s.orderIndex < bestDest.stop.orderIndex)
      .map((s) => ({ stop: s, dist: calculateDistanceMeters(query.origin, s.location) }))
      .filter((o) => o.dist <= radius)
      .sort((a, b) => a.dist - b.dist);

    if (origCandidates.length === 0) continue;
    const bestOrig = origCandidates[0];

    const s2Match = STANDARD_ROUTES_PART2.find((r) => r.id === route.id);
    const color = s2Match ? s2Match.color : route.color;
    const walkMeters = Math.round(bestOrig.dist);

    results.push({
      routeId: route.id,
      routeCode: route.code,
      routeName: route.name,
      routeColor: color,
      routeDescription: route.description,
      originStop: { id: bestOrig.stop.id, name: bestOrig.stop.name, location: bestOrig.stop.location },
      destStop: { id: bestDest.stop.id, name: bestDest.stop.name, location: bestDest.stop.location },
      walkingDistanceMeters: walkMeters,
      destWalkingDistanceMeters: Math.round(bestDest.dist),
      estimatedWalkingMinutes: calculateWalkingMinutes(walkMeters),
    });
  }

  return results.sort((a, b) => a.walkingDistanceMeters - b.walkingDistanceMeters);
}

export async function findBestRoutes(query: TripQuery): Promise<RouteRecommendation[]> {
  if (checkCoverageArea(query.origin).isOutOfArea) return [];
  const radius = query.radiusMeters || 1200;

  try {
    const { data, error } = await supabase.rpc('find_best_routes', {
      origin_lat: query.origin.latitude,
      origin_lng: query.origin.longitude,
      dest_lat: query.destination.latitude,
      dest_lng: query.destination.longitude,
      radius_meters: radius,
    });

    if (!error && Array.isArray(data) && data.length > 0) {
      return data.map((row: any) => {
        const s2Match = STANDARD_ROUTES_PART2.find((r) => r.id === row.route_id || r.code === row.route_code);
        const walkDist = Math.round(Number(row.walking_distance_meters || 0));
        return {
          routeId: row.route_id,
          routeCode: row.route_code || row.route_id.replace('route-', '').toUpperCase(),
          routeName: row.route_name || `Ruta ${row.route_code}`,
          routeColor: s2Match?.color || row.route_color || '#0284c7',
          originStop: { id: row.origin_stop_id, name: row.origin_stop_name, location: { latitude: row.origin_stop_lat, longitude: row.origin_stop_lng } },
          destStop: { id: row.dest_stop_id, name: row.dest_stop_name, location: { latitude: row.dest_stop_lat, longitude: row.dest_stop_lng } },
          walkingDistanceMeters: walkDist,
          destWalkingDistanceMeters: Math.round(Number(row.dest_walking_distance_meters || 0)),
          estimatedWalkingMinutes: calculateWalkingMinutes(walkDist),
        };
      });
    }
  } catch (err) {
    if (typeof __DEV__ !== 'undefined' && __DEV__) console.warn('[TripRecommendation] Fallback local:', err);
  }

  return findLocalBestRoutes(query);
}
