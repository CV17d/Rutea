import { StyleSheet } from 'react-native';

// Colores dinámicos desde la paleta "Galeras" en el componente.
export const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 22,
    borderWidth: 1,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.22,
    shadowRadius: 22,
    elevation: 8,
  },
  codeTile: { width: 54, height: 54, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  codeText: { color: '#ffffff', fontSize: 19, fontWeight: '900', letterSpacing: -0.5 },
  infoCol: { flex: 1 },
  routeTitle: { fontSize: 18, fontWeight: '800', letterSpacing: -0.4 },
  routeDesc: { fontSize: 13, fontWeight: '500', marginTop: 1 },
  liveRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  liveDot: { width: 7, height: 7, borderRadius: 4 },
  liveText: { fontSize: 12, fontWeight: '700' },
  etaCol: { alignItems: 'flex-end', minWidth: 56 },
  etaNumber: { fontSize: 34, fontWeight: '800', letterSpacing: -1.2, lineHeight: 36, fontVariant: ['tabular-nums'] },
  etaLabel: { fontSize: 11, fontWeight: '700', marginTop: -1 },
});
