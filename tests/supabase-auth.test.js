const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

test('MISIÓN 48 - Auth Service: auth.service.ts implementa Supabase Auth y modo Invitado', async () => {
  const servicePath = path.resolve(__dirname, '../src/services/auth.service.ts');
  assert.ok(fs.existsSync(servicePath), 'auth.service.ts debe existir');

  const content = fs.readFileSync(servicePath, 'utf8');
  assert.ok(content.includes('signUp'), 'Debe implementar registro con email');
  assert.ok(content.includes('signIn'), 'Debe implementar inicio de sesión con email');
  assert.ok(content.includes('signInAnonymously'), 'Debe implementar autenticación anónima / invitado');
  assert.ok(content.includes('signOut'), 'Debe implementar cierre de sesión');
  assert.ok(content.includes('getCurrentSession'), 'Debe implementar consulta de sesión');
  assert.ok(content.includes('supabase.auth'), 'Debe usar el cliente supabase.auth');
});

test('MISIÓN 48 - Auth Store: useAuthStore.ts gestiona sesión, perfil y rutas/paraderos favoritos', () => {
  const storePath = path.resolve(__dirname, '../src/store/useAuthStore.ts');
  assert.ok(fs.existsSync(storePath), 'useAuthStore.ts debe existir');

  const content = fs.readFileSync(storePath, 'utf8');
  assert.ok(content.includes('isAuthenticated'), 'Debe manejar estado isAuthenticated');
  assert.ok(content.includes('isGuest'), 'Debe manejar flag isGuest');
  assert.ok(content.includes('favoriteRouteIds'), 'Debe persistir rutas favoritas');
  assert.ok(content.includes('favoriteStopIds'), 'Debe persistir paraderos favoritos');
  assert.ok(content.includes('toggleFavoriteRoute'), 'Debe proveer toggle de rutas favoritas');
  assert.ok(content.includes('toggleFavoriteStop'), 'Debe proveer toggle de paraderos favoritos');
  assert.ok(content.includes('loginWithEmail'), 'Debe conectar login con email');
  assert.ok(content.includes('loginAsGuest'), 'Debe permitir acceso como invitado');
  assert.ok(content.includes('logout'), 'Debe soportar cierre de sesión');
});

test('MISIÓN 48 - LoginScreen: Componente limpio con inputs, CTA y botón Continuar como invitado', () => {
  const screenPath = path.resolve(__dirname, '../src/components/auth/LoginScreen/LoginScreen.tsx');
  const stylesPath = path.resolve(__dirname, '../src/components/auth/LoginScreen/LoginScreen.styles.ts');

  assert.ok(fs.existsSync(screenPath), 'LoginScreen.tsx debe existir');
  assert.ok(fs.existsSync(stylesPath), 'LoginScreen.styles.ts debe existir');

  const content = fs.readFileSync(screenPath, 'utf8');
  assert.ok(content.includes('Continuar como invitado'), 'Debe incluir botón "Continuar como invitado"');
  assert.ok(content.includes('Iniciar Sesión'), 'Debe incluir opción de Iniciar Sesión');
  assert.ok(content.includes('Registrarse'), 'Debe incluir opción de Registrarse');
  assert.ok(content.includes('loginAsGuest'), 'Debe invocar loginAsGuest');
  assert.ok(content.includes('secureTextEntry'), 'Debe ocultar contraseña en input');
  assert.ok(content.includes('MaterialCommunityIcons'), 'Debe usar iconografía vectorial');

  const lines = content.split('\n').length;
  assert.ok(lines <= 150, `LoginScreen.tsx tiene ${lines} líneas, debe ser <= 150`);
});

test('MISIÓN 48 - Flujo Condicional en App.tsx: Enrutamiento según autenticación', () => {
  const appPath = path.resolve(__dirname, '../App.tsx');
  assert.ok(fs.existsSync(appPath), 'App.tsx debe existir');

  const content = fs.readFileSync(appPath, 'utf8');
  assert.ok(content.includes('LoginScreen'), 'App.tsx debe importar LoginScreen');
  assert.ok(content.includes('useAuthStore'), 'App.tsx debe importar useAuthStore');
  assert.ok(content.includes('!isAuthenticated'), 'Debe validar condicionalmente si no hay sesión activa');
  assert.ok(content.includes('<LoginScreen />'), 'Debe mostrar LoginScreen si no está autenticado');

  const lines = content.split('\n').length;
  assert.ok(lines <= 200, `App.tsx tiene ${lines} líneas, debe ser <= 200`);
});
