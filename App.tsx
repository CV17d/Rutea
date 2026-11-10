import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as NativeSplash from 'expo-splash-screen';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MapContainer } from './src/components/map/MapContainer';
import { FloatingSearchBar } from './src/components/floating/FloatingSearchBar';
import { RouteSummaryCard } from './src/components/floating/RouteSummaryCard';
import { RouteHeaderToggle, RouteHeroCard, StopTimeline } from './src/components/routeDetail';
import { ActiveTrackingView } from './src/components/activeTracking';
import { BottomNavBar } from './src/components/navigation/BottomNavBar';
import { ReportIncidentModal } from './src/components/floating/ReportIncidentModal';
import { AvatarCard } from './src/components/avatar/AvatarCard';
import { UserProfileCard } from './src/components/profile/UserProfileCard';
import { TripPlanner } from './src/components/tripPlanner';
import { LoginScreen } from './src/components/auth/LoginScreen';
import { InAppNotification } from './src/components/ui/InAppNotification';
import { SplashScreen } from './src/components/ui/SplashScreen';
import { ErrorBoundary } from './src/components/ui/ErrorBoundary';
import { SettingsModal } from './src/components/settings/SettingsModal';
import { useAuthStore } from './src/store/useAuthStore';
import { useRoutesStore } from './src/store/useRoutesStore';
import { useTrackingStore } from './src/store/useTrackingStore';
import { useUiStore } from './src/store/useUiStore';
import { useSettingsStore } from './src/store/useSettingsStore';
import { useAppTheme } from './src/hooks/useAppTheme';
import { useSocketRoutes } from './src/hooks/useSocketRoutes';
import { useLocationTracking } from './src/hooks/useLocationTracking';
import { useRouteQuery } from './src/hooks/useRouteQuery';
import { useBusSimulator } from './src/hooks/useBusSimulator';
import { useProximityAlert } from './src/hooks/useProximityAlert';
import { useIncidentReports } from './src/hooks/useIncidentReports';
import { useOfflineSync } from './src/hooks/useOfflineSync';
import { useStopArrivalDetection } from './src/hooks/useStopArrivalDetection';
import { useTranslation } from './src/i18n/useTranslation';

NativeSplash.preventAutoHideAsync().catch(() => {});

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { isDark } = useAppTheme();
  const { t } = useTranslation();
  useOfflineSync();
  useSocketRoutes();
  useLocationTracking();
  useStopArrivalDetection();

  const proximityRadiusMeters = useSettingsStore((s) => s.proximityRadiusMeters);
  // Alerta sólo cuando el usuario planeó un viaje: el bus se acerca a SU punto de abordaje.
  const boardPoint = useTrackingStore((s) => s.originStopLocation);
  const selectedRoute = useRoutesStore((s) => s.getSelectedRoute());
  const { coordinates: routeCoordinates } = useRouteQuery(selectedRoute?.id || '');
  const activeRouteCoords = Array.isArray(routeCoordinates) ? routeCoordinates : [];
  useBusSimulator(selectedRoute, activeRouteCoords.length > 0 ? activeRouteCoords : selectedRoute?.coordinates);
  useProximityAlert({ routeId: selectedRoute?.id, targetLocation: boardPoint, thresholdMeters: proximityRadiusMeters });
  useIncidentReports(selectedRoute?.id);

  const { activeBuses, selectedBusId, setSelectedBusId, arrivalMessage, setArrivalMessage } = useTrackingStore();
  const {
    screenMode, setScreenMode, isAvatarModalOpen, closeAvatarModal,
    isProfileModalOpen, closeProfileModal, isTripPlannerOpen, closeTripPlanner,
  } = useUiStore();

  useEffect(() => {
    if (arrivalMessage) {
      const t = setTimeout(() => setArrivalMessage(null), 3500);
      return () => clearTimeout(t);
    }
  }, [arrivalMessage, setArrivalMessage]);

  if (!isAuthenticated) {
    return (
      <View style={[styles.container, showSplash && { backgroundColor: '#ffffff' }]}>
        <StatusBar style={showSplash ? 'dark' : 'light'} />
        <LoginScreen />
        {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
      </View>
    );
  }

  const selectedBus = selectedBusId ? activeBuses[selectedBusId] : undefined;

  return (
    <ErrorBoundary>
      <View style={[styles.container, { backgroundColor: showSplash ? '#ffffff' : isDark || screenMode === 'ON_BOARD' ? '#0f172a' : '#f8fafc' }]}>
      <StatusBar style={showSplash ? 'dark' : isDark || screenMode === 'ON_BOARD' ? 'light' : 'dark'} />
      <InAppNotification />
      {arrivalMessage && (
        <View style={styles.arrivalToast}>
          <MaterialCommunityIcons name="check-circle" size={18} color="#10b981" />
          <Text style={styles.arrivalToastText}>{arrivalMessage === '¡Llegaste a la parada!' ? t('alerts.arrivedAtStop', arrivalMessage) : arrivalMessage}</Text>
        </View>
      )}
      {screenMode === 'ON_BOARD' ? (
        <ActiveTrackingView />
      ) : (
        <>
          <MapContainer
            isDark={isDark}
            routeCoordinates={activeRouteCoords.length > 0 ? activeRouteCoords : selectedRoute?.coordinates}
            routeColor={selectedRoute?.color} stops={selectedRoute?.stops}
            onPressMap={() => { setSelectedBusId(null); closeAvatarModal(); }}
          />

          {screenMode === 'ROUTE_DETAILS' ? (
            <RouteHeaderToggle onBack={() => setScreenMode('HOME')} />
          ) : (
            <FloatingSearchBar />
          )}

          {isAvatarModalOpen && selectedBus && selectedBus.broadcasterAlias && (
            <View style={styles.floatingAvatarWrap}>
              <AvatarCard
                alias={selectedBus.broadcasterAlias} avatarSeed={selectedBus.broadcasterAvatarSeed || 'default'}
                points={selectedBus.broadcasterPoints || 100} levelTitle="Vigía del Galeras" onClose={closeAvatarModal}
              />
            </View>
          )}

          {screenMode === 'ROUTE_DETAILS' ? (
            <View style={styles.bottomDetailWrap}>
              {selectedRoute && <RouteHeroCard />}
              {selectedRoute && <StopTimeline onPressDetails={() => setScreenMode('ON_BOARD')} />}
            </View>
          ) : (
            <View style={styles.bottomHomeWrap}>
              {selectedRoute && <RouteSummaryCard />}
              <BottomNavBar />
            </View>
          )}
        </>
      )}

      <ReportIncidentModal />
      <SettingsModal />
      {isProfileModalOpen && <UserProfileCard onClose={closeProfileModal} />}
      {isTripPlannerOpen && <TripPlanner onClose={closeTripPlanner} />}
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
      </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  floatingAvatarWrap: { position: 'absolute', top: 140, left: 20, right: 20, zIndex: 40 },
  bottomHomeWrap: { position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 35 },
  bottomDetailWrap: { position: 'absolute', bottom: 24, left: 0, right: 0, zIndex: 35 },
  arrivalToast: {
    position: 'absolute', top: 56, alignSelf: 'center', zIndex: 60,
    backgroundColor: '#064e3b', flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 24,
    borderWidth: 1, borderColor: '#10b981', elevation: 6,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4,
  },
  arrivalToastText: { color: '#ffffff', fontSize: 13, fontWeight: '700', marginLeft: 8 },
});
