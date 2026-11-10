import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useUiStore } from '../../../store/useUiStore';
import { useAppTheme } from '../../../hooks/useAppTheme';
import { styles } from './RouteHeaderToggle.styles';

interface RouteHeaderToggleProps {
  onBack?: () => void;
}

/** Cabecera flotante de la vista de ruta: sólo el botón para volver, el mapa queda libre. */
export const RouteHeaderToggle: React.FC<RouteHeaderToggleProps> = ({ onBack }) => {
  const setScreenMode = useUiStore((s) => s.setScreenMode);
  const { palette: P } = useAppTheme();

  const handleBack = () => {
    if (onBack) onBack();
    else setScreenMode('HOME');
  };

  return (
    <View style={styles.container} pointerEvents="box-none">
      <TouchableOpacity
        style={[styles.backButton, { backgroundColor: P.surface, borderColor: P.line, shadowColor: P.shadow }]}
        onPress={handleBack}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="Volver al inicio"
      >
        <MaterialCommunityIcons name="arrow-left" size={22} color={P.text} />
      </TouchableOpacity>
    </View>
  );
};
