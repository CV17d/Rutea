import React, { useRef, useState, useMemo, useEffect } from 'react';
import { View } from 'react-native';
import { PASTO_COORDINATES } from '../../../constants/pastoCoordinates';
import { useUiStore } from '../../../store/useUiStore';
import { useTrackingStore } from '../../../store/useTrackingStore';
import { useAppTheme } from '../../../hooks/useAppTheme';
import { LatLng, BusStop } from '../../../types/route.types';
import { CenterLocationButton } from '../CenterLocationButton';
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

// El mapa usa Leaflet + teselas abiertas (OpenStreetMap / CARTO): no requiere API keys.
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

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#0D1A20' : '#f8fafc' }]}>
      <OsmMapView
        mapRef={activeMapRef} routeCoordinates={safeRouteCoords} routeColor={routeColor}
        stops={safeStops} clusteredStops={clusteredStops} isDark={isDark}
        onStopPress={onStopPress} onPressMap={onPressMap}
        onPanDrag={() => setTrackingActive(false)} onRegionDeltaChange={setRegionDelta}
      />
      <CenterLocationButton mapRef={activeMapRef} onRecenter={onRecenter || onPressMap} />
    </View>
  );
};
