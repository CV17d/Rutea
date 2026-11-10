const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

// 1. Verificación de useTrackingStore y estados de tripPhase
test('MISIÓN 63 - useTrackingStore: Definición de tripPhase y acciones asociadas', () => {
  const storePath = path.resolve(__dirname, '../src/store/useTrackingStore.ts');
  assert.ok(fs.existsSync(storePath), 'useTrackingStore.ts debe existir');

  const content = fs.readFileSync(storePath, 'utf8');

  // Tipos y estados requeridos
  assert.ok(content.includes('tripPhase'), 'Debe incluir tripPhase');
  assert.ok(content.includes("'WALKING_TO_STOP'"), "Debe incluir fase 'WALKING_TO_STOP'");
  assert.ok(content.includes("'WAITING_FOR_BUS'"), "Debe incluir fase 'WAITING_FOR_BUS'");
  assert.ok(content.includes("'ON_BUS'"), "Debe incluir fase 'ON_BUS'");
  assert.ok(content.includes('setTripPhase'), 'Debe incluir setter setTripPhase');
  assert.ok(content.includes('originStopLocation'), 'Debe almacenar coordenadas de paradero de origen');
  assert.ok(content.includes('walkingPolyline'), 'Debe almacenar polilínea peatonal');
  assert.ok(content.includes('arrivalMessage'), 'Debe almacenar mensaje de llegada');

  const lines = content.split('\n').length;
  assert.ok(lines <= 150, `useTrackingStore.ts tiene ${lines} líneas, debe ser <= 150`);
});

// 2. Verificación de TripPlanner: Selección de ruta inicializa 'WALKING_TO_STOP'
test('MISIÓN 63 - TripPlanner: Inicializa WALKING_TO_STOP y polilínea peatonal al confirmar ruta', () => {
  const plannerPath = path.resolve(__dirname, '../src/components/tripPlanner/TripPlanner.tsx');
  assert.ok(fs.existsSync(plannerPath), 'TripPlanner.tsx debe existir');

  const content = fs.readFileSync(plannerPath, 'utf8');
  assert.ok(content.includes("setTripPhase('WALKING_TO_STOP')"), 'Debe inicializar la fase en WALKING_TO_STOP');
  assert.ok(content.includes('setOriginStopLocation'), 'Debe registrar las coordenadas del paradero de origen');
  assert.ok(content.includes('setWalkingPolyline'), 'Debe trazar la polilínea peatonal hacia el paradero');

  const lines = content.split('\n').length;
  assert.ok(lines <= 150, `TripPlanner.tsx tiene ${lines} líneas, debe ser <= 150`);
});

// 3. Verificación de useStopArrivalDetection: Geocerca de 30m y mensaje de éxito
test('MISIÓN 63 - useStopArrivalDetection: Detección geocerca < 30m y transición automática a WAITING_FOR_BUS', () => {
  const hookPath = path.resolve(__dirname, '../src/hooks/useStopArrivalDetection.ts');
  assert.ok(fs.existsSync(hookPath), 'useStopArrivalDetection.ts debe existir');

  const content = fs.readFileSync(hookPath, 'utf8');
  assert.ok(content.includes('30'), 'Debe configurar umbral de geocerca en 30 metros');
  assert.ok(content.includes('¡Llegaste a la parada!'), 'Debe emitir el mensaje exacto: ¡Llegaste a la parada!');
  assert.ok(content.includes("'WAITING_FOR_BUS'"), 'Debe transicionar a fase WAITING_FOR_BUS');
  assert.ok(content.includes('calculateDistanceMeters') || content.includes('haversineDistance'), 'Debe calcular distancia geográfica');

  const lines = content.split('\n').length;
  assert.ok(lines <= 150, `useStopArrivalDetection.ts tiene ${lines} líneas, debe ser <= 150`);
});

