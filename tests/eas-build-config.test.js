const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

test('MISIÓN 47 - EAS Build Config: eas.json contiene perfil preview con APK para Android', () => {
  const easPath = path.resolve(__dirname, '../eas.json');
  assert.ok(fs.existsSync(easPath), 'eas.json debe existir en la raíz');

  const easContent = JSON.parse(fs.readFileSync(easPath, 'utf8'));

  assert.ok(easContent.build, 'eas.json debe definir sección build');
  assert.ok(easContent.build.preview, 'eas.json debe definir perfil preview');
  assert.strictEqual(
    easContent.build.preview.distribution,
    'internal',
    'El perfil preview debe tener distribution: "internal"'
  );
  assert.ok(easContent.build.preview.android, 'Perfil preview debe contener configuración android');
  assert.strictEqual(
    easContent.build.preview.android.buildType,
    'apk',
    'Perfil preview android debe tener buildType: "apk"'
  );
});

test('MISIÓN 47 - App Config: app.json tiene paquete com.rutea.app y permisos de GPS', () => {
  const appJsonPath = path.resolve(__dirname, '../app.json');
  assert.ok(fs.existsSync(appJsonPath), 'app.json debe existir en la raíz');

  const appContent = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
  const { expo } = appContent;

  assert.ok(expo, 'app.json debe tener sección expo');
  assert.strictEqual(expo.name, 'Rutea', 'El nombre de la aplicación debe ser Rutea');
  assert.strictEqual(expo.android.package, 'com.rutea.app', 'android.package debe ser com.rutea.app');

  const perms = expo.android.permissions;
  assert.ok(perms.includes('ACCESS_FINE_LOCATION'), 'Debe incluir ACCESS_FINE_LOCATION');
  assert.ok(perms.includes('ACCESS_COARSE_LOCATION'), 'Debe incluir ACCESS_COARSE_LOCATION');

  assert.ok(expo.icon, 'Debe definir icono principal');
  assert.ok(expo.android.adaptiveIcon.foregroundImage, 'Debe definir adaptive launcher icon');
});
