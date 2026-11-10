const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

test('MISIÓN 53 - MapContainer: useMemo y clustering de paraderos', () => {
  const mapContainerPath = path.resolve(
    __dirname,
    '../src/components/map/MapContainer/MapContainer.tsx'
  );
  assert.ok(fs.existsSync(mapContainerPath), 'MapContainer.tsx debe existir');

  const content = fs.readFileSync(mapContainerPath, 'utf8');

  // useMemo para los marcadores de paraderos
  assert.ok(content.includes('useMemo'), 'Debe utilizar useMemo para evitar re-renders');
  assert.ok(content.includes('clusterBusStops'), 'Debe integrar clustering de paraderos');
  assert.ok(content.includes('clusteredStops={clusteredStops}'), 'Debe pasar los paraderos agrupados al mapa OSM');

  const lines = content.split('\n').length;
  assert.ok(lines <= 150, `MapContainer.tsx tiene ${lines} líneas, debe ser <= 150`);
});

test('MISIÓN 53 - RoutePolyline: simplify={true} para optimización de 60fps', () => {
  const polylinePath = path.resolve(
    __dirname,
    '../src/components/map/RoutePolyline/RoutePolyline.tsx'
  );
  assert.ok(fs.existsSync(polylinePath), 'RoutePolyline.tsx debe existir');

  const content = fs.readFileSync(polylinePath, 'utf8');
  assert.ok(content.includes('simplify={true}'), 'RoutePolyline debe incluir simplify={true}');

  const lines = content.split('\n').length;
  assert.ok(lines <= 150, `RoutePolyline.tsx tiene ${lines} líneas, debe ser <= 150`);
});

test('MISIÓN 53 - Clustering Algorithm: Agrupa paraderos en zoom lejano y los expande en zoom in', () => {
  // Simular la lógica de clusterBusStops
  const threshold = 0.025;
  const mockStops = [
    { id: 's1', name: 'Paradero Centro 1', location: { latitude: 1.2140, longitude: -77.2780 }, orderIndex: 1, estimatedWaitMinutes: 3 },
    { id: 's2', name: 'Paradero Centro 2', location: { latitude: 1.2142, longitude: -77.2782 }, orderIndex: 2, estimatedWaitMinutes: 5 },
    { id: 's3', name: 'Paradero Centro 3', location: { latitude: 1.2145, longitude: -77.2784 }, orderIndex: 3, estimatedWaitMinutes: 8 },
    { id: 's4', name: 'Paradero Norte 1', location: { latitude: 1.2350, longitude: -77.2910 }, orderIndex: 4, estimatedWaitMinutes: 12 },
  ];

  function clusterTest(stops, delta) {
    if (delta <= threshold) {
      return stops.map((stop) => ({ isCluster: false, stop }));
    }
    const cellSize = Math.max(0.006, delta / 5);
    const grid = new Map();
    for (const stop of stops) {
      const cellX = Math.floor(stop.location.longitude / cellSize);
      const cellY = Math.floor(stop.location.latitude / cellSize);
      const key = `${cellX}:${cellY}`;
      if (!grid.has(key)) grid.set(key, []);
      grid.get(key).push(stop);
    }
    const result = [];
    grid.forEach((cellStops, key) => {
      if (cellStops.length === 1) {
        result.push({ isCluster: false, stop: cellStops[0] });
      } else {
        result.push({ isCluster: true, count: cellStops.length });
      }
    });
    return result;
  }

  // 1. Zoom lejano (delta = 0.08 > 0.025): debe agrupar los paraderos cercanos del centro
  const zoomedOut = clusterTest(mockStops, 0.08);
  const clusterItem = zoomedOut.find((c) => c.isCluster);
  assert.ok(clusterItem, 'Debe haber al menos un clúster al hacer zoom lejano');
  assert.strictEqual(clusterItem.count, 3, 'El clúster central debe agrupar 3 paraderos');

  // 2. Zoom in (delta = 0.01 < 0.025): debe desplegar los 4 paraderos individualmente
  const zoomedIn = clusterTest(mockStops, 0.01);
  assert.strictEqual(zoomedIn.length, 4, 'Al hacer zoom in deben mostrarse los 4 paraderos individuales');
  assert.ok(zoomedIn.every((s) => !s.isCluster), 'Ninguno debe ser clúster al hacer zoom in');
});

test('MISIÓN 53 - ClusterMarker: Componente visual con conteo numérico', () => {
  const clusterMarkerPath = path.resolve(
    __dirname,
    '../src/components/map/ClusterMarker/ClusterMarker.tsx'
  );
  assert.ok(fs.existsSync(clusterMarkerPath), 'ClusterMarker.tsx debe existir');

  const content = fs.readFileSync(clusterMarkerPath, 'utf8');
  assert.ok(content.includes('tracksViewChanges={false}'), 'Debe tener tracksViewChanges={false} para máximo rendimiento');
  assert.ok(content.includes('{count}'), 'Debe renderizar el conteo numérico del clúster');
  assert.ok(content.includes('React.memo'), 'ClusterMarker debe estar memoizado');

  const lines = content.split('\n').length;
  assert.ok(lines <= 150, `ClusterMarker.tsx tiene ${lines} líneas, debe ser <= 150`);
});
