import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import * as turf from '@turf/turf';
import { PASTO_ROUTES_GEOJSON } from './MapMatchingService';

export interface GhostBusPayload {
  busId: string;
  userId: string;
  routeId: string;
  latitude: number;
  longitude: number;
  speedKmh: number;
  heading: number;
  accuracy: number;
  is_ghost: true;
  status: 'GHOST';
  timestamp: number;
}

@Injectable()
export class GhostBusService {
  private readonly logger = new Logger(GhostBusService.name);
  private readonly SIMULATED_SPEED_KMH = 18.0; // Velocidad promedio urbana de 18 km/h
  private readonly STEP_INTERVAL_SECONDS = 15; // Intervalo de 15 segundos
  private readonly STEP_DISTANCE_KM = (18.0 * 15) / 3600; // 0.075 km = 75 metros por paso

  private readonly routeProgress = new Map<string, number>();
  private readonly lastRealPing = new Map<string, number>();
  private broadcaster?: (routeId: string, payload: GhostBusPayload) => void;

  setBroadcaster(fn: (routeId: string, payload: GhostBusPayload) => void) {
    this.broadcaster = fn;
  }

  notifyRealUserActivity(routeId: string) {
    this.lastRealPing.set(routeId, Date.now());
  }

  hasActiveRealUsers(routeId: string, maxIdleSeconds: number = 30): boolean {
    const lastPing = this.lastRealPing.get(routeId);
    if (!lastPing) return false;
    return Date.now() - lastPing < maxIdleSeconds * 1000;
  }

  calculateGhostPosition(routeId: string): GhostBusPayload | null {
    const routeFeature = PASTO_ROUTES_GEOJSON[routeId] || PASTO_ROUTES_GEOJSON['route-c1'];
    if (!routeFeature) return null;

    const totalLengthKm = turf.length(routeFeature, { units: 'kilometers' });
    if (totalLengthKm <= 0) return null;

    let currentDist = this.routeProgress.get(routeId) || 0;
    currentDist = (currentDist + this.STEP_DISTANCE_KM) % totalLengthKm;
    this.routeProgress.set(routeId, currentDist);

    // Posición estimada sobre el trazado GeoJSON
    const point = turf.along(routeFeature, currentDist, { units: 'kilometers' });
    const [longitude, latitude] = point.geometry.coordinates;

    // Cálculo del rumbo (heading) mirando 20 metros hacia adelante
    const nextDist = (currentDist + 0.02) % totalLengthKm;
    const nextPoint = turf.along(routeFeature, nextDist, { units: 'kilometers' });
    const rawBearing = turf.bearing(point, nextPoint);
    const heading = Math.round((rawBearing + 360) % 360);

    return {
      busId: `ghost-${routeId}`,
      userId: `ghost-system-${routeId}`,
      routeId,
      latitude,
      longitude,
      speedKmh: this.SIMULATED_SPEED_KMH,
      heading,
      accuracy: 5,
      is_ghost: true,
      status: 'GHOST',
      timestamp: Date.now(),
    };
  }

  @Interval(15000)
  handleGhostBusInterval() {
    const routesToMonitor = ['route-c1', 'route-c16', 'route-e4'];

    for (const routeId of routesToMonitor) {
      if (!this.hasActiveRealUsers(routeId)) {
        const ghostBus = this.calculateGhostPosition(routeId);
        if (ghostBus && this.broadcaster) {
          this.logger.debug(
            `[GhostBus] Emitiendo bus fantasma para ${routeId}: ` +
            `(${ghostBus.latitude.toFixed(4)}, ${ghostBus.longitude.toFixed(4)})`,
          );
          this.broadcaster(routeId, ghostBus);
        }
      }
    }
  }
}
