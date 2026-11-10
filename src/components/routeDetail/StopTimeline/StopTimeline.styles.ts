import { StyleSheet } from 'react-native';

// Colores dinámicos desde la paleta "Galeras" en el componente.
export const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    borderRadius: 22,
    borderWidth: 1,
    padding: 16,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.22,
    shadowRadius: 22,
    elevation: 8,
  },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  stepIcon: { width: 42, height: 42, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  stepTitle: { fontSize: 15, fontWeight: '700', letterSpacing: -0.2 },
  stepSub: { fontSize: 13, fontWeight: '500', marginTop: 2 },
  detailsButton: { height: 54, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  detailsButtonText: { fontSize: 16, fontWeight: '800', letterSpacing: -0.2 },
  helper: { fontSize: 12, fontWeight: '500', textAlign: 'center', marginTop: 10 },
});
