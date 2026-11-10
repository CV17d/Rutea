import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRoutesStore } from '../../../store/useRoutesStore';
import { useUiStore } from '../../../store/useUiStore';
import { useTranslation } from '../../../i18n/useTranslation';
import { useAppTheme } from '../../../hooks/useAppTheme';
import { TransitRoute } from '../../../types/route.types';
import { floatingSearchBarStyles as styles } from './FloatingSearchBar.styles';

export const FloatingSearchBar: React.FC = () => {
  const { searchQuery, setSearchQuery, getFilteredRoutes, selectRoute } = useRoutesStore();
  const { setScreenMode, openTripPlanner } = useUiStore();
  const { t } = useTranslation();
  const { palette } = useAppTheme();

  const filteredRoutes = getFilteredRoutes();
  const showDropdown = searchQuery.trim().length > 0;

  const handleSelectRoute = (route: TransitRoute) => {
    selectRoute(route.id);
    setSearchQuery('');
    setScreenMode('ROUTE_DETAILS');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={openTripPlanner}
        style={[styles.searchPill, { backgroundColor: palette.surface, borderColor: palette.line, shadowColor: palette.shadow }]}
        accessibilityRole="button"
        accessibilityLabel={t('search.placeholder', '¿A dónde vas hoy? Abrir planificador de viaje')}
      >
        <View style={[styles.brandTile, { backgroundColor: palette.brand }]}>
          <MaterialCommunityIcons name="map-marker-path" size={20} color={palette.onBrand} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.placeholderText, { color: palette.text }]}>{t('search.placeholder', '¿A dónde vas hoy?')}</Text>
          <Text style={[styles.subText, { color: palette.muted }]} numberOfLines={1}>{t('common.appTitle', 'Rutas Pasto')} · buses en tiempo real</Text>
        </View>
        <MaterialCommunityIcons name="magnify" size={22} color={palette.text2} />
      </TouchableOpacity>

      {/* Dropdown Glassmorphic con resultados de búsqueda */}
      {showDropdown && (
        <ScrollView style={[styles.dropdownList, { backgroundColor: palette.surface, borderColor: palette.line }]} nestedScrollEnabled keyboardShouldPersistTaps="handled">
          {filteredRoutes.map((route) => (
            <TouchableOpacity
              key={route.id}
              style={styles.routeItem}
              onPress={() => handleSelectRoute(route)}
              activeOpacity={0.7}
            >
              <View style={[styles.routeCodeBadge, { backgroundColor: route.color }]}>
                <Text style={styles.routeCodeText}>{route.code}</Text>
              </View>

              <View style={styles.routeInfoCol}>
                <Text style={[styles.routeTitleText, { color: palette.text }]} numberOfLines={1}>
                  {route.name}
                </Text>
                <Text style={[styles.routeDescText, { color: palette.muted }]} numberOfLines={1}>
                  {route.description}
                </Text>
              </View>

              <View style={styles.typeBadge}>
                <Text style={styles.typeBadgeText}>
                  {route.type === 'EXPRESS' ? t('search.express', 'EXPRESA') : t('search.standard', 'ESTÁNDAR')}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};
