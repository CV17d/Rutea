import { TransitRoute, BusStop } from '../types/route.types';
import { CommunityReport } from '../types/user.types';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

export class ApiClient {
  private static async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return (await response.json()) as T;
    } catch (error) {
      console.warn(`[ApiClient] Error in ${endpoint}:`, error);
      throw error;
    }
  }

  static async getRoutes(): Promise<TransitRoute[]> {
    return this.request<TransitRoute[]>('/routes');
  }

  static async getRouteById(routeId: string): Promise<TransitRoute> {
    return this.request<TransitRoute>(`/routes/${routeId}`);
  }

  static async getRouteStops(routeId: string): Promise<BusStop[]> {
    return this.request<BusStop[]>(`/routes/${routeId}/stops`);
  }

  static async submitIncidentReport(report: Partial<CommunityReport>): Promise<CommunityReport> {
    return this.request<CommunityReport>('/reports', {
      method: 'POST',
      body: JSON.stringify(report),
    });
  }
}
