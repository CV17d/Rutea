import React from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { CommunityReport } from '../../../types/user.types';

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

const CATEGORY_ICONS: Record<string, string> = {
  TRAFFIC_JAM: '🚗',
  ROAD_BLOCK: '🚧',
  BUS_FULL: '🚌',
  DETOUR: '↪️',
  ACCIDENT: '💥',
  POLICE_CHECK: '👮',
};

export const ReportMarker: React.FC<ReportMarkerProps> = ({ report, onPress }) => {
  const icon = CATEGORY_ICONS[report.category] || '⚠️';
  const lat = report.latitude || 1.2145;
  const lng = report.longitude || -77.2783;

  const markerContent = (
    <View style={styles.card}>
      <Text style={styles.icon}>{icon}</Text>
      <View style={styles.textWrap}>
        <Text style={styles.title} numberOfLines={1}>
          {report.title}
        </Text>
        <Text style={styles.subtext}>
          ▲ {report.upvotes} • {report.reporterAlias}
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
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.6)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 6,
    maxWidth: 160,
  },
  icon: {
    fontSize: 16,
    marginRight: 6,
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
