const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

test('MISIÓN 66 - app.json: Icono adaptativo y Splash Screen blanco (#ffffff)', () => {
  const appJsonPath = path.resolve(__dirname, '../app.json');
  const { expo } = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));

  assert.strictEqual(expo.icon, './assets/icon.png');
  assert.strictEqual(expo.android.adaptiveIcon.foregroundImage, './assets/adaptive-icon.png');
  assert.strictEqual(expo.android.adaptiveIcon.backgroundColor, '#ffffff');
  assert.deepStrictEqual(expo.splash, {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  });

  const splashPlugin = (expo.plugins || []).find((p) => Array.isArray(p) && p[0] === 'expo-splash-screen');
  assert.ok(splashPlugin, 'Debe configurar el plugin expo-splash-screen');
  assert.strictEqual(splashPlugin[1].backgroundColor, '#ffffff');
  assert.strictEqual(splashPlugin[1].image, './assets/splash.png');
});

test('MISIÓN 66 - Assets PNG: Recursos gráficos reales generados en ./assets/', () => {
  const requiredAssets = ['icon.png', 'adaptive-icon.png', 'splash.png', 'logo-mark.png', 'favicon.png'];
  for (const name of requiredAssets) {
    const filePath = path.resolve(__dirname, '../assets', name);
    assert.ok(fs.existsSync(filePath), `assets/${name} debe existir`);
    const buf = fs.readFileSync(filePath);
    assert.ok(buf.length > 10000, `assets/${name} debe ser una imagen real (> 10KB, actual: ${buf.length})`);
    assert.strictEqual(buf.slice(0, 4).toString('hex'), '89504e47', `assets/${name} debe ser formato PNG válido`);
  }
});

test('MISIÓN 66 - SplashScreen.tsx: Diseño minimalista blanco/verde (#10b981) y transición sin parpadeos', () => {
  const splashPath = path.resolve(__dirname, '../src/components/ui/SplashScreen/SplashScreen.tsx');
  const stylesPath = path.resolve(__dirname, '../src/components/ui/SplashScreen/SplashScreen.styles.ts');
  const appPath = path.resolve(__dirname, '../App.tsx');

  assert.ok(fs.existsSync(splashPath), 'SplashScreen.tsx debe existir');
  assert.ok(fs.existsSync(stylesPath), 'SplashScreen.styles.ts debe existir');

  const splashContent = fs.readFileSync(splashPath, 'utf8');
  const stylesContent = fs.readFileSync(stylesPath, 'utf8');
  const appContent = fs.readFileSync(appPath, 'utf8');

  assert.ok(stylesContent.includes('#ffffff'), 'Fondo debe ser plano blanco #ffffff');
  assert.ok(stylesContent.includes('#10b981'), 'Identidad debe usar verde esmeralda #10b981');
  assert.ok(splashContent.includes('Rutea'), 'Debe mostrar el nombre Rutea');
  assert.ok(splashContent.includes('Conectando tu camino'), 'Debe mostrar el eslogan Conectando tu camino');
  assert.ok(splashContent.includes('expo-splash-screen') && splashContent.includes('hideAsync'), 'Debe ocultar el splash nativo al estar listo');
  assert.ok(splashContent.includes('Animated.timing'), 'Debe incluir indicador animado delicado de progreso');

  assert.ok(appContent.includes('preventAutoHideAsync'), 'App.tsx debe prevenir cierre prematuro del splash nativo');
  assert.ok(appContent.includes('<SplashScreen'), 'App.tsx debe renderizar SplashScreen internamente');

  assert.ok(splashContent.split('\n').length <= 150, 'SplashScreen.tsx debe tener <= 150 líneas');
  assert.ok(stylesContent.split('\n').length <= 150, 'SplashScreen.styles.ts debe tener <= 150 líneas');
  assert.ok(appContent.split('\n').length <= 200, 'App.tsx debe tener <= 200 líneas');
});
