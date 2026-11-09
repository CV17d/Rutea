const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

test('MISIÓN 59 - RouteSummaryCard: Retorna null sin ruta seleccionada y elimina fallback C16', () => {
  const cardPath = path.resolve(
    __dirname,
    '../src/components/floating/RouteSummaryCard/RouteSummaryCard.tsx'
  );
  assert.ok(fs.existsSync(cardPath), 'RouteSummaryCard.tsx debe existir');

  const content = fs.readFileSync(cardPath, 'utf8');
  assert.ok(
    content.includes('if (!selectedRoute)') && content.includes('return null'),
    'RouteSummaryCard debe retornar null si selectedRoute es null/undefined'
  );
  assert.ok(
    !content.includes('Ruta C16 • Anganoy - Cabrera'),
    'RouteSummaryCard no debe tener quemado el texto de Ruta C16'
  );

  const lines = content.split('\n').length;
  assert.ok(lines <= 150, `RouteSummaryCard.tsx tiene ${lines} líneas, debe ser <= 150`);
});

test('MISIÓN 59 - App.tsx: No renderiza tarjetas flotantes inferiores en estado inicial', () => {
  const appPath = path.resolve(__dirname, '../App.tsx');
  assert.ok(fs.existsSync(appPath), 'App.tsx debe existir');

  const content = fs.readFileSync(appPath, 'utf8');
  assert.ok(
    content.includes('{selectedRoute && <RouteSummaryCard />}'),
    'App.tsx debe condicionar RouteSummaryCard a selectedRoute'
  );

  const lines = content.split('\n').length;
  assert.ok(lines <= 200, `App.tsx tiene ${lines} líneas, debe ser <= 200`);
});

test('MISIÓN 59 - RouteHeroCard y StopTimeline: Retornan null sin ruta seleccionada', () => {
  const heroPath = path.resolve(
    __dirname,
    '../src/components/routeDetail/RouteHeroCard/RouteHeroCard.tsx'
  );
  const timelinePath = path.resolve(
    __dirname,
    '../src/components/routeDetail/StopTimeline/StopTimeline.tsx'
  );

  const heroContent = fs.readFileSync(heroPath, 'utf8');
  assert.ok(
    heroContent.includes('return null'),
    'RouteHeroCard debe retornar null si no hay ruta ni código'
  );
  assert.ok(
    !heroContent.includes("'Ruta C16'"),
    'RouteHeroCard no debe tener fallback quemado a C16'
  );

  const timelineContent = fs.readFileSync(timelinePath, 'utf8');
  assert.ok(
    timelineContent.includes('return null'),
    'StopTimeline debe retornar null si no hay ruta ni paradas'
  );
  assert.ok(
    !timelineContent.includes('DEFAULT_STOPS'),
    'StopTimeline no debe tener paradas quemadas de C16'
  );

  assert.ok(heroContent.split('\n').length <= 150, 'RouteHeroCard debe ser <= 150 líneas');
  assert.ok(timelineContent.split('\n').length <= 150, 'StopTimeline debe ser <= 150 líneas');
});

test('MISIÓN 59 - Stores: Estado inicial limpio sin selección forzada', () => {
  const routesStorePath = path.resolve(__dirname, '../src/store/useRoutesStore.ts');
  const trackingStorePath = path.resolve(__dirname, '../src/store/useTrackingStore.ts');

  const routesStoreContent = fs.readFileSync(routesStorePath, 'utf8');
  assert.ok(
    routesStoreContent.includes('selectedRouteId: null'),
    'useRoutesStore debe iniciar con selectedRouteId: null'
  );

  const trackingStoreContent = fs.readFileSync(trackingStorePath, 'utf8');
  assert.ok(
    trackingStoreContent.includes('selectedBusId: null'),
    'useTrackingStore debe iniciar con selectedBusId: null'
  );
  assert.ok(
    trackingStoreContent.includes('isTrackingActive: false'),
    'useTrackingStore debe iniciar con isTrackingActive: false'
  );
});
