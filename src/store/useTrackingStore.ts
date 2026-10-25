import { create } from 'zustand';
import { ProjectedBusLocation } from '../types/telemetry.types';
import { CommunityReport } from '../types/user.types';

export interface CurrentUserLocation {
  latitude: number;
  longitude: number;
  speedKmh: number;
  heading: number;
  accuracy: number;
  timestamp: number;
}

interface TrackingState {
  activeBuses: Record<string, ProjectedBusLocation>;
  reports: CommunityReport[];
  selectedBusId: string | null;
  currentLocation: CurrentUserLocation | null;
  setCurrentLocation: (loc: CurrentUserLocation | null) => void;
  updateBusLocation: (bus: ProjectedBusLocation) => void;
  removeBus: (busId: string) => void;
  addReport: (report: CommunityReport) => void;
  setSelectedBusId: (busId: string | null) => void;
  getSelectedBus: () => ProjectedBusLocation | undefined;
  getBusesByRoute: (routeId: string) => ProjectedBusLocation[];
}

const INITIAL_REPORTS: CommunityReport[] = [
  {
    id: 'rep-init-1',
    category: 'TRAFFIC_JAM',
    title: 'Tráfico pesado en Calle 18',
    description: 'Congestión vehicular sector Plaza de Nariño',
    reporterAlias: 'CuyVeloz42',
    reporterAvatarSeed: 'cuy42',
    latitude: 1.2145,
    longitude: -77.2783,
    timestamp: Date.now(),
    upvotes: 4,
    routeCode: 'C1',
  },
  {
    id: 'rep-init-2',
    category: 'ROAD_BLOCK',
    title: 'Vía cerrada por obras',
    description: 'Paso restringido en Maridíaz',
    reporterAlias: 'GalerasRunner19',
    reporterAvatarSeed: 'galeras19',
    latitude: 1.2210,
    longitude: -77.2830,
    timestamp: Date.now(),
    upvotes: 7,
    routeCode: 'C1',
  },
  {
    id: 'rep-init-3',
    category: 'BUS_FULL',
    title: 'Bus lleno en Torobajo',
    description: 'Alta afluencia de estudiantes Udenar',
    reporterAlias: 'ChasquiPasto',
    reporterAvatarSeed: 'cuy-sombrero',
    latitude: 1.2312,
    longitude: -77.2918,
    timestamp: Date.now(),
    upvotes: 5,
    routeCode: 'C1',
  },
];

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
  reports: INITIAL_REPORTS,
  selectedBusId: null,
  currentLocation: null,
  setCurrentLocation: (loc) => set({ currentLocation: loc }),
  addReport: (report) => set((s) => ({ reports: [report, ...s.reports] })),

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
