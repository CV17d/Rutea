import { create } from 'zustand';
import { ProjectedBusLocation } from '../types/telemetry.types';

interface TrackingState {
  activeBuses: Record<string, ProjectedBusLocation>;
  selectedBusId: string | null;
  updateBusLocation: (bus: ProjectedBusLocation) => void;
  removeBus: (busId: string) => void;
  setSelectedBusId: (busId: string | null) => void;
  getSelectedBus: () => ProjectedBusLocation | undefined;
  getBusesByRoute: (routeId: string) => ProjectedBusLocation[];
}

export const useTrackingStore = create<TrackingState>((set, get) => ({
  activeBuses: {
    'bus-c1-live-1': {
      busId: 'bus-c1-live-1',
      routeId: 'route-c1',
      routeCode: 'C1',
      routeColor: '#10b981',
      status: 'LIVE',
      position: { latitude: 1.2145, longitude: -77.2783 },
      snappedPosition: { latitude: 1.2145, longitude: -77.2783 },
      heading: 340,
      speedKmh: 24,
      distanceToNextStopMeters: 380,
      estimatedArrivalMinutes: 2,
      nextStopName: 'Plaza Nariño (Cra 25)',
      broadcasterAlias: 'CuyVeloz42',
      broadcasterAvatarSeed: 'cuy42',
      broadcasterPoints: 340,
      lastUpdated: Date.now(),
    },
    'bus-c1-ghost-2': {
      busId: 'bus-c1-ghost-2',
      routeId: 'route-c1',
      routeCode: 'C1',
      routeColor: '#10b981',
      status: 'GHOST',
      position: { latitude: 1.1850, longitude: -77.2810 },
      snappedPosition: { latitude: 1.1850, longitude: -77.2810 },
      heading: 15,
      speedKmh: 20,
      distanceToNextStopMeters: 920,
      estimatedArrivalMinutes: 6,
      nextStopName: 'Chapal Sur',
      lastUpdated: Date.now(),
    },
    'bus-c16-live-1': {
      busId: 'bus-c16-live-1',
      routeId: 'route-c16',
      routeCode: 'C16',
      routeColor: '#38bdf8',
      status: 'LIVE',
      position: { latitude: 1.2115, longitude: -77.2778 },
      snappedPosition: { latitude: 1.2115, longitude: -77.2778 },
      heading: 355,
      speedKmh: 26,
      distanceToNextStopMeters: 450,
      estimatedArrivalMinutes: 3,
      nextStopName: 'Avenida Colombia',
      broadcasterAlias: 'GalerasRunner19',
      broadcasterAvatarSeed: 'galeras19',
      broadcasterPoints: 195,
      lastUpdated: Date.now(),
    },
    'bus-e4-live-1': {
      busId: 'bus-e4-live-1',
      routeId: 'route-e4',
      routeCode: 'E4',
      routeColor: '#ec4899',
      status: 'LIVE',
      position: { latitude: 1.2018, longitude: -77.2662 },
      snappedPosition: { latitude: 1.2018, longitude: -77.2662 },
      heading: 45,
      speedKmh: 22,
      distanceToNextStopMeters: 510,
      estimatedArrivalMinutes: 4,
      nextStopName: 'Terminal de Transportes',
      broadcasterAlias: 'VolcanRunner88',
      broadcasterAvatarSeed: 'volcan88',
      broadcasterPoints: 210,
      lastUpdated: Date.now(),
    },
    'bus-e1-live-1': {
      busId: 'bus-e1-live-1',
      routeId: 'route-e1',
      routeCode: 'E1',
      routeColor: '#f59e0b',
      status: 'LIVE',
      position: { latitude: 1.2190, longitude: -77.2720 },
      snappedPosition: { latitude: 1.2190, longitude: -77.2720 },
      heading: 190,
      speedKmh: 25,
      distanceToNextStopMeters: 620,
      estimatedArrivalMinutes: 5,
      nextStopName: 'Hospital Infantil',
      broadcasterAlias: 'BarnizMaster55',
      broadcasterAvatarSeed: 'barniz55',
      broadcasterPoints: 175,
      lastUpdated: Date.now(),
    },
  },
  selectedBusId: null,

  updateBusLocation: (bus) => {
    set((state) => ({
      activeBuses: { ...state.activeBuses, [bus.busId]: bus },
    }));
  },

  removeBus: (busId) => {
    set((state) => {
      const copy = { ...state.activeBuses };
      delete copy[busId];
      return { activeBuses: copy };
    });
  },

  setSelectedBusId: (busId) => set({ selectedBusId: busId }),

  getSelectedBus: () => {
    const { activeBuses, selectedBusId } = get();
    return selectedBusId ? activeBuses[selectedBusId] : undefined;
  },

  getBusesByRoute: (routeId) => {
    const { activeBuses } = get();
    return Object.values(activeBuses).filter((b) => b.routeId === routeId);
  },
}));
