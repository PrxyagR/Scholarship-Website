import { type NextRequest, NextResponse } from 'next/server';
import { readJsonPayload, validateJsonMutation } from '@/lib/request-security';
import { updateRoleSubmissionStatus } from '@/lib/role-submissions';
import { isConfiguredAdmin } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

const MAX_REQUEST_BYTES = 4 * 1024;

export async function PATCH(request: NextRequest) {
  const unsafeRequest = validateJsonMutation(request, MAX_REQUEST_BYTES);
  if (unsafeRequest) return unsafeRequest;

  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: 'setup' }, { status: 503 });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !isConfiguredAdmin(user)) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }

  const payload = await readJsonPayload(request, MAX_REQUEST_BYTES);
  if (payload.response) return payload.response;
  const body = payload.body;
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json({ error: 'invalid_payload' }, { status: 400 });
  }

  const raw = body as Record<string, unknown>;
  const submitterUserId = typeof raw.submitterUserId === 'string' ? raw.submitterUserId.trim() : '';
  const submissionId = typeof raw.submissionId === 'string' ? raw.submissionId.trim() : '';
  const status = raw.status === 'approved' || raw.status === 'rejected' ? raw.status : null;
  if (!submitterUserId || !submissionId || !status) {
    return NextResponse.json({ error: 'invalid_review' }, { status: 400 });
  }

  const result = await updateRoleSubmissionStatus(submitterUserId, submissionId, status);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.error === 'not_found' ? 404 : 500 });
  }

  return NextResponse.json({ ok: true, status });
}
