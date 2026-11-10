import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Palette } from '../../constants/palette';
import { PastoPlace, PLACE_TYPE_ICON, PLACE_TYPE_LABEL, searchPastoPlaces } from '../../services/placeSearch.service';

interface Props {
  query: string;
  palette: Palette;
  onPick: (place: PastoPlace) => void;
}

/** Sugerencias de barrios y lugares de Pasto mientras el usuario escribe. */
export const PlaceSuggestions: React.FC<Props> = ({ query, palette: P, onPick }) => {
  const results = useMemo(() => searchPastoPlaces(query, 5), [query]);
  if (query.trim().length < 2) return null;

  if (results.length === 0) {
    return (
      <View style={[styles.box, { backgroundColor: P.surface, borderColor: P.line }]}>
        <Text style={[styles.empty, { color: P.text2 }]}>
          No encontramos “{query.trim()}” en Pasto. Revisa el nombre del barrio o prueba con un lugar cercano.
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.box, { backgroundColor: P.surface, borderColor: P.line }]}>
      {results.map((place, i) => (
        <TouchableOpacity
          key={`${place.name}-${i}`}
          style={[styles.row, i > 0 && { borderTopWidth: 1, borderTopColor: P.line }]}
          onPress={() => onPick(place)}
          accessibilityRole="button"
          accessibilityLabel={`${place.name}, ${PLACE_TYPE_LABEL[place.type]}`}
        >
          <View style={[styles.icon, { backgroundColor: P.raised }]}>
            <MaterialCommunityIcons name={PLACE_TYPE_ICON[place.type] as any} size={18} color={P.text2} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.name, { color: P.text }]} numberOfLines={1}>{place.name}</Text>
            <Text style={[styles.type, { color: P.muted }]}>{PLACE_TYPE_LABEL[place.type]} · Pasto</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  box: { borderRadius: 18, borderWidth: 1, marginBottom: 14, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 10 },
  icon: { width: 34, height: 34, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: 15, fontWeight: '700', letterSpacing: -0.2 },
  type: { fontSize: 12, fontWeight: '500', marginTop: 1 },
  empty: { fontSize: 13, lineHeight: 19, padding: 14 },
});
