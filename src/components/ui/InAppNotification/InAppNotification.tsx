import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNotificationStore } from '../../../store/useNotificationStore';

export const InAppNotification: React.FC = () => {
  const currentToast = useNotificationStore((s) => s.currentToast);
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
            <MaterialCommunityIcons name="bell-ring" size={20} color="#10b981" />
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
            <MaterialCommunityIcons name="close" size={16} color="#94a3b8" />
          </TouchableOpacity>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
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
    backgroundColor: '#1e293b',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#10b981',
    paddingHorizontal: 14,
    paddingVertical: 12,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  titleText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  subText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  closeBtn: {
    padding: 4,
    marginLeft: 8,
  },
});
