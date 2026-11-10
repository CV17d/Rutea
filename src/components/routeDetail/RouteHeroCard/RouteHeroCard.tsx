import React from 'react';
import { View, Text } from 'react-native';
import { useRoutesStore } from '../../../store/useRoutesStore';
import { useTranslation } from '../../../i18n/useTranslation';
import { useAppTheme } from '../../../hooks/useAppTheme';
import { styles } from './RouteHeroCard.styles';

interface RouteHeroCardProps {
  etaMinutes?: number;
  routeCode?: string;
  points?: number;
}

export const RouteHeroCard: React.FC<RouteHeroCardProps> = ({
  etaMinutes = 12,
  routeCode,
  points = 50,
}) => {
  const selectedRoute = useRoutesStore((s) => s.getSelectedRoute());
  const { t } = useTranslation();
  const { isDark } = useAppTheme();

  // Si no hay ruta seleccionada ni código provisto, no renderizar
  if (!selectedRoute && !routeCode) {
    return null;
  }

  const displayCode = routeCode || (selectedRoute ? `${t('nav.routes', 'Ruta')} ${selectedRoute.code}` : '');

  return (
    <View style={[styles.container, isDark && { backgroundColor: 'rgba(30, 41, 59, 0.94)', borderColor: '#334155' }]}>
      <View style={styles.leftCol}>
        <View style={styles.etaRow}>
          <Text style={[styles.etaNumber, isDark && { color: '#ffffff' }]}>{etaMinutes}</Text>
          <Text style={[styles.etaUnit, isDark && { color: '#ffffff' }]}>Min</Text>
        </View>
        <Text style={[styles.etaLabel, isDark && { color: '#94a3b8' }]}>{t('routeDetail.estimated', 'Espera aproximada')}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.rightCol}>
        <Text style={[styles.routeTitle, isDark && { color: '#ffffff' }]}>{displayCode}</Text>
        <View style={styles.pointsRow}>
          <Text style={[styles.pointsLabel, isDark && { color: '#cbd5e1' }]}>{t('profile.points', 'Puntos')} </Text>
          <Text style={styles.pointsBadge}>+{points}</Text>
        </View>
        <Text style={[styles.collabSubtext, isDark && { color: '#94a3b8' }]}>{t('routeDetail.collabSystem', 'sistema colaborativo')}</Text>
      </View>
    </View>
  );
};
