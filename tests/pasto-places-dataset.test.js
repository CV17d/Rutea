const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const places = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/constants/places/pastoPlaces.json'), 'utf8'));
const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

test('Base de lugares de Pasto (OpenStreetMap): barrios, veredas y sitios dentro de la ciudad', () => {
  assert.ok(places.length > 800, `Debe tener cientos de lugares (tiene ${places.length})`);
  const barrios = places.filter((p) => p.t === 'barrio');
  assert.ok(barrios.length > 300, `Debe incluir los barrios de Pasto (tiene ${barrios.length})`);
  for (const name of ['tamasagra', 'chambu', 'pandiaco', 'anganoy', 'mijitayo', 'lorenzo']) {
    assert.ok(places.some((p) => norm(p.n).includes(name)), `Debe encontrar "${name}"`);
  }
  for (const p of places) {
    assert.ok(p.n && p.t, 'Cada lugar tiene nombre y tipo');
    assert.ok(p.a > 1.12 && p.a < 1.28 && p.o > -77.36 && p.o < -77.2, `${p.n} debe estar dentro de Pasto`);
  }
});

test('Planificador: resuelve lugares de la base y sugiere mientras se escribe', () => {
  const svc = fs.readFileSync(path.join(ROOT, 'src/services/tripRecommendation.service.ts'), 'utf8');
  assert.ok(svc.includes('findPastoPlace'), 'resolvePastoLocation debe consultar la base de lugares');
  const planner = fs.readFileSync(path.join(ROOT, 'src/components/tripPlanner/TripPlanner.tsx'), 'utf8');
  assert.ok(planner.includes('<PlaceSuggestions'), 'El planificador debe mostrar sugerencias de lugares');
  assert.ok(planner.includes('No encontramos'), 'Debe avisar claramente cuando un lugar no existe en Pasto');
});
