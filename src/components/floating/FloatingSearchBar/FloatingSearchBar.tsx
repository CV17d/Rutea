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
  const { isDark } = useAppTheme();

  const filteredRoutes = getFilteredRoutes();
  const showDropdown = searchQuery.trim().length > 0;

  const handleSelectRoute = (route: TransitRoute) => {
    selectRoute(route.id);
    setSearchQuery('');
    setScreenMode('ROUTE_DETAILS');
  };

  return (
    <View style={styles.container}>
      {/* Header Central: Rutas Pasto */}
      <Text style={[styles.headerTitle, isDark && { color: '#ffffff' }]}>{t('common.appTitle', 'Rutas Pasto')}</Text>

      {/* Píldora translúcida blanca: "¿A dónde vas hoy?" que acciona TripPlanner */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={openTripPlanner}
        style={[styles.searchPill, isDark && { backgroundColor: 'rgba(30, 41, 59, 0.92)', borderColor: '#334155' }]}
        accessibilityRole="button"
        accessibilityLabel={t('search.placeholder', '¿A dónde vas hoy? Abrir planificador de viaje')}
      >
        <MaterialCommunityIcons name="magnify" size={20} color="#64748b" style={{ marginRight: 6 }} />
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text style={[styles.placeholderText, isDark && { color: '#cbd5e1' }]}>{t('search.placeholder', '¿A dónde vas hoy?')}</Text>
        </View>
        <View style={styles.clearBtn}>
          <MaterialCommunityIcons name="routes" size={20} color="#0284c7" />
        </View>
      </TouchableOpacity>

      {/* Dropdown Glassmorphic con resultados de búsqueda */}
      {showDropdown && (
        <ScrollView style={[styles.dropdownList, isDark && { backgroundColor: 'rgba(15, 23, 42, 0.96)', borderColor: '#334155' }]} nestedScrollEnabled keyboardShouldPersistTaps="handled">
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
                <Text style={[styles.routeTitleText, isDark && { color: '#ffffff' }]} numberOfLines={1}>
                  {route.name}
                </Text>
                <Text style={[styles.routeDescText, isDark && { color: '#94a3b8' }]} numberOfLines={1}>
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
