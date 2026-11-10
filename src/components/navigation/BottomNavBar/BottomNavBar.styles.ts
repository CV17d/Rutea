import { StyleSheet } from 'react-native';

export const bottomNavBarStyles = StyleSheet.create({
  dock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around', // Distribuye equitativamente el espacio entre los 4 íconos
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    borderRadius: 26,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.98)',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.24,
    shadowRadius: 24,
    elevation: 8,
  },
  navItem: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navItemActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.18)',
  },
  icon: {
    fontSize: 22,
    color: '#64748b',
  },
  iconActive: {
    color: '#10b981',
  },
});
