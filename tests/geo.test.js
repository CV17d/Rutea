const test = require('node:test');
const assert = require('node:assert');

// Test Haversine distance
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

test('Calculo de distancia en San Juan de Pasto', () => {
  const plazaNarino = { latitude: 1.2145, longitude: -77.2783 };
  const plazaCarnaval = { latitude: 1.2115, longitude: -77.2778 };

  const distance = calculateDistanceMeters(plazaNarino, plazaCarnaval);
  assert.ok(distance > 300 && distance < 400, `Distancia esperada ~340m, obtenida: ${distance}`);
});

test('Calculo de ETA basado en velocidad urbana', () => {
  const distanceMeters = 1000; // 1 km
  const speedKmh = 20; // 20 km/h en Pasto
  const speedMetersPerMin = (speedKmh * 1000) / 60;
  const etaMinutes = Math.round(distanceMeters / speedMetersPerMin);

  assert.strictEqual(etaMinutes, 3, '1km a 20km/h deberia tomar 3 minutos');
});
