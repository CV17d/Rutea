import React, { useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { BusStop, LatLng } from '../../../types/route.types';
import { useTrackingStore } from '../../../store/useTrackingStore';
import { useRoutesStore } from '../../../store/useRoutesStore';
import { useUiStore } from '../../../store/useUiStore';
import { useTranslation } from '../../../i18n/useTranslation';
import { getTranslatedReporterAlias, getTranslatedReportTitle } from '../../../utils/reportDisplay.utils';
import { buildOsmMapHtml } from './osmMapHtml';

let NativeWebView: any = null;
try { NativeWebView = require('react-native-webview').WebView; } catch { NativeWebView = null; }

const CAT_COLORS: Record<string, string> = {
  TRAFFIC_JAM: '#ef4444', TRAFFIC: '#ef4444', ROAD_BLOCK: '#f59e0b',
  BUS_FULL: '#f59e0b', FULL_BUS: '#f59e0b', DETOUR: '#8b5cf6', ACCIDENT: '#dc2626', POLICE_CHECK: '#3b82f6',
};

export interface OsmMapViewProps {
  mapRef?: React.RefObject<any>;
  routeCoordinates: LatLng[];
  routeColor: string;
  stops: BusStop[];
  clusteredStops: any[];
  isDark: boolean;
  onStopPress?: (stop: BusStop) => void;
  onPressMap?: () => void;
  onPanDrag?: () => void;
  onRegionDeltaChange?: (delta: number) => void;
}

export const OsmMapView: React.FC<OsmMapViewProps> = ({
  mapRef, routeCoordinates, routeColor, stops, clusteredStops, isDark,
  onStopPress, onPressMap, onPanDrag, onRegionDeltaChange,
}) => {
  const webRef = useRef<any>(null);
  const { activeBuses, walkingPolyline, reports, currentLocation, setSelectedBusId } = useTrackingStore();
  const selectedRouteId = useRoutesStore((s) => s.selectedRouteId);
  const openAvatarModal = useUiStore((s) => s.openAvatarModal);
  const { t } = useTranslation();

  const htmlSource = useMemo(() => ({ html: buildOsmMapHtml(isDark) }), []);

  const flyTo = (lat: number, lng: number, zoom: number) => {
    webRef.current?.injectJavaScript(`window.__ruteaCamera&&window.__ruteaCamera(${lat},${lng},${zoom});true;`);
  };

  useImperativeHandle(mapRef, () => ({
    animateCamera: (cam: any) => {
      if (cam?.center) flyTo(cam.center.latitude, cam.center.longitude, cam.zoom || 16);
    },
    animateToRegion: (reg: any) => {
      const z = Math.max(11, Math.min(18, Math.round(Math.log2(360 / Math.max(0.002, reg?.latitudeDelta || 0.01)))));
      flyTo(reg.latitude, reg.longitude, z);
    },
  }));

  const payload = useMemo(() => {
    const buses = selectedRouteId ? Object.values(activeBuses).filter((b) => b.routeId === selectedRouteId) : [];
    return {
      isDark,
      routeCoords: routeCoordinates.map((c) => [c.latitude, c.longitude]),
      routeColor,
      walkingCoords: (Array.isArray(walkingPolyline) ? walkingPolyline : []).map((c) => [c.latitude, c.longitude]),
      stopItems: clusteredStops.map((it) => it.isCluster
        ? { isCluster: true, lat: it.location.latitude, lng: it.location.longitude, count: it.count }
        : { isCluster: false, id: it.stop.id, lat: it.stop.location.latitude, lng: it.stop.location.longitude }),
      buses: buses.map((b) => ({
        id: b.busId, lat: (b.snappedPosition || b.position).latitude, lng: (b.snappedPosition || b.position).longitude,
        heading: b.heading || 0, color: b.routeColor || routeColor || '#10b981', status: b.status,
      })),
      reports: reports.map((r) => ({
        id: r.id, lat: r.latitude || 1.2145, lng: r.longitude || -77.2783,
        color: CAT_COLORS[r.category] || '#f59e0b', title: getTranslatedReportTitle(r, t),
        upvotes: r.upvotes, alias: getTranslatedReporterAlias(r.reporterAlias, t),
      })),
      userLoc: currentLocation ? { lat: currentLocation.latitude, lng: currentLocation.longitude } : null,
    };
  }, [isDark, routeCoordinates, routeColor, walkingPolyline, clusteredStops, activeBuses, selectedRouteId, reports, currentLocation, t]);

  const pushState = () => {
    webRef.current?.injectJavaScript(`window.__ruteaUpdate&&window.__ruteaUpdate(${JSON.stringify(payload)});true;`);
  };

  useEffect(() => { pushState(); }, [payload]);

  const handleMessage = (ev: any) => {
    try {
      const msg = JSON.parse(ev.nativeEvent.data);
      if (msg.type === 'panDrag') onPanDrag?.();
      else if (msg.type === 'mapPress') onPressMap?.();
      else if (msg.type === 'regionChange' && msg.latitudeDelta) onRegionDeltaChange?.(msg.latitudeDelta);
      else if (msg.type === 'clusterPress') flyTo(msg.lat, msg.lng, 16);
      else if (msg.type === 'stopPress') {
        const stop = stops.find((s) => s.id === msg.stopId);
        if (stop) onStopPress?.(stop);
      } else if (msg.type === 'busPress') {
        setSelectedBusId(msg.busId);
        const bus = activeBuses[msg.busId];
        if (bus?.broadcasterAlias) openAvatarModal(msg.busId);
      }
    } catch { /* noop */ }
  };

  if (!NativeWebView) return <View style={[StyleSheet.absoluteFill, { backgroundColor: isDark ? '#070b13' : '#f8fafc' }]} />;

  return (
    <NativeWebView
      ref={webRef} source={htmlSource} style={StyleSheet.absoluteFill}
      originWhitelist={['*']} javaScriptEnabled domStorageEnabled mixedContentMode="always"
      onLoadEnd={pushState} onMessage={handleMessage}
    />
  );
};
