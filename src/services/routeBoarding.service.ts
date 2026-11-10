import { LatLng } from '../types/route.types';
import { ROUTE_FALLBACK_GEOMETRIES } from '../constants/routes/fallbackGeometries';
import { PASTO_LOCATIONS } from '../constants/routes/pastoWaypoints';
import { nearestNeighbourhood } from './placeSearch.service';
import { useRoutesStore } from '../store/useRoutesStore';
import { buildRoutePath, RoutePath } from '../utils/routePath.utils';
import { calculateBearingDegrees, calculateDistanceMeters } from '../utils/geo.utils';

/**
 * Los buses de Pasto paran en cualquier punto de su recorrido, así que no usamos
 * paraderos: se aborda en el punto de la línea de la ruta más cercano al usuario.
 */

/** Las calles no son línea recta: la caminata real es ~30% más larga que la distancia directa. */
export const WALK_DETOUR_FACTOR = 1.3;
/** Velocidad comercial promedio de un bus urbano en Pasto incluyendo paradas y semáforos. */
export const BUS_AVG_SPEED_KMH = 18;

export interface PathProjection {
  point: LatLng;
  distanceMeters: number;
  alongMeters: number;
  bearing: number;
}

const pathCache = new Map<string, RoutePath>();

/** Recorrido en bucle (ida + vuelta) de una ruta, con la geometría más actual disponible. */
export function getRoutePath(routeId: string): RoutePath | null {
  const storeCoords = useRoutesStore.getState().routes.find((r) => r.id === routeId)?.coordinates;
  const coords = storeCoords && storeCoords.length >= 2 ? storeCoords : ROUTE_FALLBACK_GEOMETRIES[routeId];
  if (!coords || coords.length < 2) return null;
  const key = `${routeId}:${coords.length}:${coords[0].latitude}:${coords[coords.length - 1].longitude}`;
  let path = pathCache.get(key);
  if (!path) {
    path = buildRoutePath(coords);
    pathCache.set(key, path);
  }
  return path.totalMeters > 0 ? path : null;
}

/**
 * Proyecta un punto sobre el recorrido. Opcionalmente limita la búsqueda a un tramo
 * [fromMeters, toMeters) o exige que el sentido del tramo coincida con un rumbo dado.
 */
export function projectOnPath(
  path: RoutePath,
  point: LatLng,
  opts: { fromMeters?: number; toMeters?: number; heading?: number } = {}
): PathProjection | null {
  const { points, cumulative } = path;
  const from = opts.fromMeters ?? 0;
  const to = opts.toMeters ?? path.totalMeters;
  const cosLat = Math.cos((point.latitude * Math.PI) / 180);
  const toXY = (p: LatLng) => ({ x: (p.longitude - point.longitude) * 111320 * cosLat, y: (p.latitude - point.latitude) * 110540 });
  let best: PathProjection | null = null;

  for (let i = 0; i < points.length - 1; i++) {
    const mid = (cumulative[i] + cumulative[i + 1]) / 2;
    if (mid < from || mid >= to) continue;
    const bearing = calculateBearingDegrees(points[i], points[i + 1]);
    if (opts.heading != null && Math.abs(((bearing - opts.heading + 540) % 360) - 180) > 90) continue;
    const a = toXY(points[i]);
    const b = toXY(points[i + 1]);
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len2 = dx * dx + dy * dy;
    const t = len2 > 0 ? Math.max(0, Math.min(1, -(a.x * dx + a.y * dy) / len2)) : 0;
    const dist = Math.hypot(a.x + t * dx, a.y + t * dy);
    if (!best || dist < best.distanceMeters) {
      const p = points[i];
      const q = points[i + 1];
      best = {
        point: { latitude: p.latitude + (q.latitude - p.latitude) * t, longitude: p.longitude + (q.longitude - p.longitude) * t },
        distanceMeters: dist,
        alongMeters: cumulative[i] + (cumulative[i + 1] - cumulative[i]) * t,
        bearing,
      };
    }
  }
  return best;
}

/** Candidatos de abordaje/descenso: el punto más cercano en el tramo de ida y en el de vuelta. */
export function projectionCandidates(path: RoutePath, point: LatLng): PathProjection[] {
  const half = path.totalMeters / 2;
  return [
    projectOnPath(path, point, { fromMeters: 0, toMeters: half }),
    projectOnPath(path, point, { fromMeters: half, toMeters: path.totalMeters }),
  ].filter((p): p is PathProjection => p !== null);
}

/** Distancia que recorre el bus hacia adelante desde `fromAlong` hasta `toAlong`. */
export function forwardDistance(path: RoutePath, fromAlong: number, toAlong: number): number {
  const L = path.totalMeters;
  return (((toAlong - fromAlong) % L) + L) % L;
}

const humanize = (key: string) =>
  key.replace(/([a-z])([A-Z0-9])/g, '$1 $2').replace(/^./, (c) => c.toUpperCase()).replace(/Narino/g, 'Nariño');

/** Nombre legible del punto: el sitio conocido más cercano, si lo hay a menos de 450 m. */
export function describePoint(point: LatLng): string {
  const barrio = nearestNeighbourhood(point);
  if (barrio) {
    const name = barrio.name.replace(/^barrio\s+/i, '');
    // Condominios, conjuntos y urbanizaciones ya dicen qué son.
    if (/^(condominio|conjunto|urbanizaci[oó]n|unidad|ciudadela|villa)/i.test(name)) return name;
    return `${barrio.type === 'vereda' ? 'Vereda' : 'Barrio'} ${name}`;
  }
  let bestName: string | null = null;
  let bestDist = 450;
  for (const [key, loc] of Object.entries(PASTO_LOCATIONS)) {
    const d = calculateDistanceMeters(point, loc);
    if (d < bestDist) { bestDist = d; bestName = humanize(key); }
  }
  return bestName ? `Cerca de ${bestName}` : 'Punto de la ruta más cercano';
}
