import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useUiStore } from '../../../store/useUiStore';
import { useTranslation } from '../../../i18n/useTranslation';
import { useAppTheme } from '../../../hooks/useAppTheme';
import { bottomNavBarStyles as styles } from './BottomNavBar.styles';

export const BottomNavBar: React.FC = () => {
  const {
    screenMode,
    setScreenMode,
    openReportModal,
    openProfileModal,
    openSettingsModal,
  } = useUiStore();
  const { t } = useTranslation();
  const { isDark } = useAppTheme();
  const inactiveColor = isDark ? '#94a3b8' : '#64748b';

  return (
    <View style={[styles.dock, isDark && { backgroundColor: 'rgba(15, 23, 42, 0.94)', borderColor: '#334155' }]}>
      {/* 1. Inicio */}
      <TouchableOpacity
        onPress={() => setScreenMode('HOME')}
        style={[styles.navItem, screenMode === 'HOME' && styles.navItemActive]}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={t('nav.home', 'Inicio')}
      >
        <MaterialCommunityIcons
          name={screenMode === 'HOME' ? 'home' : 'home-outline'}
          size={24}
          color={screenMode === 'HOME' ? '#10b981' : inactiveColor}
        />
      </TouchableOpacity>

      {/* 2. Catálogo / Detalle de Rutas */}
      <TouchableOpacity
        onPress={() => setScreenMode('ROUTE_DETAILS')}
        style={[styles.navItem, screenMode === 'ROUTE_DETAILS' && styles.navItemActive]}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={t('nav.routes', 'Rutas')}
      >
        <MaterialCommunityIcons
          name="bus"
          size={24}
          color={screenMode === 'ROUTE_DETAILS' ? '#10b981' : inactiveColor}
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
          color={inactiveColor}
        />
      </TouchableOpacity>

      {/* 4. Perfil de Usuario */}
      <TouchableOpacity
        onPress={openProfileModal}
        style={styles.navItem}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={t('nav.profile', 'Perfil de usuario')}
      >
        <MaterialCommunityIcons
          name="account-outline"
          size={24}
          color={inactiveColor}
        />
      </TouchableOpacity>

      {/* 5. Configuraciones */}
      <TouchableOpacity
        onPress={openSettingsModal}
        style={styles.navItem}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={t('nav.settings', 'Configuración')}
      >
        <MaterialCommunityIcons
          name="cog-outline"
          size={24}
          color={inactiveColor}
        />
      </TouchableOpacity>
    </View>
  );
};
