import React, { useCallback, useEffect, useRef } from 'react';
import { Animated, Easing, Image, Text, View } from 'react-native';
import * as NativeSplash from 'expo-splash-screen';
import { DOT_SIZE, styles, TRACK_WIDTH } from './SplashScreen.styles';

const LOGO_MARK = require('../../../../assets/logo-mark.png');

export interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const hasHiddenRef = useRef(false);
  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;

  const hideNativeSplash = useCallback(() => {
    if (hasHiddenRef.current) return;
    hasHiddenRef.current = true;
    NativeSplash.hideAsync().catch(() => {});
  }, []);

  useEffect(() => {
    const fallbackTimer = setTimeout(hideNativeSplash, 300);

    const sequence = Animated.sequence([
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 1250,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 280,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]);

    sequence.start(({ finished }) => {
      if (finished) onFinishRef.current();
    });

    return () => {
      clearTimeout(fallbackTimer);
      sequence.stop();
    };
  }, [fadeAnim, hideNativeSplash, progressAnim]);

  const fillTranslateX = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-TRACK_WIDTH, 0],
  });

  const dotTranslateX = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, TRACK_WIDTH - DOT_SIZE],
  });

  return (
    <Animated.View onLayout={hideNativeSplash} style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.centerBrand}>
        <Image source={LOGO_MARK} style={styles.isotipo} resizeMode="contain" accessibilityLabel="Logo de Rutea" />
        <Text style={styles.brandTitle}>Rutea</Text>
        <Text style={styles.brandSlogan}>Conectando tu camino</Text>
      </View>

      <View style={styles.loaderWrap}>
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, { transform: [{ translateX: fillTranslateX }] }]} />
        </View>
        <Animated.View style={[styles.progressDot, { transform: [{ translateX: dotTranslateX }] }]} />
      </View>
    </Animated.View>
  );
};
