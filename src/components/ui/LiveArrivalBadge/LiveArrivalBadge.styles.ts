import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#86efac',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 6,
    alignSelf: 'flex-start',
  },
  pulseDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#16a34a',
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803d',
  },
  distText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#166534',
    opacity: 0.8,
  },
  fallbackContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 6,
    alignSelf: 'flex-start',
  },
  fallbackText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
  },
});
