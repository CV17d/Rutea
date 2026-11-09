const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

test('MISIÓN 55 - Store: selectedRouteId inicial es null (mapa inicia limpio sin C16)', () => {
  const storePath = path.resolve(__dirname, '../src/store/useRoutesStore.ts');
  assert.ok(fs.existsSync(storePath), 'useRoutesStore.ts debe existir');

  const content = fs.readFileSync(storePath, 'utf8');
  assert.ok(content.includes('selectedRouteId: null'), 'selectedRouteId debe inicializar en null');
  assert.ok(!content.includes("selectedRouteId: 'route-c16'"), 'selectedRouteId no debe tener quemada la ruta C16');
});

test('MISIÓN 55 - LiveBusMarker: Elimina emoji 🚍 y usa vista superior (top-down view)', () => {
  const markerPath = path.resolve(
    __dirname,
    '../src/components/map/LiveBusMarker/LiveBusMarker.tsx'
  );
  assert.ok(fs.existsSync(markerPath), 'LiveBusMarker.tsx debe existir');

  const content = fs.readFileSync(markerPath, 'utf8');

  // Sin emojis de bus
  assert.ok(!content.includes('🚍'), 'LiveBusMarker no debe contener el emoji 🚍');
  assert.ok(!content.includes('🚌'), 'LiveBusMarker no debe contener el emoji 🚌');

  // Componente de vista superior (chasis, parabrisas, luces delanteras y traseras)
  assert.ok(content.includes('busChassis'), 'Debe renderizar chasis de vista superior busChassis');
  assert.ok(content.includes('windshield'), 'Debe incluir parabrisas para orientar el frente del vehículo');
  assert.ok(content.includes('frontLightsRow'), 'Debe incluir fila de luces delanteras');
  assert.ok(content.includes('headlight'), 'Debe incluir faros delanteros');
  assert.ok(content.includes('taillight'), 'Debe incluir luces traseras');

  // Rotación angular precisa según el rumbo (heading)
  assert.ok(content.includes('transform: [{ rotate: spin }]'), 'Debe rotar el chasis según el ángulo spin/heading');
  assert.ok(content.includes('flat={true}'), 'Debe proyectar el marcador plano sobre el plano del mapa');

  const lines = content.split('\n').length;
  assert.ok(lines <= 150, `LiveBusMarker.tsx tiene ${lines} líneas, debe ser <= 150`);
});

test('MISIÓN 55 - Map View & Flota Completa: Renderizado de buses mediante map()', () => {
  const appPath = path.resolve(__dirname, '../App.tsx');
  assert.ok(fs.existsSync(appPath), 'App.tsx debe existir');

  const appContent = fs.readFileSync(appPath, 'utf8');
  assert.ok(
    appContent.includes('currentBusList.map') || appContent.includes('.map((bus)'),
    'Debe iterar y renderizar los buses activos de la flota mediante .map()'
  );
  assert.ok(appContent.includes('<LiveBusMarker'), 'Debe instanciar LiveBusMarker para cada bus');
});

test('MISIÓN 55 - Regla de Oro: Componentes y stores bajo 150 líneas', () => {
  const files = [
    { file: '../src/components/map/LiveBusMarker/LiveBusMarker.tsx', max: 150 },
    { file: '../src/components/map/LiveBusMarker/LiveBusMarker.styles.ts', max: 150 },
    { file: '../src/store/useRoutesStore.ts', max: 150 },
    { file: '../src/store/useTrackingStore.ts', max: 150 },
    { file: '../src/hooks/useBusSimulator.ts', max: 150 },
    { file: '../App.tsx', max: 200 },
  ];

  for (const item of files) {
    const fullPath = path.resolve(__dirname, item.file);
    assert.ok(fs.existsSync(fullPath), `${item.file} debe existir`);
    const count = fs.readFileSync(fullPath, 'utf8').split('\n').length;
    assert.ok(count <= item.max, `${item.file} tiene ${count} líneas, debe ser <= ${item.max}`);
  }
});
