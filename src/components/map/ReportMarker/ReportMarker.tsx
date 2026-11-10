import React from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CommunityReport } from '../../../types/user.types';
import { useTranslation } from '../../../i18n/useTranslation';

let NativeMarker: any = null;
if (Platform.OS !== 'web') {
  try {
    NativeMarker = require('react-native-maps').Marker;
  } catch (e) {
    NativeMarker = null;
  }
}

export interface ReportMarkerProps {
  report: CommunityReport;
  onPress?: () => void;
}

const CATEGORY_CONFIG: Record<string, { icon: keyof typeof MaterialCommunityIcons.glyphMap; color: string }> = {
  TRAFFIC_JAM: { icon: 'car-multiple', color: '#ef4444' },
  TRAFFIC: { icon: 'car-multiple', color: '#ef4444' },
  ROAD_BLOCK: { icon: 'road-variant', color: '#f59e0b' },
  BUS_FULL: { icon: 'bus-alert', color: '#f59e0b' },
  FULL_BUS: { icon: 'bus-alert', color: '#f59e0b' },
  DETOUR: { icon: 'routes', color: '#8b5cf6' },
  ACCIDENT: { icon: 'car-emergency', color: '#dc2626' },
  POLICE_CHECK: { icon: 'shield-alert', color: '#3b82f6' },
};

export const ReportMarker: React.FC<ReportMarkerProps> = ({ report, onPress }) => {
  const conf = CATEGORY_CONFIG[report.category] || { icon: 'alert-circle', color: '#f59e0b' };
  const lat = report.latitude || 1.2145;
  const lng = report.longitude || -77.2783;
  const { t } = useTranslation();

  const getTranslatedTitle = () => {
    if (report.id === 'rep-init-1') return t('incidents.mapInitTraffic', report.title);
    if (report.id === 'rep-init-2') return t('incidents.mapInitRoadBlock', report.title);
    if (report.id === 'rep-init-3') return t('incidents.mapInitBusFull', report.title);
    switch (report.category as string) {
      case 'BUS_FULL':
      case 'FULL_BUS':
        return t('incidents.busFullOnRoad', 'Bus lleno en vía');
      case 'TRAFFIC_JAM':
      case 'TRAFFIC':
        return t('incidents.trafficOnRoad', 'Tráfico pesado en vía');
      case 'ROAD_BLOCK':
        return t('incidents.roadBlockOnRoad', 'Vía cerrada por obras');
      case 'DETOUR':
        return t('incidents.detourOnRoad', 'Desvío en vía');
      case 'ACCIDENT':
        return t('incidents.accidentOnRoad', 'Accidente en vía');
      case 'POLICE_CHECK':
        return t('incidents.policeCheckOnRoad', 'Retén policial en vía');
      default:
        return report.title;
    }
  };

  const displayAlias = report.reporterAlias === 'Comunidad Rutea'
    ? t('incidents.communityAlias', 'Comunidad Rutea')
    : report.reporterAlias;

  const markerContent = (
    <View style={[styles.card, { borderColor: conf.color }]}>
      <MaterialCommunityIcons name={conf.icon} size={15} color={conf.color} style={{ marginRight: 6 }} />
      <View style={styles.textWrap}>
        <Text style={styles.title} numberOfLines={1}>
          {getTranslatedTitle()}
        </Text>
        <Text style={styles.subtext}>
          ▲ {report.upvotes} • {displayAlias}
        </Text>
      </View>
    </View>
  );

  if (Platform.OS === 'web' || !NativeMarker) {
    const topPct = Math.max(15, Math.min(75, 45 + (lat - 1.2136) * 600));
    const leftPct = Math.max(15, Math.min(80, 50 + (lng - (-77.2811)) * 600));

    return (
      <TouchableOpacity
        onPress={onPress}
        style={[styles.webPositioned, { top: `${topPct}%`, left: `${leftPct}%` }]}
      >
        {markerContent}
      </TouchableOpacity>
    );
  }

  return (
    <NativeMarker
      coordinate={{ latitude: lat, longitude: lng }}
      onPress={onPress}
      anchor={{ x: 0.5, y: 1 }}
      tracksViewChanges={false}
    >
      {markerContent}
    </NativeMarker>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 6,
    maxWidth: 160,
  },
  textWrap: {
    flexShrink: 1,
  },
  title: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },
  subtext: {
    color: '#fbbf24',
    fontSize: 8,
    fontWeight: '600',
  },
  webPositioned: {
    position: 'absolute',
    zIndex: 15,
  },
});
