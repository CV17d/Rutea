import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Palette } from '../../../constants/palette';
import { useThemedStyles } from '../../../hooks/useThemedStyles';
import { useAppTheme } from '../../../hooks/useAppTheme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ProceduralAvatar } from '../ProceduralAvatar';
import { GlassBadge } from '../../ui/GlassBadge';
import { useTranslation } from '../../../i18n/useTranslation';

export interface AvatarCardProps {
  alias: string;
  avatarSeed: string;
  points: number;
  levelTitle: string;
  broadcastTimeMinutes?: number;
  onClose: () => void;
}

export const AvatarCard: React.FC<AvatarCardProps> = ({
  alias,
  avatarSeed,
  points,
  levelTitle,
  broadcastTimeMinutes = 8,
  onClose,
}) => {
  const { t } = useTranslation();
  const styles = useThemedStyles(makeStyles);
  const { palette: P } = useAppTheme();

  const getTranslatedLevel = (lvl: string) => {
    switch (lvl) {
      case 'Pasajero Novato': return t('profile.rookie', lvl);
      case 'Pasajero Frecuente': return t('profile.frequent', lvl);
      case 'Guía Local': return t('profile.guide', lvl);
      case 'Cuy Leyenda': return t('profile.legend', lvl);
      case 'Vigía del Galeras': return t('profile.galerasWatcher', lvl);
      case 'Caminante de Pasto': return t('profile.pastoWalker', lvl);
      case 'Guía Mayor de Ruta': return t('profile.seniorGuide', lvl);
      case 'Embajador Supremo de Pasto': return t('profile.supremeAmbassador', lvl);
      default: return lvl;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userRow}>
          <ProceduralAvatar seed={avatarSeed} size={48} />
          <View style={styles.userInfo}>
            <Text style={styles.alias}>{alias}</Text>
            <Text style={styles.level}>{getTranslatedLevel(levelTitle)}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={onClose} style={styles.closeBtn} accessibilityLabel="Cerrar">
          <MaterialCommunityIcons name="close" size={18} color={P.text2} />
        </TouchableOpacity>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{points} pts</Text>
          <Text style={styles.statLabel}>{t('profile.reputation', 'Reputación')}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{broadcastTimeMinutes} min</Text>
          <Text style={styles.statLabel}>{t('profile.onBoardToday', 'A bordo hoy')}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <GlassBadge type="LIVE" label={t('profile.verifiedBroadcast', 'Transmisión verificada')} />
      </View>
    </View>
  );
};

const makeStyles = (P: Palette) => StyleSheet.create({
  container: {
    width: '100%', maxWidth: 340, alignSelf: 'center', padding: 16, borderRadius: 22,
    backgroundColor: P.surface, borderWidth: 1, borderColor: P.line,
    shadowColor: P.shadow, shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.25, shadowRadius: 24, elevation: 10,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  userRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  userInfo: { justifyContent: 'center' },
  alias: { color: P.text, fontSize: 17, fontWeight: '800', letterSpacing: -0.3 },
  level: { color: P.brand, fontSize: 13, fontWeight: '600', marginTop: 1 },
  closeBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: P.raised, alignItems: 'center', justifyContent: 'center' },
  statsRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around',
    backgroundColor: P.raised, borderRadius: 14, paddingVertical: 12, marginBottom: 12,
  },
  statBox: { alignItems: 'center' },
  statNumber: { color: P.text, fontSize: 18, fontWeight: '800', letterSpacing: -0.4, fontVariant: ['tabular-nums'] },
  statLabel: { color: P.muted, fontSize: 12, fontWeight: '500', marginTop: 2 },
  statDivider: { width: 1, height: 28, backgroundColor: P.line },
  footer: { alignItems: 'center' },
});
