import { LatLng } from '../types/route.types';
import { ProjectedBusLocation } from '../types/telemetry.types';
import { buildRoutePath, headingAtDistance, pointAtDistance, RoutePath, wrapDistance } from '../utils/routePath.utils';

export { buildRoutePath, headingAtDistance, pointAtDistance };
export type { RoutePath };

const ALIASES = ['CuyConductor', 'GalerasExpress', 'ChasquiPasto'];
const AVATARS = ['cuy-sombrero', 'cuy-galeras', 'cuy-chullo'];

export interface SimulatedBusState {
  busId: string;
  routeId: string;
  routeCode: string;
  routeColor: string;
  /** Índice del segmento actual dentro del recorrido en bucle. */
  currentIndex: number;
  /** Metros recorridos desde el inicio del recorrido en bucle. */
  distanceAlong: number;
  speedKmh: number;
  broadcasterAlias: string;
  broadcasterAvatarSeed: string;
  broadcasterPoints: number;
}

export interface SimulationOptions {
  routeId: string;
  routeCode: string;
  routeColor: string;
  coordinates: LatLng[];
  busCount?: number;
  intervalMs?: number;
  onUpdate: (buses: ProjectedBusLocation[]) => void;
}

export function createInitialSimulatedBuses(
  routeId: string,
  routeCode: string,
  routeColor: string,
  totalMeters: number,
  count: number = 3
): SimulatedBusState[] {
  const buses: SimulatedBusState[] = [];
  const spacing = totalMeters / Math.max(count, 1);

  for (let i = 0; i < count; i++) {
    buses.push({
      busId: `${routeId}-sim-${i + 1}`,
      routeId,
      routeCode,
      routeColor,
      currentIndex: 0,
      distanceAlong: i * spacing,
      speedKmh: 28 + (i % 3) * 2,
      broadcasterAlias: `${ALIASES[i % ALIASES.length]} #${i + 1}`,
      broadcasterAvatarSeed: AVATARS[i % AVATARS.length],
      broadcasterPoints: 150 + i * 75,
    });
  }
  return buses;
}

export function advanceSimulationStep(
  buses: SimulatedBusState[],
  path: RoutePath,
  elapsedMs: number
): { updatedBuses: SimulatedBusState[]; projected: ProjectedBusLocation[] } {
  if (!path || path.points.length < 2 || path.totalMeters <= 0) {
    return { updatedBuses: buses, projected: [] };
  }

  const updatedBuses: SimulatedBusState[] = [];
  const projected: ProjectedBusLocation[] = [];

  for (const bus of buses) {
    // Variación suave de velocidad (26-34 km/h), sin saltos bruscos.
    const speedKmh = Math.max(26, Math.min(34, bus.speedKmh + (Math.random() - 0.5) * 1.5));
    const distanceAlong = wrapDistance(path, bus.distanceAlong + (speedKmh / 3.6) * (elapsedMs / 1000));
    const { point, segmentIndex } = pointAtDistance(path, distanceAlong);
    const heading = headingAtDistance(path, distanceAlong);
    const remainingInSegment = Math.max(0, path.cumulative[segmentIndex + 1] - distanceAlong);

    updatedBuses.push({ ...bus, distanceAlong, currentIndex: segmentIndex, speedKmh });

    projected.push({
      busId: bus.busId,
      routeId: bus.routeId,
      routeCode: bus.routeCode,
      routeColor: bus.routeColor,
      status: 'LIVE',
      position: point,
      snappedPosition: point,
      heading: Math.round(heading),
      speedKmh: Math.round(speedKmh),
      distanceToNextStopMeters: Math.round(remainingInSegment),
      estimatedArrivalMinutes: 2,
      nextStopName: `Paso ${segmentIndex + 1}/${path.points.length - 1}`,
      broadcasterAlias: bus.broadcasterAlias,
      broadcasterAvatarSeed: bus.broadcasterAvatarSeed,
      broadcasterPoints: bus.broadcasterPoints,
      lastUpdated: Date.now(),
    });
  }

  return { updatedBuses, projected };
}

class BusSimulatorService {
  private timer: ReturnType<typeof setInterval> | null = null;
  private currentBuses: SimulatedBusState[] = [];

  start(options: SimulationOptions): void {
    this.stop();
    const { routeId, routeCode, routeColor, coordinates, busCount = 3, intervalMs = 1000, onUpdate } = options;

    const path = buildRoutePath(coordinates);
    if (path.points.length < 2 || path.totalMeters <= 0) return;

    this.currentBuses = createInitialSimulatedBuses(routeId, routeCode, routeColor, path.totalMeters, busCount);

    const initial = advanceSimulationStep(this.currentBuses, path, 0);
    this.currentBuses = initial.updatedBuses;
    onUpdate(initial.projected);

    let last = Date.now();
    this.timer = setInterval(() => {
      const now = Date.now();
      // Limita el delta si la app estuvo en segundo plano, para no "saltar" la ruta.
      const elapsed = Math.min(now - last, intervalMs * 3);
      last = now;
      const step = advanceSimulationStep(this.currentBuses, path, elapsed);
      this.currentBuses = step.updatedBuses;
      onUpdate(step.projected);
    }, intervalMs);
  }

  stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.currentBuses = [];
  }
}

export const busSimulator = new BusSimulatorService();
