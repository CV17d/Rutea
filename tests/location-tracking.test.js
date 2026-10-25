const test = require('node:test');
const assert = require('node:assert');

test('Estructura de telemetria GPS valida con lat, lng, speed y heading', () => {
  const mockLocation = {
    latitude: 1.2136,
    longitude: -77.2811,
    speedKmh: 24.5,
    heading: 180,
    accuracy: 8,
    timestamp: Date.now(),
  };

  assert.strictEqual(typeof mockLocation.latitude, 'number');
  assert.strictEqual(typeof mockLocation.longitude, 'number');
  assert.strictEqual(typeof mockLocation.speedKmh, 'number');
  assert.strictEqual(typeof mockLocation.heading, 'number');
  assert.ok(mockLocation.accuracy <= 30, 'Accuracy debe ser confiable');
  assert.ok(mockLocation.speedKmh >= 0 && mockLocation.speedKmh <= 80, 'Velocidad dentro del limite urbano');
});

test('Conversion de velocidad m/s a km/h para telemetria de buses', () => {
  const speedMps = 6.25; // m/s
  const speedKmh = Math.max(0, speedMps * 3.6);
  assert.strictEqual(speedKmh, 22.5);
});
