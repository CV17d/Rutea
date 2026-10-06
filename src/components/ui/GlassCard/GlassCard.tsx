import React from 'react';
import { View, ViewProps, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { glassCardStyles } from './GlassCard.styles';

export interface GlassCardProps extends ViewProps {
  children: React.ReactNode;
  intensity?: number;
  tint?: 'dark' | 'light' | 'default';
  isHighlighted?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  intensity = 30,
  tint = 'dark',
  isHighlighted = false,
  style,
  ...props
}) => {
  return (
    <View
      style={[
        glassCardStyles.container,
        isHighlighted && glassCardStyles.highlightedBorder,
        style,
      ]}
      {...props}
    >
      <BlurView
        intensity={Platform.OS === 'ios' ? intensity : 40}
        tint={tint}
        style={StyleSheet.absoluteFill}
      />
      <View style={glassCardStyles.innerContent}>{children}</View>
    </View>
  );
};
