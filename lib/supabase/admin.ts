import { createClient } from '@supabase/supabase-js';

export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

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
