import { type NextRequest, NextResponse } from 'next/server';
import { isSaveableOpportunityId } from '@/lib/saved-opportunities';
import {
  APPLICATION_TRACKER_KEY,
  getApplicationTracker,
  isApplicationStatus,
  type ApplicationStatus,
} from '@/lib/student-tools';
import { createClient } from '@/lib/supabase/server';
import { readJsonPayload, validateJsonMutation } from '@/lib/request-security';

const MAX_REQUEST_BYTES = 12 * 1024;

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

export async function PATCH(request: NextRequest) {
  const unsafeRequest = validateJsonMutation(request, MAX_REQUEST_BYTES);
  if (unsafeRequest) return unsafeRequest;

  const context = await getUserContext();
  if ('response' in context) return context.response;

  const payload = await readJsonPayload(request, MAX_REQUEST_BYTES);
  if (payload.response) return payload.response;
  const body = payload.body as {
    opportunityId?: unknown;
    status?: unknown;
    note?: unknown;
  } | null;

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json({ error: 'invalid_payload' }, { status: 400 });
  }

  const opportunityId = body.opportunityId;
  const status = body.status;
  if (!isSaveableOpportunityId(opportunityId) || !isApplicationStatus(status)) {
    return NextResponse.json({ error: 'invalid_application' }, { status: 400 });
  }

  const currentTracker = getApplicationTracker(context.user);
  const currentRecord = currentTracker[opportunityId];
  const note =
    body.note === undefined
      ? currentRecord?.note ?? ''
      : typeof body.note === 'string'
        ? body.note.trim().slice(0, 500)
        : null;

  if (note === null) return NextResponse.json({ error: 'invalid_note' }, { status: 400 });

  const record = {
    status: status as ApplicationStatus,
    note,
    updatedAt: new Date().toISOString(),
  };
  const tracker = { ...currentTracker, [opportunityId]: record };

  const { error } = await context.supabase.auth.updateUser({
    data: {
      [APPLICATION_TRACKER_KEY]: tracker,
    },
  });

  if (error) return NextResponse.json({ error: 'update_failed' }, { status: 500 });

  return NextResponse.json({ opportunityId, record });
}
