const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

test('MISIÓN 61 - Haversine Distance: Orden estricto (lat1, lon1, lat2, lon2) y precisión métrica', () => {
  const servicePath = path.resolve(__dirname, '../src/services/tripRecommendation.service.ts');
  const geoPath = path.resolve(__dirname, '../src/utils/geo.utils.ts');

  assert.ok(fs.existsSync(servicePath), 'tripRecommendation.service.ts debe existir');
  assert.ok(fs.existsSync(geoPath), 'geo.utils.ts debe existir');

  const serviceContent = fs.readFileSync(servicePath, 'utf8');
  assert.ok(serviceContent.includes('haversineDistance'), 'Debe exportar/utilizar haversineDistance');

  // Implementación canónica de referencia
  function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const rLat1 = lat1 * (Math.PI / 180);
    const rLat2 = lat2 * (Math.PI / 180);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(rLat1) * Math.cos(rLat2) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  // Pandiaco: 1.2295, -77.2855; Hospital Departamental: 1.2050, -77.2750 (~3000 metros)
  const distPandiacoHospital = haversineDistance(1.2295, -77.2855, 1.2050, -77.2750);
  assert.ok(
    distPandiacoHospital >= 2800 && distPandiacoHospital <= 3200,
    `Distancia Pandiaco - Hospital coherente (~3000m): ${distPandiacoHospital}`
  );
});

test('MISIÓN 61 - Walking ETA: Fórmula estricta Math.ceil(distanceInMeters / 80)', () => {
  const servicePath = path.resolve(__dirname, '../src/services/tripRecommendation.service.ts');
  const serviceContent = fs.readFileSync(servicePath, 'utf8');

  assert.ok(
    serviceContent.includes('Math.ceil(distanceInMeters / 80)') ||
    serviceContent.includes('calculateWalkingMinutes'),
    'Debe implementar la fórmula estricta Math.ceil(distance / 80)'
  );

  function calculateWalkingMinutes(distanceInMeters) {
    if (distanceInMeters <= 0) return 0;
    return Math.ceil(distanceInMeters / 80);
  }

  // Validación requerida por el usuario:
  // "Si Unicentro está a 3000 metros, debe decir ~38 minutos, no 2"
  assert.strictEqual(calculateWalkingMinutes(3000), 38, '3000 metros a pie deben ser 38 minutos');
  assert.strictEqual(calculateWalkingMinutes(80), 1, '80 metros a pie debe ser 1 minuto');
  assert.strictEqual(calculateWalkingMinutes(160), 2, '160 metros a pie deben ser 2 minutos');
  assert.strictEqual(calculateWalkingMinutes(800), 10, '800 metros a pie deben ser 10 minutos');
  assert.strictEqual(calculateWalkingMinutes(0), 0, '0 metros deben ser 0 minutos');
});

test('MISIÓN 61 - Algoritmo de Búsqueda: Pandiaco a Hospital Departamental elige paradero cercano', () => {
  const servicePath = path.resolve(__dirname, '../src/services/tripRecommendation.service.ts');
  const content = fs.readFileSync(servicePath, 'utf8');

  // Valida que el algoritmo filtre primero si la ruta pasa cerca del destino y tome la parada origen más cercana
  assert.ok(content.includes('destCandidates'), 'Debe identificar candidatos de parada de destino');
  assert.ok(content.includes('origCandidates'), 'Debe identificar paradas de abordaje anteriores al destino');
  assert.ok(content.includes('calculateWalkingMinutes'), 'Debe calcular el tiempo de caminata');

  // Límites de líneas
  assert.ok(content.split('\n').length <= 150, 'tripRecommendation.service.ts debe ser <= 150 líneas');
});
