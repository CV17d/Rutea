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
  /** Minutos caminando desde el punto de descenso hasta el destino. */
  destWalkingMinutes?: number;
  /** Metros que recorre el bus entre el punto de abordaje y el de descenso. */
  rideDistanceMeters?: number;
  rideMinutes?: number;
  /** Caminata + trayecto en bus + caminata final (sin contar la espera). */
  totalMinutes?: number;
  /** Posición del punto de abordaje sobre el recorrido de la ruta (metros). */
  boardAlongMeters?: number;
}

export interface TripQuery {
  origin: LatLng;
  destination: LatLng;
  radiusMeters?: number;
}
