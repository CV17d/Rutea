import React from 'react';
import { View, TextInput, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRoutesStore } from '../../../store/useRoutesStore';
import { useUiStore } from '../../../store/useUiStore';
import { TransitRoute } from '../../../types/route.types';
import { floatingSearchBarStyles as styles } from './FloatingSearchBar.styles';

export const FloatingSearchBar: React.FC = () => {
  const { searchQuery, setSearchQuery, getFilteredRoutes, selectRoute } = useRoutesStore();
  const { setScreenMode, openTripPlanner } = useUiStore();

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
      <Text style={styles.headerTitle}>Rutas Pasto</Text>

      {/* Píldora translúcida blanca: ¿A dónde vas hoy? */}
      <View style={styles.searchPill}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.input}
          placeholder="¿A dónde vas hoy?"
          placeholderTextColor="#94a3b8"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 ? (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearBtn}>
            <Text style={styles.clearText}>✕</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={openTripPlanner} style={styles.clearBtn}>
            <Text style={{ fontSize: 15 }}>🧭</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Dropdown Glassmorphic con resultados de búsqueda */}
      {showDropdown && (
        <ScrollView style={styles.dropdownList} nestedScrollEnabled keyboardShouldPersistTaps="handled">
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
                <Text style={styles.routeTitleText} numberOfLines={1}>
                  {route.name}
                </Text>
                <Text style={styles.routeDescText} numberOfLines={1}>
                  {route.description}
                </Text>
              </View>

              <View style={styles.typeBadge}>
                <Text style={styles.typeBadgeText}>
                  {route.type === 'EXPRESS' ? 'EXPRESA' : 'ESTÁNDAR'}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};
