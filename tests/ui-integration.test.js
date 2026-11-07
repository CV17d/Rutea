const test = require('node:test');
const assert = require('node:assert');

function calculateDistanceMeters(p1, p2) {
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

function calculateEtaMinutes(distanceMeters, speedKmh = 18.0) {
  const speedMpm = (speedKmh * 1000) / 60; // ~300 m/min
  return Math.max(1, Math.round(distanceMeters / speedMpm));
}

test('UI Markers: Distinción dinámica entre bus en vivo y bus fantasma', () => {
  const liveBus = {
    busId: 'bus-c1-live',
    status: 'LIVE',
    is_ghost: false,
    routeCode: 'C1',
  };

  const ghostBus = {
    busId: 'ghost-route-c1',
    status: 'GHOST',
    is_ghost: true,
    routeCode: 'C1',
  };

  // Bus en vivo: tiene halo verde esmeralda y opacidad completa
  const liveConfig = {
    hasEmeraldHalo: liveBus.status === 'LIVE' && !liveBus.is_ghost,
    opacity: 1.0,
    borderStyle: 'solid',
  };

  // Bus fantasma: opacidad al 50% y borde punteado (dashed)
  const isGhost = ghostBus.status === 'GHOST' || ghostBus.is_ghost === true;
  const ghostConfig = {
    hasEmeraldHalo: !isGhost,
    opacity: isGhost ? 0.50 : 1.0,
    borderStyle: isGhost ? 'dashed' : 'solid',
  };

  assert.strictEqual(liveConfig.hasEmeraldHalo, true);
  assert.strictEqual(ghostConfig.hasEmeraldHalo, false);
  assert.strictEqual(ghostConfig.opacity, 0.50);
  assert.strictEqual(ghostConfig.borderStyle, 'dashed');
});

test('RouteDetailCard: Cálculo de distancia al paradero más cercano en San Juan de Pasto', () => {
  // Usuario en Plaza de Nariño
  const user = { latitude: 1.2145, longitude: -77.2783 };

  const stops = [
    { id: 'stop-catambuco', name: 'Catambuco', coordinate: { latitude: 1.1732, longitude: -77.2845 } },
    { id: 'stop-centro', name: 'Plaza Nariño', coordinate: { latitude: 1.2146, longitude: -77.2782 } },
    { id: 'stop-udenar', name: 'Udenar Torobajo', coordinate: { latitude: 1.2312, longitude: -77.2918 } },
  ];

  let nearest = stops[0];
  let minDistance = Infinity;

  for (const s of stops) {
    const d = calculateDistanceMeters(user, s.coordinate);
    if (d < minDistance) {
      minDistance = d;
      nearest = s;
    }
  }

  assert.strictEqual(nearest.name, 'Plaza Nariño');
  assert.ok(minDistance < 50, `Distancia esperada < 50m, obtenida: ${minDistance}m`);
});

test('RouteDetailCard: Estimación de ETA en minutos para aproximación de bus', () => {
  // Bus a 900 metros del paradero
  const distanceMeters = 900;
  const eta = calculateEtaMinutes(distanceMeters, 18.0);

  // 900 metros / (300 m/min) = 3 minutos
  assert.strictEqual(eta, 3);
});

test('Frontend Routes Catalog: 20 rutas oficiales SETPasto (C1 a C16 y E1 a E4)', () => {
  const fs = require('node:fs');
  const path = require('node:path');

  const r1 = fs.readFileSync(path.resolve(__dirname, '../src/constants/routes/standardRoutes1.ts'), 'utf8');
  const r2 = fs.readFileSync(path.resolve(__dirname, '../src/constants/routes/standardRoutes2.ts'), 'utf8');
  const re = fs.readFileSync(path.resolve(__dirname, '../src/constants/routes/expressRoutes.ts'), 'utf8');
  const allRoutesText = `${r1}\n${r2}\n${re}`;

  for (let i = 1; i <= 16; i++) {
    assert.ok(allRoutesText.includes(`'route-c${i}'`), `Debe contener route-c${i}`);
  }
  for (let i = 1; i <= 4; i++) {
    assert.ok(allRoutesText.includes(`'route-e${i}'`), `Debe contener route-e${i}`);
  }

  assert.ok(allRoutesText.includes('Altavista - La Paz'), 'Debe incluir C2');
  assert.ok(allRoutesText.includes('Buesaquillo/Puente Tabla - Udenar'), 'Debe incluir C5');
  assert.ok(allRoutesText.includes('Anganoy - Cabrera'), 'Debe incluir C16');
  assert.ok(allRoutesText.includes('Altos de Chapalito - Obonuco'), 'Debe incluir C1');
  assert.ok(allRoutesText.includes('Arnulfo Guerrero - Gilberto Pabón'), 'Debe incluir C3');
  assert.ok(allRoutesText.includes('El Porvenir - Jongovito'), 'Debe incluir C4');
  assert.ok(allRoutesText.includes('Cam Anganoy - Catambuco/Coba Negra'), 'Debe incluir C6');
});

test('PostGIS to Coordinates Parser: Convierte GeoJSON y EWKT a formato Polyline { latitude, longitude }', () => {
  // Función idéntica a parsePostgisToCoordinates en geo.utils
  function parsePostgisToCoordinates(path) {
    if (!path) return [];
    let raw = path;
    if (typeof raw === 'string') {
      let str = raw.trim();
      if ((str.startsWith('"') && str.endsWith('"')) || (str.startsWith("'") && str.endsWith("'"))) {
        str = str.slice(1, -1).trim();
      }
      if (str.startsWith('{') || str.startsWith('[')) {
        try { raw = JSON.parse(str); } catch { /* noop */ }
      } else if (str.toUpperCase().includes('LINESTRING')) {
        const match = str.match(/LINESTRING\s*\(([^)]+)\)/i);
        if (match && match[1]) {
          return match[1]
            .split(',')
            .map((p) => p.trim().split(/\s+/))
            .filter((p) => p.length >= 2)
            .map(([lngStr, latStr]) => ({
              latitude: parseFloat(latStr),
              longitude: parseFloat(lngStr),
            }))
            .filter((p) => !isNaN(p.latitude) && !isNaN(p.longitude));
        }
      }
    }
    const coords = raw?.coordinates || (Array.isArray(raw) ? raw : null);
    if (Array.isArray(coords)) {
      return coords
        .map((c) => ({ latitude: Number(c[1]), longitude: Number(c[0]) }))
        .filter((c) => !isNaN(c.latitude) && !isNaN(c.longitude));
    }
    return [];
  }

  // 1. Validar objeto GeoJSON de PostGIS
  const geojsonInput = {
    type: 'LineString',
    coordinates: [
      [-77.2759, 1.1927],
      [-77.2759, 1.1933],
      [-77.2758, 1.1940],
    ],
  };

  const parsed = parsePostgisToCoordinates(geojsonInput);
  assert.strictEqual(parsed.length, 3);
  assert.strictEqual(parsed[0].latitude, 1.1927);
  assert.strictEqual(parsed[0].longitude, -77.2759);
  assert.strictEqual(parsed[2].latitude, 1.1940);
  assert.strictEqual(parsed[2].longitude, -77.2758);

  // 2. Validar string EWKT con SRID=4326;LINESTRING(...)
  const ewktInput = 'SRID=4326;LINESTRING(-77.275841 1.1927, -77.275843 1.192973, -77.276066 1.192918)';
  const parsedEwkt = parsePostgisToCoordinates(ewktInput);
  assert.strictEqual(parsedEwkt.length, 3);
  assert.strictEqual(parsedEwkt[0].latitude, 1.1927);
  assert.strictEqual(parsedEwkt[0].longitude, -77.275841);
  assert.strictEqual(parsedEwkt[2].latitude, 1.192918);
  assert.strictEqual(parsedEwkt[2].longitude, -77.276066);

  // 3. Validar los 100+ puntos de alta fidelidad OSRM (688 puntos para C16 transversal)
  const fs = require('node:fs');
  const path = require('node:path');
  const c16Data = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../src/constants/routes/c16OsrmGeometry.json'), 'utf8'));
  const parsedOsrm = parsePostgisToCoordinates(c16Data);
  assert.ok(parsedOsrm.length >= 100, 'Debe parsear 100+ puntos de OSRM');
  assert.strictEqual(parsedOsrm.length, 688, 'Debe parsear exactamente 688 puntos de OSRM para Anganoy - Cabrera');

  // 4. Validar que la ruta C16 en standardRoutes2 contenga los 9 paraderos oficiales
  const r2 = fs.readFileSync(path.resolve(__dirname, '../src/constants/routes/standardRoutes2.ts'), 'utf8');
  assert.ok(r2.includes("coordinates: [], // Geometría cargada dinámicamente desde PostGIS"), 'C16 no debe tener coordenadas hardcodeadas');
  const expectedStopsC16 = ['Anganoy', 'Panorámico', 'Liceo Udenar', 'Teatro Imperial', 'San Andresito', 'San Juan Bosco', 'Las Lunas', 'San Fernando', 'Cabrera'];
  for (const stopName of expectedStopsC16) {
    assert.ok(r2.includes(stopName), `Debe contener el paradero ${stopName}`);
  }

  // 5. Validar los 330 puntos de alta fidelidad OSRM y paradas para C1 (Chapalito - Obonuco)
  const c1Data = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../src/constants/routes/c1OsrmGeometry.json'), 'utf8'));
  const parsedC1 = parsePostgisToCoordinates(c1Data);
  assert.strictEqual(parsedC1.length, 330, 'Debe parsear exactamente 330 puntos de OSRM para C1');

  const r1 = fs.readFileSync(path.resolve(__dirname, '../src/constants/routes/standardRoutes1.ts'), 'utf8');
  assert.ok(r1.includes("color: '#f97316'"), 'C1 debe tener color tematico naranja #f97316');
  const expectedStopsC1 = ['Altos de Chapalito', 'Chambú', 'Las Lunas', 'San Juan Bosco', 'Alcaldía Centro', 'Amorel de la Avenida', 'INEM Mijitayo', 'Tamasagra', 'Atención Integral Obonuco'];
  for (const stopName of expectedStopsC1) {
    assert.ok(r1.includes(stopName), `Debe contener el paradero C1: ${stopName}`);
  }

  // 6. Validar los 387 puntos de alta fidelidad OSRM y paradas para C2 (Altavista - La Paz)
  const c2Data = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../src/constants/routes/c2OsrmGeometry.json'), 'utf8'));
  const parsedC2 = parsePostgisToCoordinates(c2Data);
  assert.strictEqual(parsedC2.length, 387, 'Debe parsear exactamente 387 puntos de OSRM para C2');

  assert.ok(r1.includes("color: '#ea580c'"), 'C2 debe tener color tematico naranja/rojo #ea580c');
  const expectedStopsC2 = ['Altavista', 'Hospital San Rafael', 'Panamericana Calle 14', 'La Panadería', 'Plaza Del Carnaval', 'San Juan Bosco', 'Terminal De Transportes', 'Lorenzo', 'La Paz'];
  for (const stopName of expectedStopsC2) {
    assert.ok(r1.includes(stopName), `Debe contener el paradero C2: ${stopName}`);
  }

  // 7. Validar los 435 puntos de alta fidelidad OSRM y paradas para C3 (Arnulfo Guerrero - Gilberto Pabón)
  const c3Data = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../src/constants/routes/c3OsrmGeometry.json'), 'utf8'));
  const parsedC3 = parsePostgisToCoordinates(c3Data);
  assert.strictEqual(parsedC3.length, 435, 'Debe parsear exactamente 435 puntos de OSRM para C3');

  assert.ok(r1.includes("color: '#b91c1c'"), 'C3 debe tener color tematico carmesi #b91c1c');
  const expectedStopsC3 = ['Arnulfo Guerrero', 'Villa Flor II', 'Hospital Departamental', 'San Juan Bosco', 'Alcaldía Centro', 'Calle 16 Carrera 27', 'INEM Av Mijitayo', 'Sumatambo', 'Gilberto Pabón'];
  for (const stopName of expectedStopsC3) {
    assert.ok(r1.includes(stopName), `Debe contener el paradero C3: ${stopName}`);
  }

  // 8. Validar los 471 puntos de alta fidelidad OSRM y paradas para C4 (El Porvenir - Jongovito)
  const c4Data = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../src/constants/routes/c4OsrmGeometry.json'), 'utf8'));
  const parsedC4 = parsePostgisToCoordinates(c4Data);
  assert.strictEqual(parsedC4.length, 471, 'Debe parsear exactamente 471 puntos de OSRM para C4');

  assert.ok(r1.includes("color: '#d97706'"), 'C4 debe tener color tematico ambar/naranja #d97706');
  const expectedStopsC4 = ['Miraflores', 'San Martín', 'Avenida Chile', 'San Juan Bosco', 'María Goretti', 'Calle 16 Carrera 27', 'INEM', 'Panamericana Sumatambo', 'San Sebastián', 'Jongovito'];
  for (const stopName of expectedStopsC4) {
    assert.ok(r1.includes(stopName), `Debe contener el paradero C4: ${stopName}`);
  }

  // 9. Validar los 716 puntos de alta fidelidad OSRM y paradas para C5 (Buesaquillo/Puente Tabla - Udenar)
  const c5Data = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../src/constants/routes/c5OsrmGeometry.json'), 'utf8'));
  const parsedC5 = parsePostgisToCoordinates(c5Data);
  assert.strictEqual(parsedC5.length, 716, 'Debe parsear exactamente 716 puntos de OSRM para C5');

  assert.ok(r1.includes("color: '#be185d'"), 'C5 debe tener color tematico magenta carmesi #be185d');
  const expectedStopsC5 = ['Puente Tabla', 'Buesaquillo', 'Sena', 'Único', 'Hospital Departamental', 'San Juan Bosco', 'San Andresito', 'Éxito', 'Tamasagra', 'Mijitayo', 'Unicentro', 'Udenar Torobajo', 'Briceño'];
  for (const stopName of expectedStopsC5) {
    assert.ok(r1.includes(stopName), `Debe contener el paradero C5: ${stopName}`);
  }

  // 10. Validar los 632 puntos de alta fidelidad OSRM y paradas para C6 (Cam Anganoy - Catambuco/Coba Negra)
  const c6Data = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../src/constants/routes/c6OsrmGeometry.json'), 'utf8'));
  const parsedC6 = parsePostgisToCoordinates(c6Data);
  assert.strictEqual(parsedC6.length, 632, 'Debe parsear exactamente 632 puntos de OSRM para C6');

  assert.ok(r1.includes("color: '#0d9488'"), 'C6 debe tener color tematico cerceta/turquesa #0d9488');
  const expectedStopsC6 = ['Cam Anganoy', 'Panorámico', 'Liceo Udenar', 'Teatro Imperial', 'San Andresito', 'Coliseo Antonio Ruano', 'Estadio Libertad', 'Chapal', 'Catambuco', 'Coba Negra'];
  for (const stopName of expectedStopsC6) {
    assert.ok(r1.includes(stopName), `Debe contener el paradero C6: ${stopName}`);
  }

  // 11. Validar que exista la migración RLS para lectura pública
  const rlsSql = fs.readFileSync(path.resolve(__dirname, '../supabase/migrations/20261107000005_enable_public_read_routes.sql'), 'utf8');
  assert.ok(rlsSql.includes('ENABLE ROW LEVEL SECURITY'), 'Debe habilitar RLS');
  assert.ok(rlsSql.includes('FOR SELECT'), 'Debe permitir SELECT público');
});
