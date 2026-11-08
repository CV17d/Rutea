import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Platform, TouchableOpacity, Animated, Easing } from 'react-native';
import { ProjectedBusLocation } from '../../../types/telemetry.types';
import { styles } from './LiveBusMarker.styles';

let NativeMarker: any = null;
if (Platform.OS !== 'web') {
  try {
    NativeMarker = require('react-native-maps').Marker;
  } catch (e) {
    NativeMarker = null;
  }
}

export interface LiveBusMarkerProps {
  bus: ProjectedBusLocation;
  onPress?: () => void;
}

export const LiveBusMarker: React.FC<LiveBusMarkerProps> = ({ bus, onPress }) => {
  const [currentCoord, setCurrentCoord] = useState(bus.snappedPosition);

  const latAnim = useRef(new Animated.Value(bus.snappedPosition.latitude)).current;
  const lngAnim = useRef(new Animated.Value(bus.snappedPosition.longitude)).current;
  const headingAnim = useRef(new Animated.Value(bus.heading || 0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Escuchar valores animados para actualizar de forma continua y fluida la posición
  useEffect(() => {
    const latId = latAnim.addListener(({ value }) => {
      setCurrentCoord((prev) => ({ ...prev, latitude: value }));
    });
    const lngId = lngAnim.addListener(({ value }) => {
      setCurrentCoord((prev) => ({ ...prev, longitude: value }));
    });
    return () => {
      latAnim.removeListener(latId);
      lngAnim.removeListener(lngId);
    };
  }, [latAnim, lngAnim]);

  // Transición suave al recibir nueva coordenada OSRM
  useEffect(() => {
    Animated.parallel([
      Animated.timing(latAnim, {
        toValue: bus.snappedPosition.latitude,
        duration: 1400,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
      Animated.timing(lngAnim, {
        toValue: bus.snappedPosition.longitude,
        duration: 1400,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
      Animated.timing(headingAnim, {
        toValue: bus.heading || 0,
        duration: 400,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }),
    ]).start();
  }, [bus.snappedPosition.latitude, bus.snappedPosition.longitude, bus.heading]);

  // Halo esmeralda pulsante
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.25, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1.0, duration: 800, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulseAnim]);

  const spin = headingAnim.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  const markerContent = (
    <View style={styles.wrapper}>
      <Animated.View style={[styles.emeraldHalo, { transform: [{ scale: pulseAnim }] }]} />
      <Animated.View
        style={[
          styles.busCircle,
          { backgroundColor: bus.routeColor || '#10b981', transform: [{ rotate: spin }] },
        ]}
      >
        <Text style={styles.busIcon}>🚍</Text>
      </Animated.View>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>
          {bus.routeCode} • {bus.speedKmh} km/h
        </Text>
      </View>
    </View>
  );

  if (Platform.OS === 'web' || !NativeMarker) {
    const topPct = Math.max(10, Math.min(85, 45 + (currentCoord.latitude - 1.2136) * 600));
    const leftPct = Math.max(10, Math.min(85, 50 + (currentCoord.longitude - (-77.2811)) * 600));

    return (
      <TouchableOpacity
        onPress={onPress}
        style={[styles.webPositioned, { top: `${topPct}%`, left: `${leftPct}%` }]}
        activeOpacity={0.8}
      >
        {markerContent}
      </TouchableOpacity>
    );
  }

  return (
    <NativeMarker
      coordinate={currentCoord}
      onPress={onPress}
      anchor={{ x: 0.5, y: 0.5 }}
      flat={false}
      tracksViewChanges={false}
    >
      {markerContent}
    </NativeMarker>
  );
};
