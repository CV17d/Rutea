import React from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { GlassCard } from '../../ui/GlassCard';
import { useRoutesStore } from '../../../store/useRoutesStore';

export const FloatingSearchBar: React.FC = () => {
  const { searchQuery, setSearchQuery, routes, selectedRouteId, selectRoute } =
    useRoutesStore();

  return (
    <View style={styles.container}>
      <GlassCard isHighlighted style={styles.card}>
        <View style={styles.searchRow}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.input}
            placeholder="Buscar Ruta en Pasto (C1, C16, E1)..."
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="characters"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearBtn}>
              <Text style={styles.clearText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Quick Route Selector Pills */}
        <View style={styles.pillsRow}>
          {routes.map((route) => {
            const isSelected = route.id === selectedRouteId;
            return (
              <TouchableOpacity
                key={route.id}
                onPress={() => selectRoute(route.id)}
                style={[
                  styles.pill,
                  isSelected && {
                    backgroundColor: route.color,
                    borderColor: '#ffffff',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.pillText,
                    isSelected && styles.pillTextSelected,
                  ]}
                >
                  {route.code}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </GlassCard>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 52,
    left: 16,
    right: 16,
    zIndex: 20,
  },
  card: {
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchIcon: {
    fontSize: 16,
  },
  input: {
    flex: 1,
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    paddingVertical: 6,
  },
  clearBtn: {
    padding: 4,
  },
  clearText: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: 'bold',
  },
  pillsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.10)',
  },
  pill: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
  },
  pillText: {
    color: '#cbd5e1',
    fontSize: 12,
    fontWeight: '800',
  },
  pillTextSelected: {
    color: '#ffffff',
    fontWeight: '900',
  },
});
