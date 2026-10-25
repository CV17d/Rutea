export type UserAppRole = 'RECEIVER' | 'BROADCASTER';

export interface UserProfile {
  id: string; // Anonymous UUID
  alias: string; // ej: "CuyVeloz42", "GalerasRunner"
  avatarSeed: string;
  points: number;
  levelTitle: string; // ej: "Guía de Pasto", "Vigía del Galeras", "Caminante"
  totalDistanceBroadcastKm: number;
  totalTimeBroadcastMinutes: number;
  isBroadcasting: boolean;
  activeRouteId: string | null;
}

export type IncidentCategory = 
  | 'TRAFFIC_JAM' 
  | 'ROAD_BLOCK' 
  | 'BUS_FULL'
  | 'DETOUR' 
  | 'ACCIDENT' 
  | 'POLICE_CHECK';

export interface CommunityReport {
  id: string;
  category: IncidentCategory;
  title: string;
  description: string;
  reporterAlias: string;
  reporterAvatarSeed: string;
  timestamp: number;
  upvotes: number;
  routeCode?: string;
  routeId?: string;
  latitude?: number;
  longitude?: number;
  expiresAt?: number;
}
