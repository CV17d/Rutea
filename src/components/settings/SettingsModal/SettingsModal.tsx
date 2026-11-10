import React from 'react';
import { Modal, View, Text, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Toast } from '../../../store/useNotificationStore';
import { useSettingsStore, AppTheme, AppLanguage } from '../../../store/useSettingsStore';
import { useUiStore } from '../../../store/useUiStore';
import { useTranslation } from '../../../i18n/useTranslation';
import { useAppTheme } from '../../../hooks/useAppTheme';
import { styles } from './SettingsModal.styles';

export const SettingsModal: React.FC = () => {
  const { isSettingsModalOpen, closeSettingsModal } = useUiStore();
  const {
    theme, setTheme, language, setLanguage, hapticsEnabled, setHapticsEnabled,
    proximityRadiusMeters, setProximityRadiusMeters, clearAppCache,
  } = useSettingsStore();
  const { t } = useTranslation();
  const { isDark } = useAppTheme();

  if (!isSettingsModalOpen) return null;

  const handleClearCache = async () => {
    await clearAppCache();
    Toast.show({
      type: 'success',
      text1: t('settings.clearCacheSuccess', 'Caché eliminada correctamente'),
    });
  };

  const themes: { key: AppTheme; label: string; icon: 'white-balance-sunny' | 'weather-night' | 'cellphone' }[] = [
    { key: 'light', label: t('settings.themeLight', 'Claro'), icon: 'white-balance-sunny' },
    { key: 'dark', label: t('settings.themeDark', 'Oscuro'), icon: 'weather-night' },
    { key: 'system', label: t('settings.themeSystem', 'Sistema'), icon: 'cellphone' },
  ];

  const languages: { key: AppLanguage; label: string }[] = [
    { key: 'es', label: t('settings.langEs', 'Español') },
    { key: 'en', label: t('settings.langEn', 'English') },
  ];

  return (
    <Modal visible={isSettingsModalOpen} animationType="slide" transparent onRequestClose={closeSettingsModal}>
      <View style={styles.overlay}>
        <View style={[styles.modalContent, !isDark && { backgroundColor: '#ffffff', borderColor: '#e2e8f0' }]}>
          <View style={[styles.dragHandle, !isDark && { backgroundColor: '#cbd5e1' }]} />
          <View style={styles.headerRow}>
            <View style={styles.titleCol}>
              <Text style={[styles.title, !isDark && { color: '#0f172a' }]}>{t('settings.title', 'Configuración')}</Text>
              <Text style={[styles.subtitle, !isDark && { color: '#64748b' }]}>{t('settings.subtitle', 'Personaliza tu experiencia de viaje')}</Text>
            </View>
            <TouchableOpacity style={[styles.closeBtn, !isDark && { backgroundColor: '#f1f5f9' }]} onPress={closeSettingsModal} accessibilityLabel={t('common.close')}>
              <MaterialCommunityIcons name="close" size={20} color={isDark ? '#94a3b8' : '#64748b'} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionTitle}>{t('settings.themeSection', 'TEMA VISUAL')}</Text>
            <View style={[styles.cardBlock, !isDark && { backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }]}>
              <View style={styles.optionsRow}>
                {themes.map((item) => (
                  <TouchableOpacity
                    key={item.key}
                    style={[styles.choicePill, !isDark && { backgroundColor: '#ffffff', borderColor: '#e2e8f0' }, theme === item.key && styles.choicePillActive]}
                    onPress={() => setTheme(item.key)}
                  >
                    <MaterialCommunityIcons name={item.icon} size={16} color={theme === item.key ? '#10b981' : '#94a3b8'} />
                    <Text style={[styles.choiceText, !isDark && { color: '#64748b' }, theme === item.key && styles.choiceTextActive]}>{item.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <Text style={styles.sectionTitle}>{t('settings.languageSection', 'IDIOMA')}</Text>
            <View style={[styles.cardBlock, !isDark && { backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }]}>
              <View style={styles.optionsRow}>
                {languages.map((item) => (
                  <TouchableOpacity
                    key={item.key}
                    style={[styles.choicePill, !isDark && { backgroundColor: '#ffffff', borderColor: '#e2e8f0' }, language === item.key && styles.choicePillActive]}
                    onPress={() => setLanguage(item.key)}
                  >
                    <MaterialCommunityIcons name="translate" size={16} color={language === item.key ? '#10b981' : '#94a3b8'} />
                    <Text style={[styles.choiceText, !isDark && { color: '#64748b' }, language === item.key && styles.choiceTextActive]}>{item.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <Text style={styles.sectionTitle}>{t('settings.alertsSection', 'ALERTAS Y PREFERENCIAS')}</Text>
            <View style={[styles.cardBlock, !isDark && { backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }]}>
              <View style={styles.toggleRow}>
                <View style={styles.toggleInfo}>
                  <Text style={[styles.toggleLabel, !isDark && { color: '#0f172a' }]}>{t('settings.haptics', 'Vibración háptica')}</Text>
                  <Text style={styles.toggleSub}>{t('settings.hapticsSub', 'Confirmaciones táctiles al viajar')}</Text>
                </View>
                <Switch
                  value={hapticsEnabled}
                  onValueChange={setHapticsEnabled}
                  trackColor={{ false: '#334155', true: '#059669' }}
                  thumbColor={hapticsEnabled ? '#10b981' : '#94a3b8'}
                />
              </View>
              <Text style={[styles.toggleSub, { marginTop: 12, marginBottom: 8 }]}>
                {t('settings.proximityRadius', 'Radio de alerta de proximidad')}
              </Text>
              <View style={styles.optionsRow}>
                {[200, 400, 600].map((radius) => (
                  <TouchableOpacity
                    key={radius}
                    style={[styles.choicePill, !isDark && { backgroundColor: '#ffffff', borderColor: '#e2e8f0' }, proximityRadiusMeters === radius && styles.choicePillActive]}
                    onPress={() => setProximityRadiusMeters(radius)}
                  >
                    <Text style={[styles.choiceText, !isDark && { color: '#64748b' }, proximityRadiusMeters === radius && styles.choiceTextActive]}>
                      {radius}m
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <Text style={styles.sectionTitle}>{t('settings.storageSection', 'ALMACENAMIENTO')}</Text>
            <TouchableOpacity style={[styles.clearBtn, !isDark && { backgroundColor: '#f1f5f9', borderColor: '#cbd5e1' }]} onPress={handleClearCache}>
              <MaterialCommunityIcons name="trash-can-outline" size={18} color={isDark ? '#f8fafc' : '#0f172a'} />
              <Text style={[styles.clearBtnText, !isDark && { color: '#0f172a' }]}>{t('settings.clearCache', 'Limpiar caché de la app')}</Text>
            </TouchableOpacity>

            <View style={styles.infoFooter}>
              <Text style={styles.infoText}>{t('settings.setpInfo')} · {t('settings.version')}</Text>
              <Text style={[styles.infoText, { color: '#10b981', marginTop: 2 }]}>{t('settings.statusConnected')}</Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
