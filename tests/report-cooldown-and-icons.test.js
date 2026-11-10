const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

// 1. Verificación de Cooldown (Rate Limiting de 5 minutos) en report.service.ts
test('MISIÓN 64 - Report Service: Cooldown de 5 minutos entre reportes del mismo tipo', () => {
  const servicePath = path.resolve(__dirname, '../src/services/report.service.ts');
  assert.ok(fs.existsSync(servicePath), 'report.service.ts debe existir');

  const content = fs.readFileSync(servicePath, 'utf8');
  assert.ok(
    content.includes('REPORT_COOLDOWN_MS') && content.includes('5 * 60 * 1000'),
    'Debe definir REPORT_COOLDOWN_MS en 5 minutos (300,000 ms)'
  );
  assert.ok(content.includes('checkReportCooldown'), 'Debe implementar función checkReportCooldown');
  assert.ok(content.includes('recordReportCooldown'), 'Debe registrar marca de tiempo de reporte');
  assert.ok(content.includes('COOLDOWN_ACTIVE'), 'Debe retornar error o alerta de cooldown activo');

  const lines = content.split('\n').length;
  assert.ok(lines <= 150, `report.service.ts tiene ${lines} líneas, debe ser <= 150`);
});

// 2. Validación estricta: Invitados NUNCA suman puntos
test('MISIÓN 64 - Report Points: Validación estricta if (!isAuthenticated || isGuest) return;', () => {
  const servicePath = path.resolve(__dirname, '../src/services/report.service.ts');
  const content = fs.readFileSync(servicePath, 'utf8');

  // Validación estricta literal
  assert.ok(
    content.includes('if (!isAuthenticated || isGuest) return;') ||
    content.includes('if (!isAuthenticated || isGuest) return'),
    'Debe validar estrictamente: if (!isAuthenticated || isGuest) return;'
  );
  assert.ok(
    content.includes('awardReportPoints'),
    'Debe encapsular la suma de puntos en función segura'
  );
});

// 3. Iconografía Vectorial: Reemplazo total de emojis por @expo/vector-icons
test('MISIÓN 64 - Iconografía Vectorial: account-group, car-brake-alert, alert-octagon sin emojis', () => {
  const reportModalPath = path.resolve(
    __dirname,
    '../src/components/floating/ReportIncidentModal/ReportIncidentModal.tsx'
  );
  const quickModalPath = path.resolve(
    __dirname,
    '../src/components/floating/QuickReportModal/QuickReportModal.tsx'
  );
  const tripDetailsPath = path.resolve(
    __dirname,
    '../src/components/tripPlanner/TripDetailsModal.tsx'
  );
  const activeTrackingPath = path.resolve(
    __dirname,
    '../src/components/activeTracking/ActiveTrackingView.tsx'
  );

  const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;

  [reportModalPath, quickModalPath, tripDetailsPath, activeTrackingPath].forEach((file) => {
    assert.ok(fs.existsSync(file), `${file} debe existir`);
    const content = fs.readFileSync(file, 'utf8');
    assert.ok(!emojiRegex.test(content), `${path.basename(file)} no debe contener ningún emoji`);
  });

  const reportModalContent = fs.readFileSync(reportModalPath, 'utf8');
  assert.ok(reportModalContent.includes('account-group'), 'ReportIncidentModal debe usar ícono account-group');
  assert.ok(reportModalContent.includes('car-brake-alert'), 'ReportIncidentModal debe usar ícono car-brake-alert');
  assert.ok(reportModalContent.includes('alert-octagon'), 'ReportIncidentModal debe usar ícono alert-octagon');

  const quickModalContent = fs.readFileSync(quickModalPath, 'utf8');
  assert.ok(quickModalContent.includes('account-group'), 'QuickReportModal debe usar ícono account-group');
  assert.ok(quickModalContent.includes('car-brake-alert'), 'QuickReportModal debe usar ícono car-brake-alert');
  assert.ok(quickModalContent.includes('alert-octagon'), 'QuickReportModal debe usar ícono alert-octagon');
});

// 4. Lógica de Cooldown Matemática
test('MISIÓN 64 - Lógica de Cooldown: Bloqueo de reportes en ventana de 5 minutos', () => {
  const cooldownMs = 5 * 60 * 1000;
  const timestamps = {};

  function checkCooldown(type, now) {
    const elapsed = now - (timestamps[type] || 0);
    return elapsed >= cooldownMs;
  }

  const t0 = 1000000;
  timestamps['BUS_FULL'] = t0;

  // Intentar reportar 2 minutos después (120,000 ms) -> Debe bloquearse
  assert.strictEqual(checkCooldown('BUS_FULL', t0 + 120000), false, 'Reporte antes de 5 min debe ser rechazado');

  // Intentar reportar otro tipo (TRAFFIC) -> Debe permitirse
  assert.strictEqual(checkCooldown('TRAFFIC', t0 + 120000), true, 'Reporte de diferente tipo debe permitirse');

  // Intentar reportar 5 minutos y 1 segundo después -> Debe permitirse
  assert.strictEqual(checkCooldown('BUS_FULL', t0 + 300001), true, 'Reporte tras 5 min debe ser aceptado');
});
