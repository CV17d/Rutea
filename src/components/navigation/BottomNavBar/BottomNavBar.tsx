import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useUiStore } from '../../../store/useUiStore';
import { bottomNavBarStyles as styles } from './BottomNavBar.styles';

export const BottomNavBar: React.FC = () => {
  const {
    screenMode,
    setScreenMode,
    openReportModal,
    openProfileModal,
    openTripPlanner,
  } = useUiStore();

  return (
    <View style={styles.dock}>
      {/* 1. Home */}
      <TouchableOpacity
        onPress={() => setScreenMode('HOME')}
        style={[styles.navItem, screenMode === 'HOME' && styles.navItemActive]}
        activeOpacity={0.7}
      >
        <Text style={[styles.icon, screenMode === 'HOME' && styles.iconActive]}>
          🏠
        </Text>
      </TouchableOpacity>

      {/* 2. Bus (Route Details) */}
      <TouchableOpacity
        onPress={() => setScreenMode('ROUTE_DETAILS')}
        style={[styles.navItem, screenMode === 'ROUTE_DETAILS' && styles.navItemActive]}
        activeOpacity={0.7}
      >
        <Text style={[styles.icon, screenMode === 'ROUTE_DETAILS' && styles.iconActive]}>
          🚍
        </Text>
      </TouchableOpacity>

      {/* 3. Planificador de Viaje */}
      <TouchableOpacity
        onPress={openTripPlanner}
        style={styles.navItem}
        activeOpacity={0.7}
      >
        <Text style={styles.icon}>🧭</Text>
      </TouchableOpacity>

      {/* 4. Reportes */}
      <TouchableOpacity
        onPress={openReportModal}
        style={styles.navItem}
        activeOpacity={0.7}
      >
        <Text style={styles.icon}>📋</Text>
      </TouchableOpacity>

      {/* 5. Perfil */}
      <TouchableOpacity
        onPress={openProfileModal}
        style={styles.navItem}
        activeOpacity={0.7}
      >
        <Text style={styles.icon}>👤</Text>
      </TouchableOpacity>
    </View>
  );
};
