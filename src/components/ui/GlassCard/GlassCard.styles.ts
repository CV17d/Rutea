import { StyleSheet } from 'react-native';

export const glassCardStyles = StyleSheet.create({
  container: {
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: 'rgba(15, 23, 42, 0.72)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  highlightedBorder: {
    borderColor: 'rgba(255, 255, 255, 0.45)',
  },
  innerContent: {
    padding: 16,
  },
});
