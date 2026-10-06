import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getAvatarColorFromSeed } from '../../../utils/avatar.utils';

export interface ProceduralAvatarProps {
  seed: string;
  size?: number;
  showBorder?: boolean;
}

export const ProceduralAvatar: React.FC<ProceduralAvatarProps> = ({
  seed,
  size = 44,
  showBorder = true,
}) => {
  const bgColor = getAvatarColorFromSeed(seed);
  const initials = seed.slice(0, 2).toUpperCase();

  // Pattern variation derived from seed
  const hash = seed.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const shapeRadius = (hash % 3 === 0) ? size / 2 : size / 3;

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: shapeRadius,
          backgroundColor: bgColor,
        },
        showBorder && styles.border,
      ]}
    >
      <View style={[styles.innerGlow, { borderRadius: shapeRadius }]} />
      <Text
        style={[
          styles.initials,
          { fontSize: size * 0.42, lineHeight: size * 0.5 },
        ]}
      >
        {initials}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  border: {
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.40)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  innerGlow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  initials: {
    color: '#ffffff',
    fontWeight: '900',
    textAlign: 'center',
  },
});
