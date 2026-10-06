import { Injectable } from '@nestjs/common';
import { RouteEntity } from '../routes/routes.service';
import { Point2D } from './matching.service';

export interface GhostBusEstimate {
  busId: string;
  routeId: string;
  routeCode: string;
  status: 'GHOST';
  estimatedPosition: Point2D;
  heading: number;
  speedKmh: number;
  nextStopName: string;
  estimatedArrivalMinutes: number;
}

@Injectable()
export class GhostBusService {
  private readonly AVERAGE_URBAN_SPEED_KMH = 20.0;

  generateGhostBusForRoute(route: RouteEntity, offsetRatio: number = 0.4): GhostBusEstimate {
    const coords = route.coordinates;
    if (coords.length < 2) {
      return this.fallbackGhostBus(route);
    }

    // Interpolate position along route based on scheduled frequency
    const targetIndex = Math.min(
      coords.length - 2,
      Math.floor((coords.length - 1) * offsetRatio),
    );

    const start = coords[targetIndex];
    const end = coords[targetIndex + 1];

    const estimatedPosition: Point2D = {
      latitude: start.latitude + (end.latitude - start.latitude) * 0.5,
      longitude: start.longitude + (end.longitude - start.longitude) * 0.5,
    };

    const nextStop = route.stops[targetIndex + 1] || route.stops[0];

    return {
      busId: `ghost-${route.id}-${Math.floor(offsetRatio * 100)}`,
      routeId: route.id,
      routeCode: route.code,
      status: 'GHOST',
      estimatedPosition,
      heading: 20,
      speedKmh: this.AVERAGE_URBAN_SPEED_KMH,
      nextStopName: nextStop ? nextStop.name : 'Siguiente Parada',
      estimatedArrivalMinutes: 5,
    };
  }

  private fallbackGhostBus(route: RouteEntity): GhostBusEstimate {
    return {
      busId: `ghost-${route.id}-default`,
      routeId: route.id,
      routeCode: route.code,
      status: 'GHOST',
      estimatedPosition: { latitude: 1.2145, longitude: -77.2783 },
      heading: 0,
      speedKmh: this.AVERAGE_URBAN_SPEED_KMH,
      nextStopName: 'Plaza Nariño',
      estimatedArrivalMinutes: 4,
    };
  }
}
