const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

test('MISIÓN 54 - Dependencies: expo-updates instalado en package.json', () => {
  const pkgPath = path.resolve(__dirname, '../package.json');
  assert.ok(fs.existsSync(pkgPath), 'package.json debe existir');

  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  assert.ok(
    pkg.dependencies && pkg.dependencies['expo-updates'],
    'expo-updates debe estar instalado en dependencies'
  );
});

test('MISIÓN 54 - App Config: updates con EAS URL y fallbackToCacheTimeout: 0', () => {
  const appJsonPath = path.resolve(__dirname, '../app.json');
  assert.ok(fs.existsSync(appJsonPath), 'app.json debe existir');

  const appConfig = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
  const { expo } = appConfig;

  // updates config
  assert.ok(expo.updates, 'app.json debe tener sección updates');
  assert.ok(expo.updates.url && expo.updates.url.includes('u.expo.dev'), 'updates.url debe apuntar a EAS (u.expo.dev)');
  assert.strictEqual(
    expo.updates.fallbackToCacheTimeout,
    0,
    'fallbackToCacheTimeout debe ser 0 para carga instantánea'
  );

  // runtimeVersion
  assert.ok(expo.runtimeVersion, 'app.json debe definir runtimeVersion para compatibilidad OTA');

  // plugins
  const plugins = expo.plugins || [];
  const updatesPlugin = plugins.find((p) => {
    if (typeof p === 'string') return p === 'expo-updates';
    if (Array.isArray(p)) return p[0] === 'expo-updates';
    return false;
  });
  assert.ok(updatesPlugin, 'plugins debe incluir expo-updates');
});

test('MISIÓN 54 - Env Production: .env.production separa variables de producción', () => {
  const prodEnvPath = path.resolve(__dirname, '../.env.production');
  assert.ok(fs.existsSync(prodEnvPath), '.env.production debe existir');

  const content = fs.readFileSync(prodEnvPath, 'utf8');
  assert.ok(content.includes('EXPO_PUBLIC_API_URL'), 'Debe definir EXPO_PUBLIC_API_URL de producción');
  assert.ok(content.includes('EXPO_PUBLIC_SUPABASE_URL'), 'Debe definir EXPO_PUBLIC_SUPABASE_URL');
  assert.ok(content.includes('EXPO_PUBLIC_SUPABASE_ANON_KEY'), 'Debe definir EXPO_PUBLIC_SUPABASE_ANON_KEY');
  assert.ok(content.includes('production'), 'Debe especificar entorno de producción');
});

test('MISIÓN 54 - EAS Config: Perfil production compila en app-bundle (.aab) y submit habilitado', () => {
  const easPath = path.resolve(__dirname, '../eas.json');
  assert.ok(fs.existsSync(easPath), 'eas.json debe existir');

  const easConfig = JSON.parse(fs.readFileSync(easPath, 'utf8'));

  // build.production con app-bundle para Play Store
  assert.ok(easConfig.build && easConfig.build.production, 'eas.json debe tener build.production');
  assert.ok(
    easConfig.build.production.android && easConfig.build.production.android.buildType === 'app-bundle',
    'build.production.android.buildType debe ser "app-bundle" (.aab) para Play Store'
  );

  // submit.production configurado para Google Play
  assert.ok(easConfig.submit && easConfig.submit.production, 'eas.json debe tener submit.production');
  assert.ok(easConfig.submit.production.android, 'submit.production debe configurar android');
});
