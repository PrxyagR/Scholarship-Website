import { randomUUID } from 'node:crypto';
import { type NextRequest, NextResponse } from 'next/server';
import {
  getUserRoleSubmissions,
  MAX_ROLE_SUBMISSIONS_PER_USER,
  parseRoleSubmission,
  ROLE_SUBMISSIONS_KEY,
} from '@/lib/role-submissions';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { readJsonPayload, validateJsonMutation } from '@/lib/request-security';

const MAX_REQUEST_BYTES = 24 * 1024;

export async function POST(request: NextRequest) {
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
        redirectTo: '/sign-in?message=submit-role-required&next=/submit-role',
      },
      { status: 401 },
    );
  }

  const currentSubmissions = getUserRoleSubmissions(user);
  if (currentSubmissions.length >= MAX_ROLE_SUBMISSIONS_PER_USER) {
    return NextResponse.json({ error: 'submission_limit' }, { status: 429 });
  }

  const payload = await readJsonPayload(request, MAX_REQUEST_BYTES);
  if (payload.response) return payload.response;
  const body = payload.body;
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json({ error: 'invalid_payload' }, { status: 400 });
  }

  const raw = body as Record<string, unknown>;
  const deadline = raw.deadline;
  const submission = parseRoleSubmission({
    ...raw,
    id: randomUUID(),
    submittedAt: new Date().toISOString(),
    status: 'pending',
    deadline:
      deadline && typeof deadline === 'object' && !Array.isArray(deadline)
        ? deadline
        : { kind: raw.deadlineKind, date: raw.deadlineDate, label: raw.deadlineLabel },
  });

  if (!submission) return NextResponse.json({ error: 'invalid_submission' }, { status: 400 });
  if (submission.deadline.kind === 'date' && submission.deadline.date! < new Date().toISOString().slice(0, 10)) {
    return NextResponse.json({ error: 'expired_deadline' }, { status: 400 });
  }

  const adminClient = createAdminClient();
  if (!adminClient) return NextResponse.json({ error: 'setup' }, { status: 503 });

  const { error } = await adminClient.auth.admin.updateUserById(user.id, {
    app_metadata: {
      [ROLE_SUBMISSIONS_KEY]: [...currentSubmissions, submission],
    },
  });

  if (error) return NextResponse.json({ error: 'update_failed' }, { status: 500 });

  return NextResponse.json({ submissionId: submission.id, status: submission.status });
}
