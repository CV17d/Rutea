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
    // OpenStreetMap de San Juan de Pasto con filtro oscuro de alto contraste
    const pastoUrl = 'https://www.openstreetmap.org/export/embed.html?bbox=-77.315%2C1.185%2C-77.245%2C1.245&layer=mapnik';

    return (
      <View style={styles.webContainer}>
        {/* Mapa real de San Juan de Pasto para navegadores web */}
        {React.createElement('iframe', {
          src: pastoUrl,
          style: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: 'none',
            filter: 'invert(92%) hue-rotate(190deg) brightness(80%) contrast(115%)',
            pointerEvents: 'none',
          },
          title: 'Mapa de Pasto',
        })}

        {/* Capa de viñeta oscura para realzar el glassmorfismo */}
        <View style={styles.webVignette} pointerEvents="none" />

        <TouchableWithoutFeedback onPress={onPressMap}>
          <View style={StyleSheet.absoluteFillObject}>{children}</View>
        </TouchableWithoutFeedback>
      </View>
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
  },
  webVignette: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(7, 11, 19, 0.45)',
  },
});
