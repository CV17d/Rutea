const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

test('TripTimeline Component: Contiene 3 fases/nodos visuales (caminata, bus y llegada)', () => {
  const timelinePath = path.resolve(__dirname, '../src/components/tripPlanner/TripTimeline.tsx');
  const stylesPath = path.resolve(__dirname, '../src/components/tripPlanner/TripTimeline.styles.ts');

  assert.ok(fs.existsSync(timelinePath), 'TripTimeline.tsx debe existir');
  assert.ok(fs.existsSync(stylesPath), 'TripTimeline.styles.ts debe existir');

  const content = fs.readFileSync(timelinePath, 'utf8');

  // Nodo 1: Caminata inicial
  assert.ok(content.includes('Camina'), 'Debe incluir instrucción de caminata');
  assert.ok(content.includes('metros hasta el paradero'), 'Debe indicar distancia en metros a pie');
  assert.ok(content.includes('walkCircle'), 'Debe tener círculo con ícono de peatón');

  // Nodo 2: Trayecto en Bus
  assert.ok(content.includes('busCircle'), 'Debe tener círculo con ícono de bus');
  assert.ok(content.includes('LiveArrivalBadge'), 'Debe incluir el badge de ETA en vivo');
  assert.ok(content.includes('Viaja durante'), 'Debe indicar conteo de paradas intermedias');
  assert.ok(content.includes('isStopsExpanded'), 'Debe soportar lista colapsable/expandible');

  // Nodo 3: Llegada a destino
  assert.ok(content.includes('destCircle'), 'Debe tener círculo de llegada');
  assert.ok(content.includes('Bájate en'), 'Debe indicar paradero de destino final');
});

test('TripDetailsModal: Bottom Sheet expansible con TripTimeline y botón CTA', () => {
  const modalPath = path.resolve(__dirname, '../src/components/tripPlanner/TripDetailsModal.tsx');
  const modalStylesPath = path.resolve(__dirname, '../src/components/tripPlanner/TripDetailsModal.styles.ts');

  assert.ok(fs.existsSync(modalPath), 'TripDetailsModal.tsx debe existir');
  assert.ok(fs.existsSync(modalStylesPath), 'TripDetailsModal.styles.ts debe existir');

  const modalContent = fs.readFileSync(modalPath, 'utf8');
  assert.ok(modalContent.includes('TripTimeline'), 'Debe renderizar TripTimeline');
  assert.ok(modalContent.includes('Ver Ruta en el Mapa'), 'Debe contener botón CTA para ver en mapa');
  assert.ok(modalContent.includes('dragHandle'), 'Debe tener dragHandle para apariencia moderna de Bottom Sheet');
  assert.ok(modalContent.includes('STANDARD_ROUTES_PART2'), 'Debe extraer colores oficiales');
});

test('TripPlanner Integration: Conecta TripDetailsModal al seleccionar recomendación', () => {
  const plannerPath = path.resolve(__dirname, '../src/components/tripPlanner/TripPlanner.tsx');
  const plannerContent = fs.readFileSync(plannerPath, 'utf8');

  assert.ok(plannerContent.includes('TripDetailsModal'), 'Debe importar TripDetailsModal');
  assert.ok(plannerContent.includes('selectedRec'), 'Debe manejar estado de recomendación seleccionada');
  assert.ok(plannerContent.includes('onSelectRoute={handleConfirmRoute}'), 'Debe confirmar y seleccionar ruta en mapa');
});
