import { LatLng } from '../types/route.types';
import placesData from '../constants/places/pastoPlaces.json';

/**
 * Buscador de lugares de San Juan de Pasto (barrios, veredas, colegios, hospitales,
 * parques, centros comerciales…). Datos © colaboradores de OpenStreetMap (ODbL),
 * descargados con Overpass y limpiados en src/constants/places/pastoPlaces.json.
 */
export type PlaceType =
  | 'barrio' | 'vereda' | 'salud' | 'educacion' | 'parque' | 'comercio'
  | 'transporte' | 'gobierno' | 'iglesia' | 'hotel' | 'sitio';

export interface PastoPlace {
  name: string;
  type: PlaceType;
  location: LatLng;
}

interface RawPlace { n: string; a: number; o: number; t: PlaceType }

export const normalizePlaceText = (s: string): string =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();

const PLACES: (PastoPlace & { key: string })[] = (placesData as RawPlace[]).map((p) => ({
  name: p.n,
  type: p.t,
  location: { latitude: p.a, longitude: p.o },
  key: normalizePlaceText(p.n).replace(/^barrio /, ''),
}));

// Los barrios y veredas son lo que más se busca: desempatan por encima de otros lugares.
const TYPE_BOOST: Partial<Record<PlaceType, number>> = { barrio: 3, vereda: 2, salud: 1, educacion: 1, transporte: 1 };

export const PLACE_TYPE_LABEL: Record<PlaceType, string> = {
  barrio: 'Barrio', vereda: 'Vereda / corregimiento', salud: 'Salud', educacion: 'Educación',
  parque: 'Parque', comercio: 'Comercio', transporte: 'Transporte', gobierno: 'Institución',
  iglesia: 'Iglesia', hotel: 'Hotel', sitio: 'Sitio de interés',
};

export const PLACE_TYPE_ICON: Record<PlaceType, string> = {
  barrio: 'home-group', vereda: 'pine-tree', salud: 'hospital-box-outline', educacion: 'school-outline',
  parque: 'tree-outline', comercio: 'storefront-outline', transporte: 'bus-stop', gobierno: 'bank-outline',
  iglesia: 'church', hotel: 'bed-outline', sitio: 'map-marker-star-outline',
};

function score(key: string, q: string, words: string[]): number {
  if (key === q) return 100;
  if (key.startsWith(q)) return 80;
  if (key.split(' ').some((w) => w.startsWith(q))) return 60;
  if (words.every((w) => key.includes(w))) return 40;
  return 0;
}

/** Lugares cuyo nombre coincide con el texto (sin tildes ni mayúsculas), mejores primero. */
export function searchPastoPlaces(query: string, limit = 6): PastoPlace[] {
  const q = normalizePlaceText(query || '');
  if (q.length < 2) return [];
  const words = q.split(' ');
  return PLACES
    .map((p) => ({ p, s: score(p.key, q, words) }))
    .filter((r) => r.s > 0)
    .sort((a, b) =>
      b.s + (TYPE_BOOST[b.p.type] || 0) - (a.s + (TYPE_BOOST[a.p.type] || 0)) || a.p.key.length - b.p.key.length)
    // Un mismo barrio puede venir como "Chambú" y "Barrio Chambú": mostrar sólo uno.
    .filter((r, i, all) => all.findIndex((o) => o.p.key === r.p.key && o.p.type === r.p.type) === i)
    .slice(0, limit)
    .map(({ p }) => ({ name: p.name, type: p.type, location: p.location }));
}

/** Mejor coincidencia para un texto libre, o null si no existe en Pasto. */
export function findPastoPlace(query: string): PastoPlace | null {
  return searchPastoPlaces(query, 1)[0] || null;
}

/** Barrio o vereda más cercano a un punto (para nombrar dónde subirse al bus). */
export function nearestNeighbourhood(point: LatLng, maxMeters = 450): PastoPlace | null {
  const cosLat = Math.cos((point.latitude * Math.PI) / 180);
  let best: PastoPlace | null = null;
  let bestD = maxMeters;
  for (const p of PLACES) {
    if (p.type !== 'barrio' && p.type !== 'vereda') continue;
    const d = Math.hypot((p.location.latitude - point.latitude) * 110540, (p.location.longitude - point.longitude) * 111320 * cosLat);
    if (d < bestD) { bestD = d; best = p; }
  }
  return best;
}

export const PASTO_PLACES_COUNT = PLACES.length;
