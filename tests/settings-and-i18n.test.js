const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

// 1. Verificación del Store de Configuraciones (useSettingsStore)
test('Settings Store: Estado inicial, mutaciones de tema, idioma, háptica y radio', async () => {
  const storePath = path.resolve(__dirname, '../src/store/useSettingsStore.ts');
  assert.ok(fs.existsSync(storePath), 'useSettingsStore.ts debe existir');

  const content = fs.readFileSync(storePath, 'utf8');
  assert.ok(content.includes('theme'), 'Debe gestionar tema (light | dark | system)');
  assert.ok(content.includes('language'), 'Debe gestionar idioma (es | en)');
  assert.ok(content.includes('hapticsEnabled'), 'Debe gestionar haptic feedback');
  assert.ok(content.includes('proximityRadiusMeters'), 'Debe gestionar radio de proximidad');
  assert.ok(content.includes('clearAppCache'), 'Debe contar con purga de caché');

  const lines = content.split('\n').length;
  assert.ok(lines <= 150, `useSettingsStore.ts tiene ${lines} líneas, debe ser <= 150`);
});

// 2. Integridad de los Diccionarios i18n (es vs en)
test('i18n Translations: Simetría total de claves entre Español e Inglés', () => {
  const esPath = path.resolve(__dirname, '../src/i18n/locales/es.ts');
  const enPath = path.resolve(__dirname, '../src/i18n/locales/en.ts');
  const typesPath = path.resolve(__dirname, '../src/i18n/translations.types.ts');
  const hookPath = path.resolve(__dirname, '../src/i18n/useTranslation.ts');

  assert.ok(fs.existsSync(esPath), 'locales/es.ts debe existir');
  assert.ok(fs.existsSync(enPath), 'locales/en.ts debe existir');
  assert.ok(fs.existsSync(typesPath), 'translations.types.ts debe existir');
  assert.ok(fs.existsSync(hookPath), 'useTranslation.ts debe existir');

  const esContent = fs.readFileSync(esPath, 'utf8');
  const enContent = fs.readFileSync(enPath, 'utf8');

  // Dominios obligatorios de traducción del sistema
  const domains = [
    'common',
    'nav',
    'search',
    'routeDetail',
    'onBoard',
    'incidents',
    'alerts',
    'profile',
    'auth',
    'settings',
  ];

  for (const domain of domains) {
    assert.ok(esContent.includes(`${domain}:`), `es.ts debe contener dominio ${domain}`);
    assert.ok(enContent.includes(`${domain}:`), `en.ts debe contener dominio ${domain}`);
  }

  // Verificación de textos específicos en inglés y español
  assert.ok(esContent.includes('¿A dónde vas hoy?'), 'es.ts debe contener placeholder en español');
  assert.ok(enContent.includes('Where are you going today?'), 'en.ts debe contener placeholder en inglés');
  assert.ok(esContent.includes('¡Llegaste a la parada!'), 'es.ts debe contener alerta en español');
  assert.ok(enContent.includes('You arrived at the bus stop!'), 'en.ts debe contener alerta en inglés');
  assert.ok(esContent.includes('Configuración') || esContent.includes('Configuraciones'), 'es.ts debe contener título de ajustes');
  assert.ok(enContent.includes('Settings'), 'en.ts debe contener Settings');
});

