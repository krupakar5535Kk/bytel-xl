import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || '';

/**
 * Checks whether Supabase has been properly configured with real project credentials.
 * @returns {boolean}
 */
export const isSupabaseConfigured = () => {
  return Boolean(
    supabaseUrl &&
    supabaseUrl !== 'https://your-project-id.supabase.co' &&
    supabasePublishableKey &&
    supabasePublishableKey !== 'sb_publishable_your_key_here'
  );
};

// Log status on client load
if (!isSupabaseConfigured()) {
  console.info(
    '[Wild Fire Supabase] Notice: Supabase URL is currently set to placeholder. Replace VITE_SUPABASE_URL in frontend/.env with your Supabase Project URL (e.g. https://[project-id].supabase.co) to activate live Supabase synchronization.'
  );
} else {
  console.info('[Wild Fire Supabase] Client successfully initialized with configured credentials.');
}

// Fallback safe URL prevents uncaught initialization throws if the URL hasn't been substituted yet
const clientUrl = (supabaseUrl && supabaseUrl.startsWith('http'))
  ? supabaseUrl
  : 'https://placeholder.supabase.co';

const clientKey = supabasePublishableKey || 'placeholder-publishable-key';

/**
 * Shared Supabase client instance for Wild Fire
 */
export const supabase = createClient(clientUrl, clientKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export default supabase;
