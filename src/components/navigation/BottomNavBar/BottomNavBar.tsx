import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useUiStore } from '../../../store/useUiStore';
import { bottomNavBarStyles as styles } from './BottomNavBar.styles';

export const BottomNavBar: React.FC = () => {
  const {
    screenMode,
    setScreenMode,
    openReportModal,
    openProfileModal,
  } = useUiStore();

  return (
    <View style={styles.dock}>
      {/* 1. Inicio */}
      <TouchableOpacity
        onPress={() => setScreenMode('HOME')}
        style={[styles.navItem, screenMode === 'HOME' && styles.navItemActive]}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Inicio"
      >
        <MaterialCommunityIcons
          name={screenMode === 'HOME' ? 'home' : 'home-outline'}
          size={24}
          color={screenMode === 'HOME' ? '#10b981' : '#64748b'}
        />
      </TouchableOpacity>

      {/* 2. Catálogo / Detalle de Rutas */}
      <TouchableOpacity
        onPress={() => setScreenMode('ROUTE_DETAILS')}
        style={[styles.navItem, screenMode === 'ROUTE_DETAILS' && styles.navItemActive]}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Rutas"
      >
        <MaterialCommunityIcons
          name="bus"
          size={24}
          color={screenMode === 'ROUTE_DETAILS' ? '#10b981' : '#64748b'}
        />
      </TouchableOpacity>

      {/* 3. Reportar Novedad */}
      <TouchableOpacity
        onPress={openReportModal}
        style={styles.navItem}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Reportar novedad"
      >
        <MaterialCommunityIcons
          name="clipboard-alert-outline"
          size={24}
          color="#64748b"
        />
      </TouchableOpacity>

      {/* 4. Perfil de Usuario */}
      <TouchableOpacity
        onPress={openProfileModal}
        style={styles.navItem}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Perfil de usuario"
      >
        <MaterialCommunityIcons
          name="account-outline"
          size={24}
          color="#64748b"
        />
      </TouchableOpacity>
    </View>
  );
};
