const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

// Haversine puro para pruebas
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

const PASTO_CENTROID = { latitude: 1.2136, longitude: -77.2811 };
const MAX_COVERAGE_METERS = 15000;
const OUT_OF_AREA_MSG = 'Parece que estás fuera de San Juan de Pasto. Por favor, ingresa un punto de origen manualmente';

function checkCoverageArea(loc) {
  if (!loc) return { isOutOfArea: true, distanceKm: 0, message: OUT_OF_AREA_MSG };
  const d = calculateDistanceMeters(loc, PASTO_CENTROID);
  const isOutOfArea = d > MAX_COVERAGE_METERS;
  return {
    isOutOfArea,
    distanceKm: Math.round((d / 1000) * 10) / 10,
    message: isOutOfArea ? OUT_OF_AREA_MSG : undefined,
  };
}

test('Control de Cobertura: Coordenadas dentro de Pasto son válidas (< 15 km)', () => {
  // Plaza Nariño (~0 km)
  const plaza = checkCoverageArea({ latitude: 1.2145, longitude: -77.2783 });
  assert.strictEqual(plaza.isOutOfArea, false, 'Plaza Nariño dentro de cobertura');

  // Torobajo Udenar (~2.2 km)
  const torobajo = checkCoverageArea({ latitude: 1.2312, longitude: -77.2918 });
  assert.strictEqual(torobajo.isOutOfArea, false, 'Torobajo dentro de cobertura');

  // Catambuco (~5.8 km)
  const catambuco = checkCoverageArea({ latitude: 1.1732, longitude: -77.2845 });
  assert.strictEqual(catambuco.isOutOfArea, false, 'Catambuco dentro de cobertura');

  // Genoy (~10.2 km)
  const genoy = checkCoverageArea({ latitude: 1.2674, longitude: -77.3358 });
  assert.strictEqual(genoy.isOutOfArea, false, 'Genoy dentro de cobertura');
});

test('Control de Cobertura: Coordenadas fuera de Pasto (> 15 km) activan isOutOfArea', () => {
  // Aeropuerto Chachagüí (~25 km al norte)
  const chachagui = checkCoverageArea({ latitude: 1.3986, longitude: -77.2919 });
  assert.strictEqual(chachagui.isOutOfArea, true, 'Chachagüí fuera de cobertura');
  assert.strictEqual(chachagui.message, OUT_OF_AREA_MSG);

  // Ipiales (~65 km al sur)
  const ipiales = checkCoverageArea({ latitude: 0.8286, longitude: -77.6444 });
  assert.strictEqual(ipiales.isOutOfArea, true, 'Ipiales fuera de cobertura');

  // Cali (~260 km)
  const cali = checkCoverageArea({ latitude: 3.4516, longitude: -76.5320 });
  assert.strictEqual(cali.isOutOfArea, true, 'Cali fuera de cobertura');

  // Bogotá (~520 km)
  const bogota = checkCoverageArea({ latitude: 4.7110, longitude: -74.0721 });
  assert.strictEqual(bogota.isOutOfArea, true, 'Bogotá fuera de cobertura');
});

test('GPS Real & TripPlanner: Archivos implementan expo-location y mensaje de advertencia', () => {
  const servicePath = path.resolve(__dirname, '../src/services/tripRecommendation.service.ts');
  const hookPath = path.resolve(__dirname, '../src/hooks/useLocationTracking.ts');
  const plannerPath = path.resolve(__dirname, '../src/components/tripPlanner/TripPlanner.tsx');

  assert.ok(fs.existsSync(servicePath), 'tripRecommendation.service.ts debe existir');
  assert.ok(fs.existsSync(hookPath), 'useLocationTracking.ts debe existir');
  assert.ok(fs.existsSync(plannerPath), 'TripPlanner.tsx debe existir');

  const serviceContent = fs.readFileSync(servicePath, 'utf8');
  assert.ok(serviceContent.includes('checkCoverageArea'), 'Debe exportar checkCoverageArea');
  assert.ok(serviceContent.includes('MAX_COVERAGE_METERS = 15000'), 'Radio de 15 km');
  assert.ok(serviceContent.includes(OUT_OF_AREA_MSG), 'Mensaje oficial fuera de cobertura');

  const hookContent = fs.readFileSync(hookPath, 'utf8');
  assert.ok(hookContent.includes('Location.getCurrentPositionAsync'), 'Debe solicitar GPS real con expo-location');
  assert.ok(hookContent.includes('requestForegroundPermissionsAsync'), 'Debe solicitar permisos');

  const plannerContent = fs.readFileSync(plannerPath, 'utf8');
  assert.ok(plannerContent.includes('checkCoverageArea'), 'TripPlanner debe validar cobertura');
  assert.ok(plannerContent.includes(OUT_OF_AREA_MSG), 'TripPlanner debe mostrar mensaje');
});
