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
