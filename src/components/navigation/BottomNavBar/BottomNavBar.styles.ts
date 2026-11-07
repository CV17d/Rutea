import { StyleSheet, Platform } from 'react-native';

export const bottomNavBarStyles = StyleSheet.create({
  dock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderRadius: 32,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.98)',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.10,
    shadowRadius: 16,
    elevation: 8,
  },
  navItem: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navItemActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.18)',
  },
  icon: {
    fontSize: 20,
    color: '#64748b',
  },
  iconActive: {
    color: '#10b981',
  },
});
