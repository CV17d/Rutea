import { Alert } from 'react-native';
import { supabase } from './supabase.client';
import { useTrackingStore } from '../store/useTrackingStore';
import { useAuthStore } from '../store/useAuthStore';
import { CommunityReport, IncidentCategory } from '../types/user.types';

export type IncidentType = 'FULL_BUS' | 'TRAFFIC' | 'ACCIDENT' | 'DETOUR';
export interface IncidentReport {
  id: string; route_id: string; user_id?: string | null;
  type: IncidentType; lat: number; lng: number; created_at: string;
}
export interface CreateIncidentPayload {
  routeId: string; userId?: string | null; type: IncidentType; lat: number; lng: number;
}

export const REPORT_COOLDOWN_MS = 5 * 60 * 1000;
const reportTimestamps: Record<string, number> = {};

export function checkReportCooldown(type: string): { canReport: boolean; remainingSeconds: number } {
  const elapsed = Date.now() - (reportTimestamps[type] || 0);
  if (elapsed < REPORT_COOLDOWN_MS) {
    return { canReport: false, remainingSeconds: Math.ceil((REPORT_COOLDOWN_MS - elapsed) / 1000) };
  }
  return { canReport: true, remainingSeconds: 0 };
}

export function recordReportCooldown(type: string, time: number = Date.now()): void {
  reportTimestamps[type] = time;
}

export function resetReportCooldowns(): void {
  Object.keys(reportTimestamps).forEach((k) => delete reportTimestamps[k]);
}

export function awardReportPoints(points: number = 10): void {
  const { isAuthenticated, isGuest } = useAuthStore.getState();
  if (!isAuthenticated || isGuest) return;
  useAuthStore.getState().addPoints(10);
  const tracking = useTrackingStore.getState();
  tracking.setGamification(tracking.totalPoints + points, tracking.currentRank);
}

const TYPE_TO_CAT: Record<IncidentType, IncidentCategory> = {
  FULL_BUS: 'BUS_FULL', TRAFFIC: 'TRAFFIC_JAM', ACCIDENT: 'ACCIDENT', DETOUR: 'DETOUR',
};
const TYPE_LABELS: Record<IncidentType, string> = {
  FULL_BUS: 'Bus Lleno', TRAFFIC: 'Tráfico Pesado', ACCIDENT: 'Accidente en vía', DETOUR: 'Desvío de ruta',
};

function incidentToCommunityReport(inc: IncidentReport): CommunityReport {
  return {
    id: inc.id, category: TYPE_TO_CAT[inc.type] || 'BUS_FULL',
    title: TYPE_LABELS[inc.type] || 'Novedad en vía',
    description: `Reportado por usuario • ${inc.route_id}`, reporterAlias: 'Comunidad Rutea',
    reporterAvatarSeed: inc.id, timestamp: new Date(inc.created_at).getTime(), upvotes: 1,
    routeId: inc.route_id, latitude: inc.lat, longitude: inc.lng,
  };
}

export const reportService = {
  async createIncidentReport(payload: CreateIncidentPayload) {
    const isGuest = useAuthStore.getState().isGuest || !payload.userId || !useAuthStore.getState().isAuthenticated || !!useAuthStore.getState().user?.isGuest;
    const GUEST_MSG = 'Reporte enviado. Inicia sesión para ganar puntos por tu colaboración';
    const SUCCESS_MSG = '¡+10 Puntos por tu reporte!';

    const cooldown = checkReportCooldown(payload.type);
    if (!cooldown.canReport) {
      const waitMsg = `Debes esperar ${Math.ceil(cooldown.remainingSeconds / 60)} min para enviar otro reporte de este tipo`;
      Alert.alert('Reporte reciente', waitMsg);
      return { data: null, error: 'COOLDOWN_ACTIVE', isGuest, message: waitMsg };
    }

    const { routeId, userId, type, lat, lng } = payload;
    const record = {
      route_id: routeId, user_id: isGuest ? null : (userId || null),
      type, lat, lng, created_at: new Date().toISOString(),
    };

    recordReportCooldown(type);

    try {
      const { data, error } = await supabase.from('incident_reports').insert(record).select().single();
      const created: IncidentReport = data || { id: `inc-${Date.now()}`, ...record };
      useTrackingStore.getState().addReport(incidentToCommunityReport(created));

      if (isGuest) {
        Alert.alert('Reporte enviado', GUEST_MSG);
        return { data: created, error: error?.message || null, isGuest: true, message: GUEST_MSG };
      }

      if (userId) {
        try { await supabase.rpc('increment_user_points', { target_user_id: userId, points_to_add: 10 }); } catch { /* noop */ }
      }
      useAuthStore.getState().addPoints(10);
      const tracking = useTrackingStore.getState();
      tracking.setGamification(tracking.totalPoints + 10, tracking.currentRank);
      return { data: created, error: null, isGuest: false, message: SUCCESS_MSG };
    } catch {
      const fallback: IncidentReport = { id: `inc-${Date.now()}`, ...record };
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
