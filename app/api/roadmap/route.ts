import { type NextRequest, NextResponse } from 'next/server';
import { parseRoadmapAnswers, ROADMAP_KEY } from '@/lib/roadmap';
import { readJsonPayload, validateJsonMutation } from '@/lib/request-security';
import { createClient } from '@/lib/supabase/server';

const MAX_REQUEST_BYTES = 8 * 1024;

export async function PUT(request: NextRequest) {
  const unsafeRequest = validateJsonMutation(request, MAX_REQUEST_BYTES);
  if (unsafeRequest) return unsafeRequest;

  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: 'setup' }, { status: 503 });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json(
      {
        error: 'auth_required',
        redirectTo: '/sign-in?message=roadmap-required&next=/roadmap',
      },
      { status: 401 },
    );
  }

  const payload = await readJsonPayload(request, MAX_REQUEST_BYTES);
  if (payload.response) return payload.response;
  const body = payload.body;
  const answers =
    body && typeof body === 'object' && !Array.isArray(body) && 'answers' in body
      ? parseRoadmapAnswers((body as { answers?: unknown }).answers)
      : parseRoadmapAnswers(body);

  if (!answers) return NextResponse.json({ error: 'invalid_roadmap' }, { status: 400 });

  const { error } = await supabase.auth.updateUser({
    data: { [ROADMAP_KEY]: answers },
  });
  if (error) return NextResponse.json({ error: 'update_failed' }, { status: 500 });

  return NextResponse.json({ answers });
}