// 3. Componente SettingsModal: UI moderna, sin emojis y bajo 150 líneas
test('SettingsModal Component: UI de temas, i18n, háptica, radio, purga y vector icons', () => {
  const modalPath = path.resolve(__dirname, '../src/components/settings/SettingsModal/SettingsModal.tsx');
  const stylesPath = path.resolve(__dirname, '../src/components/settings/SettingsModal/SettingsModal.styles.ts');

  assert.ok(fs.existsSync(modalPath), 'SettingsModal.tsx debe existir');
  assert.ok(fs.existsSync(stylesPath), 'SettingsModal.styles.ts debe existir');

  const content = fs.readFileSync(modalPath, 'utf8');
  const stylesContent = fs.readFileSync(stylesPath, 'utf8');

  // No debe contener ningún emoji
  const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
  assert.ok(!emojiRegex.test(content), 'SettingsModal.tsx no debe contener emojis');

  // Debe usar MaterialCommunityIcons
  assert.ok(content.includes('MaterialCommunityIcons'), 'Debe usar MaterialCommunityIcons');
  assert.ok(content.includes('white-balance-sunny'), 'Debe incluir ícono para modo claro');
  assert.ok(content.includes('weather-night'), 'Debe incluir ícono para modo oscuro');
  assert.ok(content.includes('translate'), 'Debe incluir ícono para selector de idioma');
  assert.ok(content.includes('trash-can-outline'), 'Debe incluir ícono para limpiar caché');

  // Selectores
  assert.ok(content.includes('setTheme'), 'Debe invocar setTheme');
  assert.ok(content.includes('setLanguage'), 'Debe invocar setLanguage');
  assert.ok(content.includes('setHapticsEnabled'), 'Debe invocar setHapticsEnabled');
  assert.ok(content.includes('setProximityRadiusMeters'), 'Debe invocar setProximityRadiusMeters');
  assert.ok(content.includes('clearAppCache'), 'Debe invocar clearAppCache');

  // Regla de líneas
  const modalLines = content.split('\n').length;
  const stylesLines = stylesContent.split('\n').length;
  assert.ok(modalLines <= 150, `SettingsModal.tsx tiene ${modalLines} líneas, debe ser <= 150`);
  assert.ok(stylesLines <= 150, `SettingsModal.styles.ts tiene ${stylesLines} líneas, debe ser <= 150`);
});

// 4. Integración en BottomNavBar y App.tsx
test('Navegación e Integración: BottomNavBar abre SettingsModal y App.tsx lo monta', () => {
  const navPath = path.resolve(__dirname, '../src/components/navigation/BottomNavBar/BottomNavBar.tsx');
  const appPath = path.resolve(__dirname, '../App.tsx');

  const navContent = fs.readFileSync(navPath, 'utf8');
  const appContent = fs.readFileSync(appPath, 'utf8');

  assert.ok(navContent.includes('openSettingsModal'), 'BottomNavBar debe consumir openSettingsModal');
  assert.ok(navContent.includes('cog-outline'), 'BottomNavBar debe tener ícono cog-outline para ajustes');

  assert.ok(appContent.includes('SettingsModal'), 'App.tsx debe importar y renderizar SettingsModal');
  assert.ok(appContent.includes('<SettingsModal />'), 'App.tsx debe montar <SettingsModal />');

  const navLines = navContent.split('\n').length;
  const appLines = appContent.split('\n').length;
  assert.ok(navLines <= 150, `BottomNavBar.tsx tiene ${navLines} líneas, debe ser <= 150`);
  assert.ok(appLines <= 200, `App.tsx tiene ${appLines} líneas, debe ser <= 200`);
});

// 5. Motor de Temas Reactivo: useAppTheme, conmutación Claro/Oscuro/Sistema y estilos de Mapa
test('Motor de Temas Reactivo: Conmutación Claro/Oscuro y sincronización con Sistema', () => {
  const themeHookPath = path.resolve(__dirname, '../src/hooks/useAppTheme.ts');
  const darkMapPath = path.resolve(__dirname, '../src/constants/darkMapStyle.ts');
  const mapPath = path.resolve(__dirname, '../src/components/map/MapContainer/MapContainer.tsx');
  const appPath = path.resolve(__dirname, '../App.tsx');

  assert.ok(fs.existsSync(themeHookPath), 'useAppTheme.ts debe existir');
  assert.ok(fs.existsSync(darkMapPath), 'darkMapStyle.ts debe existir');
  assert.ok(fs.existsSync(mapPath), 'MapContainer.tsx debe existir');

  const themeHookContent = fs.readFileSync(themeHookPath, 'utf8');
  assert.ok(themeHookContent.includes('useColorScheme'), 'useAppTheme debe consultar el esquema del sistema (useColorScheme)');
  assert.ok(themeHookContent.includes("themeSetting === 'dark'"), 'Debe detectar selección explícita oscura');
  assert.ok(themeHookContent.includes("themeSetting === 'system'"), 'Debe respetar el sistema cuando se selecciona sistema');

  const mapContent = fs.readFileSync(mapPath, 'utf8');
  assert.ok(mapContent.includes('useAppTheme'), 'MapContainer debe suscribirse al tema reactivo con useAppTheme');
  assert.ok(mapContent.includes('DARK_MAP_STYLE'), 'MapContainer debe usar DARK_MAP_STYLE en modo oscuro');
  assert.ok(mapContent.includes('customMapStyle'), 'MapContainer debe configurar customMapStyle para Google Maps');

  const appContent = fs.readFileSync(appPath, 'utf8');
  assert.ok(appContent.includes('useAppTheme'), 'App.tsx debe usar useAppTheme para alternar el fondo y la barra de estado');
  assert.ok(appContent.includes('isDark'), 'App.tsx debe conmutar el fondo según isDark');

  // Comprobar límite de líneas
  const hookLines = themeHookContent.split('\n').length;
  const mapLines = mapContent.split('\n').length;
  assert.ok(hookLines <= 150, `useAppTheme.ts tiene ${hookLines} líneas, debe ser <= 150`);
  assert.ok(mapLines <= 150, `MapContainer.tsx tiene ${mapLines} líneas, debe ser <= 150`);
});

