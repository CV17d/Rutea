const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

test('MISIÓN 60 - LiveBusMarker.styles: Proporciones cenitales realistas (20x46, radio 4, elevación 4)', () => {
  const stylesPath = path.resolve(
    __dirname,
    '../src/components/map/LiveBusMarker/LiveBusMarker.styles.ts'
  );
  assert.ok(fs.existsSync(stylesPath), 'LiveBusMarker.styles.ts debe existir');

  const content = fs.readFileSync(stylesPath, 'utf8');

  // Proporciones rectangulares del chasis
  assert.ok(content.includes('width: 20'), 'Chasis debe tener ancho 20');
  assert.ok(content.includes('height: 46'), 'Chasis debe tener alto 46');
  assert.ok(content.includes('borderRadius: 4'), 'Chasis debe tener radio de curvatura 4');

  // Relieve y volumen espacial (sombra y elevación)
  assert.ok(content.includes('elevation: 4'), 'Chasis debe tener elevation 4');
  assert.ok(content.includes('borderWidth: 1'), 'Chasis debe tener borde de 1px');
  assert.ok(content.includes("borderColor: 'rgba(0, 0, 0, 0.1)'"), 'Chasis debe tener borde semitransparente');

  // Parabrisas superior oscuro
  assert.ok(content.includes("width: '100%'"), 'Parabrisas debe ocupar el 100% del ancho');
  assert.ok(content.includes('height: 8'), 'Parabrisas debe tener altura de 8px');
  assert.ok(
    content.includes("backgroundColor: 'rgba(0, 0, 0, 0.6)'"),
    'Parabrisas debe ser oscuro rgba(0, 0, 0, 0.6)'
  );
  assert.ok(
    content.includes('borderTopLeftRadius: 4') && content.includes('borderTopRightRadius: 4'),
    'Parabrisas debe tener borde superior redondeado'
  );

  const lines = content.split('\n').length;
  assert.ok(lines <= 150, `LiveBusMarker.styles.ts tiene ${lines} líneas, debe ser <= 150`);
});

test('MISIÓN 60 - LiveBusMarker.tsx: Estructura cenital con rotación angular y trompa definida', () => {
  const markerPath = path.resolve(
    __dirname,
    '../src/components/map/LiveBusMarker/LiveBusMarker.tsx'
  );
  assert.ok(fs.existsSync(markerPath), 'LiveBusMarker.tsx debe existir');

  const content = fs.readFileSync(markerPath, 'utf8');

  // Envoltorio rotacional angular para orientación precisa
  assert.ok(
    content.includes('transform: [{ rotate: spin }]'),
    'Debe rotar el vehículo con spin angular según el rumbo'
  );
  assert.ok(
    content.includes('bus.routeColor'),
    'Fondo del bus debe colorearse con el color de la ruta'
  );

  // Jerarquía visual cenital: parabrisas, luces y techo
  assert.ok(content.includes('styles.windshield'), 'Debe renderizar el parabrisas');
  assert.ok(content.includes('styles.roofCenter'), 'Debe renderizar la zona de techo');
  assert.ok(content.includes('styles.frontLightsRow'), 'Debe incluir luces frontales');
  assert.ok(content.includes('styles.rearLightsRow'), 'Debe incluir luces traseras');

  const lines = content.split('\n').length;
  assert.ok(lines <= 150, `LiveBusMarker.tsx tiene ${lines} líneas, debe ser <= 150`);
});
