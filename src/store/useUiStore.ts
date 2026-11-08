import { create } from 'zustand';

export type UiScreenMode = 'HOME' | 'ROUTE_DETAILS' | 'ON_BOARD';

interface UiState {
  screenMode: UiScreenMode;
  isReportModalOpen: boolean;
  isAvatarModalOpen: boolean;
  isProfileModalOpen: boolean;
  isTripPlannerOpen: boolean;
  selectedAvatarBroadcasterId: string | null;
  isRouteListExpanded: boolean;
  
  setScreenMode: (mode: UiScreenMode) => void;
  openReportModal: () => void;
  closeReportModal: () => void;
  openAvatarModal: (broadcasterId: string) => void;
  closeAvatarModal: () => void;
  openProfileModal: () => void;
  closeProfileModal: () => void;
  toggleProfileModal: () => void;
  openTripPlanner: () => void;
  closeTripPlanner: () => void;
  toggleTripPlanner: () => void;
  toggleRouteList: () => void;
  setRouteListExpanded: (expanded: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  screenMode: 'HOME',
  isReportModalOpen: false,
  isAvatarModalOpen: false,
  isProfileModalOpen: false,
  isTripPlannerOpen: false,
  selectedAvatarBroadcasterId: null,
  isRouteListExpanded: false,

  setScreenMode: (mode) => set({ screenMode: mode }),
  openReportModal: () => set({ isReportModalOpen: true }),
  closeReportModal: () => set({ isReportModalOpen: false }),
  openAvatarModal: (broadcasterId) => 
    set({ isAvatarModalOpen: true, selectedAvatarBroadcasterId: broadcasterId }),
  closeAvatarModal: () => 
    set({ isAvatarModalOpen: false, selectedAvatarBroadcasterId: null }),
  openProfileModal: () => set({ isProfileModalOpen: true }),
  closeProfileModal: () => set({ isProfileModalOpen: false }),
  toggleProfileModal: () => set((s) => ({ isProfileModalOpen: !s.isProfileModalOpen })),
  openTripPlanner: () => set({ isTripPlannerOpen: true }),
  closeTripPlanner: () => set({ isTripPlannerOpen: false }),
  toggleTripPlanner: () => set((s) => ({ isTripPlannerOpen: !s.isTripPlannerOpen })),
  toggleRouteList: () => 
    set((state) => ({ isRouteListExpanded: !state.isRouteListExpanded })),
  setRouteListExpanded: (expanded) => 
    set({ isRouteListExpanded: expanded }),
}));
