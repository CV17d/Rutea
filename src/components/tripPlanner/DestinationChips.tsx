import React from 'react';
import { ScrollView, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Palette } from '../../constants/palette';
import { styles } from './TripPlanner.styles';

interface Props {
  chips: string[];
  value: string;
  palette: Palette;
  onPick: (chip: string) => void;
}

/** Destinos frecuentes como píldoras desplazables; la elegida queda resaltada. */
export const DestinationChips: React.FC<Props> = ({ chips, value, palette: P, onPick }) => (
  <ScrollView horizontal showsHorizontalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={styles.chipsRow}>
    {chips.map((chip) => {
      const active = value.trim() === chip;
      return (
        <TouchableOpacity key={chip} style={[styles.chip, { backgroundColor: active ? P.brandSoft : P.surface, borderColor: active ? P.brand : P.line }]} onPress={() => onPick(chip)}>
          <MaterialCommunityIcons name="history" size={13} color={active ? P.brand : P.muted} />
          <Text style={[styles.chipText, { color: active ? P.brand : P.text2 }]}>{chip}</Text>
        </TouchableOpacity>
      );
    })}
  </ScrollView>
);
