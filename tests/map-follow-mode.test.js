const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

test('MISIÓN 58 - useTrackingStore: Estado isTrackingActive y acción setTrackingActive', () => {
  const storePath = path.resolve(__dirname, '../src/store/useTrackingStore.ts');
  assert.ok(fs.existsSync(storePath), 'useTrackingStore.ts debe existir');

  const content = fs.readFileSync(storePath, 'utf8');
  assert.ok(content.includes('isTrackingActive: boolean'), 'Debe tipar isTrackingActive en TrackingState');
  assert.ok(content.includes('setTrackingActive: (active: boolean) => void'), 'Debe tipar setTrackingActive');
  assert.ok(content.includes('isTrackingActive: false'), 'isTrackingActive debe inicializar en false');
  assert.ok(content.includes('setTrackingActive: (active) => set({ isTrackingActive: active })'), 'Debe actualizar isTrackingActive');

  const lines = content.split('\n').length;
  assert.ok(lines <= 150, `useTrackingStore.ts tiene ${lines} líneas, debe ser <= 150`);
});

test('MISIÓN 58 - CenterLocationButton: Follow Mode activo, hápticos y color dinámico', () => {
  const btnPath = path.resolve(
    __dirname,
    '../src/components/map/CenterLocationButton/CenterLocationButton.tsx'
  );
  assert.ok(fs.existsSync(btnPath), 'CenterLocationButton.tsx debe existir');

  const content = fs.readFileSync(btnPath, 'utf8');
  assert.ok(content.includes('setTrackingActive(true)'), 'onPress debe activar Follow Mode con setTrackingActive(true)');
  assert.ok(content.includes('Haptics.impactAsync'), 'Debe disparar feedback háptico');
  assert.ok(content.includes('animateCamera') || content.includes('animateToRegion'), 'Debe centrar la cámara');
  assert.ok(content.includes('#10b981'), 'Debe usar color verde/acento para estado activo');
  assert.ok(content.includes('#64748b'), 'Debe usar color gris/slate para estado inactivo');

  const lines = content.split('\n').length;
  assert.ok(lines <= 150, `CenterLocationButton.tsx tiene ${lines} líneas, debe ser <= 150`);
});

test('MISIÓN 58 - MapContainer: Centrado reactivo Follow Mode y liberación por onPanDrag', () => {
  const mapPath = path.resolve(
    __dirname,
    '../src/components/map/MapContainer/MapContainer.tsx'
  );
  assert.ok(fs.existsSync(mapPath), 'MapContainer.tsx debe existir');

  const content = fs.readFileSync(mapPath, 'utf8');
  assert.ok(content.includes('isTrackingActive'), 'Debe consumir isTrackingActive');
  assert.ok(content.includes('currentLocation'), 'Debe consumir currentLocation');
  assert.ok(content.includes('setTrackingActive(false)'), 'Debe poder liberar el rastreo');
  assert.ok(content.includes('onPanDrag='), 'MapView debe tener onPanDrag para liberar seguimiento');
  assert.ok(
    content.includes('animateCamera') || content.includes('animateToRegion'),
    'useEffect debe centrar el mapa suavemente en nuevas coordenadas'
  );

  const lines = content.split('\n').length;
  assert.ok(lines <= 150, `MapContainer.tsx tiene ${lines} líneas, debe ser <= 150`);
});
