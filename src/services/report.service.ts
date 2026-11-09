import { supabase } from './supabase.client';
import { useTrackingStore } from '../store/useTrackingStore';
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

const TYPE_TO_CATEGORY: Record<IncidentType, IncidentCategory> = {
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
    category: TYPE_TO_CATEGORY[inc.type] || 'BUS_FULL',
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
   * Inserta un nuevo reporte de incidente en Supabase y actualiza el mapa local
   */
  async createIncidentReport(payload: CreateIncidentPayload): Promise<{ data: IncidentReport | null; error: string | null }> {
    try {
      const { routeId, userId, type, lat, lng } = payload;
      const record = {
        route_id: routeId,
        user_id: userId || null,
        type,
        lat,
        lng,
        created_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('incident_reports')
        .insert(record)
        .select()
        .single();

      const created: IncidentReport = data || {
        id: `inc-${Date.now()}`,
        ...record,
      };

      // Reflejar inmediatamente en el almacén de marcadores del mapa
      useTrackingStore.getState().addReport(incidentToCommunityReport(created));

      if (error) {
        console.warn('[ReportService] Inserción offline fallback:', error.message);
      }

      return { data: created, error: null };
    } catch (err: any) {
      const fallback: IncidentReport = {
        id: `inc-${Date.now()}`,
        route_id: payload.routeId,
        user_id: payload.userId || null,
        type: payload.type,
        lat: payload.lat,
        lng: payload.lng,
        created_at: new Date().toISOString(),
      };
      useTrackingStore.getState().addReport(incidentToCommunityReport(fallback));
      return { data: fallback, error: null };
    }
  },

  /**
   * Consulta los reportes activos generados hace menos de 2 horas
   */
  async fetchActiveIncidents(routeId?: string): Promise<IncidentReport[]> {
    try {
      const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
      let query = supabase
        .from('incident_reports')
        .select('*')
        .gte('created_at', twoHoursAgo)
        .order('created_at', { ascending: false });

      if (routeId) {
        query = query.eq('route_id', routeId);
      }

      const { data, error } = await query;
      if (error || !data) return [];

      const reports = data as IncidentReport[];
      // Sincronizar marcadores del mapa
      reports.forEach((rep) => {
        useTrackingStore.getState().addReport(incidentToCommunityReport(rep));
      });

      return reports;
    } catch {
      return [];
    }
  },

  /**
   * Suscribe en tiempo real (Supabase Realtime) a los nuevos incidentes
   */
  subscribeToIncidents(callback: (incident: IncidentReport) => void, routeId?: string): () => void {
    const channelName = `incidents-${routeId || 'all'}-${Date.now()}`;
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'incident_reports' },
        (payload: any) => {
          const newInc = payload.new as IncidentReport;
          if (!routeId || newInc.route_id === routeId) {
            useTrackingStore.getState().addReport(incidentToCommunityReport(newInc));
            callback(newInc);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },
};
