import { LatLng } from './route.types';

export type BusStatusType = 'LIVE' | 'GHOST' | 'OFFLINE';

export interface RawTelemetryPayload {
  userId: string;
  routeId: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  speedKmh: number;
  heading: number;
  timestamp: number;
}

export interface ProjectedBusLocation {
  busId: string;
  routeId: string;
  routeCode: string;
  routeColor: string;
  status: BusStatusType;
  position: LatLng;
  snappedPosition: LatLng;
  heading: number;
  speedKmh: number;
  distanceToNextStopMeters: number;
  estimatedArrivalMinutes: number;
  nextStopName: string;
  broadcasterAlias?: string;
  broadcasterAvatarSeed?: string;
  broadcasterPoints?: number;
  lastUpdated: number;
}

export interface TelemetrySocketEvents {
  'telemetry:emit': (data: RawTelemetryPayload) => void;
  'telemetry:projected': (data: ProjectedBusLocation) => void;
  'room:join': (routeId: string) => void;
  'room:leave': (routeId: string) => void;
}
