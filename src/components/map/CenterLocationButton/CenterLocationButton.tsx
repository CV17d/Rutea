import React, { useState } from 'react';
import { TouchableOpacity, ActivityIndicator, StyleProp, ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useTrackingStore, CurrentUserLocation } from '../../../store/useTrackingStore';
import { PASTO_COORDINATES } from '../../../constants/pastoCoordinates';
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
  const [isLocating, setIsLocating] = useState(false);

  const handleCenter = async () => {
    setIsLocating(true);
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
      console.warn('CenterLocationButton error:', e);
    } finally {
      setIsLocating(false);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.fab, style]}
      onPress={handleCenter}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel="Centrar ubicación GPS"
    >
      {isLocating ? (
        <ActivityIndicator size="small" color="#0284c7" />
      ) : (
        <MaterialCommunityIcons name="crosshairs-gps" size={22} color="#0f172a" />
      )}
    </TouchableOpacity>
  );
};
