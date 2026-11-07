import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
const WebSocket = require('ws');

dotenv.config();

(globalThis as any).WebSocket = WebSocket;

interface GeoJsonFeature {
  type: string;
  properties: { id: string; name: string };
  geometry: {
    type: string;
    coordinates: [number, number][];
  };
}

interface GeoJsonCollection {
  type: string;
  features: GeoJsonFeature[];
}

async function runSeedGeometry() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Faltan variables SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en el entorno');
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
    realtime: { transport: WebSocket as any },
  });

  const geoJsonPath = path.resolve(__dirname, '../data/setp_rutas.geojson');
  console.log(`Leyendo GeoJSON desde: ${geoJsonPath}`);

  const rawData = fs.readFileSync(geoJsonPath, 'utf-8');
  const geojson: GeoJsonCollection = JSON.parse(rawData);

  const routeFeature = geojson.features.find((f) => f.properties.id === 'route-c16');
  if (!routeFeature || !routeFeature.geometry || !routeFeature.geometry.coordinates) {
    throw new Error('No se encontró la geometría de route-c16 en el GeoJSON');
  }

  const coordinates = routeFeature.geometry.coordinates;
  console.log(`Coordenadas extraídas (${coordinates.length} puntos)`);

  const pointsString = coordinates.map(([lng, lat]) => `${lng} ${lat}`).join(', ');
  const ewktString = `SRID=4326;LINESTRING(${pointsString})`;

  console.log(`EWKT generado: ${ewktString}`);

  const { data, error } = await supabase
    .from('routes')
    .update({ path: ewktString })
    .eq('id', 'route-c16')
    .select();

  if (error) {
    console.error('Error al actualizar en Supabase:', error);
    process.exit(1);
  }

  console.log('✅ Actualización exitosa en Supabase:');
  console.log(data);
}

runSeedGeometry().catch((err) => {
  console.error('Error fatal:', err);
  process.exit(1);
});
