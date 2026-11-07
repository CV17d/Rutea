import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useUiStore } from '../../../store/useUiStore';
import { styles } from './RouteHeaderToggle.styles';

interface RouteHeaderToggleProps {
  onBack?: () => void;
  onTabChange?: (tab: 'search' | 'live') => void;
}

export const RouteHeaderToggle: React.FC<RouteHeaderToggleProps> = ({
  onBack,
  onTabChange,
}) => {
  const setScreenMode = useUiStore((s) => s.setScreenMode);
  const [activeTab, setActiveTab] = useState<'search' | 'live'>('search');

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      setScreenMode('HOME');
    }
  };

  const handleSelectTab = (tab: 'search' | 'live') => {
    setActiveTab(tab);
    if (onTabChange) onTabChange(tab);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <Text style={styles.backArrowText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rutas Pasto</Text>
      </View>

      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, activeTab === 'search' && styles.toggleButtonActive]}
          onPress={() => handleSelectTab('search')}
          activeOpacity={0.8}
        >
          <Text style={[styles.toggleText, activeTab === 'search' && styles.toggleTextActive]}>
            Buscar
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.toggleButton, activeTab === 'live' && styles.toggleButtonActive]}
          onPress={() => handleSelectTab('live')}
          activeOpacity={0.8}
        >
          <Text style={[styles.toggleText, activeTab === 'live' && styles.toggleTextActive]}>
            En vivo
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
