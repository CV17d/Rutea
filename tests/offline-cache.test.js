const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

test('MISIÓN 50 - AsyncStorage & Sync Service: sync.service.ts implementa caché local y sincronización', () => {
  const servicePath = path.resolve(__dirname, '../src/services/sync.service.ts');
  assert.ok(fs.existsSync(servicePath), 'sync.service.ts debe existir');

  const content = fs.readFileSync(servicePath, 'utf8');
  assert.ok(content.includes('@react-native-async-storage/async-storage'), 'Debe importar AsyncStorage');
  assert.ok(content.includes('syncRoutesCatalog'), 'Debe implementar syncRoutesCatalog');
  assert.ok(content.includes('getCachedRoutes'), 'Debe implementar getCachedRoutes');
  assert.ok(content.includes('saveRoutesToCache'), 'Debe implementar saveRoutesToCache');
  assert.ok(content.includes('loadOfflineFallback'), 'Debe implementar loadOfflineFallback para modo avión');
  assert.ok(content.includes('isOffline'), 'Debe reportar flag isOffline');
});

test('MISIÓN 50 - Routes Store: useRoutesStore.ts lee primero del almacenamiento local y maneja modo offline', () => {
  const storePath = path.resolve(__dirname, '../src/store/useRoutesStore.ts');
  assert.ok(fs.existsSync(storePath), 'useRoutesStore.ts debe existir');

  const content = fs.readFileSync(storePath, 'utf8');
  assert.ok(content.includes('loadLocalCache'), 'Debe proveer método loadLocalCache');
  assert.ok(content.includes('isOffline'), 'Debe incluir estado isOffline');
  assert.ok(content.includes('setOffline'), 'Debe permitir alternar estado offline');
  assert.ok(content.includes('AsyncStorage'), 'Debe leer de almacenamiento local AsyncStorage');
  assert.ok(content.includes('loadLocalCache()'), 'Debe disparar lectura de caché de forma inmediata');
});

test('MISIÓN 50 - Geometrías Offline: 20 rutas SETPasto (C1 a E4) disponibles en fallbackGeometries', () => {
  const geomPath = path.resolve(__dirname, '../src/constants/routes/fallbackGeometries.ts');
  assert.ok(fs.existsSync(geomPath), 'fallbackGeometries.ts debe existir');

  const content = fs.readFileSync(geomPath, 'utf8');
  // Validar las 20 rutas
  for (let i = 1; i <= 16; i++) {
    assert.ok(content.includes(`route-c${i}`), `Debe contener geometría para route-c${i}`);
  }
  for (let i = 1; i <= 4; i++) {
    assert.ok(content.includes(`route-e${i}`), `Debe contener geometría para route-e${i}`);
  }
});

test('MISIÓN 50 - App y Hook de Sincronización en Segundo Plano', () => {
  const hookPath = path.resolve(__dirname, '../src/hooks/useOfflineSync.ts');
  assert.ok(fs.existsSync(hookPath), 'useOfflineSync.ts debe existir');

  const hookContent = fs.readFileSync(hookPath, 'utf8');
  assert.ok(hookContent.includes('syncRoutesCatalog'), 'Debe ejecutar syncRoutesCatalog en segundo plano');

  const appPath = path.resolve(__dirname, '../App.tsx');
  const appContent = fs.readFileSync(appPath, 'utf8');
  assert.ok(appContent.includes('useOfflineSync'), 'App.tsx debe montar useOfflineSync');

  const lines = appContent.split('\n').length;
  assert.ok(lines <= 200, `App.tsx tiene ${lines} líneas, debe ser <= 200`);
});
