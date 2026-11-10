import { LatLng } from '../types/route.types';
import { RouteRecommendation, TripQuery } from '../types/trip.types';
import { MOCK_PASTO_ROUTES } from '../constants/mockRoutes';
import { STANDARD_ROUTES_PART2 } from '../constants/routes/standardRoutes2';
import { PASTO_LOCATIONS } from '../constants/routes/pastoWaypoints';
import { findPastoPlace } from './placeSearch.service';
import { calculateDistanceMeters, haversineDistance } from '../utils/geo.utils';
import { BUS_AVG_SPEED_KMH, describePoint, forwardDistance, getRoutePath, projectionCandidates, WALK_DETOUR_FACTOR } from './routeBoarding.service';

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
    if (kClean === qClean || kClean.includes(qClean)) return loc;
  }

  // Base de lugares de OpenStreetMap: barrios, veredas, colegios, hospitales, parques…
  const place = findPastoPlace(raw);
  if (place) return place.location;

  for (const [key, loc] of Object.entries(PASTO_LOCATIONS)) {
    if (qClean.includes(clean(key))) return loc;
  }

  for (const route of MOCK_PASTO_ROUTES) {
    for (const stop of route.stops) {
      const sClean = clean(stop.name);
      if (sClean === qClean || sClean.includes(qClean) || qClean.includes(sClean)) return stop.location;
    }
  }
  return null;
}

/**
 * Recomienda rutas usando la línea real del recorrido (no paraderos): el usuario
 * aborda en el punto de la ruta más cercano y se baja en el más cercano al destino,
 * respetando el sentido en que circula el bus.
 */
export function findLocalBestRoutes(query: TripQuery): RouteRecommendation[] {
  if (checkCoverageArea(query.origin).isOutOfArea) return [];
  const radius = query.radiusMeters || 1200;
  const directMeters = calculateDistanceMeters(query.origin, query.destination);
  const results: RouteRecommendation[] = [];

  for (const route of MOCK_PASTO_ROUTES) {
    const path = getRoutePath(route.id);
    if (!path) continue;
    const origCandidates = projectionCandidates(path, query.origin).filter((o) => o.distanceMeters <= radius);
    const destCandidates = projectionCandidates(path, query.destination).filter((d) => d.distanceMeters <= radius);

    let best: RouteRecommendation | null = null;
    for (const orig of origCandidates) {
      for (const dest of destCandidates) {
        const rideMeters = forwardDistance(path, orig.alongMeters, dest.alongMeters);
        // Descartar trayectos absurdos: casi nulos o que dan media vuelta a la ciudad.
        if (rideMeters < 250 || rideMeters > Math.max(4000, directMeters * 3)) continue;
        const walkMeters = Math.round(orig.distanceMeters * WALK_DETOUR_FACTOR);
        const destWalkMeters = Math.round(dest.distanceMeters * WALK_DETOUR_FACTOR);
        const rideMinutes = Math.max(1, Math.round(rideMeters / ((BUS_AVG_SPEED_KMH * 1000) / 60)));
        const walkMin = calculateWalkingMinutes(walkMeters);
        const destWalkMin = calculateWalkingMinutes(destWalkMeters);
        const totalMinutes = walkMin + rideMinutes + destWalkMin;
        if (best && totalMinutes >= (best.totalMinutes ?? Infinity)) continue;

        const s2Match = STANDARD_ROUTES_PART2.find((r) => r.id === route.id);
        best = {
          routeId: route.id,
          routeCode: route.code,
          routeName: route.name,
          routeColor: s2Match ? s2Match.color : route.color,
          routeDescription: route.description,
          originStop: { id: `${route.id}-board`, name: describePoint(orig.point), location: orig.point },
          destStop: { id: `${route.id}-alight`, name: describePoint(dest.point), location: dest.point },
          walkingDistanceMeters: walkMeters,
          destWalkingDistanceMeters: destWalkMeters,
          estimatedWalkingMinutes: walkMin,
          destWalkingMinutes: destWalkMin,
          rideDistanceMeters: Math.round(rideMeters),
          rideMinutes,
          totalMinutes,
          boardAlongMeters: orig.alongMeters,
        };
      }
    }
    if (best) results.push(best);
  }

  // Si caminar directo es más rápido que cualquier bus, igual mostramos las rutas, ordenadas por tiempo total.
  return results.sort((a, b) => (a.totalMinutes ?? 0) - (b.totalMinutes ?? 0)).slice(0, 6);
}

/**
 * Se calcula en el dispositivo con la geometría real de las rutas. (El RPC
 * `find_best_routes` de Supabase trabaja con paraderos y ya no se usa.)
 */
export async function findBestRoutes(query: TripQuery): Promise<RouteRecommendation[]> {
  return findLocalBestRoutes(query);
}
