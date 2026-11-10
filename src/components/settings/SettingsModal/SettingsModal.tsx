import React from 'react';
import { Modal, View, Text, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Toast } from '../../../store/useNotificationStore';
import { useSettingsStore, AppTheme, AppLanguage } from '../../../store/useSettingsStore';
import { useUiStore } from '../../../store/useUiStore';
import { useTranslation } from '../../../i18n/useTranslation';
import { useAppTheme } from '../../../hooks/useAppTheme';
import { makeStyles } from './SettingsModal.styles';
import { useThemedStyles } from '../../../hooks/useThemedStyles';

export const SettingsModal: React.FC = () => {
  const styles = useThemedStyles(makeStyles);
  const { isSettingsModalOpen, closeSettingsModal } = useUiStore();
  const {
    theme, setTheme, language, setLanguage, hapticsEnabled, setHapticsEnabled,
    proximityRadiusMeters, setProximityRadiusMeters, clearAppCache,
  } = useSettingsStore();
  const { t } = useTranslation();
  const { palette } = useAppTheme();

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
        <View style={[styles.modalContent]}>
          <View style={[styles.dragHandle]} />
          <View style={styles.headerRow}>
            <View style={styles.titleCol}>
              <Text style={[styles.title]}>{t('settings.title', 'Configuración')}</Text>
              <Text style={[styles.subtitle]}>{t('settings.subtitle', 'Personaliza tu experiencia de viaje')}</Text>
            </View>
            <TouchableOpacity style={[styles.closeBtn]} onPress={closeSettingsModal} accessibilityLabel={t('common.close')}>
              <MaterialCommunityIcons name="close" size={20} color={palette.text2} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionTitle}>{t('settings.themeSection', 'TEMA VISUAL')}</Text>
            <View style={[styles.cardBlock]}>
              <View style={styles.optionsRow}>
                {themes.map((item) => (
                  <TouchableOpacity
                    key={item.key}
                    style={[styles.choicePill, theme === item.key && styles.choicePillActive]}
                    onPress={() => setTheme(item.key)}
                  >
                    <MaterialCommunityIcons name={item.icon} size={16} color={theme === item.key ? palette.brand : '#94a3b8'} />
                    <Text style={[styles.choiceText, theme === item.key && styles.choiceTextActive]}>{item.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <Text style={styles.sectionTitle}>{t('settings.languageSection', 'IDIOMA')}</Text>
            <View style={[styles.cardBlock]}>
              <View style={styles.optionsRow}>
                {languages.map((item) => (
                  <TouchableOpacity
                    key={item.key}
                    style={[styles.choicePill, language === item.key && styles.choicePillActive]}
                    onPress={() => setLanguage(item.key)}
                  >
                    <MaterialCommunityIcons name="translate" size={16} color={language === item.key ? palette.brand : '#94a3b8'} />
                    <Text style={[styles.choiceText, language === item.key && styles.choiceTextActive]}>{item.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <Text style={styles.sectionTitle}>{t('settings.alertsSection', 'ALERTAS Y PREFERENCIAS')}</Text>
            <View style={[styles.cardBlock]}>
              <View style={styles.toggleRow}>
                <View style={styles.toggleInfo}>
                  <Text style={[styles.toggleLabel]}>{t('settings.haptics', 'Vibración háptica')}</Text>
                  <Text style={styles.toggleSub}>{t('settings.hapticsSub', 'Confirmaciones táctiles al viajar')}</Text>
                </View>
                <Switch
                  value={hapticsEnabled}
                  onValueChange={setHapticsEnabled}
                  trackColor={{ false: palette.line, true: palette.brand }}
                  thumbColor={hapticsEnabled ? palette.brand : palette.muted}
                />
              </View>
              <Text style={[styles.toggleSub, { marginTop: 12, marginBottom: 8 }]}>
                {t('settings.proximityRadius', 'Radio de alerta de proximidad')}
              </Text>
              <View style={styles.optionsRow}>
                {[200, 400, 600].map((radius) => (
                  <TouchableOpacity
                    key={radius}
                    style={[styles.choicePill, proximityRadiusMeters === radius && styles.choicePillActive]}
                    onPress={() => setProximityRadiusMeters(radius)}
                  >
                    <Text style={[styles.choiceText, proximityRadiusMeters === radius && styles.choiceTextActive]}>
                      {radius}m
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <Text style={styles.sectionTitle}>{t('settings.storageSection', 'ALMACENAMIENTO')}</Text>
            <TouchableOpacity style={[styles.clearBtn]} onPress={handleClearCache}>
              <MaterialCommunityIcons name="trash-can-outline" size={18} color={palette.text} />
              <Text style={[styles.clearBtnText]}>{t('settings.clearCache', 'Limpiar caché de la app')}</Text>
            </TouchableOpacity>

            <View style={styles.infoFooter}>
              <Text style={styles.infoText}>{t('settings.setpInfo')} · {t('settings.version')}</Text>
              <Text style={[styles.infoText, { color: palette.brand, marginTop: 2 }]}>{t('settings.statusConnected')}</Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
