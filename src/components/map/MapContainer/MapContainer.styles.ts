import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
  },
  webContainer: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
  },
  webVignette: {
    ...StyleSheet.absoluteFill,
  },
  recenterBtn: {
    position: 'absolute',
    right: 20,
    bottom: 215,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.90)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.98)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 5,
    zIndex: 20,
  },
  recenterIcon: {
    fontSize: 22,
    color: '#0f172a',
    fontWeight: '900',
  },
});
