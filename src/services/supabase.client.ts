import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://glpxmxgezqyskeomoknn.supabase.co';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_ornbeoowo1p8LWKxAAUDKQ_hoSTimQI';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});

export async function initAnonymousUserSession() {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    if (sessionData?.session) {
      return sessionData.session.user;
    }

    const { data, error } = await supabase.auth.signInAnonymously();
    if (error) {
      if (typeof __DEV__ !== 'undefined' && __DEV__) console.warn('[Supabase] Anonymous sign-in error:', error.message);
      return null;
    }
    return data.user;
  } catch (err) {
    if (typeof __DEV__ !== 'undefined' && __DEV__) console.warn('[Supabase] Auth failed:', err);
    return null;
  }
}
