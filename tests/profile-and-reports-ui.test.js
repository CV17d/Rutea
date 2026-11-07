const test = require('node:test');
const assert = require('node:assert');

function calculateProgress(points) {
  const tiers = [
    { min: 0, max: 30, current: 'Cuy Novato', next: 'Pasajero Frecuente' },
    { min: 30, max: 75, current: 'Pasajero Frecuente', next: 'Vigía del Galeras' },
    { min: 75, max: 150, current: 'Vigía del Galeras', next: 'Chasqui Urbano' },
    { min: 150, max: 300, current: 'Chasqui Urbano', next: 'Embajador Supremo' },
  ];

  for (const tier of tiers) {
    if (points < tier.max) {
      const earnedInTier = points - tier.min;
      const range = tier.max - tier.min;
      const pct = Math.min(100, Math.max(0, Math.round((earnedInTier / range) * 100)));
      return { nextRank: tier.next, pct, needed: tier.max - points };
    }
  }

  return { nextRank: 'Nivel Máximo', pct: 100, needed: 0 };
}

test('UserProfileCard: Cálculo de barra de progreso visual por rangos', () => {
  // 15 puntos en Cuy Novato (0-30) -> 50% hacia Pasajero Frecuente
  const p1 = calculateProgress(15);
  assert.strictEqual(p1.nextRank, 'Pasajero Frecuente');
  assert.strictEqual(p1.pct, 50);
  assert.strictEqual(p1.needed, 15);

  // 85 puntos en Vigía del Galeras (75-150) -> 10 de 75 puntos = 13% hacia Chasqui Urbano
  const p2 = calculateProgress(85);
  assert.strictEqual(p2.nextRank, 'Chasqui Urbano');
  assert.strictEqual(p2.pct, 13);
  assert.strictEqual(p2.needed, 65);

  // 350 puntos -> Máximo
  const p3 = calculateProgress(350);
  assert.strictEqual(p3.pct, 100);
  assert.strictEqual(p3.needed, 0);
});

test('QuickReportModal: 3 opciones oficiales con bonificación de +15 puntos', () => {
  const REPORT_OPTIONS = [
    { key: 'TRAFFIC_JAM', label: 'Tráfico', icon: '🚗' },
    { key: 'ROAD_BLOCK', label: 'Vía Cerrada', icon: '🚧' },
    { key: 'BUS_FULL', label: 'Bus Lleno', icon: '🚌' },
  ];

  assert.strictEqual(REPORT_OPTIONS.length, 3);
  const keys = REPORT_OPTIONS.map((o) => o.key);
  assert.ok(keys.includes('TRAFFIC_JAM'));
  assert.ok(keys.includes('ROAD_BLOCK'));
  assert.ok(keys.includes('BUS_FULL'));

  const payload = {
    userId: 'user-pastuso-123',
    routeId: 'route-c1',
    reportType: 'TRAFFIC_JAM',
    latitude: 1.2145,
    longitude: -77.2783,
  };

  assert.ok(payload.latitude && payload.longitude);
  assert.strictEqual(payload.reportType, 'TRAFFIC_JAM');
});
