import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

export type BadgeType = 'LIVE' | 'GHOST' | 'WAIT' | 'POINTS';

export interface GlassBadgeProps {
  type: BadgeType;
  label?: string;
  style?: ViewStyle;
}

export const GlassBadge: React.FC<GlassBadgeProps> = ({
  type,
  label,
  style,
}) => {
  const getBadgeConfig = () => {
    switch (type) {
      case 'LIVE':
        return {
          bg: 'rgba(16, 185, 129, 0.20)',
          border: 'rgba(16, 185, 129, 0.60)',
          text: '#10b981',
          defaultText: 'EN VIVO',
          hasPulseDot: true,
        };
      case 'GHOST':
        return {
          bg: 'rgba(148, 163, 184, 0.20)',
          border: 'rgba(148, 163, 184, 0.40)',
          text: '#94a3b8',
          defaultText: 'ESTIMADO',
          hasPulseDot: false,
        };
      case 'WAIT':
        return {
          bg: 'rgba(245, 158, 11, 0.20)',
          border: 'rgba(245, 158, 11, 0.50)',
          text: '#fbbf24',
          defaultText: 'ESPERA',
          hasPulseDot: false,
        };
      case 'POINTS':
        return {
          bg: 'rgba(56, 189, 248, 0.20)',
          border: 'rgba(56, 189, 248, 0.50)',
          text: '#38bdf8',
          defaultText: 'PUNTOS',
          hasPulseDot: false,
        };
    }
  };

  const config = getBadgeConfig();

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: config.bg, borderColor: config.border },
        style,
      ]}
    >
      {config.hasPulseDot && <View style={styles.pulseDot} />}
      <Text style={[styles.badgeText, { color: config.text }]}>
        {label || config.defaultText}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
    gap: 6,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10b981',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});
