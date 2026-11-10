const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');

test('MISIÓN 67 - app.json: Versionado incrementado (1.0.1 / versionCode >= 2) y assets verificados', () => {
  const { expo } = JSON.parse(fs.readFileSync(path.join(ROOT, 'app.json'), 'utf8'));

  assert.notStrictEqual(expo.version, '1.0.0', 'La versión debe incrementarse (ej. 1.0.1)');
  assert.ok(expo.android.versionCode >= 2, `android.versionCode debe ser >= 2 (actual: ${expo.android.versionCode})`);

  const splashPlugin = expo.plugins.find((p) => Array.isArray(p) && p[0] === 'expo-splash-screen');
  const notifPlugin = expo.plugins.find((p) => Array.isArray(p) && p[0] === 'expo-notifications');

  const assetRefs = [
    expo.icon,
    expo.android.adaptiveIcon.foregroundImage,
    expo.web.favicon,
    splashPlugin && splashPlugin[1].image,
    notifPlugin && notifPlugin[1].icon,
  ].filter(Boolean);

  for (const rel of assetRefs) {
    assert.ok(fs.existsSync(path.join(ROOT, rel)), `Asset referenciado en app.json debe existir: ${rel}`);
  }
});

test('MISIÓN 67 - EAS & Dependencias: eas.json con env de producción y peer deps de SDK 58', () => {
  const eas = JSON.parse(fs.readFileSync(path.join(ROOT, 'eas.json'), 'utf8'));
  const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));

  assert.strictEqual(eas.build.preview.android.buildType, 'apk');
  assert.ok(eas.build.preview.env?.EXPO_PUBLIC_SUPABASE_URL, 'preview.env debe incluir EXPO_PUBLIC_SUPABASE_URL');
  assert.ok(eas.build.preview.env?.EXPO_PUBLIC_API_URL, 'preview.env debe incluir EXPO_PUBLIC_API_URL');

  assert.ok(pkg.dependencies['expo-font'], 'expo-font debe estar instalado para @expo/vector-icons en APK');
  assert.ok(!pkg.devDependencies?.['eas-cli'], 'eas-cli no debe estar en devDependencies del proyecto');
  assert.ok(
    String(pkg.dependencies['@react-native-async-storage/async-storage']).includes('2.2.0'),
    'async-storage debe coincidir con versión 2.2.0 esperada por Expo SDK 58'
  );
});

test('MISIÓN 67 - Endpoints Offline/Producción y Saneamiento de Consola', () => {
  const apiContent = fs.readFileSync(path.join(ROOT, 'src/services/api.client.ts'), 'utf8');
  const sockContent = fs.readFileSync(path.join(ROOT, 'src/services/socket.client.ts'), 'utf8');
  const supaContent = fs.readFileSync(path.join(ROOT, 'src/services/supabase.client.ts'), 'utf8');
  const syncContent = fs.readFileSync(path.join(ROOT, 'src/services/sync.service.ts'), 'utf8');

  assert.ok(!apiContent.includes('localhost:3000'), 'api.client no debe tener fallback a localhost');
  assert.ok(!sockContent.includes('localhost:3000'), 'socket.client no debe tener fallback a localhost');
  assert.ok(sockContent.includes('connect_error'), 'socket.client debe manejar connect_error sin crashear offline');
  assert.ok(!supaContent.includes('demo-rutea-pasto'), 'supabase.client debe apuntar al cluster productivo por defecto');
  assert.ok(syncContent.split('\n').length <= 150, 'sync.service.ts debe respetar límite <= 150 líneas');

  const scanDir = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) scanDir(full);
      else if (/\.(ts|tsx)$/.test(entry.name)) {
        const src = fs.readFileSync(full, 'utf8');
        assert.ok(!/\bconsole\.log\s*\(/.test(src), `No debe haber console.log en producción: ${entry.name}`);
        assert.ok(!/\bdebugger\b/.test(src), `No debe haber debugger en: ${entry.name}`);
      }
    }
  };
  scanDir(path.join(ROOT, 'src'));
  const appSrc = fs.readFileSync(path.join(ROOT, 'App.tsx'), 'utf8');
  assert.ok(!/\bconsole\.log\s*\(/.test(appSrc), 'App.tsx no debe contener console.log');
});

test('APK Crash Fix - OsmMapView & ErrorBoundary: Mapa OSM/CartoDB sin Google API Key y ErrorBoundary activo', () => {
  const mapContainer = fs.readFileSync(path.join(ROOT, 'src/components/map/MapContainer/MapContainer.tsx'), 'utf8');
  const osmView = fs.readFileSync(path.join(ROOT, 'src/components/map/OsmMapView/OsmMapView.tsx'), 'utf8');
  const osmScript = fs.readFileSync(path.join(ROOT, 'src/components/map/OsmMapView/osmMapScript.ts'), 'utf8');
  const osmHtml = fs.readFileSync(path.join(ROOT, 'src/components/map/OsmMapView/osmMapHtml.ts'), 'utf8');
  const errorBoundary = fs.readFileSync(path.join(ROOT, 'src/components/ui/ErrorBoundary/ErrorBoundary.tsx'), 'utf8');
  const appSrc = fs.readFileSync(path.join(ROOT, 'App.tsx'), 'utf8');

  assert.ok(!mapContainer.includes('react-native-maps') && !mapContainer.includes('GOOGLE_MAPS'), 'MapContainer no debe depender de Google Maps ni de API keys');
  assert.ok(mapContainer.includes('<OsmMapView'), 'MapContainer debe renderizar OsmMapView sin Google Maps Key');
  assert.ok(osmScript.includes('tile.openstreetmap.org') && !osmScript.includes('cartocdn.com'), 'Debe usar teselas OpenStreetMap sin API key');
  assert.ok(!/api[_-]?key|access_token/i.test(osmScript), 'Las teselas no deben requerir API key');
  assert.ok(osmScript.includes('__ruteaCamera') && osmScript.includes('__ruteaUpdate'), 'Debe soportar cámara y actualizaciones reactivas');
  assert.ok(appSrc.includes('<ErrorBoundary>'), 'App.tsx debe envolver la vista principal con ErrorBoundary');

  for (const [name, content] of [
    ['MapContainer.tsx', mapContainer],
    ['OsmMapView.tsx', osmView],
    ['osmMapScript.ts', osmScript],
    ['osmMapHtml.ts', osmHtml],
    ['ErrorBoundary.tsx', errorBoundary],
  ]) {
    assert.ok(content.split('\n').length <= 150, `${name} excede 150 líneas`);
  }
});