// 6. Traducción Completa al Inglés: Alertas de mapa, reportes en vivo y rangos de usuario
test('i18n Total Coverage: Alertas en mapa, reportes y rangos traducidos al inglés', () => {
  const enPath = path.resolve(__dirname, '../src/i18n/locales/en.ts');
  const enContent = fs.readFileSync(enPath, 'utf8');

  // Rango Novato y Gamificación
  assert.ok(enContent.includes('Rookie Passenger'), 'en.ts debe traducir Pasajero Novato a Rookie Passenger');
  assert.ok(enContent.includes('Frequent Passenger'), 'en.ts debe traducir Pasajero Frecuente');
  assert.ok(enContent.includes('Local Guide'), 'en.ts debe traducir Guía Local');
  assert.ok(enContent.includes('Legendary Cuy'), 'en.ts debe traducir Cuy Leyenda');

  // Reportes de Novedad e Incidentes
  assert.ok(enContent.includes('Full Bus'), 'en.ts debe traducir Bus Lleno a Full Bus');
  assert.ok(enContent.includes('Heavy Traffic'), 'en.ts debe traducir Tráfico Pesado a Heavy Traffic');
  assert.ok(enContent.includes('Traffic Jam'), 'en.ts debe traducir Trancón a Traffic Jam');
  assert.ok(enContent.includes('Detour'), 'en.ts debe traducir Desvío a Detour');
  assert.ok(enContent.includes('Accident'), 'en.ts debe traducir Accidente a Accident');

  // Alertas en el Mapa y Feed en Vivo
  assert.ok(enContent.includes('Heavy traffic on 18th St'), 'en.ts debe traducir alerta de tráfico en Calle 18');
  assert.ok(enContent.includes('Full bus in Torobajo'), 'en.ts debe traducir alerta de bus lleno en Torobajo');
  assert.ok(enContent.includes('Full bus on route'), 'en.ts debe traducir bus lleno en vía');
  assert.ok(enContent.includes('Traffic on 17th is heavy'), 'en.ts debe traducir comentarios de feed en vivo');

  // Componentes consumen useTranslation
  const markerPath = path.resolve(__dirname, '../src/components/map/ReportMarker/ReportMarker.tsx');
  const markerContent = fs.readFileSync(markerPath, 'utf8');
  assert.ok(markerContent.includes('useTranslation'), 'ReportMarker debe usar useTranslation');
  assert.ok(markerContent.includes('getTranslatedTitle'), 'ReportMarker debe implementar getTranslatedTitle');

  const userProfilePath = path.resolve(__dirname, '../src/components/profile/UserProfileCard/UserProfileCard.tsx');
  const userProfileContent = fs.readFileSync(userProfilePath, 'utf8');
  assert.ok(userProfileContent.includes('getTranslatedRank'), 'UserProfileCard debe traducir el rango dinámicamente');

  const reportModalPath = path.resolve(__dirname, '../src/components/floating/ReportIncidentModal/ReportIncidentModal.tsx');
  const reportModalContent = fs.readFileSync(reportModalPath, 'utf8');
  assert.ok(reportModalContent.includes('getOptionLabel'), 'ReportIncidentModal debe traducir opciones dinámicamente');
});
