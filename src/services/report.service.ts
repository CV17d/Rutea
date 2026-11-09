import { Alert } from 'react-native';
import { supabase } from './supabase.client';
import { useTrackingStore } from '../store/useTrackingStore';
import { useAuthStore } from '../store/useAuthStore';
import { CommunityReport, IncidentCategory } from '../types/user.types';

export type IncidentType = 'FULL_BUS' | 'TRAFFIC' | 'ACCIDENT' | 'DETOUR';

export interface IncidentReport {
  id: string;
  route_id: string;
  user_id?: string | null;
  type: IncidentType;
  lat: number;
  lng: number;
  created_at: string;
}

export interface CreateIncidentPayload {
  routeId: string;
  userId?: string | null;
  type: IncidentType;
  lat: number;
  lng: number;
}

const TYPE_TO_CAT: Record<IncidentType, IncidentCategory> = {
  FULL_BUS: 'BUS_FULL',
  TRAFFIC: 'TRAFFIC_JAM',
  ACCIDENT: 'ACCIDENT',
  DETOUR: 'DETOUR',
};

const TYPE_LABELS: Record<IncidentType, string> = {
  FULL_BUS: 'Bus Lleno',
  TRAFFIC: 'Tráfico Pesado',
  ACCIDENT: 'Accidente en vía',
  DETOUR: 'Desvío de ruta',
};

function incidentToCommunityReport(inc: IncidentReport): CommunityReport {
  return {
    id: inc.id,
    category: TYPE_TO_CAT[inc.type] || 'BUS_FULL',
    title: TYPE_LABELS[inc.type] || 'Novedad en vía',
    description: `Reportado por usuario • ${inc.route_id}`,
    reporterAlias: 'Comunidad Rutea',
    reporterAvatarSeed: inc.id,
    timestamp: new Date(inc.created_at).getTime(),
    upvotes: 1,
    routeId: inc.route_id,
    latitude: inc.lat,
    longitude: inc.lng,
  };
}

export const reportService = {
  /**
   * Inserta reporte en Supabase. Si el usuario es invitado, no incrementa puntos.
   */
  async createIncidentReport(payload: CreateIncidentPayload) {
    const isGuest = useAuthStore.getState().isGuest || !payload.userId || !!useAuthStore.getState().user?.isGuest;
    const GUEST_MSG = 'Reporte enviado. Inicia sesión para ganar puntos por tu colaboración';
    const SUCCESS_MSG = '¡+10 Puntos por tu reporte!';

    try {
      const { routeId, userId, type, lat, lng } = payload;
      const record = {
        route_id: routeId,
        user_id: isGuest ? null : (userId || null),
        type,
        lat,
        lng,
        created_at: new Date().toISOString(),
      };

      const { data, error } = await supabase.from('incident_reports').insert(record).select().single();
      const created: IncidentReport = data || { id: `inc-${Date.now()}`, ...record };

      useTrackingStore.getState().addReport(incidentToCommunityReport(created));

      if (isGuest) {
        Alert.alert('Reporte enviado', GUEST_MSG);
        return { data: created, error: error?.message || null, isGuest: true, message: GUEST_MSG };
      }

      if (userId) {
        try {
          await supabase.rpc('increment_user_points', { target_user_id: userId, points_to_add: 10 });
        } catch { /* Fallback */ }
      }
      useAuthStore.getState().addPoints(10);
      const tracking = useTrackingStore.getState();
      tracking.setGamification(tracking.totalPoints + 10, tracking.currentRank);

      return { data: created, error: null, isGuest: false, message: SUCCESS_MSG };
    } catch {
      const fallback: IncidentReport = {
        id: `inc-${Date.now()}`,
        route_id: payload.routeId,
        user_id: isGuest ? null : (payload.userId || null),
        type: payload.type,
        lat: payload.lat,
        lng: payload.lng,
        created_at: new Date().toISOString(),
      };
      useTrackingStore.getState().addReport(incidentToCommunityReport(fallback));

      if (isGuest) {
        Alert.alert('Reporte enviado', GUEST_MSG);
        return { data: fallback, error: null, isGuest: true, message: GUEST_MSG };
      }

      useAuthStore.getState().addPoints(10);
      const tracking = useTrackingStore.getState();
      tracking.setGamification(tracking.totalPoints + 10, tracking.currentRank);
      return { data: fallback, error: null, isGuest: false, message: SUCCESS_MSG };
    }
  },

  async fetchActiveIncidents(routeId?: string): Promise<IncidentReport[]> {
    try {
      const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
      let query = supabase.from('incident_reports').select('*').gte('created_at', twoHoursAgo).order('created_at', { ascending: false });
      if (routeId) query = query.eq('route_id', routeId);
      const { data, error } = await query;
      if (error || !data) return [];
      const reports = data as IncidentReport[];
      reports.forEach((rep) => useTrackingStore.getState().addReport(incidentToCommunityReport(rep)));
      return reports;
    } catch { return []; }
  },

  subscribeToIncidents(callback: (incident: IncidentReport) => void, routeId?: string): () => void {
    const channel = supabase.channel(`incidents-${routeId || 'all'}-${Date.now()}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'incident_reports' }, (payload: any) => {
        const newInc = payload.new as IncidentReport;
        if (!routeId || newInc.route_id === routeId) {
          useTrackingStore.getState().addReport(incidentToCommunityReport(newInc));
          callback(newInc);
        }
      }).subscribe();
    return () => { supabase.removeChannel(channel); };
  },
};
