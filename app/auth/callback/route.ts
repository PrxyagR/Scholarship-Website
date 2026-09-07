import { type NextRequest, NextResponse } from 'next/server';
import { getSafeNextPath } from '@/lib/supabase/redirects';
import { createClient } from '@/lib/supabase/server';

const CONSENT_VERSION = '2026-08-29';

function redirectTo(request: NextRequest, path: string) {
  return NextResponse.redirect(new URL(path, request.url));
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const provider = searchParams.get('provider');
  const next = getSafeNextPath(searchParams.get('next'), '/account');

  if (!code) {
    return redirectTo(request, '/sign-in?error=confirm');
  }

  const supabase = await createClient();
  if (!supabase) {
    return redirectTo(request, '/sign-in?error=setup');
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return redirectTo(request, '/sign-in?error=confirm');
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const providers = Array.isArray(user?.app_metadata?.providers)
    ? user.app_metadata.providers
    : [];
  const isGoogleAccount =
    user?.app_metadata?.provider === 'google' || providers.includes('google');

  if (user && provider === 'google' && isGoogleAccount) {
    await supabase.auth.updateUser({
      data: {
        maplepath_consent: true,
        consent_version: CONSENT_VERSION,
        maplepath_auth_provider: 'google',
      },
    });
  }

  return redirectTo(request, next);
}
