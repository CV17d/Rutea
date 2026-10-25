const test = require('node:test');
const assert = require('node:assert');

// Implementación del servicio de gamificación para tests unitarios
class GamificationEngine {
  constructor() {
    this.sessions = new Map();
  }

  getRank(points) {
    if (points >= 300) return 'Embajador Supremo de Pasto';
    if (points >= 150) return 'Chasqui Urbano';
    if (points >= 75) return 'Vigía del Galeras';
    if (points >= 30) return 'Pasajero Frecuente';
    return 'Cuy Novato';
  }

  processTelemetry(userId, lat, lng, now = Date.now()) {
    let state = this.sessions.get(userId);
    if (!state) {
      state = {
        userId,
        totalPoints: 0,
        currentRank: this.getRank(0),
        accumulatedMeters: 0,
        lastAwardTime: now,
        lastLat: lat,
        lastLng: lng,
      };
      this.sessions.set(userId, state);
    }

    let awarded = 0;
    const prevRank = state.currentRank;

    // Distancia
    if (state.lastLat !== undefined && state.lastLng !== undefined) {
      const distance = this.haversine(state.lastLat, state.lastLng, lat, lng);
      if (distance > 0 && distance < 2000) {
        state.accumulatedMeters += distance;
        if (state.accumulatedMeters >= 500) {
          const distPoints = Math.floor(state.accumulatedMeters / 500);
          awarded += distPoints;
          state.accumulatedMeters %= 500;
        }
      }
    }
    state.lastLat = lat;
    state.lastLng = lng;

    // Tiempo (1 minuto continuo = +1 punto)
    const elapsedMs = now - state.lastAwardTime;
    if (elapsedMs >= 60000) {
      const timePoints = Math.floor(elapsedMs / 60000);
      awarded += timePoints;
      state.lastAwardTime = now;
    }

    state.totalPoints += awarded;
    const newRank = this.getRank(state.totalPoints);
    const rankUp = newRank !== prevRank;
    state.currentRank = newRank;

    return {
      userId,
      awarded,
      totalPoints: state.totalPoints,
      currentRank: newRank,
      rankUp,
    };
  }

  haversine(lat1, lon1, lat2, lon2) {
    const R = 6371000;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }
}

test('Gamificación: Asignación de rangos escalables', () => {
  const engine = new GamificationEngine();
  assert.strictEqual(engine.getRank(0), 'Cuy Novato');
  assert.strictEqual(engine.getRank(29), 'Cuy Novato');
  assert.strictEqual(engine.getRank(30), 'Pasajero Frecuente');
  assert.strictEqual(engine.getRank(75), 'Vigía del Galeras');
  assert.strictEqual(engine.getRank(150), 'Chasqui Urbano');
  assert.strictEqual(engine.getRank(305), 'Embajador Supremo de Pasto');
});

test('Gamificación: +1 punto otorgado al acumular 500 metros recorridos', () => {
  const engine = new GamificationEngine();
  const t0 = 1000000;
  // Inicio en Catambuco
  engine.processTelemetry('user-1', 1.1732, -77.2845, t0);

  // Desplazamiento de ~600 metros hacia el norte
  const res = engine.processTelemetry('user-1', 1.1785, -77.2845, t0 + 10000);

  assert.strictEqual(res.awarded, 1);
  assert.strictEqual(res.totalPoints, 1);
  assert.strictEqual(res.currentRank, 'Cuy Novato');
});

test('Gamificación: +1 punto otorgado por cada minuto continuo transmitiendo', () => {
  const engine = new GamificationEngine();
  const t0 = 1000000;
  engine.processTelemetry('user-2', 1.2145, -77.2783, t0);

  // Mismo lugar tras 65 segundos (1 minuto y 5 seg)
  const res = engine.processTelemetry('user-2', 1.21451, -77.2783, t0 + 65000);

  assert.strictEqual(res.awarded, 1);
  assert.strictEqual(res.totalPoints, 1);
});

test('Gamificación: Promoción automática de rango (rankUp)', () => {
  const engine = new GamificationEngine();
  const state = {
    userId: 'user-3',
    totalPoints: 74,
    currentRank: 'Pasajero Frecuente',
    accumulatedMeters: 450,
    lastAwardTime: 1000,
    lastLat: 1.2100,
    lastLng: -77.2780,
  };
  engine.sessions.set('user-3', state);

  // Recorre 100m más cruzando el umbral de 500m -> +1 pt -> 75 pts -> Vigía del Galeras
  const res = engine.processTelemetry('user-3', 1.2109, -77.2780, 2000);

  assert.strictEqual(res.totalPoints, 75);
  assert.strictEqual(res.currentRank, 'Vigía del Galeras');
  assert.strictEqual(res.rankUp, true);
});
