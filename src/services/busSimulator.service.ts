import { LatLng } from '../types/route.types';
import { ProjectedBusLocation } from '../types/telemetry.types';
import { calculateBearingDegrees, calculateDistanceMeters } from '../utils/geo.utils';

export interface SimulatedBusState {
  busId: string;
  routeId: string;
  routeCode: string;
  routeColor: string;
  currentIndex: number;
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

const ALIASES = ['CuyConductor', 'GalerasExpress', 'ChasquiPasto'];
const AVATARS = ['cuy-sombrero', 'cuy-galeras', 'cuy-chullo'];

export function createInitialSimulatedBuses(
  routeId: string,
  routeCode: string,
  routeColor: string,
  totalCoords: number,
  count: number = 3
): SimulatedBusState[] {
  const buses: SimulatedBusState[] = [];
  const step = Math.floor(totalCoords / Math.max(count, 1));

  for (let i = 0; i < count; i++) {
    buses.push({
      busId: `${routeId}-sim-${i + 1}`,
      routeId,
      routeCode,
      routeColor,
      currentIndex: (i * step) % Math.max(totalCoords, 1),
      speedKmh: 28 + (i % 3) * 2, // ~30 km/h
      broadcasterAlias: `${ALIASES[i % ALIASES.length]} #${i + 1}`,
      broadcasterAvatarSeed: AVATARS[i % AVATARS.length],
      broadcasterPoints: 150 + i * 75,
    });
  }

  return buses;
}

export function advanceSimulationStep(
  buses: SimulatedBusState[],
  coordinates: LatLng[]
): { updatedBuses: SimulatedBusState[]; projected: ProjectedBusLocation[] } {
  if (!coordinates || coordinates.length === 0) {
    return { updatedBuses: buses, projected: [] };
  }

  const updatedBuses: SimulatedBusState[] = [];
  const projected: ProjectedBusLocation[] = [];

  for (const bus of buses) {
    const nextIdx = (bus.currentIndex + 1) % coordinates.length;
    const currentPos = coordinates[bus.currentIndex];
    const nextPos = coordinates[nextIdx];

    const heading = calculateBearingDegrees(currentPos, nextPos);
    const speedVariation = 29 + Math.round(Math.random() * 3); // 29-32 km/h (~30 km/h)

    updatedBuses.push({
      ...bus,
      currentIndex: nextIdx,
      speedKmh: speedVariation,
    });

    projected.push({
      busId: bus.busId,
      routeId: bus.routeId,
      routeCode: bus.routeCode,
      routeColor: bus.routeColor,
      status: 'LIVE',
      position: currentPos,
      snappedPosition: currentPos,
      heading: Math.round(heading),
      speedKmh: speedVariation,
      distanceToNextStopMeters: Math.round(calculateDistanceMeters(currentPos, nextPos)),
      estimatedArrivalMinutes: 2,
      nextStopName: `Paso ${nextIdx + 1}/${coordinates.length}`,
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
    const { routeId, routeCode, routeColor, coordinates, busCount = 3, intervalMs = 1500, onUpdate } = options;

    if (!coordinates || coordinates.length < 2) return;

    this.currentBuses = createInitialSimulatedBuses(routeId, routeCode, routeColor, coordinates.length, busCount);

    // Emisión inmediata inicial
    const initial = advanceSimulationStep(this.currentBuses, coordinates);
    this.currentBuses = initial.updatedBuses;
    onUpdate(initial.projected);

    // Ciclo continuo de tránsito en tiempo real
    this.timer = setInterval(() => {
      const step = advanceSimulationStep(this.currentBuses, coordinates);
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
