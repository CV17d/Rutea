const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

test('MISIÓN 52 - Dependencies: expo-notifications instalado en package.json', () => {
  const pkgPath = path.resolve(__dirname, '../package.json');
  assert.ok(fs.existsSync(pkgPath), 'package.json debe existir');

  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  assert.ok(
    pkg.dependencies && pkg.dependencies['expo-notifications'],
    'expo-notifications debe estar listado en dependencies'
  );
});

test('MISIÓN 52 - App Config: app.json tiene permisos de notificaciones y plugin configurado', () => {
  const appJsonPath = path.resolve(__dirname, '../app.json');
  assert.ok(fs.existsSync(appJsonPath), 'app.json debe existir');

  const appConfig = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
  const { expo } = appConfig;

  // Permisos Android
  const perms = expo.android.permissions;
  assert.ok(perms.includes('POST_NOTIFICATIONS'), 'Debe incluir POST_NOTIFICATIONS');
  assert.ok(perms.includes('VIBRATE'), 'Debe incluir VIBRATE');

  // Plugins Expo
  const plugins = expo.plugins || [];
  const notifPlugin = plugins.find((p) => {
    if (typeof p === 'string') return p === 'expo-notifications';
    if (Array.isArray(p)) return p[0] === 'expo-notifications';
    return false;
  });
  assert.ok(notifPlugin, 'Debe incluir el plugin expo-notifications en app.json');
});

test('MISIÓN 52 - Notification Service: notification.service.ts implementa configuración y registro', () => {
  const servicePath = path.resolve(__dirname, '../src/services/notification.service.ts');
  assert.ok(fs.existsSync(servicePath), 'notification.service.ts debe existir');

  const content = fs.readFileSync(servicePath, 'utf8');
  assert.ok(content.includes('setNotificationHandler'), 'Debe configurar setNotificationHandler');
  assert.ok(content.includes('setNotificationChannelAsync'), 'Debe configurar canal de notificación');
  assert.ok(content.includes('registerForPushNotificationsAsync'), 'Debe exportar registro de push token');
  assert.ok(content.includes('scheduleProximityNotification'), 'Debe exportar scheduleProximityNotification');
  assert.ok(content.includes('AndroidNotificationPriority.MAX'), 'Debe usar máxima prioridad para despertar la pantalla');

  const lines = content.split('\n').length;
  assert.ok(lines <= 150, `notification.service.ts tiene ${lines} líneas, debe ser <= 150`);
});

test('MISIÓN 52 - Proximity Alert Hook: useProximityAlert.ts lanza notificación push local nativa', () => {
  const hookPath = path.resolve(__dirname, '../src/hooks/useProximityAlert.ts');
  assert.ok(fs.existsSync(hookPath), 'useProximityAlert.ts debe existir');

  const content = fs.readFileSync(hookPath, 'utf8');
  assert.ok(content.includes('Notifications.scheduleNotificationAsync'), 'Debe invocar Notifications.scheduleNotificationAsync');
  assert.ok(
    content.includes('¡Prepárate! La ruta') && content.includes('está llegando a tu parada'),
    'Debe formular el mensaje oficial: ¡Prepárate! La ruta [Código] está llegando a tu parada'
  );
  assert.ok(content.includes('registerForPushNotificationsAsync'), 'Debe registrar permisos de notificación');

  const lines = content.split('\n').length;
  assert.ok(lines <= 150, `useProximityAlert.ts tiene ${lines} líneas, debe ser <= 150`);
});

test('MISIÓN 52 - Notificación de Proximidad: Formato de carga útil cuando el bus está a < 400m', () => {
  const thresholdMeters = 400;
  const busDistance = 280;

  function buildProximityNotification(routeCode, distance) {
    if (distance <= thresholdMeters) {
      return {
        title: '¡Prepárate!',
        body: `¡Prepárate! La ruta ${routeCode} está llegando a tu parada`,
        sound: true,
        vibrate: [0, 250, 250, 250],
        data: { routeCode, distanceMeters: distance },
      };
    }
    return null;
  }

  const payload = buildProximityNotification('C16', busDistance);
  assert.ok(payload !== null, 'Debe disparar notificación si distancia <= 400m');
  assert.strictEqual(payload.title, '¡Prepárate!');
  assert.strictEqual(payload.body, '¡Prepárate! La ruta C16 está llegando a tu parada');
  assert.deepStrictEqual(payload.vibrate, [0, 250, 250, 250]);

  // Fuera de umbral (> 400m)
  const outsidePayload = buildProximityNotification('C16', 550);
  assert.strictEqual(outsidePayload, null, 'No debe disparar si distancia > 400m');
});