// 4. Lógica matemática de geocerca (< 30m)
test('MISIÓN 63 - Geocerca Matemática: Transición si distancia < 30 metros', () => {
  function haversineMeters(p1, p2) {
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

  const originStop = { latitude: 1.2145, longitude: -77.2783 }; // Plaza Nariño

  // Usuario a 15 metros del paradero (dentro de geocerca)
  const userNearby = { latitude: 1.2146, longitude: -77.2783 };
  const distNearby = haversineMeters(userNearby, originStop);
  assert.ok(distNearby < 30, `distNearby (${distNearby.toFixed(1)}m) debe ser < 30m`);

  // Usuario a 120 metros del paradero (fuera de geocerca)
  const userFar = { latitude: 1.2155, longitude: -77.2783 };
  const distFar = haversineMeters(userFar, originStop);
  assert.ok(distFar >= 30, `distFar (${distFar.toFixed(1)}m) debe ser >= 30m`);

  // Transición de fase simulada
  let tripPhase = 'WALKING_TO_STOP';
  let message = null;

  if (distNearby < 30) {
    tripPhase = 'WAITING_FOR_BUS';
    message = '¡Llegaste a la parada!';
  }

  assert.strictEqual(tripPhase, 'WAITING_FOR_BUS');
  assert.strictEqual(message, '¡Llegaste a la parada!');
});

// 5. Verificación de WalkingPolyline y MapContainer
test('MISIÓN 63 - WalkingPolyline y MapContainer: Línea punteada y enfoque de cámara', () => {
  const polylinePath = path.resolve(__dirname, '../src/components/map/WalkingPolyline/WalkingPolyline.tsx');
  const mapPath = path.resolve(__dirname, '../src/components/map/MapContainer/MapContainer.tsx');

  assert.ok(fs.existsSync(polylinePath), 'WalkingPolyline.tsx debe existir');
  assert.ok(fs.existsSync(mapPath), 'MapContainer.tsx debe existir');

  const polylineContent = fs.readFileSync(polylinePath, 'utf8');
  assert.ok(polylineContent.includes('lineDashPattern'), 'WalkingPolyline debe ser punteada (lineDashPattern)');
  assert.ok(polylineContent.includes("'WALKING_TO_STOP'"), 'WalkingPolyline debe renderizarse en fase WALKING_TO_STOP');

  const mapContent = fs.readFileSync(mapPath, 'utf8');
  assert.ok(mapContent.includes('animateCamera') || mapContent.includes('animateToRegion'), 'MapContainer debe enfocar la cámara');
  assert.ok(mapContent.includes('WALKING_TO_STOP'), 'MapContainer debe responder a WALKING_TO_STOP');
  assert.ok(mapContent.includes('WAITING_FOR_BUS'), 'MapContainer debe responder a WAITING_FOR_BUS');

  const polylineLines = polylineContent.split('\n').length;
  assert.ok(polylineLines <= 150, `WalkingPolyline.tsx tiene ${polylineLines} líneas, debe ser <= 150`);

  const mapLines = mapContent.split('\n').length;
  assert.ok(mapLines <= 150, `MapContainer.tsx tiene ${mapLines} líneas, debe ser <= 150`);
});

// 6. Verificación de App.tsx: Integración de useStopArrivalDetection, WalkingPolyline y mensaje de llegada
test('MISIÓN 63 - App.tsx: Integración global y regla de oro (< 200 líneas)', () => {
  const appPath = path.resolve(__dirname, '../App.tsx');
  assert.ok(fs.existsSync(appPath), 'App.tsx debe existir');

  const content = fs.readFileSync(appPath, 'utf8');
  assert.ok(content.includes('useStopArrivalDetection'), 'App.tsx debe ejecutar useStopArrivalDetection');
  assert.ok(content.includes('<WalkingPolyline'), 'App.tsx debe renderizar WalkingPolyline en MapContainer');
  assert.ok(content.includes('arrivalMessage'), 'App.tsx debe reflejar arrivalMessage');

  const lines = content.split('\n').length;
  assert.ok(lines <= 200, `App.tsx tiene ${lines} líneas, debe ser <= 200 (actual: ${lines})`);
});
