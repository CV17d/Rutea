import React from 'react';
import { View, Text } from 'react-native';
import { useRoutesStore } from '../../../store/useRoutesStore';
import { useTranslation } from '../../../i18n/useTranslation';
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

  // Si no hay ruta seleccionada ni código provisto, no renderizar
  if (!selectedRoute && !routeCode) {
    return null;
  }

  const displayCode = routeCode || (selectedRoute ? `Ruta ${selectedRoute.code}` : '');

  return (
    <View style={styles.container}>
      <View style={styles.leftCol}>
        <View style={styles.etaRow}>
          <Text style={styles.etaNumber}>{etaMinutes}</Text>
          <Text style={styles.etaUnit}>Min</Text>
        </View>
        <Text style={styles.etaLabel}>{t('routeDetail.estimated', 'Espera aproximada')}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.rightCol}>
        <Text style={styles.routeTitle}>{displayCode}</Text>
        <View style={styles.pointsRow}>
          <Text style={styles.pointsLabel}>{t('profile.points', 'Puntos')} </Text>
          <Text style={styles.pointsBadge}>+{points}</Text>
        </View>
        <Text style={styles.collabSubtext}>sistema colaborativo</Text>
      </View>
    </View>
  );
};
