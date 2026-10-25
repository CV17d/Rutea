import { Injectable, Logger } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface ActiveSessionRecord {
  id: string;
  user_id: string;
  route_id: string;
  avatar_seed: string;
  alias: string;
  is_active: boolean;
  latitude?: number;
  longitude?: number;
  speed_kmh?: number;
  heading?: number;
  accuracy?: number;
  created_at?: string;
  updated_at?: string;
}

const CUY_AVATARS = [
  'cuy-ruana',
  'cuy-carnaval',
  'cuy-galeras',
  'cuy-sombrero',
  'cuy-chullo',
  'cuy-pastuso',
];

const PASTUSO_ALIASES = [
  'Viajero Galeras',
  'Pasajero de Chapal',
  'Rumbero del Carnaval',
  'Caminante de Torobajo',
  'Explorador de Maridíaz',
  'Compañero del Bus',
];

@Injectable()
export class SupabaseService {
  private readonly logger = new Logger(SupabaseService.name);
  private readonly client: SupabaseClient;

  constructor() {
    const supabaseUrl =
      process.env.SUPABASE_URL ||
      process.env.EXPO_PUBLIC_SUPABASE_URL ||
      'https://demo-rutea-pasto.supabase.co';
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_ANON_KEY ||
      process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
      'dummy_service_role_key_for_rutea_pasto';

    this.client = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    });
    this.logger.log(`[Supabase] Conectado exitosamente a: ${supabaseUrl}`);
  }

  getClient(): SupabaseClient {
    return this.client;
  }

  generateProceduralAvatar(): { seed: string; alias: string } {
    const randomAvatar = CUY_AVATARS[Math.floor(Math.random() * CUY_AVATARS.length)];
    const randomAlias = PASTUSO_ALIASES[Math.floor(Math.random() * PASTUSO_ALIASES.length)];
    const suffix = Math.floor(100 + Math.random() * 900);

    return {
      seed: `${randomAvatar}-${suffix}`,
      alias: `${randomAlias} #${suffix}`,
    };
  }

  async registerAnonymousSession(params: {
    userId: string;
    routeId: string;
    latitude?: number;
    longitude?: number;
  }): Promise<ActiveSessionRecord> {
    const { seed, alias } = this.generateProceduralAvatar();

    const record: ActiveSessionRecord = {
      id: `session-${params.userId}`,
      user_id: params.userId,
      route_id: params.routeId,
      avatar_seed: seed,
      alias,
      is_active: true,
      latitude: params.latitude,
      longitude: params.longitude,
      speed_kmh: 0,
      heading: 0,
      accuracy: 10,
      updated_at: new Date().toISOString(),
    };

    try {
      const { error } = await this.client
        .from('active_sessions')
        .upsert(record, { onConflict: 'id' });

      if (error) {
        this.logger.warn(`[Supabase] Advertencia registrando sesión: ${error.message}`);
      } else {
        this.logger.log(`[Supabase] Sesión anónima persistida para ${params.userId} (${alias})`);
      }
    } catch (err: any) {
      this.logger.warn(`[Supabase] Modo offline/demo: ${err?.message || err}`);
    }

    return record;
  }

  async updateSessionTelemetry(
    userId: string,
    telemetry: { latitude: number; longitude: number; speedKmh?: number; heading?: number },
  ): Promise<void> {
    try {
      await this.client
        .from('active_sessions')
        .update({
          latitude: telemetry.latitude,
          longitude: telemetry.longitude,
          speed_kmh: telemetry.speedKmh ?? 0,
          heading: telemetry.heading ?? 0,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId);
    } catch (err: any) {
      this.logger.debug(`[Supabase] Telemetria offline: ${err?.message}`);
    }
  }

  async updateSessionPoints(userId: string, points: number, rank: string): Promise<void> {
    try {
      await this.client
        .from('active_sessions')
        .update({
          total_points: points,
          current_rank: rank,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId);
    } catch (err: any) {
      this.logger.debug(`[Supabase] Puntos offline: ${err?.message}`);
    }
  }

  async endSession(userId: string): Promise<void> {
    try {
      await this.client
        .from('active_sessions')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('user_id', userId);
      this.logger.log(`[Supabase] Sesión finalizada para ${userId}`);
    } catch (err: any) {
      this.logger.debug(`[Supabase] Fin sesión offline: ${err?.message}`);
    }
  }
}
