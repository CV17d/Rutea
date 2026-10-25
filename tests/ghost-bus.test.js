const test = require('node:test');
const assert = require('node:assert');
const turf = require('../backend/node_modules/@turf/turf');

// Simulación de GhostBusEngine para pruebas unitarias
class GhostBusEngine {
  constructor() {
    this.speedKmh = 18.0;
    this.stepIntervalSec = 15;
    this.stepDistanceKm = (18.0 * 15) / 3600; // 0.075 km
    this.routeProgress = new Map();
    this.lastRealPing = new Map();
  }

  notifyRealUserActivity(routeId) {
    this.lastRealPing.set(routeId, Date.now());
  }

  hasActiveRealUsers(routeId, maxIdleSeconds = 30) {
    const lastPing = this.lastRealPing.get(routeId);
    if (!lastPing) return false;
    return Date.now() - lastPing < maxIdleSeconds * 1000;
  }

  calculatePosition(routeFeature, routeId) {
    const totalLengthKm = turf.length(routeFeature, { units: 'kilometers' });
    let currentDist = this.routeProgress.get(routeId) || 0;
    currentDist = (currentDist + this.stepDistanceKm) % totalLengthKm;
    this.routeProgress.set(routeId, currentDist);

    const point = turf.along(routeFeature, currentDist, { units: 'kilometers' });
    const [longitude, latitude] = point.geometry.coordinates;

    const nextDist = (currentDist + 0.02) % totalLengthKm;
    const nextPoint = turf.along(routeFeature, nextDist, { units: 'kilometers' });
    const rawBearing = turf.bearing(point, nextPoint);
    const heading = Math.round((rawBearing + 360) % 360);

    return {
      busId: `ghost-${routeId}`,
      userId: `ghost-system-${routeId}`,
      routeId,
      latitude,
      longitude,
      speedKmh: this.speedKmh,
      heading,
      accuracy: 5,
      is_ghost: true,
      status: 'GHOST',
      timestamp: Date.now(),
      distanceKm: currentDist,
    };
  }
}

const C16_LINE = turf.lineString([
  [-77.2760, 1.1920], // Chapal
  [-77.2750, 1.2010],
  [-77.2778, 1.2115], // Plaza del Carnaval
  [-77.2815, 1.2205],
  [-77.2855, 1.2295], // Pandiaco
]);

test('Ghost Bus: Generación de posición simulada a 18 km/h con flag is_ghost', () => {
  const engine = new GhostBusEngine();
  const ghost1 = engine.calculatePosition(C16_LINE, 'route-c16');

  assert.strictEqual(ghost1.is_ghost, true);
  assert.strictEqual(ghost1.status, 'GHOST');
  assert.strictEqual(ghost1.speedKmh, 18.0);
  assert.strictEqual(typeof ghost1.latitude, 'number');
  assert.strictEqual(typeof ghost1.longitude, 'number');
  assert.ok(ghost1.heading >= 0 && ghost1.heading <= 360);
});

test('Ghost Bus: Avance incremental de 75m (0.075 km) por cada ciclo de 15 segundos', () => {
  const engine = new GhostBusEngine();
  const step1 = engine.calculatePosition(C16_LINE, 'route-c16');
  const step2 = engine.calculatePosition(C16_LINE, 'route-c16');

  const diffKm = step2.distanceKm - step1.distanceKm;
  assert.ok(Math.abs(diffKm - 0.075) < 0.001, `El avance debe ser exactamente ~0.075 km (obtenido: ${diffKm})`);
});

test('Ghost Bus: Detección de arranque en frío cuando hay 0 usuarios reales', () => {
  const engine = new GhostBusEngine();
  assert.strictEqual(engine.hasActiveRealUsers('route-c16'), false, 'Ruta sin usuarios debe retornar false');

  // Llega telemetría de pasajero real
  engine.notifyRealUserActivity('route-c16');
  assert.strictEqual(engine.hasActiveRealUsers('route-c16'), true, 'Ruta con usuario activo debe retornar true');
});
