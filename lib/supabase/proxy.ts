import { createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';
import { getSupabaseConfig } from './config';

function applySecurityHeaders(response: NextResponse, request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const connectSources = ["'self'"];

  if (supabaseUrl) {
    try {
      const parsed = new URL(supabaseUrl);
      connectSources.push(parsed.origin, parsed.origin.replace(/^http/, 'ws'));
    } catch {
      // Ignore an invalid optional URL here; application setup handles it separately.
    }
  }

  const contentSecurityPolicy = [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    `connect-src ${connectSources.join(' ')}`,
  ].join('; ');

  response.headers.set('Content-Security-Policy', contentSecurityPolicy);
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');

  if (request.nextUrl.protocol === 'https:') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }

  if (
    request.nextUrl.pathname.startsWith('/api/') ||
    ['/account', '/dashboard', '/saved'].some((path) =>
      request.nextUrl.pathname.startsWith(path),
    ) ||
    request.nextUrl.pathname.startsWith('/admin/')
  ) {
    response.headers.set('Cache-Control', 'private, no-store');
  }

  return response;
}

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const config = getSupabaseConfig();

  if (!config) return applySecurityHeaders(response, request);

  const supabase = createServerClient(config.url, config.key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  await supabase.auth.getClaims();
  return applySecurityHeaders(response, request);
}
