import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  card: { borderRadius: 20, padding: 16, marginBottom: 12, borderWidth: 1 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  codeBadge: { width: 46, height: 46, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  codeText: { color: '#ffffff', fontSize: 16, fontWeight: '900', letterSpacing: -0.3 },
  titleCol: { flex: 1 },
  bestTag: { fontSize: 12, fontWeight: '800', marginBottom: 1 },
  routeName: { fontSize: 16, fontWeight: '800', letterSpacing: -0.3 },
  routeDesc: { fontSize: 13, fontWeight: '500', marginTop: 1 },
  totalCol: { alignItems: 'flex-end' },
  totalValue: { fontSize: 30, fontWeight: '800', letterSpacing: -1, lineHeight: 32, fontVariant: ['tabular-nums'] },
  totalUnit: { fontSize: 12, fontWeight: '700', marginTop: -2 },
  legBar: { flexDirection: 'row', gap: 3, height: 6, marginBottom: 8 },
  leg: { borderRadius: 3 },
  legLabels: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  legLabel: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legText: { fontSize: 12, fontWeight: '700', fontVariant: ['tabular-nums'] },
  itineraryBox: { borderTopWidth: 1, paddingTop: 12, marginBottom: 12, gap: 6 },
  stopName: { fontSize: 13, fontWeight: '600' },
  // Conservados para compatibilidad con otras vistas
  walkingText: { fontSize: 12, fontWeight: '600' },
});
