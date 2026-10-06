import React, { useRef } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import MapView, { PROVIDER_DEFAULT } from 'react-native-maps';
import { PASTO_COORDINATES } from '../../../constants/pastoCoordinates';

export interface MapContainerProps {
  children?: React.ReactNode;
  onPressMap?: () => void;
}

const DARK_MAP_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#17202a' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#8ca0ba' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#17202a' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#243342' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#334e68' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0b131e' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#162b29' }] },
];

export const MapContainer: React.FC<MapContainerProps> = ({
  children,
  onPressMap,
}) => {
  const mapRef = useRef<MapView>(null);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        provider={PROVIDER_DEFAULT}
        initialRegion={{
          latitude: PASTO_COORDINATES.center.latitude,
          longitude: PASTO_COORDINATES.center.longitude,
          latitudeDelta: PASTO_COORDINATES.defaultDelta.latitudeDelta,
          longitudeDelta: PASTO_COORDINATES.defaultDelta.longitudeDelta,
        }}
        customMapStyle={DARK_MAP_STYLE}
        showsUserLocation={true}
        showsMyLocationButton={false}
        showsCompass={false}
        onPress={onPressMap}
      >
        {children}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#070b13',
  },
});
