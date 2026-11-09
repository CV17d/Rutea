import { supabase } from './supabase.client';
import { generateLocalAlias } from '../utils/avatar.utils';

export interface AuthResponse<T = any> {
  data: T | null;
  error: string | null;
}

export interface UserSessionData {
  id: string;
  email: string | null;
  displayName: string;
  avatarSeed: string;
  isGuest: boolean;
}

/**
 * Servicio de Autenticación con Supabase Auth y modo Invitado (Guest).
 */
export const authService = {
  /**
   * Registro con Email y Contraseña
   */
  async signUp(email: string, password: string, displayName?: string): Promise<AuthResponse<UserSessionData>> {
    try {
      const trimmedEmail = email.trim().toLowerCase();
      const alias = displayName?.trim() || generateLocalAlias(trimmedEmail);

      const { data, error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: {
          data: {
            display_name: alias,
            avatar_seed: trimmedEmail,
          },
        },
      });

      if (error) {
        return { data: null, error: error.message };
      }

      const user = data.user;
      if (!user) {
        return { data: null, error: 'No se pudo crear la cuenta' };
      }

      return {
        data: {
          id: user.id,
          email: user.email || trimmedEmail,
          displayName: user.user_metadata?.display_name || alias,
          avatarSeed: user.user_metadata?.avatar_seed || trimmedEmail,
          isGuest: false,
        },
        error: null,
      };
    } catch (err: any) {
      return { data: null, error: err.message || 'Error de conexión con el servicio de autenticación' };
    }
  },

  /**
   * Inicio de Sesión con Email y Contraseña
   */
  async signIn(email: string, password: string): Promise<AuthResponse<UserSessionData>> {
    try {
      const trimmedEmail = email.trim().toLowerCase();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      });

      if (error) {
        return { data: null, error: error.message };
      }

      const user = data.user;
      if (!user) {
        return { data: null, error: 'Usuario no encontrado' };
      }

      const displayName = user.user_metadata?.display_name || user.email?.split('@')[0] || 'Pasajero Pastuso';
      const avatarSeed = user.user_metadata?.avatar_seed || user.id;

      return {
        data: {
          id: user.id,
          email: user.email || trimmedEmail,
          displayName,
          avatarSeed,
          isGuest: false,
        },
        error: null,
      };
    } catch (err: any) {
      return { data: null, error: err.message || 'Error al iniciar sesión' };
    }
  },

  /**
   * Autenticación anónima / Modo Invitado
   */
  async signInAnonymously(): Promise<AuthResponse<UserSessionData>> {
    try {
      // Intentar signInAnonymously con Supabase
      const { data, error } = await supabase.auth.signInAnonymously();

      if (!error && data?.user) {
        const user = data.user;
        const seed = `guest-${user.id.slice(0, 8)}`;
        return {
          data: {
            id: user.id,
            email: null,
            displayName: generateLocalAlias(seed),
            avatarSeed: seed,
            isGuest: true,
          },
          error: null,
        };
      }

      // Fallback local seguro para modo invitado sin bloquear el flujo offline o demo
      const fallbackId = `guest-${Date.now()}`;
      return {
        data: {
          id: fallbackId,
          email: null,
          displayName: generateLocalAlias(fallbackId),
          avatarSeed: fallbackId,
          isGuest: true,
        },
        error: null,
      };
    } catch {
      const fallbackId = `guest-${Date.now()}`;
      return {
        data: {
          id: fallbackId,
          email: null,
          displayName: generateLocalAlias(fallbackId),
          avatarSeed: fallbackId,
          isGuest: true,
        },
        error: null,
      };
    }
  },

  /**
   * Cerrar Sesión
   */
  async signOut(): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.signOut();
      return { error: error ? error.message : null };
    } catch (err: any) {
      return { error: err.message || 'Error al cerrar sesión' };
    }
  },

  /**
   * Obtener Sesión Actual de Supabase
   */
  async getCurrentSession(): Promise<UserSessionData | null> {
    try {
      const { data } = await supabase.auth.getSession();
      const user = data?.session?.user;
      if (!user) return null;

      const isGuest = user.is_anonymous || !user.email;
      const seed = user.user_metadata?.avatar_seed || user.id;

      return {
        id: user.id,
        email: user.email || null,
        displayName: user.user_metadata?.display_name || generateLocalAlias(seed),
        avatarSeed: seed,
        isGuest,
      };
    } catch {
      return null;
    }
  },
};
