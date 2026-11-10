import { StyleSheet } from 'react-native';

// Los colores se aplican desde la paleta (ámbar = información en vivo).
const pill = {
  flexDirection: 'row' as const,
  alignItems: 'center' as const,
  borderRadius: 12,
  paddingHorizontal: 10,
  paddingVertical: 7,
  gap: 7,
  alignSelf: 'flex-start' as const,
};

export const styles = StyleSheet.create({
  container: { ...pill },
  pulseDot: { width: 8, height: 8, borderRadius: 4 },
  text: { fontSize: 13, fontWeight: '700', flexShrink: 1 },
  distText: { fontSize: 12, fontWeight: '800', fontVariant: ['tabular-nums'] },
  fallbackContainer: { ...pill },
  fallbackText: { fontSize: 13, fontWeight: '600' },
});
