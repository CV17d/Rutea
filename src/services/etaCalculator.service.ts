import { LatLng } from '../types/route.types';
import { ProjectedBusLocation } from '../types/telemetry.types';
import { calculateDistanceMeters } from '../utils/geo.utils';
import { RoutePath } from '../utils/routePath.utils';
import { BUS_AVG_SPEED_KMH, forwardDistance, projectOnPath } from './routeBoarding.service';

export interface ApproachingBusEta {
  bus: ProjectedBusLocation;
  distanceMeters: number;
  etaMinutes: number;
  displayText: string;
}

/**
 * Calcula el tiempo estimado de llegada en minutos dada una distancia en metros
 * y una velocidad promedio en km/h (por defecto 30 km/h en Pasto).
 */
export function calculateEtaMinutes(distanceMeters: number, speedKmh: number = 30): number {
  if (distanceMeters <= 0) return 1;
  const effectiveSpeed = Math.max(10, speedKmh);
  const metersPerMinute = (effectiveSpeed * 1000) / 60; // 30 km/h = 500 m/min
  const minutes = Math.round(distanceMeters / metersPerMinute);
  return Math.max(1, minutes);
}

/**
 * Calcula la distancia restante entre la posición del bus y el paradero objetivo.
 */
export function calculateRemainingDistanceMeters(
  busPosition: LatLng,
  targetStopLocation: LatLng
): number {
  return Math.round(calculateDistanceMeters(busPosition, targetStopLocation));
}

/**
 * Encuentra el bus más cercano en aproximación a un paradero específico.
 */
export function findClosestApproachingBus(
  buses: ProjectedBusLocation[],
  targetStopLocation: LatLng,
  routeId?: string
): ApproachingBusEta | null {
  if (!buses || buses.length === 0 || !targetStopLocation) {
    return null;
  }

  const filtered = routeId ? buses.filter((b) => b.routeId === routeId) : buses;
  if (filtered.length === 0) return null;

  let closest: ProjectedBusLocation | null = null;
  let minDistance = Infinity;

  for (const bus of filtered) {
    const pos = bus.snappedPosition || bus.position;
    if (!pos) continue;

    const dist = calculateRemainingDistanceMeters(pos, targetStopLocation);
    if (dist < minDistance) {
      minDistance = dist;
      closest = bus;
    }
  }

  if (!closest) return null;

  const eta = calculateEtaMinutes(minDistance, closest.speedKmh || 30);
  const alias = closest.broadcasterAlias || `Bus ${closest.routeCode}`;
  const displayText =
    eta <= 1
      ? `${alias} llegando ahora (< 1 min)`
      : `${alias} llegando en ~${eta} min`;

  return {
    bus: closest,
    distanceMeters: minDistance,
    etaMinutes: eta,
    displayText,
  };
}

export interface AlongRouteEta extends ApproachingBusEta {
  /** Metros que el bus aún debe recorrer por la ruta hasta el punto de abordaje. */
  routeDistanceMeters: number;
}

const STALE_BUS_MS = 2 * 60 * 1000;

/**
 * ETA real: distancia por la ruta (en el sentido en que circula el bus) desde cada bus
 * hasta el punto de abordaje. Ignora buses que ya pasaron, que van en sentido contrario
 * o cuya señal está desactualizada.
 */
export function findNextBusAlongRoute(
  buses: ProjectedBusLocation[],
  routeId: string,
  path: RoutePath,
  boardAlongMeters: number
): AlongRouteEta | null {
  let best: AlongRouteEta | null = null;
  const now = Date.now();
  for (const bus of buses) {
    if (bus.routeId !== routeId) continue;
    if (bus.lastUpdated && now - bus.lastUpdated > STALE_BUS_MS) continue;
    const pos = bus.snappedPosition || bus.position;
    if (!pos) continue;
    const proj = projectOnPath(path, pos, { heading: bus.heading }) || projectOnPath(path, pos);
    if (!proj || proj.distanceMeters > 150) continue;
    const routeDistanceMeters = Math.round(forwardDistance(path, proj.alongMeters, boardAlongMeters));
    const speed = bus.speedKmh && bus.speedKmh >= 8 ? Math.min(bus.speedKmh, 40) : BUS_AVG_SPEED_KMH;
    const eta = calculateEtaMinutes(routeDistanceMeters, speed);
    if (best && routeDistanceMeters >= best.routeDistanceMeters) continue;
    const alias = bus.broadcasterAlias || `Bus ${bus.routeCode}`;
    best = {
      bus,
      distanceMeters: routeDistanceMeters,
      routeDistanceMeters,
      etaMinutes: eta,
      displayText: eta <= 1 ? `${alias} llegando ahora (< 1 min)` : `${alias} llegando en ~${eta} min`,
    };
  }
  return best;
}
