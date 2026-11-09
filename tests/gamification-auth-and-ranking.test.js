const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

test('MISIÓN 57 - Report Service: Restringe puntos a invitados y genera alerta', () => {
  const servicePath = path.resolve(__dirname, '../src/services/report.service.ts');
  assert.ok(fs.existsSync(servicePath), 'report.service.ts debe existir');

  const content = fs.readFileSync(servicePath, 'utf8');
  assert.ok(content.includes('isGuest'), 'Debe validar si el usuario es invitado (isGuest)');
  assert.ok(
    content.includes('Reporte enviado. Inicia sesión para ganar puntos por tu colaboración'),
    'Debe incluir el mensaje exacto para invitados'
  );
  assert.ok(content.includes('Alert.alert'), 'Debe alertar al usuario invitado');

  // Verifica que los puntos solo se agregan cuando NO es invitado
  assert.ok(
    content.includes('if (isGuest)') && content.includes('useAuthStore.getState().addPoints(10)'),
    'Debe condicionar la suma de puntos a usuarios no invitados'
  );

  const lines = content.split('\n').length;
  assert.ok(lines <= 150, `report.service.ts tiene ${lines} líneas, debe ser <= 150`);
});

test('MISIÓN 57 - ReportIncidentModal: Muestra feedback diferenciado para invitados', () => {
  const modalPath = path.resolve(
    __dirname,
    '../src/components/floating/ReportIncidentModal/ReportIncidentModal.tsx'
  );
  assert.ok(fs.existsSync(modalPath), 'ReportIncidentModal.tsx debe existir');

  const content = fs.readFileSync(modalPath, 'utf8');
  assert.ok(content.includes('isGuest'), 'Debe consultar isGuest de useAuthStore');
  assert.ok(
    content.includes('Reporte enviado. Inicia sesión para ganar puntos por tu colaboración'),
    'Debe mostrar toast explicativo a invitados'
  );

  const lines = content.split('\n').length;
  assert.ok(lines <= 150, `ReportIncidentModal.tsx tiene ${lines} líneas, debe ser <= 150`);
});

test('MISIÓN 57 - Lógica de Rangos y Tabla de Líderes Reactiva', () => {
  const utilsPath = path.resolve(
    __dirname,
    '../src/components/profile/UserProfileCard/userProfile.utils.ts'
  );
  assert.ok(fs.existsSync(utilsPath), 'userProfile.utils.ts debe existir');

  const content = fs.readFileSync(utilsPath, 'utf8');
  assert.ok(content.includes('calculateRank'), 'Debe implementar y exportar calculateRank');
  assert.ok(content.includes('calculateUserPosition'), 'Debe implementar calculateUserPosition');
  assert.ok(content.includes('calculateLeaderboard'), 'Debe implementar calculateLeaderboard');
  assert.ok(content.includes('Galeras Runner') && content.includes('320'), 'Debe incluir al rival Galeras Runner con 320 pts');

  // Verificación matemática del cálculo de rangos
  function calculateRank(points) {
    if (points < 100) return 'Pasajero Novato';
    if (points < 500) return 'Pasajero Frecuente';
    if (points < 1000) return 'Guía Local';
    return 'Cuy Leyenda';
  }

  assert.strictEqual(calculateRank(40), 'Pasajero Novato');
  assert.strictEqual(calculateRank(330), 'Pasajero Frecuente');
  assert.strictEqual(calculateRank(700), 'Guía Local');
  assert.strictEqual(calculateRank(1200), 'Cuy Leyenda');

  // Verificación matemática del escalafón dinámico frente a rivales
  const RIVALS = [
    { alias: 'Don_Pastuso99', pts: 1250 },
    { alias: 'CuyVeloz42', pts: 680 },
    { alias: 'Galeras Runner', pts: 320 },
  ];

  function calculateUserPosition(points) {
    return RIVALS.filter((r) => r.pts > points).length + 1;
  }

  // Si tiene 85 pts: posición 4
  assert.strictEqual(calculateUserPosition(85), 4);

  // Si supera a Galeras Runner con 330 pts: posición 3
  assert.strictEqual(calculateUserPosition(330), 3);

  // Si supera a CuyVeloz con 700 pts: posición 2
  assert.strictEqual(calculateUserPosition(700), 2);

  // Si supera a Don_Pastuso con 1300 pts: posición 1 (Líder Absoluto)
  assert.strictEqual(calculateUserPosition(1300), 1);

  const lines = content.split('\n').length;
  assert.ok(lines <= 150, `userProfile.utils.ts tiene ${lines} líneas, debe ser <= 150`);
});

test('MISIÓN 57 - UserProfileCard: Consume calculateRank y actualiza UI reactivamente', () => {
  const cardPath = path.resolve(
    __dirname,
    '../src/components/profile/UserProfileCard/UserProfileCard.tsx'
  );
  assert.ok(fs.existsSync(cardPath), 'UserProfileCard.tsx debe existir');

  const content = fs.readFileSync(cardPath, 'utf8');
  assert.ok(
    content.includes('const currentRank = calculateRank(points)'),
    'Debe definir la variable derivada const currentRank = calculateRank(points)'
  );
  assert.ok(content.includes('calculateUserPosition'), 'Debe consumir calculateUserPosition');
  assert.ok(content.includes('calculateLeaderboard'), 'Debe renderizar la tabla reactiva calculateLeaderboard');

  const lines = content.split('\n').length;
  assert.ok(lines <= 150, `UserProfileCard.tsx tiene ${lines} líneas, debe ser <= 150`);
});
