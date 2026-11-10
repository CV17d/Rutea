const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

test('MISIÓN 46 - Iconografía Vectorial: Reemplazo de emojis por @expo/vector-icons en la UI', () => {
  const tripTimelinePath = path.resolve(__dirname, '../src/components/tripPlanner/TripTimeline.tsx');
  const tripPlannerPath = path.resolve(__dirname, '../src/components/tripPlanner/TripPlanner.tsx');
  const liveArrivalPath = path.resolve(__dirname, '../src/components/ui/LiveArrivalBadge/LiveArrivalBadge.tsx');
  const recCardPath = path.resolve(__dirname, '../src/components/tripPlanner/RouteRecommendationCard.tsx');
  const navBarPath = path.resolve(__dirname, '../src/components/navigation/BottomNavBar/BottomNavBar.tsx');

  // 1. TripTimeline
  const timelineContent = fs.readFileSync(tripTimelinePath, 'utf8');
  assert.ok(timelineContent.includes('@expo/vector-icons'), 'TripTimeline debe importar @expo/vector-icons');
  assert.ok(timelineContent.includes('name="walk"'), 'TripTimeline debe usar ícono de caminata');
  assert.ok(timelineContent.includes('name="bus"'), 'TripTimeline debe usar ícono de bus');
  assert.ok(timelineContent.includes('name="flag-checkered"'), 'TripTimeline debe usar ícono de bandera/destino');
  assert.ok(!timelineContent.includes('🚶'), 'TripTimeline no debe contener el emoji 🚶');
  assert.ok(!timelineContent.includes('🚍'), 'TripTimeline no debe contener el emoji 🚍');
  assert.ok(!timelineContent.includes('🏁'), 'TripTimeline no debe contener el emoji 🏁');

  // 2. TripPlanner
  const plannerContent = fs.readFileSync(tripPlannerPath, 'utf8');
  assert.ok(plannerContent.includes('@expo/vector-icons'), 'TripPlanner debe importar @expo/vector-icons');
  assert.ok(plannerContent.includes('name="close"'), 'TripPlanner debe usar ícono de cerrar');
  assert.ok(plannerContent.includes('name="crosshairs-gps"'), 'TripPlanner debe usar ícono GPS');
  assert.ok(!plannerContent.includes('✕'), 'TripPlanner no debe contener el carácter ✕');
  assert.ok(!plannerContent.includes('🟢'), 'TripPlanner no debe contener el emoji 🟢');
  assert.ok(!plannerContent.includes('🔴'), 'TripPlanner no debe contener el emoji 🔴');

  // 3. LiveArrivalBadge
  const badgeContent = fs.readFileSync(liveArrivalPath, 'utf8');
  assert.ok(badgeContent.includes('@expo/vector-icons'), 'LiveArrivalBadge debe importar @expo/vector-icons');
  assert.ok(badgeContent.includes('name="bus"'), 'LiveArrivalBadge debe usar ícono vectorial de bus');
  assert.ok(!badgeContent.includes('🚍'), 'LiveArrivalBadge no debe contener el emoji 🚍');

  // 4. RouteRecommendationCard
  const recContent = fs.readFileSync(recCardPath, 'utf8');
  assert.ok(recContent.includes('@expo/vector-icons'), 'RouteRecommendationCard debe importar @expo/vector-icons');
  assert.ok(recContent.includes('name="walk"'), 'RouteRecommendationCard debe usar ícono de caminata');
  assert.ok(recContent.includes('name="bus"'), 'RouteRecommendationCard debe usar ícono vectorial de bus');
  assert.ok(!recContent.includes('🚶'), 'RouteRecommendationCard no debe contener el emoji 🚶');

  // 5. BottomNavBar
  const navContent = fs.readFileSync(navBarPath, 'utf8');
  assert.ok(navContent.includes('@expo/vector-icons'), 'BottomNavBar debe importar @expo/vector-icons');
  assert.ok(navContent.includes('name={screenMode === \'HOME\' ? \'home\' : \'home-outline\'}'), 'BottomNavBar debe tener ícono de Home vectorial');
  assert.ok(navContent.includes('name="bus"'), 'BottomNavBar debe tener ícono de bus vectorial');
  assert.ok(navContent.includes('name="clipboard-alert-outline"'), 'BottomNavBar debe tener ícono de reportes vectorial');
  assert.ok(navContent.includes('name="account-outline"'), 'BottomNavBar debe tener ícono de perfil vectorial');
  assert.ok(!navContent.includes('🏠'), 'BottomNavBar no debe contener emoji 🏠');
  assert.ok(!navContent.includes('🧭'), 'BottomNavBar no debe contener emoji 🧭');
  assert.ok(!navContent.includes('📋'), 'BottomNavBar no debe contener emoji 📋');
  assert.ok(!navContent.includes('👤'), 'BottomNavBar no debe contener emoji 👤');
});

