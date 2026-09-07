import { type NextRequest, NextResponse } from 'next/server';
import { parseStudentProfile, STUDENT_PROFILE_KEY } from '@/lib/student-tools';
import { createClient } from '@/lib/supabase/server';
import { readJsonPayload, validateJsonMutation } from '@/lib/request-security';

const MAX_REQUEST_BYTES = 8 * 1024;

async function getUserContext() {
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
  const unsafeRequest = validateJsonMutation(request, MAX_REQUEST_BYTES);
  if (unsafeRequest) return unsafeRequest;

  const context = await getUserContext();
  if ('response' in context) return context.response;

  const payload = await readJsonPayload(request, MAX_REQUEST_BYTES);
  if (payload.response) return payload.response;
  const body = payload.body;

  const profile = parseStudentProfile(
    body && typeof body === 'object' && 'profile' in body
      ? (body as { profile?: unknown }).profile
      : body,
  );

  if (!profile) return NextResponse.json({ error: 'invalid_profile' }, { status: 400 });

  const { error } = await context.supabase.auth.updateUser({
    data: {
      [STUDENT_PROFILE_KEY]: profile,
    },
  });

  if (error) return NextResponse.json({ error: 'update_failed' }, { status: 500 });

  return NextResponse.json({ profile });
}
