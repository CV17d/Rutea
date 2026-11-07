import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
const WebSocket = require('ws');

dotenv.config();
(globalThis as any).WebSocket = WebSocket;

export type CoordinatePair = [number, number];

export interface OsrmRouteResponse {
  code: string;
  routes: Array<{
    geometry: {
      type: string;
      coordinates: CoordinatePair[];
    };
    distance: number;
    duration: number;
  }>;
}

/**
 * Consulta la API pública de OSRM para alinear waypoints a las calles reales (snap-to-roads).
 */
export async function getRouteGeometryFromOsrm(
  coordinates: CoordinatePair[]
): Promise<CoordinatePair[]> {
  const coordString = coordinates.map(([lng, lat]) => `${lng},${lat}`).join(';');
  const osrmUrl = `http://router.project-osrm.org/route/v1/driving/${coordString}?overview=full&geometries=geojson`;

  console.log(`[OSRM] Consultando OSRM para ${coordinates.length} waypoints...`);
  const response = await fetch(osrmUrl);

  if (!response.ok) {
    throw new Error(`[OSRM] Error en petición HTTP: ${response.status} ${response.statusText}`);
  }

  const data = (await response.json()) as OsrmRouteResponse;
  if (data.code !== 'Ok' || !data.routes || !data.routes.length) {
    throw new Error(`[OSRM] La API no devolvió rutas válidas. Código: ${data.code}`);
  }

  const geometry = data.routes[0].geometry;
  console.log(
    `[OSRM] Trazado exitoso. Generados ${geometry.coordinates.length} puntos de alta resolución.`
  );
  return geometry.coordinates;
}

/**
 * Convierte un arreglo de coordenadas [lng, lat] a formato EWKT PostGIS SRID=4326.
 */
export function coordinatesToEwkt(coordinates: CoordinatePair[]): string {
  const points = coordinates.map(([lng, lat]) => `${lng} ${lat}`).join(', ');
  return `SRID=4326;LINESTRING(${points})`;
}

async function runAutoRouter() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Faltan variables SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env');
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
    realtime: { transport: WebSocket },
  });

  // 1. Cargar coordenadas base de Ruta C16 desde GeoJSON
  const geoJsonPath = path.resolve(__dirname, '../data/setp_rutas.geojson');
  console.log(`[Rutea] Leyendo waypoints desde: ${geoJsonPath}`);
  const rawData = fs.readFileSync(geoJsonPath, 'utf-8');
  const geojson = JSON.parse(rawData);
  const feature = geojson.features.find((f: any) => f.properties.id === 'route-c16');

  if (!feature || !feature.geometry?.coordinates) {
    throw new Error('No se encontraron coordenadas para route-c16 en el GeoJSON');
  }

  const baseWaypoints: CoordinatePair[] = feature.geometry.coordinates;
  console.log(`[Rutea] Waypoints base cargados: ${baseWaypoints.length}`);

  // 2. Obtener geometría de alta fidelidad desde OSRM
  const highFidelityCoords = await getRouteGeometryFromOsrm(baseWaypoints);

  // 3. Convertir a EWKT
  const ewkt = coordinatesToEwkt(highFidelityCoords);
  console.log(`[Rutea] EWKT generado (${ewkt.length} caracteres)`);

  // 4. Inyectar / actualizar en Supabase PostGIS
  console.log('[Supabase] Actualizando route-c16 en tabla routes...');
  const { data, error } = await supabase
    .from('routes')
    .update({ path: ewkt })
    .eq('id', 'route-c16')
    .select();

  if (error) {
    console.error('[Supabase] Error en update path:', error);
    process.exit(1);
  }

  // 5. Actualizar descripción a 'Anganoy - Cabrera'
  await supabase
    .from('routes')
    .update({ description: 'Anganoy - Cabrera' })
    .eq('id', 'route-c16');

  console.log('✅ Base de datos actualizada con éxito con geometría OSRM:');
  console.log(data);
}

// Ejecutar si es invocado directamente por CLI
if (require.main === module) {
  runAutoRouter().catch((err) => {
    console.error('Error fatal en auto-router:', err);
    process.exit(1);
  });
}
