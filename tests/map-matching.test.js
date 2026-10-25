const test = require('node:test');
const assert = require('node:assert');
const turf = require('../backend/node_modules/@turf/turf');

// Trazado de prueba equivalente a Pasto C1
const C1_GEOJSON = turf.lineString([
  [-77.2845, 1.1732], // Catambuco
  [-77.2810, 1.1850],
  [-77.2790, 1.1980], // Chapal
  [-77.2775, 1.2085],
  [-77.2783, 1.2145], // Plaza de Nariño (Centro)
  [-77.2830, 1.2210], // Maridíaz
  [-77.2890, 1.2280],
  [-77.2918, 1.2312], // U. de Nariño Torobajo
]);

const MAX_TOLERANCE_METERS = 45.0;

function processMapMatching(raw) {
  const rawPoint = turf.point([raw.longitude, raw.latitude]);
  const snapped = turf.nearestPointOnLine(C1_GEOJSON, rawPoint, { units: 'meters' });
  const distanceMeters = turf.pointToLineDistance(rawPoint, C1_GEOJSON, { units: 'meters' });
  const [snappedLng, snappedLat] = snapped.geometry.coordinates;
  const bearing = turf.bearing(rawPoint, snapped);
  const isDeviated = distanceMeters > MAX_TOLERANCE_METERS;

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

test('Map-Matching Turf: Proyección ortogonal (snap-to-road) sobre trazado oficial C1 en Plaza Nariño', () => {
  // Coordenada con pequeño ruido GPS (~10m al este de Plaza de Nariño)
  const raw = {
    userId: 'user-pastuso-01',
    routeId: 'C1',
    latitude: 1.21455,
    longitude: -77.27822,
    timestamp: Date.now(),
  };

  const result = processMapMatching(raw);

  assert.strictEqual(result.isValid, true);
  assert.strictEqual(result.isDeviated, false);
  assert.strictEqual(result.status, 'SNAPPED');
  assert.ok(result.distanceMeters < MAX_TOLERANCE_METERS, `Distancia ${result.distanceMeters}m debe ser < 45m`);
  assert.strictEqual(typeof result.snappedLatitude, 'number');
  assert.strictEqual(typeof result.snappedLongitude, 'number');
});

test('Map-Matching Turf: Descarte o marcado como DEVIATED cuando la distancia supera los 45m', () => {
  // Coordenada alejada 200m del trazado oficial de la C1
  const rawDeviated = {
    userId: 'user-pastuso-02',
    routeId: 'C1',
    latitude: 1.2180,
    longitude: -77.2710,
    timestamp: Date.now(),
  };

  const result = processMapMatching(rawDeviated);

  assert.strictEqual(result.isValid, false);
  assert.strictEqual(result.isDeviated, true);
  assert.strictEqual(result.status, 'DEVIATED');
  assert.ok(result.distanceMeters > MAX_TOLERANCE_METERS, `Distancia ${result.distanceMeters}m debe superar los 45m`);
});

test('Map-Matching Turf: Cálculo de bearing coherente para orientación del bus en mapa', () => {
  const raw = {
    userId: 'user-pastuso-03',
    routeId: 'C1',
    latitude: 1.2085,
    longitude: -77.2775,
    timestamp: Date.now(),
  };

  const result = processMapMatching(raw);

  assert.ok(result.bearing >= 0 && result.bearing <= 360, 'El bearing debe estar entre 0° y 360°');
});
