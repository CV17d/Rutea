import React from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MapContainer } from './src/components/map/MapContainer';
import { RoutePolyline } from './src/components/map/RoutePolyline';
import { StopMarker } from './src/components/map/StopMarker';
import { BusMarker } from './src/components/map/BusMarker';
import { FloatingSearchBar } from './src/components/floating/FloatingSearchBar';
import { RouteDetailCard } from './src/components/floating/RouteDetailCard';
import { OnBoardPanel } from './src/components/floating/OnBoardPanel';
import { CommunityReportFeed } from './src/components/floating/CommunityReportFeed';
import { QuickReportModal } from './src/components/floating/QuickReportModal';
import { AvatarCard } from './src/components/avatar/AvatarCard';
import { useRoutesStore } from './src/store/useRoutesStore';
import { useTrackingStore } from './src/store/useTrackingStore';
import { useUiStore } from './src/store/useUiStore';
import { useSocketRoutes } from './src/hooks/useSocketRoutes';
import { useLocationTracker } from './src/hooks/useLocationTracker';

export default function App() {
  useSocketRoutes();
  useLocationTracker();

  const selectedRoute = useRoutesStore((s) => s.getSelectedRoute());
  const { activeBuses, selectedBusId, setSelectedBusId } = useTrackingStore();
  const { screenMode, isAvatarModalOpen, closeAvatarModal, openAvatarModal } = useUiStore();

  const currentBusList = Object.values(activeBuses).filter(
    (b) => !selectedRoute || b.routeId === selectedRoute.id
  );

  const selectedBus = selectedBusId ? activeBuses[selectedBusId] : undefined;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* 100% Pasto Viewport Background Map */}
      <MapContainer onPressMap={() => { setSelectedBusId(null); closeAvatarModal(); }}>
        {selectedRoute && (
          <>
            <RoutePolyline route={selectedRoute} />
            {selectedRoute.stops.map((stop) => (
              <StopMarker key={stop.id} stop={stop} />
            ))}
          </>
        )}

        {currentBusList.map((bus) => (
          <BusMarker
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
      </MapContainer>

      {/* Floating Glassmorphic Top Controls */}
      <FloatingSearchBar />

      {/* Floating Broadcaster Avatar Detail Card on Map Tap */}
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

      {/* Dynamic Bottom Panels according to Mode */}
      {screenMode === 'ON_BOARD' ? (
        <View style={styles.bottomBroadcasterWrap}>
          <CommunityReportFeed />
          <OnBoardPanel />
        </View>
      ) : (
        <RouteDetailCard />
      )}

      {/* Crowdsourced Incident Modal */}
      <QuickReportModal />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070b13',
  },
  floatingAvatarWrap: {
    position: 'absolute',
    top: 140,
    left: 20,
    right: 20,
    zIndex: 40,
  },
  bottomBroadcasterWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 35,
  },
});
