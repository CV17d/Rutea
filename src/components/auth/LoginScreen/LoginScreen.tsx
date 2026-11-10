import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuthStore } from '../../../store/useAuthStore';
import { useTranslation } from '../../../i18n/useTranslation';
import { makeStyles } from './LoginScreen.styles';
import { useThemedStyles } from '../../../hooks/useThemedStyles';
import { useAppTheme } from '../../../hooks/useAppTheme';

export const LoginScreen: React.FC = () => {
  const styles = useThemedStyles(makeStyles);
  const { palette: P } = useAppTheme();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { t } = useTranslation();

  const { loginWithEmail, registerWithEmail, loginAsGuest, isLoading, error, clearError } = useAuthStore();

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) return;
    if (isRegister) {
      await registerWithEmail(email, password, name);
    } else {
      await loginWithEmail(email, password);
    }
  };

  const handleToggleMode = (mode: boolean) => {
    setIsRegister(mode);
    clearError();
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerCol}>
        <View style={styles.logoBadge}>
          <Image source={require('../../../../assets/logo-mark.png')} style={styles.logoImage} resizeMode="contain" />
        </View>
        <Text style={styles.title}>{t('common.appTitle', 'Rutea Pasto')}</Text>
        <Text style={styles.subtitle}>{t('auth.subtitle', 'Transporte Urbano Inteligente • SETPasto')}</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tabBtn, !isRegister && styles.tabBtnActive]}
            onPress={() => handleToggleMode(false)}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, !isRegister && styles.tabTextActive]}>{t('auth.signIn', 'Iniciar Sesión')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabBtn, isRegister && styles.tabBtnActive]}
            onPress={() => handleToggleMode(true)}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, isRegister && styles.tabTextActive]}>{t('auth.register', 'Registrarse')}</Text>
          </TouchableOpacity>
        </View>

        {isRegister && (
          <View style={styles.inputWrap}>
            <MaterialCommunityIcons name="account-outline" size={20} color={P.muted} />
            <TextInput
              style={styles.input}
              placeholder={t('auth.namePlaceholder', 'Nombre o Alias (ej. CuyVeloz)')}
              placeholderTextColor={P.muted}
              value={name}
              onChangeText={setName}
            />
          </View>
        )}

        <View style={styles.inputWrap}>
          <MaterialCommunityIcons name="email-outline" size={20} color={P.muted} />
          <TextInput
            style={styles.input}
            placeholder={t('auth.email', 'Correo electrónico')}
            placeholderTextColor={P.muted}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={(t) => { setEmail(t); if (error) clearError(); }}
          />
        </View>

        <View style={styles.inputWrap}>
          <MaterialCommunityIcons name="lock-outline" size={20} color={P.muted} />
          <TextInput
            style={styles.input}
            placeholder={t('auth.password', 'Contraseña')}
            placeholderTextColor={P.muted}
            secureTextEntry
            value={password}
            onChangeText={(t) => { setPassword(t); if (error) clearError(); }}
          />
        </View>

        {error && (
          <View style={styles.errorBanner}>
            <MaterialCommunityIcons name="alert-circle-outline" size={16} color={P.danger} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={handleSubmit}
          disabled={isLoading || !email.trim() || !password.trim()}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator color={P.onBrand} size="small" />
          ) : (
            <Text style={styles.primaryBtnText}>
              {isRegister ? t('auth.createAccount', 'Crear Cuenta') : t('auth.signIn', 'Iniciar Sesión')}
            </Text>
          )}
        </TouchableOpacity>

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>o</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity
          style={styles.guestBtn}
          onPress={loginAsGuest}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="incognito" size={20} color={P.text} />
          <Text style={styles.guestBtnText}>{t('auth.guestContinue', 'Continuar como invitado')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
