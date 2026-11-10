import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useUiStore } from '../../../store/useUiStore';
import { useTranslation } from '../../../i18n/useTranslation';
import { useAppTheme } from '../../../hooks/useAppTheme';
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
  const { t } = useTranslation();
  const { isDark } = useAppTheme();
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
          style={[styles.backButton, isDark && { backgroundColor: 'rgba(30, 41, 59, 0.90)', borderColor: '#334155', borderWidth: 1 }]}
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="arrow-left" size={20} color={isDark ? '#cbd5e1' : '#94a3b8'} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isDark && { color: '#ffffff' }]}>{t('common.appTitle', 'Rutas Pasto')}</Text>
      </View>

      <View style={[styles.toggleContainer, isDark && { backgroundColor: 'rgba(15, 23, 42, 0.85)', borderColor: '#334155' }]}>
        <TouchableOpacity
          style={[styles.toggleButton, activeTab === 'search' && styles.toggleButtonActive]}
          onPress={() => handleSelectTab('search')}
          activeOpacity={0.8}
        >
          <Text style={[styles.toggleText, activeTab === 'search' && styles.toggleTextActive]}>
            {t('nav.routes', 'Buscar')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.toggleButton, activeTab === 'live' && styles.toggleButtonActive]}
          onPress={() => handleSelectTab('live')}
          activeOpacity={0.8}
        >
          <Text style={[styles.toggleText, activeTab === 'live' && styles.toggleTextActive]}>
            {t('routeDetail.live', 'En vivo')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
