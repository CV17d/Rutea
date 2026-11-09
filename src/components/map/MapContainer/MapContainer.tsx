import React, { useRef } from 'react';
import { View, StyleSheet, Platform, TouchableWithoutFeedback } from 'react-native';
import { PASTO_COORDINATES } from '../../../constants/pastoCoordinates';
import { useUiStore } from '../../../store/useUiStore';
import { LatLng } from '../../../types/route.types';
import { CenterLocationButton } from '../CenterLocationButton';
import { styles } from './MapContainer.styles';

export interface MapContainerProps {
  children?: React.ReactNode;
  routeCoordinates?: LatLng[];
  routeColor?: string;
  onPressMap?: () => void;
  onRecenter?: () => void;
  mapRef?: React.RefObject<any>;
}

let NativeMapView: any = null;
let NativePolyline: any = null;
let PROVIDER_DEFAULT: any = null;

if (Platform.OS !== 'web') {
  try {
    const Maps = require('react-native-maps');
    NativeMapView = Maps.default;
    PROVIDER_DEFAULT = Maps.PROVIDER_DEFAULT;
    NativePolyline = Maps.Polyline;
  } catch (e) {
    NativeMapView = null;
    NativePolyline = null;
  }
}

export const MapContainer: React.FC<MapContainerProps> = ({
  children,
  routeCoordinates,
  routeColor = '#3b82f6',
  onPressMap,
  onRecenter,
  mapRef: externalMapRef,
}) => {
  const internalMapRef = useRef<any>(null);
  const activeMapRef = externalMapRef || internalMapRef;
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
          style={[styles.webVignette, { backgroundColor: isDark ? 'rgba(7, 11, 19, 0.45)' : 'rgba(255, 255, 255, 0.08)' }]}
          pointerEvents="none"
        />

        <TouchableWithoutFeedback onPress={onPressMap}>
          <View style={StyleSheet.absoluteFill}>
            {children}
            {!isDark && (
              <CenterLocationButton mapRef={activeMapRef} onRecenter={onRecenter || onPressMap} />
            )}
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#070b13' : '#f8fafc' }]}>
      <NativeMapView
        ref={activeMapRef}
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
        {routeCoordinates && routeCoordinates.length > 0 && NativePolyline && (
          <NativePolyline
            coordinates={routeCoordinates}
            strokeColor={routeColor}
            strokeWidth={5}
            lineCap="round"
            lineJoin="round"
          />
        )}
        {children}
      </NativeMapView>

      {!isDark && (
        <CenterLocationButton mapRef={activeMapRef} onRecenter={onRecenter || onPressMap} />
      )}
    </View>
  );
};
