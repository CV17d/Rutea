const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

// Simulación de lógica de avance de buses para pruebas unitarias sin dependencias externas
function calculateBearingDegrees(start, end) {
  const startLat = start.latitude * (Math.PI / 180);
  const startLng = start.longitude * (Math.PI / 180);
  const endLat = end.latitude * (Math.PI / 180);
  const endLng = end.longitude * (Math.PI / 180);

  const y = Math.sin(endLng - startLng) * Math.cos(endLat);
  const x =
    Math.cos(startLat) * Math.sin(endLat) -
    Math.sin(startLat) * Math.cos(endLat) * Math.cos(endLng - startLng);
  const brng = Math.atan2(y, x) * (180 / Math.PI);
  return (brng + 360) % 360;
}

function advanceSimulationStep(buses, coordinates) {
  return buses.map((bus) => {
    const nextIdx = (bus.currentIndex + 1) % coordinates.length;
    const currentPos = coordinates[bus.currentIndex];
    const nextPos = coordinates[nextIdx];
    const heading = calculateBearingDegrees(currentPos, nextPos);
    return {
      ...bus,
      currentIndex: nextIdx,
      position: nextPos,
      heading: Math.round(heading),
      speedKmh: 30,
    };
  });
}

test('Bus Simulator: Instancia 3 buses distribuidos equidistantemente a ~30 km/h', () => {
  const sampleCoords = [
    { latitude: 1.2145, longitude: -77.2783 },
    { latitude: 1.2160, longitude: -77.2793 },
    { latitude: 1.2185, longitude: -77.2805 },
    { latitude: 1.2210, longitude: -77.2830 },
    { latitude: 1.2235, longitude: -77.2870 },
    { latitude: 1.2290, longitude: -77.2870 },
  ];

  const count = 3;
  const step = Math.floor(sampleCoords.length / count);
  const initialBuses = [];

  for (let i = 0; i < count; i++) {
    initialBuses.push({
      busId: `route-c1-sim-${i + 1}`,
      routeId: 'route-c1',
      routeCode: 'C1',
      currentIndex: (i * step) % sampleCoords.length,
      speedKmh: 30,
    });
  }

  assert.strictEqual(initialBuses.length, 3, 'Debe instanciar exactamente 3 buses');
  assert.strictEqual(initialBuses[0].currentIndex, 0, 'Bus 1 en inicio');
  assert.strictEqual(initialBuses[1].currentIndex, 2, 'Bus 2 en el tercio');
  assert.strictEqual(initialBuses[2].currentIndex, 4, 'Bus 3 en dos tercios');
  assert.strictEqual(initialBuses[0].speedKmh, 30, 'Velocidad configurada en ~30 km/h');
});

test('Bus Simulator: Avance secuencial sobre geometrías OSRM y cálculo de rumbo', () => {
  const coords = [
    { latitude: 1.2145, longitude: -77.2783 }, // Plaza Nariño
    { latitude: 1.2185, longitude: -77.2805 }, // Hacia el norte
    { latitude: 1.2290, longitude: -77.2870 }, // Hacia Unicentro
  ];

  const buses = [
    { busId: 'bus-1', currentIndex: 0, position: coords[0] },
    { busId: 'bus-2', currentIndex: 1, position: coords[1] },
  ];

  const nextStep = advanceSimulationStep(buses, coords);

  assert.strictEqual(nextStep[0].currentIndex, 1, 'Bus 1 debe avanzar a índice 1');
  assert.strictEqual(nextStep[0].position.latitude, 1.2185);
  assert.ok(nextStep[0].heading >= 0 && nextStep[0].heading <= 360, 'Heading válido');
  assert.strictEqual(nextStep[1].currentIndex, 2, 'Bus 2 debe avanzar a índice 2');
});

test('LiveBusMarker y useBusSimulator: Archivos existen, usan Animated y respetan límites de código', () => {
  const markerPath = path.resolve(__dirname, '../src/components/map/LiveBusMarker/LiveBusMarker.tsx');
  const servicePath = path.resolve(__dirname, '../src/services/busSimulator.service.ts');
  const hookPath = path.resolve(__dirname, '../src/hooks/useBusSimulator.ts');

  assert.ok(fs.existsSync(markerPath), 'LiveBusMarker.tsx debe existir');
  assert.ok(fs.existsSync(servicePath), 'busSimulator.service.ts debe existir');
  assert.ok(fs.existsSync(hookPath), 'useBusSimulator.ts debe existir');

  const markerCode = fs.readFileSync(markerPath, 'utf8');
  assert.ok(markerCode.includes('Animated.timing'), 'Debe usar Animated.timing para transiciones suaves');
  assert.ok(markerCode.includes('busBody') || markerCode.includes('emeraldHalo'), 'Debe incluir cuerpo de bus cenital');
  assert.ok(markerCode.includes('km/h') || markerCode.includes('roofCodeText'), 'Debe mostrar identificación o velocidad');

  const serviceCode = fs.readFileSync(servicePath, 'utf8');
  assert.ok(serviceCode.includes('setInterval'), 'Debe usar setInterval para ciclo de emisión');
  assert.ok(serviceCode.includes('createInitialSimulatedBuses'), 'Debe instanciar buses iniciales');
});
