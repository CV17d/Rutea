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
  totalPoints: number;
  currentRank: string;
  setGamification: (points: number, rank: string) => void;
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
    id: 'rep-init-1', category: 'TRAFFIC_JAM', title: 'Tráfico pesado en Calle 18',
    description: 'Congestión sector Plaza de Nariño', reporterAlias: 'CuyVeloz42',
    reporterAvatarSeed: 'cuy42', latitude: 1.2145, longitude: -77.2783,
    timestamp: Date.now(), upvotes: 4, routeCode: 'C1',
  },
  {
    id: 'rep-init-2', category: 'ROAD_BLOCK', title: 'Vía cerrada por obras',
    description: 'Paso restringido en Maridíaz', reporterAlias: 'GalerasRunner19',
    reporterAvatarSeed: 'galeras19', latitude: 1.2210, longitude: -77.2830,
    timestamp: Date.now(), upvotes: 7, routeCode: 'C1',
  },
  {
    id: 'rep-init-3', category: 'BUS_FULL', title: 'Bus lleno en Torobajo',
    description: 'Alta afluencia de estudiantes Udenar', reporterAlias: 'ChasquiPasto',
    reporterAvatarSeed: 'cuy-sombrero', latitude: 1.2312, longitude: -77.2918,
    timestamp: Date.now(), upvotes: 5, routeCode: 'C1',
  },
];

export const useTrackingStore = create<TrackingState>((set, get) => ({
  activeBuses: {},
  reports: INITIAL_REPORTS,
  selectedBusId: null,
  currentLocation: null,
  totalPoints: 85,
  currentRank: 'Vigía del Galeras',
  setGamification: (points, rank) => set({ totalPoints: points, currentRank: rank }),
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
