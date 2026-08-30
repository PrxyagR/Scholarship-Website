import { type NextRequest, NextResponse } from 'next/server';
import { getSafeNextPath } from '@/lib/supabase/redirects';
import { createClient } from '@/lib/supabase/server';

function redirectTo(request: NextRequest, path: string) {
  return NextResponse.redirect(new URL(path, request.url));
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
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

  return redirectTo(request, next);
}
