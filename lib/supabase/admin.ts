import { createClient } from '@supabase/supabase-js';
import type { User } from '@supabase/supabase-js';

export function isConfiguredAdmin(user: User | null | undefined) {
  if (!user || !user.email_confirmed_at) return false;

  const adminUserId = process.env.SUPABASE_ADMIN_USER_ID?.trim();
  if (adminUserId) return user.id === adminUserId;

  const adminEmail = process.env.SUPABASE_ADMIN_EMAIL?.trim().toLowerCase();
  return Boolean(adminEmail && user.email?.toLowerCase() === adminEmail);
}

export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceRoleKey =
    process.env.SUPABASE_SECRET_KEY?.trim() ||
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!url || !serviceRoleKey) return null;

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
}

export async function countRegisteredUsers() {
  const adminClient = createAdminClient();
  if (!adminClient) return null;

  const perPage = 1000;
  let page = 1;
  let registered = 0;
  let confirmed = 0;

  while (true) {
    const { data, error } = await adminClient.auth.admin.listUsers({ page, perPage });
    if (error) throw error;

    registered += data.users.length;
    confirmed += data.users.filter((user) => Boolean(user.email_confirmed_at)).length;

    if (data.users.length < perPage) break;
    page += 1;
  }

  return { registered, confirmed };
}
