import React, { useRef } from 'react';
import { View, StyleSheet, Platform, TouchableWithoutFeedback, Text, TouchableOpacity } from 'react-native';
import { PASTO_COORDINATES } from '../../../constants/pastoCoordinates';
import { useUiStore } from '../../../store/useUiStore';

export interface MapContainerProps {
  children?: React.ReactNode;
  onPressMap?: () => void;
  onRecenter?: () => void;
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
  onRecenter,
}) => {
  const mapRef = useRef<any>(null);
  const screenMode = useUiStore((s) => s.screenMode);
  const isDark = screenMode === 'ON_BOARD';

  if (Platform.OS === 'web' || !NativeMapView) {
    const pastoUrl = 'https://www.openstreetmap.org/export/embed.html?bbox=-77.315%2C1.185%2C-77.245%2C1.245&layer=mapnik';
    const filterStyle = isDark
      ? 'invert(92%) hue-rotate(190deg) brightness(80%) contrast(115%)'
      : 'saturate(115%) contrast(98%) brightness(102%)';

    return (
      <View style={[styles.webContainer, { backgroundColor: isDark ? '#090e17' : '#f8fafc' }]}>
        {React.createElement('iframe', {
          src: pastoUrl,
          style: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: 'none',
            filter: filterStyle,
            pointerEvents: 'none',
          },
          title: 'Mapa de Pasto',
        })}

        <View
          style={[
            styles.webVignette,
            { backgroundColor: isDark ? 'rgba(7, 11, 19, 0.45)' : 'rgba(255, 255, 255, 0.08)' },
          ]}
          pointerEvents="none"
        />

        <TouchableWithoutFeedback onPress={onPressMap}>
          <View style={StyleSheet.absoluteFill}>
            {children}

            {/* Botón flotante de recentrado / ubicación */}
            {!isDark && (
              <TouchableOpacity
                onPress={onRecenter || onPressMap}
                style={styles.recenterBtn}
                activeOpacity={0.8}
              >
                <Text style={styles.recenterIcon}>⌖</Text>
              </TouchableOpacity>
            )}
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#070b13' : '#f8fafc' }]}>
      <NativeMapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
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

      {!isDark && (
        <TouchableOpacity
          onPress={onRecenter || onPressMap}
          style={styles.recenterBtn}
          activeOpacity={0.8}
        >
          <Text style={styles.recenterIcon}>⌖</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
  },
  webContainer: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
  },
  webVignette: {
    ...StyleSheet.absoluteFill,
  },
  recenterBtn: {
    position: 'absolute',
    right: 20,
    bottom: 215,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.90)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.98)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 5,
    zIndex: 20,
  },
  recenterIcon: {
    fontSize: 22,
    color: '#0f172a',
    fontWeight: '900',
  },
});
