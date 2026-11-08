import { LatLng } from '../types/route.types';
import { ProjectedBusLocation } from '../types/telemetry.types';
import { calculateDistanceMeters } from '../utils/geo.utils';

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
