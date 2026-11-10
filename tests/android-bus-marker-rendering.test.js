const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

test('MISIÓN 62 - LiveBusMarker: Estructura cenital sin punto verde/halo ETA interferente', () => {
  const markerPath = path.resolve(
    __dirname,
    '../src/components/map/LiveBusMarker/LiveBusMarker.tsx'
  );
  assert.ok(fs.existsSync(markerPath), 'LiveBusMarker.tsx debe existir');

  const content = fs.readFileSync(markerPath, 'utf8');

  // El diseño del bus debe estar explícito dentro de Animated.View con rotación
  assert.ok(
    content.includes('Animated.View') && content.includes('transform: [{ rotate: spin }]'),
    'Debe envolver el diseño en Animated.View con transform [{ rotate: spin }]'
  );

  // Cuerpo del microbús
  assert.ok(content.includes('styles.busBody'), 'Debe renderizar styles.busBody');
  assert.ok(content.includes('bus.routeColor'), 'Debe aplicar el color de la ruta al cuerpo');

  // Parabrisas superior oscuro
  assert.ok(content.includes('styles.windshield'), 'Debe contener el parabrisas');

  // Remoción del halo/punto verde interferente
  assert.ok(!content.includes('emeraldHalo'), 'No debe incluir el halo verde de interferencia en el marcador');

  const lines = content.split('\n').length;
  assert.ok(lines <= 150, `LiveBusMarker.tsx tiene ${lines} líneas, debe ser <= 150`);
});

test('MISIÓN 62 - LiveBusMarker.styles: Dimensiones y propiedades exactas de cuerpo y parabrisas', () => {
  const stylesPath = path.resolve(
    __dirname,
    '../src/components/map/LiveBusMarker/LiveBusMarker.styles.ts'
  );
  assert.ok(fs.existsSync(stylesPath), 'LiveBusMarker.styles.ts debe existir');

  const content = fs.readFileSync(stylesPath, 'utf8');

  // Cuerpo del bus (width: 22, height: 48, borderRadius: 6, elevation: 4)
  assert.ok(content.includes('width: 22'), 'busBody debe tener width: 22');
  assert.ok(content.includes('height: 48'), 'busBody debe tener height: 48');
  assert.ok(content.includes('borderRadius: 6'), 'busBody debe tener borderRadius: 6');
  assert.ok(content.includes('elevation: 4'), 'busBody debe tener elevation: 4');

  // Parabrisas (width: '100%', height: 10, rgba(0,0,0,0.7), borderTopLeftRadius: 6, borderTopRightRadius: 6)
  assert.ok(content.includes("width: '100%'"), 'windshield debe ocupar el 100%');
  assert.ok(content.includes('height: 10'), 'windshield debe tener height: 10');
  assert.ok(
    content.includes("backgroundColor: 'rgba(0, 0, 0, 0.7)'"),
    'windshield debe tener fondo rgba(0, 0, 0, 0.7)'
  );
  assert.ok(
    content.includes('borderTopLeftRadius: 6') && content.includes('borderTopRightRadius: 6'),
    'windshield debe tener esquinas superiores con radio 6'
  );

  const lines = content.split('\n').length;
  assert.ok(lines <= 150, `LiveBusMarker.styles.ts tiene ${lines} líneas, debe ser <= 150`);
});
