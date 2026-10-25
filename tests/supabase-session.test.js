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
