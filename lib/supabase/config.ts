const DEFAULT_SITE_URL = 'https://maplepath-opportunities.prayagrakholia7.chatgpt.site';

export function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim()
    || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!url || !key) return null;

  return { url, key };
}

export function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL?.trim() || DEFAULT_SITE_URL).replace(/\/$/, '');
}

export function isSupabaseConfigured() {
  return Boolean(getSupabaseConfig());
}
