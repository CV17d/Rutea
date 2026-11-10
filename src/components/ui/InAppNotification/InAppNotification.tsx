import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNotificationStore } from '../../../store/useNotificationStore';
import { Palette } from '../../../constants/palette';
import { useThemedStyles } from '../../../hooks/useThemedStyles';
import { useAppTheme } from '../../../hooks/useAppTheme';

export const InAppNotification: React.FC = () => {
  const currentToast = useNotificationStore((s) => s.currentToast);
  const styles = useThemedStyles(makeStyles);
  const { palette: P } = useAppTheme();
  const hideToast = useNotificationStore((s) => s.hideToast);

  const translateY = useRef(new Animated.Value(-60)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (currentToast) {
      Animated.parallel([
        Animated.spring(translateY, { toValue: 0, useNativeDriver: true, friction: 8 }),
        Animated.timing(opacity, { toValue: 1, duration: 250, useNativeDriver: true }),
      ]).start();

      const timer = setTimeout(() => {
        handleDismiss();
      }, currentToast.duration || 4000);

      return () => clearTimeout(timer);
    } else {
      translateY.setValue(-60);
      opacity.setValue(0);
    }
  }, [currentToast]);

  const handleDismiss = () => {
    Animated.parallel([
      Animated.timing(translateY, { toValue: -60, duration: 250, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(() => hideToast());
  };

  if (!currentToast) return null;

  return (
    <View style={styles.overlay} pointerEvents="box-none">
      <Animated.View style={[styles.card, { transform: [{ translateY }], opacity }]}>
        <TouchableOpacity activeOpacity={0.9} onPress={handleDismiss} style={styles.contentRow}>
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons name="bell-ring" size={20} color={P.live} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.titleText}>{currentToast.text1}</Text>
            {currentToast.text2 && (
              <Text style={styles.subText} numberOfLines={2}>
                {currentToast.text2}
              </Text>
            )}
          </View>
          <TouchableOpacity onPress={handleDismiss} style={styles.closeBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <MaterialCommunityIcons name="close" size={18} color={P.muted} />
          </TouchableOpacity>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const makeStyles = (P: Palette) => StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 48 : 38,
    left: 16,
    right: 16,
    zIndex: 9999,
    alignItems: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: P.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: P.line,
    paddingHorizontal: 14,
    paddingVertical: 12,
    elevation: 10,
    shadowColor: P.shadow,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.28,
    shadowRadius: 24,
  },
  contentRow: { flexDirection: 'row', alignItems: 'center' },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: P.liveSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContainer: { flex: 1 },
  titleText: { color: P.text, fontSize: 15, fontWeight: '800', letterSpacing: -0.2 },
  subText: { color: P.text2, fontSize: 13, fontWeight: '500', marginTop: 2, lineHeight: 18 },
  closeBtn: { padding: 4, marginLeft: 8 },
});
