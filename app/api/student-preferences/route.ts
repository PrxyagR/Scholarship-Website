import { type NextRequest, NextResponse } from 'next/server';
import { parseStudentProfile, STUDENT_PROFILE_KEY } from '@/lib/student-tools';
import { createClient } from '@/lib/supabase/server';

async function getUserContext(request: NextRequest) {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) {
    return { response: NextResponse.json({ error: 'invalid_origin' }, { status: 403 }) };
  }

  const supabase = await createClient();
  if (!supabase) return { response: NextResponse.json({ error: 'setup' }, { status: 503 }) };

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      response: NextResponse.json(
        {
          error: 'auth_required',
          redirectTo: '/sign-in?message=dashboard-required&next=/dashboard',
        },
        { status: 401 },
      ),
    };
  }

  return { supabase, user };
}

export async function PUT(request: NextRequest) {
  const context = await getUserContext(request);
  if ('response' in context) return context.response;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid_payload' }, { status: 400 });
  }

  const profile = parseStudentProfile(
    body && typeof body === 'object' && 'profile' in body
      ? (body as { profile?: unknown }).profile
      : body,
  );

  if (!profile) return NextResponse.json({ error: 'invalid_profile' }, { status: 400 });

  const { error } = await context.supabase.auth.updateUser({
    data: {
      ...context.user.user_metadata,
      [STUDENT_PROFILE_KEY]: profile,
    },
  });

  if (error) return NextResponse.json({ error: 'update_failed' }, { status: 500 });

  return NextResponse.json({ profile });
}
