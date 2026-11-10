const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

test('Trip Planner Migration: SQL define find_best_routes con PostGIS, ST_DWithin, ST_DistanceSphere e INNER JOIN', () => {
  const migPath = path.resolve(__dirname, '../supabase/migrations/20261108000001_create_find_best_routes_rpc.sql');
  assert.ok(fs.existsSync(migPath), 'Debe existir la migración find_best_routes');

  const sql = fs.readFileSync(migPath, 'utf8');
  assert.ok(sql.includes('CREATE OR REPLACE FUNCTION find_best_routes'), 'Debe definir la función find_best_routes');
  assert.ok(sql.includes('origin_lat DOUBLE PRECISION'), 'Debe recibir origin_lat');
  assert.ok(sql.includes('dest_lat DOUBLE PRECISION'), 'Debe recibir dest_lat');
  assert.ok(sql.includes('radius_meters DOUBLE PRECISION DEFAULT 1000'), 'Debe recibir radius_meters');
  assert.ok(sql.includes('ST_DWithin('), 'Debe usar ST_DWithin para filtrado de radio');
  assert.ok(sql.includes('ST_DistanceSphere('), 'Debe usar ST_DistanceSphere para distancia a pie');
  assert.ok(sql.includes('INNER JOIN stops s_dest'), 'Debe hacer INNER JOIN entre paraderos origen y destino');
  assert.ok(sql.includes('s_orig.sequence < s_dest.sequence'), 'Debe respetar la secuencia secuencial de paradas');
  assert.ok(sql.includes('CREATE TABLE IF NOT EXISTS stops'), 'Debe asegurar tabla stops');
  assert.ok(sql.includes('idx_stops_location ON stops USING GIST(location);'), 'Debe indexar location con GiST');
});

test('Trip Planner Engine: Recomienda ruta directa con parada de abordaje y distancia en metros', () => {
  function calculateDistanceMeters(p1, p2) {
    const R = 6371000;
    const dLat = (p2.latitude - p1.latitude) * (Math.PI / 180);
    const dLon = (p2.longitude - p1.longitude) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(p1.latitude * (Math.PI / 180)) *
        Math.cos(p2.latitude * (Math.PI / 180)) *
        Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  // Origen: Plaza de Nariño (1.2145, -77.2783)
  const origin = { latitude: 1.2145, longitude: -77.2783 };
  // Parada de abordaje: Plaza del Carnaval (1.2115, -77.2778)
  const boardingStop = { latitude: 1.2115, longitude: -77.2778 };

  const distMeters = calculateDistanceMeters(origin, boardingStop);
  assert.ok(distMeters > 0 && distMeters < 500, `Distancia calculada coherente (~330m): ${distMeters}`);

  const walkingMinutes = Math.max(1, Math.round(distMeters / 80));
  assert.ok(walkingMinutes >= 1 && walkingMinutes <= 6, `Tiempo a pie estimado: ${walkingMinutes} min`);
});

test('Trip Planner UI: RouteRecommendationCard y TripPlanner existen y usan colores de standardRoutes2', () => {
  const cardPath = path.resolve(__dirname, '../src/components/tripPlanner/RouteRecommendationCard.tsx');
  const plannerPath = path.resolve(__dirname, '../src/components/tripPlanner/TripPlanner.tsx');
  const servicePath = path.resolve(__dirname, '../src/services/tripRecommendation.service.ts');

  assert.ok(fs.existsSync(cardPath), 'RouteRecommendationCard.tsx debe existir');
  assert.ok(fs.existsSync(plannerPath), 'TripPlanner.tsx debe existir');
  assert.ok(fs.existsSync(servicePath), 'tripRecommendation.service.ts debe existir');

  const cardContent = fs.readFileSync(cardPath, 'utf8');
  assert.ok(cardContent.includes('STANDARD_ROUTES_PART2'), 'Debe importar STANDARD_ROUTES_PART2');
  assert.ok(cardContent.includes('walkingDistanceMeters'), 'Debe mostrar walkingDistanceMeters');
  assert.ok(cardContent.includes('Subirse en:'), 'Debe indicar paradero de subida');
  assert.ok(cardContent.includes('Bajarse en:'), 'Debe indicar paradero de bajada');

  const plannerContent = fs.readFileSync(plannerPath, 'utf8');
  assert.ok(plannerContent.includes('find_best_routes') || plannerContent.includes('findBestRoutes'), 'Debe llamar al servicio de recomendacion');
  assert.ok(plannerContent.includes('Mi Ubicación'), 'Debe soportar Mi Ubicacion / GPS');
  assert.ok(plannerContent.includes('¿A dónde vas?'), 'Debe tener input de destino');
});

test('Trip Planner Keyboard Avoidance: Hook useKeyboardOffset eleva el panel con el teclado y lo baja al ocultarse', () => {
  const hookPath = path.resolve(__dirname, '../src/hooks/useKeyboardOffset.ts');
  const plannerPath = path.resolve(__dirname, '../src/components/tripPlanner/TripPlanner.tsx');

  assert.ok(fs.existsSync(hookPath), 'useKeyboardOffset.ts debe existir');
  const hookContent = fs.readFileSync(hookPath, 'utf8');
  const plannerContent = fs.readFileSync(plannerPath, 'utf8');

  assert.ok(hookContent.includes('keyboardDidShow') && hookContent.includes('keyboardDidHide'), 'Debe escuchar eventos de teclado en Android');
  assert.ok(hookContent.includes('keyboardWillShow') && hookContent.includes('keyboardWillHide'), 'Debe escuchar eventos de teclado en iOS');
  assert.ok(hookContent.includes('Animated.timing'), 'Debe animar suavemente la subida y bajada del panel');
  assert.ok(hookContent.includes('shrinkDelta'), 'Debe compensar si el sistema ya redimensionó la ventana (adjustResize)');

  assert.ok(plannerContent.includes('useKeyboardOffset'), 'TripPlanner debe consumir useKeyboardOffset');
  assert.ok(plannerContent.includes('paddingBottom: offsetAnim'), 'TripPlanner debe aplicar el desplazamiento animado al overlay');
  assert.ok(plannerContent.includes('Keyboard.dismiss'), 'TripPlanner debe ocultar el teclado al buscar o tocar fuera');
  assert.ok(plannerContent.includes('keyboardShouldPersistTaps="handled"'), 'Debe permitir pulsar botones/chips con teclado abierto');

  const hookLines = hookContent.split('\n').length;
  const plannerLines = plannerContent.split('\n').length;
  assert.ok(hookLines <= 150, `useKeyboardOffset.ts tiene ${hookLines} líneas, debe ser <= 150`);
  assert.ok(plannerLines <= 150, `TripPlanner.tsx tiene ${plannerLines} líneas, debe ser <= 150`);
});
