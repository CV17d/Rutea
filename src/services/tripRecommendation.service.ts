import { LatLng } from '../types/route.types';
import { RouteRecommendation, TripQuery } from '../types/trip.types';
import { supabase } from './supabase.client';
import { MOCK_PASTO_ROUTES } from '../constants/mockRoutes';
import { STANDARD_ROUTES_PART2 } from '../constants/routes/standardRoutes2';
import { PASTO_LOCATIONS } from '../constants/routes/pastoWaypoints';
import { calculateDistanceMeters } from '../utils/geo.utils';

export function resolvePastoLocation(input: string): LatLng | null {
  const norm = input.trim().toLowerCase();
  const directKey = Object.keys(PASTO_LOCATIONS).find((k) => k.toLowerCase() === norm);
  if (directKey) return PASTO_LOCATIONS[directKey];

  const matched = Object.entries(PASTO_LOCATIONS).find(([name]) =>
    name.toLowerCase().includes(norm) || norm.includes(name.toLowerCase())
  );
  if (matched) return matched[1];

  const coords = norm.split(',').map((s) => parseFloat(s.trim()));
  if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
    return { latitude: coords[0], longitude: coords[1] };
  }
  return null;
}

export function findLocalBestRoutes(query: TripQuery): RouteRecommendation[] {
  const radius = query.radiusMeters || 1000;
  const results: RouteRecommendation[] = [];

  for (const route of MOCK_PASTO_ROUTES) {
    const origStops = route.stops
      .map((stop) => ({ stop, dist: calculateDistanceMeters(query.origin, stop.location) }))
      .filter((item) => item.dist <= radius);

    const destStops = route.stops
      .map((stop) => ({ stop, dist: calculateDistanceMeters(query.destination, stop.location) }))
      .filter((item) => item.dist <= radius);

    for (const orig of origStops) {
      for (const dest of destStops) {
        if (orig.stop.orderIndex < dest.stop.orderIndex) {
          const s2Match = STANDARD_ROUTES_PART2.find((r) => r.id === route.id);
          const color = s2Match ? s2Match.color : route.color;
          const walkingMin = Math.max(1, Math.round(orig.dist / 80));

          results.push({
            routeId: route.id,
            routeCode: route.code,
            routeName: route.name,
            routeColor: color,
            routeDescription: route.description,
            originStop: { id: orig.stop.id, name: orig.stop.name, location: orig.stop.location },
            destStop: { id: dest.stop.id, name: dest.stop.name, location: dest.stop.location },
            walkingDistanceMeters: Math.round(orig.dist),
            destWalkingDistanceMeters: Math.round(dest.dist),
            estimatedWalkingMinutes: walkingMin,
          });
        }
      }
    }
  }

  return results.sort((a, b) => a.walkingDistanceMeters - b.walkingDistanceMeters);
}

export async function findBestRoutes(query: TripQuery): Promise<RouteRecommendation[]> {
  const radius = query.radiusMeters || 1000;

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
        const color = s2Match?.color || row.route_color || '#0284c7';
        const walkDist = Number(row.walking_distance_meters || 0);
        return {
          routeId: row.route_id,
          routeCode: row.route_code || row.route_id.replace('route-', '').toUpperCase(),
          routeName: row.route_name || `Ruta ${row.route_code}`,
          routeColor: color,
          originStop: {
            id: row.origin_stop_id,
            name: row.origin_stop_name,
            location: { latitude: row.origin_stop_lat, longitude: row.origin_stop_lng },
          },
          destStop: {
            id: row.dest_stop_id,
            name: row.dest_stop_name,
            location: { latitude: row.dest_stop_lat, longitude: row.dest_stop_lng },
          },
          walkingDistanceMeters: Math.round(walkDist),
          destWalkingDistanceMeters: Math.round(Number(row.dest_walking_distance_meters || 0)),
          estimatedWalkingMinutes: Math.max(1, Math.round(walkDist / 80)),
        };
      });
    }
  } catch (err) {
    console.warn('[TripRecommendation] Error en RPC find_best_routes, fallback local:', err);
  }

  return findLocalBestRoutes(query);
}
