import { Injectable } from '@nestjs/common';
import * as turf from '@turf/turf';

export interface RawCoordinates {
  userId: string;
  routeId: string;
  latitude: number;
  longitude: number;
  speedKmh?: number;
  heading?: number;
  accuracy?: number;
  timestamp: number;
}

export interface ProcessedCoordinateResult {
  isValid: boolean;
  isDeviated: boolean;
  status: 'SNAPPED' | 'DEVIATED' | 'DISCARDED';
  originalLatitude: number;
  originalLongitude: number;
  snappedLatitude: number;
  snappedLongitude: number;
  distanceMeters: number;
  bearing: number;
  routeId: string;
}

// GeoJSON temporal con trazados oficiales de transporte de San Juan de Pasto
export const PASTO_ROUTES_GEOJSON: Record<string, GeoJSON.Feature<GeoJSON.LineString>> = {
  'route-c1': turf.lineString([
    [-77.2845, 1.1732], // Catambuco
    [-77.2810, 1.1850],
    [-77.2790, 1.1980], // Chapal
    [-77.2775, 1.2085],
    [-77.2783, 1.2145], // Plaza de Nariño (Centro)
    [-77.2830, 1.2210], // Maridíaz
    [-77.2890, 1.2280],
    [-77.2918, 1.2312], // U. de Nariño Torobajo
  ]),
  'C1': turf.lineString([
    [-77.2845, 1.1732],
    [-77.2810, 1.1850],
    [-77.2790, 1.1980],
    [-77.2775, 1.2085],
    [-77.2783, 1.2145],
    [-77.2830, 1.2210],
    [-77.2890, 1.2280],
    [-77.2918, 1.2312],
  ]),
  'route-c16': turf.lineString([
    [-77.2760, 1.1920], // Chapal
    [-77.2750, 1.2010],
    [-77.2778, 1.2115], // Plaza del Carnaval
    [-77.2815, 1.2205],
    [-77.2855, 1.2295], // Pandiaco
  ]),
  'C16': turf.lineString([
    [-77.2760, 1.1920],
    [-77.2750, 1.2010],
    [-77.2778, 1.2115],
    [-77.2815, 1.2205],
    [-77.2855, 1.2295],
  ]),
  'route-e4': turf.lineString([
    [-77.2880, 1.2050],
    [-77.2662, 1.2018], // Terminal
    [-77.2710, 1.2150],
    [-77.2840, 1.2289], // San Ezequiel
  ]),
  'E4': turf.lineString([
    [-77.2880, 1.2050],
    [-77.2662, 1.2018],
    [-77.2710, 1.2150],
    [-77.2840, 1.2289],
  ]),
};

@Injectable()
export class MapMatchingService {
  private readonly MAX_TOLERANCE_METERS = 45.0; // Umbral de tolerancia de 45m

  processRawCoordinates(raw: RawCoordinates): ProcessedCoordinateResult {
    const routeFeature = PASTO_ROUTES_GEOJSON[raw.routeId] || PASTO_ROUTES_GEOJSON['route-c1'];

    // Coordenadas crudas del GPS (GeoJSON usa [longitud, latitud])
    const rawPoint = turf.point([raw.longitude, raw.latitude]);

    // 1. Proyeccion ortogonal sobre el trazado oficial de la ruta (snap-to-road)
    const snapped = turf.nearestPointOnLine(routeFeature, rawPoint, { units: 'meters' });
    const distanceMeters = turf.pointToLineDistance(rawPoint, routeFeature, { units: 'meters' });

    const [snappedLng, snappedLat] = snapped.geometry.coordinates;

    // 2. Calculo de bearing (direccion de la ruta en ese segmento)
    const bearing = turf.bearing(rawPoint, snapped);

    // 3. Validar si esta demasiado lejos del trazado (ruido GPS o usuario bajo del bus)
    const isDeviated = distanceMeters > this.MAX_TOLERANCE_METERS;

    return {
      isValid: !isDeviated,
      isDeviated,
      status: isDeviated ? 'DEVIATED' : 'SNAPPED',
      originalLatitude: raw.latitude,
      originalLongitude: raw.longitude,
      snappedLatitude: snappedLat,
      snappedLongitude: snappedLng,
      distanceMeters: Math.round(distanceMeters * 10) / 10,
      bearing: Math.round((bearing + 360) % 360),
      routeId: raw.routeId,
    };
  }
}
