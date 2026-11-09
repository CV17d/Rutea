import React, { useRef, useState, useMemo } from 'react';
import { View, StyleSheet, Platform, TouchableWithoutFeedback } from 'react-native';
import { PASTO_COORDINATES } from '../../../constants/pastoCoordinates';
import { useUiStore } from '../../../store/useUiStore';
import { LatLng, BusStop } from '../../../types/route.types';
import { CenterLocationButton } from '../CenterLocationButton';
import { StopMarker } from '../StopMarker';
import { ClusterMarker } from '../ClusterMarker';
import { clusterBusStops } from '../../../utils/cluster.utils';
import { styles } from './MapContainer.styles';

export interface MapContainerProps {
  children?: React.ReactNode;
  routeCoordinates?: LatLng[];
  routeColor?: string;
  stops?: BusStop[];
  onStopPress?: (stop: BusStop) => void;
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
  } catch {
    NativeMapView = null;
    NativePolyline = null;
  }
}

export const MapContainer: React.FC<MapContainerProps> = ({
  children,
  routeCoordinates,
  routeColor = '#3b82f6',
  stops,
  onStopPress,
  onPressMap,
  onRecenter,
  mapRef: externalMapRef,
}) => {
  const internalMapRef = useRef<any>(null);
  const activeMapRef = externalMapRef || internalMapRef;
  const screenMode = useUiStore((s) => s.screenMode);
  const isDark = screenMode === 'ON_BOARD';

  const [regionDelta, setRegionDelta] = useState(PASTO_COORDINATES.defaultDelta.latitudeDelta);

  // Optimización de 60 FPS: Memoización y Clustering de paraderos
  const renderedStopMarkers = useMemo(() => {
    if (!stops || stops.length === 0) return null;
    const items = clusterBusStops(stops, regionDelta);
    return items.map((item) => {
      if (item.isCluster) {
        return (
          <ClusterMarker
            key={`cluster-${item.id}`}
            coordinate={item.location}
            count={item.count}
            onPress={() => {
              activeMapRef.current?.animateToRegion({
                latitude: item.location.latitude,
                longitude: item.location.longitude,
                latitudeDelta: Math.max(0.005, regionDelta / 2),
                longitudeDelta: Math.max(0.005, regionDelta / 2),
              }, 300);
            }}
          />
        );
      }
      return <StopMarker key={item.stop.id} stop={item.stop} onPress={() => onStopPress?.(item.stop)} />;
    });
  }, [stops, regionDelta, onStopPress]);

  if (Platform.OS === 'web' || !NativeMapView) {
    const pastoUrl = 'https://www.openstreetmap.org/export/embed.html?bbox=-77.315%2C1.185%2C-77.245%2C1.245&layer=mapnik';
    const filterStyle = isDark
      ? 'invert(92%) hue-rotate(190deg) brightness(80%) contrast(115%)'
      : 'saturate(115%) contrast(98%) brightness(102%)';

    return (
      <View style={[styles.webContainer, { backgroundColor: isDark ? '#090e17' : '#f8fafc' }]}>
        {React.createElement('iframe', {
          src: pastoUrl,
          style: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none', filter: filterStyle, pointerEvents: 'none' },
          title: 'Mapa de Pasto',
        })}
        <View style={[styles.webVignette, { backgroundColor: isDark ? 'rgba(7, 11, 19, 0.45)' : 'rgba(255, 255, 255, 0.08)' }]} pointerEvents="none" />
        <TouchableWithoutFeedback onPress={onPressMap}>
          <View style={StyleSheet.absoluteFill}>
            {renderedStopMarkers}
            {children}
            {!isDark && <CenterLocationButton mapRef={activeMapRef} onRecenter={onRecenter || onPressMap} />}
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
        showsUserLocation
        showsMyLocationButton={false}
        showsCompass={false}
        onPress={onPressMap}
        onRegionChangeComplete={(r: any) => setRegionDelta(r.latitudeDelta)}
      >
        {routeCoordinates && routeCoordinates.length > 0 && NativePolyline && (
          <NativePolyline
            coordinates={routeCoordinates}
            strokeColor={routeColor}
            strokeWidth={5}
            lineCap="round"
            lineJoin="round"
            simplify={true}
          />
        )}
        {renderedStopMarkers}
        {children}
      </NativeMapView>
      {!isDark && <CenterLocationButton mapRef={activeMapRef} onRecenter={onRecenter || onPressMap} />}
    </View>
  );
};
