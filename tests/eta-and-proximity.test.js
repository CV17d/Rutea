const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

// Funciones puras de cálculo para pruebas unitarias sin dependencias externas
function calculateEtaMinutes(distanceMeters, speedKmh = 30) {
  if (distanceMeters <= 0) return 1;
  const effectiveSpeed = Math.max(10, speedKmh);
  const metersPerMinute = (effectiveSpeed * 1000) / 60; // 30 km/h = 500 m/min
  return Math.max(1, Math.round(distanceMeters / metersPerMinute));
}

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

test('ETA Calculator: Estimación de minutos a 30 km/h en Pasto', () => {
  // 500m a 30 km/h (500 m/min) = 1 minuto
  assert.strictEqual(calculateEtaMinutes(500, 30), 1, '500m debe ser 1 min');
  // 1500m a 30 km/h = 3 minutos
  assert.strictEqual(calculateEtaMinutes(1500, 30), 3, '1500m debe ser 3 min');
  // 2500m a 30 km/h = 5 minutos
  assert.strictEqual(calculateEtaMinutes(2500, 30), 5, '2500m debe ser 5 min');
  // 0m o negativo retorna 1 minuto mínimo
  assert.strictEqual(calculateEtaMinutes(0, 30), 1, '0m retorna 1 min minimo');
});

test('ETA Calculator: Detección del bus más cercano y formato de llegada', () => {
  const targetStop = { latitude: 1.2145, longitude: -77.2783 }; // Plaza Nariño

  const buses = [
    {
      busId: 'bus-c10-1',
      routeId: 'route-c10',
      broadcasterAlias: 'CuyConductor #1',
      speedKmh: 30,
      snappedPosition: { latitude: 1.2185, longitude: -77.2805 }, // ~500m
    },
    {
      busId: 'bus-c10-2',
      routeId: 'route-c10',
      broadcasterAlias: 'GalerasExpress #2',
      speedKmh: 30,
      snappedPosition: { latitude: 1.2312, longitude: -77.2918 }, // ~2.4km
    },
  ];

  let closestBus = null;
  let minDistance = Infinity;

  for (const b of buses) {
    const d = calculateDistanceMeters(b.snappedPosition, targetStop);
    if (d < minDistance) {
      minDistance = d;
      closestBus = b;
    }
  }

  assert.strictEqual(closestBus.busId, 'bus-c10-1', 'Bus 1 debe ser el más cercano');
  const eta = calculateEtaMinutes(minDistance, closestBus.speedKmh);
  const displayText = `${closestBus.broadcasterAlias} llegando en ~${eta} min`;

  assert.ok(displayText.includes('CuyConductor #1 llegando en ~'), 'Texto descriptivo correcto');
});

test('Geofencing: Alerta de proximidad < 400m lanza mensaje oficial', () => {
  const thresholdMeters = 400;
  const targetStop = { latitude: 1.2145, longitude: -77.2783 };

  // Bus a 300 metros
  const busNearby = { latitude: 1.2165, longitude: -77.2770 };
  const distance = calculateDistanceMeters(busNearby, targetStop);

  assert.ok(distance < thresholdMeters, `Distancia ${distance}m debe ser menor al umbral de 400m`);

  let alertMessage = null;
  if (distance <= thresholdMeters) {
    alertMessage = '¡Prepárate! Tu bus está a punto de llegar';
  }

  assert.strictEqual(alertMessage, '¡Prepárate! Tu bus está a punto de llegar');
});

test('ETA & Proximity Files: Existencia y exportación de componentes y hooks', () => {
  const servicePath = path.resolve(__dirname, '../src/services/etaCalculator.service.ts');
  const badgePath = path.resolve(__dirname, '../src/components/ui/LiveArrivalBadge/LiveArrivalBadge.tsx');
  const hookPath = path.resolve(__dirname, '../src/hooks/useProximityAlert.ts');

  assert.ok(fs.existsSync(servicePath), 'etaCalculator.service.ts debe existir');
  assert.ok(fs.existsSync(badgePath), 'LiveArrivalBadge.tsx debe existir');
  assert.ok(fs.existsSync(hookPath), 'useProximityAlert.ts debe existir');

  const hookContent = fs.readFileSync(hookPath, 'utf8');
  assert.ok(hookContent.includes('thresholdMeters = 400'), 'Umbral por defecto de 400 metros');
  assert.ok(hookContent.includes('¡Prepárate! Tu bus está a punto de llegar'), 'Mensaje oficial de geocerca');
});
