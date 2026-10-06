import { Injectable } from '@nestjs/common';

export interface Point2D {
  latitude: number;
  longitude: number;
}

export interface MatchResult {
  original: Point2D;
  snapped: Point2D;
  distanceMeters: number;
  isWithinTolerance: boolean;
  bearing: number;
}

@Injectable()
export class MatchingService {
  private readonly MAX_TOLERANCE_METERS = 40.0; // 40m según PROJECT_CONTEXT.md

  snapPointToRoute(point: Point2D, routePolyline: Point2D[]): MatchResult {
    let minDistance = Infinity;
    let closestPoint = point;
    let bearing = 0;

    for (let i = 0; i < routePolyline.length - 1; i++) {
      const p1 = routePolyline[i];
      const p2 = routePolyline[i + 1];
      const projection = this.projectOnSegment(point, p1, p2);

      if (projection.distance < minDistance) {
        minDistance = projection.distance;
        closestPoint = projection.snapped;
        bearing = this.calculateBearing(p1, p2);
      }
    }

    return {
      original: point,
      snapped: closestPoint,
      distanceMeters: minDistance,
      isWithinTolerance: minDistance <= this.MAX_TOLERANCE_METERS,
      bearing,
    };
  }

  private projectOnSegment(p: Point2D, a: Point2D, b: Point2D) {
    const dx = b.longitude - a.longitude;
    const dy = b.latitude - a.latitude;

    if (dx === 0 && dy === 0) {
      return { snapped: a, distance: this.haversine(p, a) };
    }

    const t = Math.max(
      0,
      Math.min(
        1,
        ((p.longitude - a.longitude) * dx + (p.latitude - a.latitude) * dy) /
          (dx * dx + dy * dy),
      ),
    );

    const snapped: Point2D = {
      latitude: a.latitude + t * dy,
      longitude: a.longitude + t * dx,
    };

    return {
      snapped,
      distance: this.haversine(p, snapped),
    };
  }

  private haversine(p1: Point2D, p2: Point2D): number {
    const R = 6371000;
    const dLat = (p2.latitude - p1.latitude) * (Math.PI / 180);
    const dLon = (p2.longitude - p1.longitude) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(p1.latitude * (Math.PI / 180)) *
        Math.cos(p2.latitude * (Math.PI / 180)) *
        Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  private calculateBearing(start: Point2D, end: Point2D): number {
    const y = Math.sin((end.longitude - start.longitude) * (Math.PI / 180)) *
      Math.cos(end.latitude * (Math.PI / 180));
    const x =
      Math.cos(start.latitude * (Math.PI / 180)) *
        Math.sin(end.latitude * (Math.PI / 180)) -
      Math.sin(start.latitude * (Math.PI / 180)) *
        Math.cos(end.latitude * (Math.PI / 180)) *
        Math.cos((end.longitude - start.longitude) * (Math.PI / 180));
    return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
  }
}
