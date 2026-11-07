import React from 'react';
import { View, TextInput, Text, TouchableOpacity } from 'react-native';
import { useRoutesStore } from '../../../store/useRoutesStore';
import { floatingSearchBarStyles as styles } from './FloatingSearchBar.styles';

export const FloatingSearchBar: React.FC = () => {
  const { searchQuery, setSearchQuery } = useRoutesStore();

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
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearBtn}>
            <Text style={styles.clearText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
