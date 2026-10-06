import { Injectable } from '@nestjs/common';
import { RoutesService } from '../routes/routes.service';
import { MatchingService } from '../matching/matching.service';
import { GamificationService } from '../gamification/gamification.service';
import { TrackingGateway } from '../tracking/tracking.gateway';

export interface IngestTelemetryDto {
  userId: string;
  routeId: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  speedKmh: number;
  heading: number;
  timestamp: number;
}

@Injectable()
export class TelemetryService {
  constructor(
    private readonly routesService: RoutesService,
    private readonly matchingService: MatchingService,
    private readonly gamificationService: GamificationService,
    private readonly trackingGateway: TrackingGateway,
  ) {}

  processIncomingTelemetry(dto: IngestTelemetryDto) {
    const route = this.routesService.findById(dto.routeId);
    if (!route) return null;

    // 1. Proyección ortogonal Snap-to-Route
    const match = this.matchingService.snapPointToRoute(
      { latitude: dto.latitude, longitude: dto.longitude },
      route.coordinates,
    );

    // 2. Validación de Gamificación y Anti-Spoofing
    const validation = this.gamificationService.validateAndCalculatePoints(
      dto.speedKmh,
      dto.accuracy,
      match.isWithinTolerance,
      match.distanceMeters,
    );

    if (!validation.isValid) {
      console.warn(`[Telemetry] Descarte de paquete: ${validation.reason}`);
      return { status: 'DISCARDED', reason: validation.reason };
    }

    // 3. Empaquetar posición proyectada para clientes receptores
    const projectedBus = {
      busId: `bus-${dto.routeId}-${dto.userId.slice(0, 6)}`,
      routeId: dto.routeId,
      routeCode: route.code,
      routeColor: route.color,
      status: 'LIVE',
      position: { latitude: dto.latitude, longitude: dto.longitude },
      snappedPosition: match.snapped,
      heading: match.bearing || dto.heading,
      speedKmh: dto.speedKmh,
      distanceToNextStopMeters: 350,
      estimatedArrivalMinutes: 2,
      nextStopName: route.stops[0]?.name || 'Próxima Parada',
      broadcasterAlias: 'CuyVeloz42',
      broadcasterAvatarSeed: 'cuy42',
      broadcasterPoints: 340 + validation.awardedPoints,
      lastUpdated: Date.now(),
    };

    // 4. Emitir en tiempo real al canal de la ruta
    this.trackingGateway.broadcastProjectedBus(dto.routeId, projectedBus);

    return {
      status: 'PROCESSED',
      awardedPoints: validation.awardedPoints,
      projectedBus,
    };
  }
}
