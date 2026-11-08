import { LatLng } from './route.types';

export interface RouteRecommendation {
  routeId: string;
  routeCode: string;
  routeName: string;
  routeColor: string;
  routeDescription?: string;
  originStop: {
    id: string;
    name: string;
    location: LatLng;
  };
  destStop: {
    id: string;
    name: string;
    location: LatLng;
  };
  walkingDistanceMeters: number;
  destWalkingDistanceMeters?: number;
  estimatedWalkingMinutes: number;
}

export interface TripQuery {
  origin: LatLng;
  destination: LatLng;
  radiusMeters?: number;
}
