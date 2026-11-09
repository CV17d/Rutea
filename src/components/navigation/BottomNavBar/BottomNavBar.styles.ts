import { StyleSheet } from 'react-native';

export const bottomNavBarStyles = StyleSheet.create({
  dock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around', // Distribuye equitativamente el espacio entre los 4 íconos
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    borderRadius: 32,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.98)',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.10,
    shadowRadius: 16,
    elevation: 8,
  },
  navItem: {
    paddingVertical: 8,
    paddingHorizontal: 16,
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
