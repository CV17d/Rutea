import { StyleSheet, Platform } from 'react-native';

export const floatingSearchBarStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 52 : 44,
    left: 20,
    right: 20,
    zIndex: 25,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  searchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    borderRadius: 28,
    paddingVertical: 11,
    paddingHorizontal: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.95)',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 4,
    gap: 10,
  },
  searchIcon: {
    fontSize: 15,
  },
  input: {
    flex: 1,
    color: '#0f172a',
    fontSize: 14,
    fontWeight: '600',
    paddingVertical: 0,
  },
  clearBtn: {
    padding: 4,
  },
  clearText: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
