import { LatLng } from '../types/route.types';
import { calculateBearingDegrees, calculateDistanceMeters } from './geo.utils';

const HEADING_LOOKAHEAD_METERS = 15;
const CLOSED_LOOP_TOLERANCE_METERS = 40;

/** Recorrido preprocesado: puntos sin duplicados, en bucle cerrado, con distancias acumuladas. */
export interface RoutePath {
  points: LatLng[];
  cumulative: number[];
  totalMeters: number;
}

/**
 * Convierte la geometría de una ruta en un bucle continuo.
 * Si la ruta no termina donde empieza, se recorre de ida y luego de vuelta,
 * así el bus nunca "teletransporta" del final al inicio ni va en reversa.
 */
export function buildRoutePath(coordinates: LatLng[]): RoutePath {
  const clean: LatLng[] = [];
  for (const c of coordinates || []) {
    if (!c || !Number.isFinite(c.latitude) || !Number.isFinite(c.longitude)) continue;
    const prev = clean[clean.length - 1];
    if (!prev || calculateDistanceMeters(prev, c) > 0.5) clean.push(c);
  }

  let points = clean;
  if (clean.length >= 2) {
    const isClosed = calculateDistanceMeters(clean[0], clean[clean.length - 1]) <= CLOSED_LOOP_TOLERANCE_METERS;
    points = isClosed ? [...clean, clean[0]] : [...clean, ...clean.slice(0, -1).reverse()];
  }

  const cumulative: number[] = [0];
  for (let i = 1; i < points.length; i++) {
    cumulative.push(cumulative[i - 1] + calculateDistanceMeters(points[i - 1], points[i]));
  }
  return { points, cumulative, totalMeters: cumulative[cumulative.length - 1] || 0 };
}

export function wrapDistance(path: RoutePath, d: number): number {
  const L = path.totalMeters;
  if (L <= 0) return 0;
  return ((d % L) + L) % L;
}

/** Posición interpolada y segmento para una distancia recorrida. */
export function pointAtDistance(path: RoutePath, distance: number): { point: LatLng; segmentIndex: number } {
  const { points, cumulative } = path;
  if (points.length === 0) return { point: { latitude: 0, longitude: 0 }, segmentIndex: 0 };
  if (points.length === 1 || path.totalMeters <= 0) return { point: points[0], segmentIndex: 0 };

  const d = wrapDistance(path, distance);
  let lo = 0;
  let hi = cumulative.length - 1;
  while (lo < hi - 1) {
    const mid = (lo + hi) >> 1;
    if (cumulative[mid] <= d) lo = mid; else hi = mid;
  }
  const segLen = cumulative[lo + 1] - cumulative[lo];
  const t = segLen > 0 ? (d - cumulative[lo]) / segLen : 0;
  const a = points[lo];
  const b = points[lo + 1];
  return {
    point: { latitude: a.latitude + (b.latitude - a.latitude) * t, longitude: a.longitude + (b.longitude - a.longitude) * t },
    segmentIndex: lo,
  };
}

/** Rumbo hacia donde avanza el bus (mirando unos metros adelante para evitar giros bruscos). */
export function headingAtDistance(path: RoutePath, distance: number): number {
  const here = pointAtDistance(path, distance).point;
  const ahead = pointAtDistance(path, distance + HEADING_LOOKAHEAD_METERS).point;
  return calculateBearingDegrees(here, ahead);
}

