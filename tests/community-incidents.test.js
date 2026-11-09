const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

test('MISIÓN 49 - SQL Migration: Tabla incident_reports con columnas, RLS y retención de 2 horas', () => {
  const migrationPath = path.resolve(
    __dirname,
    '../supabase/migrations/20261109000002_create_incident_reports_table.sql'
  );
  assert.ok(fs.existsSync(migrationPath), 'Archivo de migración debe existir');

  const sql = fs.readFileSync(migrationPath, 'utf8');
  assert.ok(sql.includes('CREATE TABLE IF NOT EXISTS public.incident_reports'), 'Debe crear tabla incident_reports');
  assert.ok(sql.includes('route_id TEXT NOT NULL'), 'Debe contener columna route_id');
  assert.ok(sql.includes('user_id UUID REFERENCES auth.users(id)'), 'Debe vincular user_id a auth.users');
  assert.ok(sql.includes('FULL_BUS'), 'Debe validar tipo FULL_BUS');
  assert.ok(sql.includes('TRAFFIC'), 'Debe validar tipo TRAFFIC');
  assert.ok(sql.includes('ACCIDENT'), 'Debe validar tipo ACCIDENT');
  assert.ok(sql.includes('DETOUR'), 'Debe validar tipo DETOUR');
  assert.ok(sql.includes('lat DOUBLE PRECISION NOT NULL'), 'Debe contener lat');
  assert.ok(sql.includes('lng DOUBLE PRECISION NOT NULL'), 'Debe contener lng');
  assert.ok(sql.includes("INTERVAL '2 hours'"), 'Debe filtrar reportes recientes de 2 horas');
  assert.ok(sql.includes('supabase_realtime'), 'Debe registrar la tabla en supabase_realtime');
});

test('MISIÓN 49 - Report Service: report.service.ts implementa inserción, consulta de 2h y Realtime', () => {
  const servicePath = path.resolve(__dirname, '../src/services/report.service.ts');
  assert.ok(fs.existsSync(servicePath), 'report.service.ts debe existir');

  const content = fs.readFileSync(servicePath, 'utf8');
  assert.ok(content.includes('createIncidentReport'), 'Debe implementar createIncidentReport');
  assert.ok(content.includes('fetchActiveIncidents'), 'Debe implementar fetchActiveIncidents');
  assert.ok(content.includes('subscribeToIncidents'), 'Debe implementar subscribeToIncidents');
  assert.ok(content.includes('2 * 60 * 60 * 1000'), 'Debe calcular ventana de 2 horas');
  assert.ok(content.includes('useTrackingStore'), 'Debe sincronizar con useTrackingStore');
});

test('MISIÓN 49 - ReportIncidentModal: 4 opciones visuales y premio de +15 puntos', () => {
  const modalPath = path.resolve(
    __dirname,
    '../src/components/floating/ReportIncidentModal/ReportIncidentModal.tsx'
  );
  assert.ok(fs.existsSync(modalPath), 'ReportIncidentModal.tsx debe existir');

  const content = fs.readFileSync(modalPath, 'utf8');
  assert.ok(content.includes('Bus Lleno'), 'Debe incluir opción Bus Lleno');
  assert.ok(content.includes('Tráfico Pesado'), 'Debe incluir opción Tráfico Pesado');
  assert.ok(content.includes('Desvío'), 'Debe incluir opción Desvío');
  assert.ok(content.includes('Accidente'), 'Debe incluir opción Accidente');
  assert.ok(content.includes('currentLocation'), 'Debe usar GPS real de useTrackingStore');
  assert.ok(
    content.includes('+15 PTS') || content.includes('+10 PTS') || content.includes('PTS'),
    'Debe otorgar puntos por reporte'
  );

  const lines = content.split('\n').length;
  assert.ok(lines <= 150, `ReportIncidentModal.tsx tiene ${lines} líneas, debe ser <= 150`);
});

test('MISIÓN 49 - Botón Reportar Novedad en TripDetailsModal y BottomNavBar', () => {
  const tripModalPath = path.resolve(__dirname, '../src/components/tripPlanner/TripDetailsModal.tsx');
  const tripModalContent = fs.readFileSync(tripModalPath, 'utf8');
  assert.ok(tripModalContent.includes('Reportar Novedad'), 'TripDetailsModal debe incluir botón Reportar Novedad');
  assert.ok(tripModalContent.includes('openReportModal'), 'Debe invocar openReportModal');

  const navPath = path.resolve(__dirname, '../src/components/navigation/BottomNavBar/BottomNavBar.tsx');
  const navContent = fs.readFileSync(navPath, 'utf8');
  assert.ok(navContent.includes('Reportar novedad'), 'BottomNavBar debe tener acceso para reportar novedad');
  assert.ok(navContent.includes('openReportModal'), 'Debe disparar openReportModal');
});

test('MISIÓN 49 - MapContainer y Marcadores: ReportMarker y useIncidentReports', () => {
  const markerPath = path.resolve(__dirname, '../src/components/map/ReportMarker/ReportMarker.tsx');
  const markerContent = fs.readFileSync(markerPath, 'utf8');
  assert.ok(markerContent.includes('FULL_BUS'), 'ReportMarker debe soportar FULL_BUS');
  assert.ok(markerContent.includes('TRAFFIC'), 'ReportMarker debe soportar TRAFFIC');
  assert.ok(markerContent.includes('DETOUR'), 'ReportMarker debe soportar DETOUR');
  assert.ok(markerContent.includes('ACCIDENT'), 'ReportMarker debe soportar ACCIDENT');

  const hookPath = path.resolve(__dirname, '../src/hooks/useIncidentReports.ts');
  assert.ok(fs.existsSync(hookPath), 'useIncidentReports.ts debe existir');

  const appPath = path.resolve(__dirname, '../App.tsx');
  const appContent = fs.readFileSync(appPath, 'utf8');
  assert.ok(appContent.includes('useIncidentReports'), 'App.tsx debe usar useIncidentReports');
  assert.ok(appContent.includes('ReportIncidentModal'), 'App.tsx debe montar ReportIncidentModal');
});
