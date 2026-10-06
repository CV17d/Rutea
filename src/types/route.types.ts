export interface LatLng {
  latitude: number;
  longitude: number;
}

export interface BusStop {
  id: string;
  name: string;
  orderIndex: number;
  location: LatLng;
  estimatedWaitMinutes: number;
  isTerminal?: boolean;
}

export interface TransitRoute {
  id: string;
  code: string; // ej: "C1", "C16", "E1", "E4"
  name: string;
  color: string;
  description: string;
  direction: 'SUR_NORTE' | 'NORTE_SUR' | 'CIRCULAR';
  coordinates: LatLng[];
  stops: BusStop[];
  estimatedFrequencyMinutes: number;
  isActive: boolean;
}

export interface RouteFilter {
  searchQuery: string;
  selectedRouteId: string | null;
  onlyActiveBuses: boolean;
}
