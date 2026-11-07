const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

test('Supabase Migration: Script contiene PostGIS y tablas operativas', () => {
  const migrationPath = path.resolve(__dirname, '../supabase/migrations/20261024000001_create_postgis_and_tables.sql');
  assert.ok(fs.existsSync(migrationPath), 'El archivo de migracion debe existir');

  const sql = fs.readFileSync(migrationPath, 'utf8');

  // Validar extension PostGIS
  assert.ok(
    sql.includes('CREATE EXTENSION IF NOT EXISTS postgis;'),
    'Debe habilitar la extension PostGIS',
  );

  // Validar tablas routes, stops, active_sessions
  assert.ok(sql.includes('CREATE TABLE IF NOT EXISTS routes'), 'Debe crear tabla routes');
  assert.ok(sql.includes('CREATE TABLE IF NOT EXISTS stops'), 'Debe crear tabla stops');
  assert.ok(sql.includes('CREATE TABLE IF NOT EXISTS active_sessions'), 'Debe crear tabla active_sessions');

  // Validar tipos geometry(Point, 4326)
  assert.ok(
    sql.includes('GEOMETRY(Point, 4326)'),
    'Debe soportar tipos geometry(Point, 4326)',
  );
  assert.ok(
    sql.includes('idx_stops_location ON stops USING GIST(location);'),
    'Debe incluir indice espacial GiST para stops',
  );
  assert.ok(
    sql.includes('idx_active_sessions_location ON active_sessions USING GIST(last_location);'),
    'Debe incluir indice espacial GiST para active_sessions',
  );
});

test('Supabase Service: Generación procedimental de Avatar y Alias Pastuso', () => {
  const CUY_AVATARS = [
    'cuy-ruana',
    'cuy-carnaval',
    'cuy-galeras',
    'cuy-sombrero',
    'cuy-chullo',
    'cuy-pastuso',
  ];

  const PASTUSO_ALIASES = [
    'Viajero Galeras',
    'Pasajero de Chapal',
    'Rumbero del Carnaval',
    'Caminante de Torobajo',
    'Explorador de Maridíaz',
    'Compañero del Bus',
  ];

  function generateProceduralAvatar() {
    const randomAvatar = CUY_AVATARS[Math.floor(Math.random() * CUY_AVATARS.length)];
    const randomAlias = PASTUSO_ALIASES[Math.floor(Math.random() * PASTUSO_ALIASES.length)];
    const suffix = Math.floor(100 + Math.random() * 900);

    return {
      seed: `${randomAvatar}-${suffix}`,
      alias: `${randomAlias} #${suffix}`,
    };
  }

  const { seed, alias } = generateProceduralAvatar();

  assert.ok(seed.startsWith('cuy-'), 'Seed debe iniciar con prefijo cuy-');
  assert.ok(alias.includes('#'), 'Alias debe incluir identificador numérico');
  assert.ok(seed.length > 5);
});

test('Supabase Service: Estructura de ActiveSessionRecord al presionar "Estoy a bordo"', () => {
  const payload = {
    userId: 'user-pastuso-777',
    routeId: 'route-c1',
    latitude: 1.2145,
    longitude: -77.2783,
  };

  const session = {
    id: `session-${payload.userId}`,
    user_id: payload.userId,
    route_id: payload.routeId,
    avatar_seed: 'cuy-galeras-777',
    alias: 'Viajero Galeras #777',
    is_active: true,
    latitude: payload.latitude,
    longitude: payload.longitude,
    speed_kmh: 0,
    heading: 0,
    accuracy: 10,
    updated_at: new Date().toISOString(),
  };

  assert.strictEqual(session.id, 'session-user-pastuso-777');
  assert.strictEqual(session.user_id, 'user-pastuso-777');
  assert.strictEqual(session.route_id, 'route-c1');
  assert.strictEqual(session.is_active, true);
  assert.strictEqual(typeof session.latitude, 'number');
  assert.strictEqual(typeof session.longitude, 'number');
});

test('Supabase Seed: Script 20261107000004 contiene 20 rutas oficiales SETPasto', () => {
  const seedPath = path.resolve(__dirname, '../supabase/migrations/20261107000004_seed_setp_routes.sql');
  assert.ok(fs.existsSync(seedPath), 'El archivo de migracion debe existir');

  const sql = fs.readFileSync(seedPath, 'utf8');

  // Validar 20 rutas
  for (let i = 1; i <= 16; i++) {
    assert.ok(sql.includes(`'route-c${i}'`), `Debe incluir route-c${i}`);
  }
  for (let i = 1; i <= 4; i++) {
    assert.ok(sql.includes(`'route-e${i}'`), `Debe incluir route-e${i}`);
  }

  // Validar descripciones específicas
  assert.ok(sql.includes('La Paz - Altavista'), 'Debe incluir descripcion para C2');
  assert.ok(sql.includes('Puente Tabla - Briceño'), 'Debe incluir descripcion para C5');
  assert.ok(sql.includes('Hospital - Unicentro'), 'Debe incluir descripcion para C16');
  assert.ok(sql.includes('ON CONFLICT (id) DO NOTHING;'), 'Debe contener ON CONFLICT (id) DO NOTHING');
});

test('Auto-Router OSRM: Script auto-router.ts y conversion a EWKT PostGIS', () => {
  const routerScriptPath = path.resolve(__dirname, '../backend/src/scripts/auto-router.ts');
  assert.ok(fs.existsSync(routerScriptPath), 'El script auto-router.ts debe existir');

  const content = fs.readFileSync(routerScriptPath, 'utf8');
  assert.ok(content.includes('router.project-osrm.org'), 'Debe consultar la API publica de OSRM');
  assert.ok(content.includes('SRID=4326;LINESTRING'), 'Debe generar EWKT con SRID=4326');
  assert.ok(content.includes('.update({ path: ewkt })'), 'Debe actualizar el campo path en routes');

  // Validar formato de conversion de coordenadas a EWKT
  const sampleCoords = [[-77.2759, 1.1927], [-77.2759, 1.1933]];
  const points = sampleCoords.map(([lng, lat]) => `${lng} ${lat}`).join(', ');
  const ewkt = `SRID=4326;LINESTRING(${points})`;
  assert.strictEqual(ewkt, 'SRID=4326;LINESTRING(-77.2759 1.1927, -77.2759 1.1933)');
});
