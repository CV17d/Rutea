import React, { useRef } from 'react';
import { View, StyleSheet, Platform, TouchableWithoutFeedback } from 'react-native';
import { PASTO_COORDINATES } from '../../../constants/pastoCoordinates';

export interface MapContainerProps {
  children?: React.ReactNode;
  onPressMap?: () => void;
}

let NativeMapView: any = null;
let PROVIDER_DEFAULT: any = null;

if (Platform.OS !== 'web') {
  try {
    const Maps = require('react-native-maps');
    NativeMapView = Maps.default;
    PROVIDER_DEFAULT = Maps.PROVIDER_DEFAULT;
  } catch (e) {
    NativeMapView = null;
  }
}

export const MapContainer: React.FC<MapContainerProps> = ({
  children,
  onPressMap,
}) => {
  const mapRef = useRef<any>(null);

  if (Platform.OS === 'web' || !NativeMapView) {
    return (
      <TouchableWithoutFeedback onPress={onPressMap}>
        <View style={styles.webContainer}>
          {/* Simulated Dark City Grid of San Juan de Pasto */}
          <View style={styles.webGridOverlay} />
          <View style={styles.webCenterRing} />
          {children}
        </View>
      </TouchableWithoutFeedback>
    );
  }

  return (
    <View style={styles.container}>
      <NativeMapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        provider={PROVIDER_DEFAULT}
        initialRegion={{
          latitude: PASTO_COORDINATES.center.latitude,
          longitude: PASTO_COORDINATES.center.longitude,
          latitudeDelta: PASTO_COORDINATES.defaultDelta.latitudeDelta,
          longitudeDelta: PASTO_COORDINATES.defaultDelta.longitudeDelta,
        }}
        showsUserLocation={true}
        showsMyLocationButton={false}
        showsCompass={false}
        onPress={onPressMap}
      >
        {children}
      </NativeMapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#070b13',
  },
  webContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#090e17',
    overflow: 'hidden',
    position: 'relative',
  },
  webGridOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.15,
    borderWidth: 1,
    borderColor: '#38bdf8',
  },
  webCenterRing: {
    position: 'absolute',
    top: '48%',
    left: '48%',
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(16, 185, 129, 0.4)',
  },
});
