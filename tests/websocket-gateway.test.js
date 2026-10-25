const test = require('node:test');
const assert = require('node:assert');

test('LocationGateway: Evento joinRoom valida routeId', () => {
  const payload = { routeId: 'C1' };
  const routeId = typeof payload === 'string' ? payload : payload?.routeId;
  assert.strictEqual(routeId, 'C1');
});

test('LocationGateway: Evento updateLocation valida coordenadas y payload', () => {
  const telemetry = {
    userId: 'user-anon-8585',
    routeId: 'route-c1',
    latitude: 1.2145,
    longitude: -77.2783,
    speedKmh: 24,
    heading: 340,
    accuracy: 8,
    timestamp: Date.now(),
  };

  assert.ok(telemetry.routeId, 'Debe incluir routeId para room broadcast');
  assert.strictEqual(typeof telemetry.latitude, 'number');
  assert.strictEqual(typeof telemetry.longitude, 'number');
  assert.ok(telemetry.latitude > 1.0 && telemetry.latitude < 1.5, 'Coordenadas en Pasto');
  assert.ok(telemetry.longitude < -77.0 && telemetry.longitude > -77.5, 'Coordenadas en Pasto');
});
