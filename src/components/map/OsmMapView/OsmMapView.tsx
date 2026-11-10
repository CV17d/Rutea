import React, { useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { BusStop, LatLng } from '../../../types/route.types';
import { useTrackingStore } from '../../../store/useTrackingStore';
import { useRoutesStore } from '../../../store/useRoutesStore';
import { useUiStore } from '../../../store/useUiStore';
import { useTranslation } from '../../../i18n/useTranslation';
import { getTranslatedReporterAlias, getTranslatedReportTitle } from '../../../utils/reportDisplay.utils';
import { buildOsmMapHtml } from './osmMapHtml';

let NativeWebView: any = null;
if (Platform.OS !== 'web') {
  try { NativeWebView = require('react-native-webview').WebView; } catch { NativeWebView = null; }
}

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
  const iframeRef = useRef<any>(null);
  const { activeBuses, walkingPolyline, reports, currentLocation, setSelectedBusId } = useTrackingStore();
  const selectedRouteId = useRoutesStore((s) => s.selectedRouteId);
  const openAvatarModal = useUiStore((s) => s.openAvatarModal);
  const { t } = useTranslation();

  const htmlSource = useMemo(() => ({ html: buildOsmMapHtml(isDark), baseUrl: 'https://rutea.app/' }), []); // baseUrl: Referer válido para OSM

  const sendToMap = (msg: Record<string, unknown>, js: string) => {
    if (Platform.OS === 'web') {
      try { iframeRef.current?.contentWindow?.postMessage(msg, '*'); } catch { /* noop */ }
    } else {
      webRef.current?.injectJavaScript(`${js};true;`);
    }
  };

  const flyTo = (lat: number, lng: number, zoom: number) => {
    sendToMap({ __ruteaCamera: [lat, lng, zoom] }, `window.__ruteaCamera&&window.__ruteaCamera(${lat},${lng},${zoom})`);
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
        heading: b.heading || 0, code: b.routeCode, color: b.routeColor || routeColor || '#10b981', status: b.status,
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
    sendToMap({ __ruteaUpdate: payload }, `window.__ruteaUpdate&&window.__ruteaUpdate(${JSON.stringify(payload)})`);
  };

  useEffect(() => { pushState(); }, [payload]);

  const handleRawMessage = (raw: string) => {
    try {
      const msg = JSON.parse(raw);
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
  const handleMessage = (ev: any) => handleRawMessage(ev?.nativeEvent?.data);

  const handlerRef = useRef(handleRawMessage);
  handlerRef.current = handleRawMessage;
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;
    const onMsg = (e: MessageEvent) => {
      if (e.source !== iframeRef.current?.contentWindow) return;
      if (e.data && e.data.__rutea && typeof e.data.data === 'string') handlerRef.current(e.data.data);
    };
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, []);

  if (Platform.OS === 'web') {
    return (
      <View style={[StyleSheet.absoluteFill, { backgroundColor: isDark ? '#0D1A20' : '#f8fafc' }]}>
        {React.createElement('iframe', {
          ref: iframeRef, srcDoc: htmlSource.html, title: 'Mapa de Pasto', onLoad: pushState,
          style: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' },
        })}
      </View>
    );
  }

  if (!NativeWebView) return <View style={[StyleSheet.absoluteFill, { backgroundColor: isDark ? '#0D1A20' : '#f8fafc' }]} />;

  return (
    <NativeWebView
      ref={webRef} source={htmlSource} style={StyleSheet.absoluteFill}
      originWhitelist={['*']} javaScriptEnabled domStorageEnabled mixedContentMode="always"
      onLoadEnd={pushState} onMessage={handleMessage}
    />
  );
};