test('MISIÓN 46 - CenterLocationButton: FAB circular, GPS Crosshair y control de cámara', () => {
  const btnPath = path.resolve(__dirname, '../src/components/map/CenterLocationButton/CenterLocationButton.tsx');
  const stylesPath = path.resolve(__dirname, '../src/components/map/CenterLocationButton/CenterLocationButton.styles.ts');
  const mapContainerPath = path.resolve(__dirname, '../src/components/map/MapContainer/MapContainer.tsx');

  assert.ok(fs.existsSync(btnPath), 'CenterLocationButton.tsx debe existir');
  assert.ok(fs.existsSync(stylesPath), 'CenterLocationButton.styles.ts debe existir');

  const btnContent = fs.readFileSync(btnPath, 'utf8');
  assert.ok(btnContent.includes('MaterialCommunityIcons'), 'Debe importar MaterialCommunityIcons');
  assert.ok(btnContent.includes('name="crosshairs-gps"'), 'Debe mostrar ícono crosshairs-gps');
  assert.ok(btnContent.includes('animateCamera') || btnContent.includes('animateToRegion'), 'Debe soportar animacion suave de camara');
  assert.ok(btnContent.includes('useTrackingStore'), 'Debe consultar coordenadas desde useTrackingStore');
  assert.ok(btnContent.includes('Location.getCurrentPositionAsync'), 'Debe tener fallback a GPS nativo');

  const stylesContent = fs.readFileSync(stylesPath, 'utf8');
  assert.ok(stylesContent.includes('borderRadius: 16'), 'Debe usar el radio de controles del sistema visual');
  assert.ok(stylesContent.includes('elevation'), 'Debe tener elevación/sombra');
  assert.ok(stylesContent.includes('position: \'absolute\''), 'Debe posicionarse absolutamente');

  // Integración en MapContainer
  const mapContent = fs.readFileSync(mapContainerPath, 'utf8');
  assert.ok(mapContent.includes('CenterLocationButton'), 'MapContainer debe integrar CenterLocationButton');
  assert.ok(mapContent.includes('<CenterLocationButton'), 'MapContainer debe renderizar el FAB CenterLocationButton');
});

test('MISIÓN 46 - Regla de Oro: Componentes bajo 150 líneas y App.tsx bajo 200 líneas', () => {
  const checks = [
    { file: '../src/components/tripPlanner/TripTimeline.tsx', max: 150 },
    { file: '../src/components/tripPlanner/TripPlanner.tsx', max: 150 },
    { file: '../src/components/ui/LiveArrivalBadge/LiveArrivalBadge.tsx', max: 150 },
    { file: '../src/components/tripPlanner/RouteRecommendationCard.tsx', max: 150 },
    { file: '../src/components/navigation/BottomNavBar/BottomNavBar.tsx', max: 150 },
    { file: '../src/components/map/CenterLocationButton/CenterLocationButton.tsx', max: 150 },
    { file: '../src/components/map/MapContainer/MapContainer.tsx', max: 150 },
    { file: '../App.tsx', max: 200 },
  ];

  for (const { file, max } of checks) {
    const fullPath = path.resolve(__dirname, file);
    assert.ok(fs.existsSync(fullPath), `${file} debe existir`);
    const lineCount = fs.readFileSync(fullPath, 'utf8').split('\n').length;
    assert.ok(
      lineCount <= max,
      `Archivo ${file} tiene ${lineCount} líneas, debe ser <= ${max}`
    );
  }
});
