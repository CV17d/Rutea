import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://demo-rutea-pasto.supabase.co';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_anon_key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});

export async function initAnonymousUserSession() {
  try {
    const { data: sessionData, error: sessionErr } = await supabase.auth.getSession();
    if (sessionData?.session) {
      return sessionData.session.user;
    }

    const { data, error } = await supabase.auth.signInAnonymously();
    if (error) {
      console.warn('[Supabase] Anonymous sign-in error:', error.message);
      return null;
    }
    return data.user;
  } catch (err) {
    console.warn('[Supabase] Auth failed:', err);
    return null;
  }
}
