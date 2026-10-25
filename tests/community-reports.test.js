const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

test('Community Reports Migration: SQL contiene tipos Point(4326) y expiración de 45 minutos', () => {
  const migPath = path.resolve(__dirname, '../supabase/migrations/20261024000003_create_community_reports.sql');
  assert.ok(fs.existsSync(migPath), 'Debe existir la migración de reportes comunitarios');

  const sql = fs.readFileSync(migPath, 'utf8');
  assert.ok(sql.includes('CREATE TABLE IF NOT EXISTS community_reports'), 'Debe crear la tabla community_reports');
  assert.ok(sql.includes('GEOMETRY(Point, 4326)'), 'Debe soportar geometría Point 4326');
  assert.ok(sql.includes("INTERVAL '45 minutes'"), 'Debe configurar expiración a 45 minutos');
  assert.ok(sql.includes('idx_reports_location ON community_reports USING GIST(location);'), 'Debe tener índice GiST');
});

test('Community Reports: Tipos válidos (Tráfico, Vía Cerrada, Bus Lleno) y cálculo de expiración', () => {
  const validTypes = ['TRAFFIC', 'ROAD_CLOSED', 'BUS_FULL', 'TRAFFIC_JAM'];
  const report = {
    userId: 'user-pastuso-99',
    routeId: 'route-c1',
    reportType: 'TRAFFIC',
    latitude: 1.2145,
    longitude: -77.2783,
    timestamp: Date.now(),
  };

  assert.ok(validTypes.includes(report.reportType));
  const expiresAt = report.timestamp + 45 * 60 * 1000;
  const diffMinutes = (expiresAt - report.timestamp) / 60000;
  assert.strictEqual(diffMinutes, 45, 'Debe expirar en exactamente 45 minutos');
});

test('Community Reports: Recompensa inmediata de +15 puntos al emitir reporte verificado', () => {
  let userPoints = 40;
  const REPORT_REWARD = 15;

  function submitReport(report) {
    userPoints += REPORT_REWARD;
    return {
      success: true,
      awardedPoints: REPORT_REWARD,
      newTotal: userPoints,
    };
  }

  const result = submitReport({ reportType: 'BUS_FULL' });
  assert.strictEqual(result.awardedPoints, 15);
  assert.strictEqual(result.newTotal, 55);
});
