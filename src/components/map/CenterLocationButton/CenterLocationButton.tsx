import React, { useState } from 'react';
import { TouchableOpacity, ActivityIndicator, StyleProp, ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import * as Haptics from 'expo-haptics';
import { useTrackingStore, CurrentUserLocation } from '../../../store/useTrackingStore';
import { PASTO_COORDINATES } from '../../../constants/pastoCoordinates';
import { useAppTheme } from '../../../hooks/useAppTheme';
import { styles } from './CenterLocationButton.styles';

export interface CenterLocationButtonProps {
  mapRef?: React.RefObject<any>;
  onRecenter?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const CenterLocationButton: React.FC<CenterLocationButtonProps> = ({
  mapRef,
  onRecenter,
  style,
}) => {
  const { palette } = useAppTheme();
  const [isLocating, setIsLocating] = useState(false);
  const isTrackingActive = useTrackingStore((s) => s.isTrackingActive);
  const setTrackingActive = useTrackingStore((s) => s.setTrackingActive);

  const handleCenter = async () => {
    setIsLocating(true);
    setTrackingActive(true);

    try {
      if (Haptics && typeof Haptics.impactAsync === 'function') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch {
      // Fallback si haptics no está disponible
    }

    try {
      let target: { latitude: number; longitude: number } | null =
        useTrackingStore.getState().currentLocation;

      if (!target) {
        const { status } = await Location.getForegroundPermissionsAsync();
        if (status === 'granted') {
          const loc = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
          const realLoc: CurrentUserLocation = {
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            speedKmh: Math.max(0, (loc.coords.speed || 0) * 3.6),
            heading: loc.coords.heading || 0,
            accuracy: loc.coords.accuracy || 10,
            timestamp: loc.timestamp,
          };
          useTrackingStore.getState().setCurrentLocation(realLoc);
          target = realLoc;
        }
      }

      const centerCoord = target || PASTO_COORDINATES.center;

      if (mapRef?.current) {
        if (typeof mapRef.current.animateCamera === 'function') {
          mapRef.current.animateCamera(
            {
              center: {
                latitude: centerCoord.latitude,
                longitude: centerCoord.longitude,
              },
              zoom: 16,
            },
            { duration: 800 }
          );
        } else if (typeof mapRef.current.animateToRegion === 'function') {
          mapRef.current.animateToRegion(
            {
              latitude: centerCoord.latitude,
              longitude: centerCoord.longitude,
              latitudeDelta: 0.008,
              longitudeDelta: 0.008,
            },
            800
          );
        }
      }

      if (onRecenter) {
        onRecenter();
      }
    } catch (e) {
      if (typeof __DEV__ !== 'undefined' && __DEV__) console.warn('CenterLocationButton error:', e);
    } finally {
      setIsLocating(false);
    }
  };

  const iconColor = isTrackingActive ? palette.brand : palette.text;

  return (
    <TouchableOpacity
      style={[
        styles.fab,
        { backgroundColor: palette.surface, borderColor: isTrackingActive ? palette.brand : palette.line, shadowColor: palette.shadow },
        style,
      ]}
      onPress={handleCenter}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={isTrackingActive ? 'Rastreo GPS Activo' : 'Centrar ubicación GPS'}
    >
      {isLocating ? (
        <ActivityIndicator size="small" color={palette.brand} />
      ) : (
        <MaterialCommunityIcons name="crosshairs-gps" size={22} color={iconColor} />
      )}
    </TouchableOpacity>
  );
};
