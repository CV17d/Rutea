const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

// 1. Verificación de InAppNotification y paleta visual oscura/esmeralda
test('MISIÓN 65 - InAppNotification: Paleta Galeras (claro/oscuro), acento en vivo e ícono bell-ring', () => {
  const componentPath = path.resolve(
    __dirname,
    '../src/components/ui/InAppNotification/InAppNotification.tsx'
  );
  assert.ok(fs.existsSync(componentPath), 'InAppNotification.tsx debe existir');

  const content = fs.readFileSync(componentPath, 'utf8');

  // Tema visual exigido
  assert.ok(content.includes('P.surface'), 'Debe usar la superficie de la paleta (claro/oscuro)');
  assert.ok(content.includes('P.live'), 'Debe usar el acento en vivo de la paleta');
  assert.ok(content.includes('P.text'), 'Debe usar el color de texto de la paleta');
  assert.ok(content.includes('bell-ring'), 'Debe usar ícono vectorial bell-ring');

  // Superposición no bloqueante
  assert.ok(content.includes('pointerEvents="box-none"'), 'Debe tener pointerEvents="box-none" para no bloquear el mapa');
  assert.ok(content.includes('zIndex: 9999'), 'Debe tener alta prioridad z-index (9999)');

  const lines = content.split('\n').length;
  assert.ok(lines <= 150, `InAppNotification.tsx tiene ${lines} líneas, debe ser <= 150`);
});

// 2. Verificación de API Toast y useNotificationStore
test('MISIÓN 65 - useNotificationStore: Store global y helper Toast.show / Toast.hide', () => {
  const storePath = path.resolve(__dirname, '../src/store/useNotificationStore.ts');
  assert.ok(fs.existsSync(storePath), 'useNotificationStore.ts debe existir');

  const content = fs.readFileSync(storePath, 'utf8');
  assert.ok(content.includes('useNotificationStore'), 'Debe exportar useNotificationStore');
  assert.ok(content.includes('Toast ='), 'Debe exportar helper Toast');
  assert.ok(content.includes('show:'), 'Debe incluir método Toast.show');
  assert.ok(content.includes('hide:'), 'Debe incluir método Toast.hide');

  const lines = content.split('\n').length;
  assert.ok(lines <= 150, `useNotificationStore.ts tiene ${lines} líneas, debe ser <= 150`);
});

// 3. Verificación de useProximityAlert: Reemplazo de Alert.alert por Toast.show
test('MISIÓN 65 - useProximityAlert: Usa Toast.show en geocerca de aproximación', () => {
  const hookPath = path.resolve(__dirname, '../src/hooks/useProximityAlert.ts');
  assert.ok(fs.existsSync(hookPath), 'useProximityAlert.ts debe existir');

  const content = fs.readFileSync(hookPath, 'utf8');
  assert.ok(content.includes('Toast.show'), 'Debe disparar Toast.show en lugar de Alert.alert');
  assert.ok(content.includes('¡Prepárate!'), 'Debe conservar título ¡Prepárate!');
  assert.ok(!content.includes('Alert.alert'), 'No debe invocar Alert.alert nativo blanco');

  const lines = content.split('\n').length;
  assert.ok(lines <= 150, `useProximityAlert.ts tiene ${lines} líneas, debe ser <= 150`);
});

// 4. Verificación de App.tsx: Montaje de InAppNotification en el árbol raíz
test('MISIÓN 65 - App.tsx: Monta InAppNotification en la vista raíz y respeta regla de oro', () => {
  const appPath = path.resolve(__dirname, '../App.tsx');
  assert.ok(fs.existsSync(appPath), 'App.tsx debe existir');

  const content = fs.readFileSync(appPath, 'utf8');
  assert.ok(content.includes('<InAppNotification'), 'Debe montar InAppNotification en App.tsx');

  const lines = content.split('\n').length;
  assert.ok(lines <= 200, `App.tsx tiene ${lines} líneas, debe ser <= 200 (actual: ${lines})`);
});
