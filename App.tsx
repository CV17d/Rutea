import React from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MapContainer } from './src/components/map/MapContainer';
import { RoutePolyline } from './src/components/map/RoutePolyline';
import { StopMarker } from './src/components/map/StopMarker';
import { LiveBusMarker } from './src/components/map/LiveBusMarker';
import { ReportMarker } from './src/components/map/ReportMarker';
import { FloatingSearchBar } from './src/components/floating/FloatingSearchBar';
import { RouteSummaryCard } from './src/components/floating/RouteSummaryCard';
import { RouteHeaderToggle, RouteHeroCard, StopTimeline } from './src/components/routeDetail';
import { ActiveTrackingView } from './src/components/activeTracking';
import { BottomNavBar } from './src/components/navigation/BottomNavBar';
import { QuickReportModal } from './src/components/floating/QuickReportModal';
import { AvatarCard } from './src/components/avatar/AvatarCard';
import { UserProfileCard } from './src/components/profile/UserProfileCard';
import { TripPlanner } from './src/components/tripPlanner';
import { useRoutesStore } from './src/store/useRoutesStore';
import { useTrackingStore } from './src/store/useTrackingStore';
import { useUiStore } from './src/store/useUiStore';
import { useSocketRoutes } from './src/hooks/useSocketRoutes';
import { useLocationTracking } from './src/hooks/useLocationTracking';
import { useRouteQuery } from './src/hooks/useRouteQuery';
import { useBusSimulator } from './src/hooks/useBusSimulator';
import { useProximityAlert } from './src/hooks/useProximityAlert';

export default function App() {
  useSocketRoutes();
  useLocationTracking();

  const selectedRoute = useRoutesStore((s) => s.getSelectedRoute());
  const { coordinates: routeCoordinates } = useRouteQuery(selectedRoute?.id || 'route-c16');
  useBusSimulator(selectedRoute, routeCoordinates.length > 0 ? routeCoordinates : selectedRoute?.coordinates);

  useProximityAlert({
    routeId: selectedRoute?.id,
    targetLocation: selectedRoute?.stops?.[0]?.location,
    thresholdMeters: 400,
  });

  const { activeBuses, selectedBusId, setSelectedBusId, reports } = useTrackingStore();
  const {
    screenMode,
    setScreenMode,
    isAvatarModalOpen,
    closeAvatarModal,
    openAvatarModal,
    isProfileModalOpen,
    closeProfileModal,
    isTripPlannerOpen,
    closeTripPlanner,
  } = useUiStore();

  const currentBusList = Object.values(activeBuses).filter(
    (b) => !selectedRoute || b.routeId === selectedRoute.id
  );

  const selectedBus = selectedBusId ? activeBuses[selectedBusId] : undefined;

  return (
    <View style={[styles.container, { backgroundColor: screenMode === 'ON_BOARD' ? '#0f172a' : '#f8fafc' }]}>
      <StatusBar style={screenMode === 'ON_BOARD' ? 'light' : 'dark'} />

      {screenMode === 'ON_BOARD' ? (
        <ActiveTrackingView />
      ) : (
        <>
          <MapContainer
            routeCoordinates={routeCoordinates.length > 0 ? routeCoordinates : selectedRoute?.coordinates}
            routeColor={selectedRoute?.color}
            onPressMap={() => { setSelectedBusId(null); closeAvatarModal(); }}
          >
            {selectedRoute && (
              <>
                <RoutePolyline
                  route={selectedRoute}
                  coordinates={routeCoordinates.length > 0 ? routeCoordinates : undefined}
                />
                {selectedRoute.stops.map((stop) => (
                  <StopMarker key={stop.id} stop={stop} />
                ))}
              </>
            )}

            {currentBusList.map((bus) => (
              <LiveBusMarker
                key={bus.busId}
                bus={bus}
                onPress={() => {
                  setSelectedBusId(bus.busId);
                  if (bus.broadcasterAlias) {
                    openAvatarModal(bus.busId);
                  }
                }}
              />
            ))}

            {reports.map((report) => (
              <ReportMarker key={report.id} report={report} />
            ))}
          </MapContainer>

          {screenMode === 'ROUTE_DETAILS' ? (
            <RouteHeaderToggle onBack={() => setScreenMode('HOME')} />
          ) : (
            <FloatingSearchBar />
          )}

          {isAvatarModalOpen && selectedBus && selectedBus.broadcasterAlias && (
            <View style={styles.floatingAvatarWrap}>
              <AvatarCard
                alias={selectedBus.broadcasterAlias}
                avatarSeed={selectedBus.broadcasterAvatarSeed || 'default'}
                points={selectedBus.broadcasterPoints || 100}
                levelTitle="Vigía del Galeras"
                onClose={closeAvatarModal}
              />
            </View>
          )}

          {screenMode === 'ROUTE_DETAILS' ? (
            <View style={styles.bottomDetailWrap}>
              <RouteHeroCard />
              <StopTimeline onPressDetails={() => setScreenMode('ON_BOARD')} />
            </View>
          ) : (
            <View style={styles.bottomHomeWrap}>
              <RouteSummaryCard />
              <BottomNavBar />
            </View>
          )}
        </>
      )}

      <QuickReportModal />

      {isProfileModalOpen && (
        <UserProfileCard onClose={closeProfileModal} />
      )}

      {isTripPlannerOpen && (
        <TripPlanner onClose={closeTripPlanner} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  floatingAvatarWrap: {
    position: 'absolute',
    top: 140,
    left: 20,
    right: 20,
    zIndex: 40,
  },
  bottomHomeWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 35,
  },
  bottomDetailWrap: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    zIndex: 35,
  },
});
