import { StyleSheet } from 'react-native';

// Colores dinámicos desde la paleta "Galeras" en el componente.
export const styles = StyleSheet.create({
  container: { paddingVertical: 4 },
  stepRow: { flexDirection: 'row', gap: 14 },
  leftCol: { alignItems: 'center', width: 40 },
  iconCircle: { width: 40, height: 40, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  walkCircle: {},
  busCircle: {},
  destCircle: {},
  trackLine: { width: 4, flex: 1, minHeight: 22, borderRadius: 2, marginVertical: 4 },
  walkLine: { width: 0, borderLeftWidth: 2, borderStyle: 'dotted', backgroundColor: 'transparent' },
  contentCol: { flex: 1, paddingBottom: 20, paddingTop: 2 },
  stepHeader: { fontSize: 15, fontWeight: '700', lineHeight: 20, letterSpacing: -0.2 },
  stepSubtext: { fontSize: 13, fontWeight: '500', marginTop: 3, lineHeight: 18 },
  badgeWrap: { marginTop: 10 },
});
