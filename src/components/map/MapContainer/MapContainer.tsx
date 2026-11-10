import React, { useRef, useState, useMemo, useEffect } from 'react';
import { View, StyleSheet, Platform, TouchableWithoutFeedback } from 'react-native';
import { PASTO_COORDINATES } from '../../../constants/pastoCoordinates';
import { DARK_MAP_STYLE } from '../../../constants/darkMapStyle';
import { useUiStore } from '../../../store/useUiStore';
import { useTrackingStore } from '../../../store/useTrackingStore';
import { useAppTheme } from '../../../hooks/useAppTheme';
import { LatLng, BusStop } from '../../../types/route.types';
import { CenterLocationButton } from '../CenterLocationButton';
import { StopMarker } from '../StopMarker';
import { ClusterMarker } from '../ClusterMarker';
import { OsmMapView } from '../OsmMapView';
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
  isDark?: boolean;
}

const HAS_GOOGLE_MAPS_KEY = Boolean(process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY);
let NativeMapView: any = null;
let NativePolyline: any = null;
let PROVIDER_DEFAULT: any = null;

if (Platform.OS !== 'web' && HAS_GOOGLE_MAPS_KEY) {
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
  children, routeCoordinates, routeColor = '#3b82f6', stops, onStopPress, onPressMap, onRecenter, mapRef: externalMapRef, isDark: propIsDark,
}) => {
  const internalMapRef = useRef<any>(null);
  const activeMapRef = externalMapRef || internalMapRef;
  const { isDark: themeIsDark } = useAppTheme();
  const screenMode = useUiStore((s) => s.screenMode);
  const isDark = propIsDark !== undefined ? propIsDark : (themeIsDark || screenMode === 'ON_BOARD');
  const { currentLocation, isTrackingActive, setTrackingActive, tripPhase, originStopLocation } = useTrackingStore();
  const [regionDelta, setRegionDelta] = useState(PASTO_COORDINATES.defaultDelta.latitudeDelta);

  useEffect(() => {
    if (!isTrackingActive || !currentLocation || !activeMapRef.current) return;
    const center = { latitude: currentLocation.latitude, longitude: currentLocation.longitude };
    if (typeof activeMapRef.current.animateCamera === 'function') {
      activeMapRef.current.animateCamera({ center, zoom: 16 }, { duration: 600 });
    } else if (typeof activeMapRef.current.animateToRegion === 'function') {
      activeMapRef.current.animateToRegion({ ...center, latitudeDelta: 0.008, longitudeDelta: 0.008 }, 600);
    }
  }, [currentLocation, isTrackingActive]);

  useEffect(() => {
    if (!originStopLocation || !activeMapRef.current) return;
    const center = { latitude: originStopLocation.latitude, longitude: originStopLocation.longitude };
    if (tripPhase === 'WALKING_TO_STOP') activeMapRef.current.animateCamera?.({ center, zoom: 17 }, { duration: 800 });
    else if (tripPhase === 'WAITING_FOR_BUS') activeMapRef.current.animateCamera?.({ center, zoom: 15 }, { duration: 800 });
  }, [tripPhase, originStopLocation]);

  const safeStops = Array.isArray(stops) ? stops : [];
  const safeRouteCoords = Array.isArray(routeCoordinates) ? routeCoordinates : [];
  const clusteredStops = useMemo(() => (safeStops.length > 0 ? clusterBusStops(safeStops, regionDelta) : []), [safeStops, regionDelta]);

  const renderedStopMarkers = useMemo(() => clusteredStops.map((item) => item.isCluster ? (
    <ClusterMarker
      key={`cluster-${item.id}`} coordinate={item.location} count={item.count}
      onPress={() => activeMapRef.current?.animateToRegion({
        latitude: item.location.latitude, longitude: item.location.longitude,
        latitudeDelta: Math.max(0.005, regionDelta / 2), longitudeDelta: Math.max(0.005, regionDelta / 2),
      }, 300)}
    />
  ) : <StopMarker key={item.stop.id} stop={item.stop} onPress={() => onStopPress?.(item.stop)} />), [clusteredStops, regionDelta, onStopPress]);

  if (Platform.OS === 'web') {
    const pastoUrl = 'https://www.openstreetmap.org/export/embed.html?bbox=-77.315%2C1.185%2C-77.245%2C1.245&layer=mapnik';
    const filterStyle = isDark ? 'invert(92%) hue-rotate(190deg) brightness(80%)' : 'saturate(115%) contrast(98%)';
    return (
      <View style={[styles.webContainer, { backgroundColor: isDark ? '#090e17' : '#f8fafc' }]}>
        {React.createElement('iframe', { src: pastoUrl, style: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none', filter: filterStyle, pointerEvents: 'none' }, title: 'Mapa de Pasto' })}
        <View style={[styles.webVignette, { backgroundColor: isDark ? 'rgba(7, 11, 19, 0.45)' : 'rgba(255, 255, 255, 0.08)' }]} pointerEvents="none" />
        <TouchableWithoutFeedback onPress={onPressMap}>
          <View style={StyleSheet.absoluteFill} onTouchStart={() => isTrackingActive && setTrackingActive(false)}>
            {renderedStopMarkers}{children}
            <CenterLocationButton mapRef={activeMapRef} onRecenter={onRecenter || onPressMap} />
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }

  if (!HAS_GOOGLE_MAPS_KEY || !NativeMapView) {
    return (
      <View style={[styles.container, { backgroundColor: isDark ? '#070b13' : '#f8fafc' }]}>
        <OsmMapView
          mapRef={activeMapRef} routeCoordinates={safeRouteCoords} routeColor={routeColor}
          stops={safeStops} clusteredStops={clusteredStops} isDark={isDark}
          onStopPress={onStopPress} onPressMap={onPressMap}
          onPanDrag={() => setTrackingActive(false)} onRegionDeltaChange={setRegionDelta}
        />
        <CenterLocationButton mapRef={activeMapRef} onRecenter={onRecenter || onPressMap} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#070b13' : '#f8fafc' }]}>
      <NativeMapView
        ref={activeMapRef} style={StyleSheet.absoluteFill} provider={PROVIDER_DEFAULT} customMapStyle={isDark ? DARK_MAP_STYLE : []}
        initialRegion={{ ...PASTO_COORDINATES.center, ...PASTO_COORDINATES.defaultDelta }}
        showsUserLocation showsMyLocationButton={false} showsCompass={false}
        onPress={onPressMap} onPanDrag={() => setTrackingActive(false)}
        onTouchStart={() => isTrackingActive && setTrackingActive(false)}
        onRegionChangeComplete={(r: any) => setRegionDelta(r.latitudeDelta)}
      >
        {safeRouteCoords.length > 0 && NativePolyline && (
          <NativePolyline coordinates={safeRouteCoords} strokeColor={routeColor} strokeWidth={5} lineCap="round" lineJoin="round" simplify={true} />
        )}
        {renderedStopMarkers}{children}
      </NativeMapView>
      <CenterLocationButton mapRef={activeMapRef} onRecenter={onRecenter || onPressMap} />
    </View>
  );
};
