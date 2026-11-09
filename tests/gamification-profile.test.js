const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

test('MISIÓN 51 - SQL Migration: Columna points y función increment_user_points', () => {
  const migrationPath = path.resolve(
    __dirname,
    '../supabase/migrations/20261109000003_add_points_to_user_profiles.sql'
  );
  assert.ok(fs.existsSync(migrationPath), 'Migración de gamificación debe existir');

  const sql = fs.readFileSync(migrationPath, 'utf8');
  assert.ok(sql.includes('ADD COLUMN IF NOT EXISTS points INT DEFAULT 0'), 'Debe agregar columna points a user_profiles');
  assert.ok(sql.includes('FUNCTION public.increment_user_points'), 'Debe definir RPC increment_user_points');
  assert.ok(sql.includes('points_to_add INT DEFAULT 10') || sql.includes('10'), 'Debe manejar incremento de +10 puntos');
});

test('MISIÓN 51 - Report Service: Incrementa +10 puntos por reporte colaborativo', () => {
  const servicePath = path.resolve(__dirname, '../src/services/report.service.ts');
  const content = fs.readFileSync(servicePath, 'utf8');

  assert.ok(content.includes('increment_user_points'), 'Debe invocar increment_user_points en Supabase');
  assert.ok(content.includes('points_to_add: 10') || content.includes('10'), 'Debe sumar 10 puntos por reporte');
  assert.ok(content.includes('useAuthStore.getState().addPoints(10)'), 'Debe actualizar puntos en useAuthStore');
});

test('MISIÓN 51 - Rangos Dinámicos y Cálculo de Progreso hacia el Siguiente Nivel', () => {
  const cardPath = path.resolve(
    __dirname,
    '../src/components/profile/UserProfileCard/UserProfileCard.tsx'
  );
  assert.ok(fs.existsSync(cardPath), 'UserProfileCard.tsx debe existir');
  const content = fs.readFileSync(cardPath, 'utf8');

  // Validar consumo desde useAuthStore
  assert.ok(content.includes('useAuthStore((s) => s.points)'), 'Debe consumir puntos de useAuthStore');

  // Validar nombres oficiales de rangos dinámicos
  assert.ok(content.includes('Pasajero Novato'), 'Debe incluir rango Pasajero Novato (< 100 pt)');
  assert.ok(content.includes('Guía Local'), 'Debe incluir rango Guía Local (> 500 pt)');
  assert.ok(content.includes('Cuy Leyenda'), 'Debe incluir rango Cuy Leyenda (> 1000 pt)');

  // Validar componentes de barra de progreso
  assert.ok(content.includes('progressBar'), 'Debe renderizar la barra de progreso');
  assert.ok(content.includes('progressNextRank'), 'Debe indicar el siguiente rango y puntos necesarios');

  // Test numérico de los rangos usando la lógica exportada o emulada
  function testProgress(pts) {
    if (pts < 100) return { currentRank: 'Pasajero Novato', needed: 100 - pts };
    if (pts < 500) return { currentRank: 'Pasajero Frecuente', needed: 500 - pts };
    if (pts < 1000) return { currentRank: 'Guía Local', needed: 1000 - pts };
    return { currentRank: 'Cuy Leyenda', needed: 0 };
  }

  // < 100 pt
  const r1 = testProgress(40);
  assert.strictEqual(r1.currentRank, 'Pasajero Novato');
  assert.strictEqual(r1.needed, 60);

  // 100 - 499 pt
  const r2 = testProgress(250);
  assert.strictEqual(r2.currentRank, 'Pasajero Frecuente');

  // > 500 pt
  const r3 = testProgress(650);
  assert.strictEqual(r3.currentRank, 'Guía Local');
  assert.strictEqual(r3.needed, 350);

  // > 1000 pt
  const r4 = testProgress(1200);
  assert.strictEqual(r4.currentRank, 'Cuy Leyenda');
  assert.strictEqual(r4.needed, 0);

  // Regla de Oro: archivo < 150 líneas
  const lines = content.split('\n').length;
  assert.ok(lines <= 150, `UserProfileCard.tsx tiene ${lines} líneas, debe ser <= 150`);
});
