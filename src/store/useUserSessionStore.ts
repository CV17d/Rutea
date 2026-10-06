import { create } from 'zustand';
import { UserAppRole, UserProfile } from '../types/user.types';
import { generateLocalAlias, getLevelTitleByPoints } from '../utils/avatar.utils';

interface UserSessionState {
  role: UserAppRole;
  profile: UserProfile;
  toggleRole: () => void;
  setRole: (role: UserAppRole) => void;
  startBroadcasting: (routeId: string) => void;
  stopBroadcasting: () => void;
  addPoints: (pointsToAdd: number) => void;
}

const initialSeed = 'seed-user-pasto-85';

export const useUserSessionStore = create<UserSessionState>((set) => ({
  role: 'RECEIVER',
  profile: {
    id: 'user-anon-8585',
    alias: generateLocalAlias(initialSeed),
    avatarSeed: initialSeed,
    points: 85, // Exact reference specification: "85 PTS"
    levelTitle: getLevelTitleByPoints(85),
    totalDistanceBroadcastKm: 14.2,
    totalTimeBroadcastMinutes: 48,
    isBroadcasting: false,
    activeRouteId: null,
  },

  toggleRole: () => {
    set((state) => {
      const nextRole: UserAppRole = state.role === 'RECEIVER' ? 'BROADCASTER' : 'RECEIVER';
      return {
        role: nextRole,
        profile: {
          ...state.profile,
          isBroadcasting: nextRole === 'BROADCASTER',
        },
      };
    });
  },

  setRole: (role) => {
    set((state) => ({
      role,
      profile: {
        ...state.profile,
        isBroadcasting: role === 'BROADCASTER',
      },
    }));
  },

  startBroadcasting: (routeId) => {
    set((state) => ({
      role: 'BROADCASTER',
      profile: {
        ...state.profile,
        isBroadcasting: true,
        activeRouteId: routeId,
      },
    }));
  },

  stopBroadcasting: () => {
    set((state) => ({
      role: 'RECEIVER',
      profile: {
        ...state.profile,
        isBroadcasting: false,
        activeRouteId: null,
      },
    }));
  },

  addPoints: (pointsToAdd) => {
    set((state) => {
      const newPoints = state.profile.points + pointsToAdd;
      return {
        profile: {
          ...state.profile,
          points: newPoints,
          levelTitle: getLevelTitleByPoints(newPoints),
        },
      };
    });
  },
}));
